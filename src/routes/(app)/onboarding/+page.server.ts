import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession();
	
	// Redirect to login if not authenticated
	if (!session || !user) {
		throw redirect(303, '/login');
	}
	
	return {
		user,
		session
	};
};

export const actions: Actions = {
	complete: async ({ locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		try {
			// Update profile to mark onboarding as complete
			const { error: updateError } = await supabase
				.from('profiles')
				.update({
					onboarding_completed: true,
					setup_completed: true,
					onboarding_step: 5, // Final step
					setup_completed_at: new Date().toISOString()
				})
				.eq('id', user.id);

			if (updateError) {
				console.error('Error updating profile:', updateError);
				return fail(500, { error: 'Failed to complete onboarding' });
			}

			// Log successful onboarding completion
			await supabase.rpc('log_auth_event', {
				p_user_id: user.id,
				p_action: 'onboarding_completed',
				p_success: true,
				p_metadata: {
					completed_at: new Date().toISOString()
				}
			});

			// Redirect to home page
			throw redirect(303, '/');
		} catch (err) {
			console.error('Onboarding completion error:', err);
			
			// Log failed attempt
			await supabase.rpc('log_auth_event', {
				p_user_id: user.id,
				p_action: 'onboarding_completed',
				p_success: false,
				p_error_message: err instanceof Error ? err.message : 'Unknown error'
			});

			return fail(500, { error: 'Failed to complete onboarding' });
		}
	}
};