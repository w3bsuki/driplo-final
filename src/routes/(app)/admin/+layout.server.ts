import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals?.safeGetSession()
	
	if (!user) {
		throw redirect(303, '/login')
	}
	
	// Check if user is admin
	const { data: profile } = await locals?.supabase
		.from('profiles')
		.select('account_type, email')
		.eq('id', user?.id)
		.single()
	
	// For emergency cleanup - check if user has admin email or account type
	const isAdmin = (profile as any)?.email?.includes('admin') || (profile as any)?.account_type === 'admin';
	if (!isAdmin) {
		throw redirect(303, '/')
	}
	
	return {
		user,
		profile,
		isAdmin
	}
}