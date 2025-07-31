import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { generateCSRFToken, csrfProtectedAction } from '$lib/server/csrf'

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	const { isAdmin, user } = await parent();
	
	if (!isAdmin) {
		error(403, 'Unauthorized');
	}
	
	// Get the brand verification request
	const { data: request, error: requestError } = await locals?.supabase
		.from('brand_verification_requests' as any)
		.select('*')
		.eq('id', params?.id)
		.single();
	
	if (requestError || !request) {
		error(404, 'Brand verification request not found');
	}
	
	// Get the user's profile
	const { data: profile, error: profileError } = await locals?.supabase
		.from('profiles')
		.select('*')
		.eq('id', (request as any)?.user_id)
		.single();
	
	if (profileError || !profile) {
		error(404, 'User profile not found');
	}
	
	// Get social media accounts
	const { data: socialAccounts } = await locals?.supabase
		.from('social_media_accounts' as any)
		.select('*')
		.eq('user_id', (request as any)?.user_id);
	
	// Get admin who reviewed (if applicable)
	let reviewer = null;
	if ((request as any)?.reviewed_by) {
		const { data: reviewerData } = await locals?.supabase
			.from('profiles')
			.select('username, full_name')
			.eq('id', (request as any)?.reviewed_by)
			.single();
		
		reviewer = reviewerData;
	}
	
	return {
		csrfToken: generateCSRFToken(),
		request,
		profile,
		socialAccounts: socialAccounts || [],
		reviewer,
		user
	
	};
};

export const actions: Actions = {
	approve: async ({ request, params, locals }) => {
		const formData = await request?.formData();
		const adminNotes = formData?.get('adminNotes') as string;
		const userId = locals?.user?.id;

		if (!userId) {
			throw error(401, 'Unauthorized');
		}

		// Update brand verification request
		const { error: updateError } = await locals?.supabase
			.from('brand_verification_requests' as any)
			.update({
				verification_status: 'approved',
				admin_notes: adminNotes,
				reviewed_by: userId,
				reviewed_at: new Date().toISOString()
			})
			.eq('id', params?.id);

		if (updateError) {
			throw error(500, 'Failed to update verification request');
		}

		// Get request data for profile update
		const { data: requestData } = await locals?.supabase
			.from('brand_verification_requests' as any)
			.select('user_id, brand_name, brand_category')
			.eq('id', params?.id)
			.single();

		if (requestData) {
			const { error: profileError } = await locals?.supabase
				.from('profiles')
				.update({
					is_verified: true,
					account_type: 'brand',
					brand_name: (requestData as any)?.brand_name,
					brand_category: (requestData as any)?.brand_category
				})
				.eq('id', (requestData as any)?.user_id);

			if (profileError) {
				throw error(500, 'Failed to update profile');
			}
		}

		// Create admin approval record
		await locals?.supabase
			.from('admin_approvals' as any)
			.insert({
				request_type: 'brand_verification',
				request_id: params?.id,
				admin_id: userId,
				action: 'approve',
				notes: adminNotes
			});

		throw redirect(303, '/admin/brands');
	},

	reject: async ({ request, params, locals }) => {
		const formData = await request?.formData();
		const adminNotes = formData?.get('adminNotes') as string;
		const userId = locals?.user?.id;

		if (!userId) {
			throw error(401, 'Unauthorized');
		}

		if (!adminNotes?.trim()) {
			throw error(400, 'Please provide a reason for rejection');
		}

		// Update brand verification request
		const { error: updateError } = await locals?.supabase
			.from('brand_verification_requests' as any)
			.update({
				verification_status: 'rejected',
				admin_notes: adminNotes,
				reviewed_by: userId,
				reviewed_at: new Date().toISOString()
			})
			.eq('id', params?.id);

		if (updateError) {
			throw error(500, 'Failed to update verification request');
		}

		// Create admin approval record
		await locals?.supabase
			.from('admin_approvals' as any)
			.insert({
				request_type: 'brand_verification',
				request_id: params?.id,
				admin_id: userId,
				action: 'reject',
				notes: adminNotes
			});

		throw redirect(303, '/admin/brands');
	},

	requestInfo: async ({ request, params, locals }) => {
		const formData = await request?.formData();
		const infoMessage = formData?.get('infoMessage') as string;
		const userId = locals?.user?.id;

		if (!userId) {
			throw error(401, 'Unauthorized');
		}

		if (!infoMessage?.trim()) {
			throw error(400, 'Please specify what information is needed');
		}

		// Update status to more_info_needed
		const { error: updateError } = await locals?.supabase
			.from('brand_verification_requests' as any)
			.update({
				verification_status: 'more_info_needed',
				admin_notes: infoMessage,
				reviewed_by: userId,
				reviewed_at: new Date().toISOString()
			})
			.eq('id', params?.id);

		if (updateError) {
			throw error(500, 'Failed to update verification request');
		}

		// Create admin approval record
		await locals?.supabase
			.from('admin_approvals' as any)
			.insert({
				request_type: 'brand_verification',
				request_id: params?.id,
				admin_id: userId,
				action: 'request_info',
				notes: infoMessage
			});

		throw redirect(303, '/admin/brands');
	}
};