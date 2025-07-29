import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	
	if (!session) {
		throw redirect(303, '/login?redirect=/messages');
	}

	try {
		// Load initial conversations with proper pagination
		const { data: conversations, error: conversationsError } = await locals.supabase
			.from('conversations')
			.select(`
				*,
				listing:listings (
					id,
					title,
					images,
					price
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
				),
				last_message:messages (
					id,
					message_text,
					created_at,
					sender_id
				)
			`)
			.or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
			.eq('archived_by_buyer', false)
			.eq('archived_by_seller', false)
			.order('updated_at', { ascending: false })
			.limit(20);

		if (conversationsError) {
			console.error('Error loading conversations:', conversationsError);
			throw error(500, 'Failed to load conversations');
		}

		// Get unread count for each conversation
		const conversationsWithUnread = await Promise.all(
			(conversations || []).map(async (conversation) => {
				const { count } = await locals.supabase
					.from('messages')
					.select('*', { count: 'exact', head: true })
					.eq('conversation_id', conversation.id)
					.eq('is_read', false)
					.neq('sender_id', session.user.id);

				return {
					...conversation,
					unread_count: count || 0
				};
			})
		);

		return {
			conversations: conversationsWithUnread,
			user: session.user
		};
	} catch (err) {
		console.error('Error in messages load:', err);
		throw error(500, 'Failed to load messages');
	}
};

export const actions: Actions = {
	archive: async ({ request, locals, params }) => {
		const { session } = await locals.safeGetSession();
		
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const conversationId = formData.get('conversationId')?.toString();

		if (!conversationId) {
			return fail(400, { error: 'Conversation ID is required' });
		}

		try {
			// Get conversation to check user access
			const { data: conversation, error: convError } = await locals.supabase
				.from('conversations')
				.select('buyer_id, seller_id')
				.eq('id', conversationId)
				.or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
				.single();

			if (convError || !conversation) {
				return fail(404, { error: 'Conversation not found' });
			}

			// Determine which field to update based on user role
			const isBuyer = session.user.id === conversation.buyer_id;
			const archiveField = isBuyer ? 'archived_by_buyer' : 'archived_by_seller';

			// Archive the conversation
			const { error: updateError } = await locals.supabase
				.from('conversations')
				.update({
					[archiveField]: true,
					updated_at: new Date().toISOString()
				})
				.eq('id', conversationId);

			if (updateError) {
				console.error('Error archiving conversation:', updateError);
				return fail(500, { error: 'Failed to archive conversation' });
			}

			return { success: true, action: 'archive', conversationId };
		} catch (err) {
			console.error('Error archiving conversation:', err);
			return fail(500, { error: 'Internal server error' });
		}
	},

	unarchive: async ({ request, locals }) => {
		const { session } = await locals.safeGetSession();
		
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const conversationId = formData.get('conversationId')?.toString();

		if (!conversationId) {
			return fail(400, { error: 'Conversation ID is required' });
		}

		try {
			// Get conversation to check user access
			const { data: conversation, error: convError } = await locals.supabase
				.from('conversations')
				.select('buyer_id, seller_id')
				.eq('id', conversationId)
				.or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
				.single();

			if (convError || !conversation) {
				return fail(404, { error: 'Conversation not found' });
			}

			// Determine which field to update based on user role
			const isBuyer = session.user.id === conversation.buyer_id;
			const archiveField = isBuyer ? 'archived_by_buyer' : 'archived_by_seller';

			// Unarchive the conversation
			const { error: updateError } = await locals.supabase
				.from('conversations')
				.update({
					[archiveField]: false,
					updated_at: new Date().toISOString()
				})
				.eq('id', conversationId);

			if (updateError) {
				console.error('Error unarchiving conversation:', updateError);
				return fail(500, { error: 'Failed to unarchive conversation' });
			}

			return { success: true, action: 'unarchive', conversationId };
		} catch (err) {
			console.error('Error unarchiving conversation:', err);
			return fail(500, { error: 'Internal server error' });
		}
	}
};