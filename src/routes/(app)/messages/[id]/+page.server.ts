import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { session } = await locals.safeGetSession();
	
	if (!session) {
		throw redirect(303, '/login?redirect=/messages/' + params.id);
	}

	const conversationId = params.id;

	try {
		// Get conversation details with authorization check
		const { data: conversation, error: conversationError } = await locals.supabase
			.from('conversations')
			.select(`
				*,
				listing:listings (
					id,
					title,
					images,
					price,
					condition,
					size,
					brand
				),
				buyer:profiles!conversations_buyer_id_fkey (
					id,
					username,
					avatar_url
				),
				seller:profiles!conversations_seller_id_fkey (
					id,
					username,
					avatar_url
				)
			`)
			.eq('id', conversationId)
			.or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
			.single();

		if (conversationError || !conversation) {
			console.error('Conversation not found:', conversationError);
			throw error(404, 'Conversation not found');
		}

		// Get messages for this conversation
		const { data: messages, error: messagesError } = await locals.supabase
			.from('messages')
			.select(`
				*,
				sender:profiles!messages_sender_id_fkey (
					id,
					username,
					avatar_url
				)
			`)
			.eq('conversation_id', conversationId)
			.order('created_at', { ascending: true });

		if (messagesError) {
			console.error('Error loading messages:', messagesError);
			throw error(500, 'Failed to load messages');
		}

		// Mark messages as read for the current user
		await locals.supabase
			.from('messages')
			.update({ is_read: true })
			.eq('conversation_id', conversationId)
			.neq('sender_id', session.user.id)
			.eq('is_read', false);

		return {
			conversation,
			messages: messages || [],
			currentUserId: session.user.id
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err; // Re-throw SvelteKit errors
		}
		console.error('Error in message conversation load:', err);
		throw error(500, 'Failed to load conversation');
	}
};

export const actions: Actions = {
	send: async ({ request, locals, params }) => {
		const { session } = await locals.safeGetSession();
		
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const conversationId = params.id;
		const formData = await request.formData();
		const messageText = formData.get('message')?.toString()?.trim();

		if (!messageText) {
			return fail(400, { error: 'Message cannot be empty' });
		}

		if (messageText.length > 1000) {
			return fail(400, { error: 'Message is too long (max 1000 characters)' });
		}

		try {
			// Verify user has access to this conversation
			const { data: conversation, error: convError } = await locals.supabase
				.from('conversations')
				.select('buyer_id, seller_id')
				.eq('id', conversationId)
				.or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
				.single();

			if (convError || !conversation) {
				return fail(404, { error: 'Conversation not found' });
			}

			// Send the message
			const { error: messageError } = await locals.supabase
				.from('messages')
				.insert({
					conversation_id: conversationId,
					sender_id: session.user.id,
					message_text: messageText,
					is_read: false
				});

			if (messageError) {
				console.error('Error sending message:', messageError);
				return fail(500, { error: 'Failed to send message' });
			}

			// Update conversation's updated_at timestamp
			await locals.supabase
				.from('conversations')
				.update({ updated_at: new Date().toISOString() })
				.eq('id', conversationId);

			return { success: true, message: 'Message sent successfully' };
		} catch (err) {
			console.error('Error sending message:', err);
			return fail(500, { error: 'Failed to send message' });
		}
	}
};