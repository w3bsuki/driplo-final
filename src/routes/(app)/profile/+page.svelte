<script lang="ts">
	import { user } from '$lib/stores/auth'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	
	// Get user from store
	
	// Get supabase client from page data
	const supabase = $derived($page.data.supabase)

	onMount(async () => {
		if (!$user) {
			goto('/login')
			return
		}

		try {
			// Get user's profile to find username
			const { data: profile, error } = await supabase
				.from('profiles')
				.select('username')
				.eq('id', $user.id)
				.single()

			if (error || !profile?.username) {
				// If no profile exists, go to settings to create one
				goto('/profile/settings')
			} else {
				goto(`/profile/${profile.username}`)
			}
		} catch (error) {
			console.error('Error loading profile:', error)
			goto('/profile/settings')
		}
	})
</script>

<!-- Loading state while redirecting -->
<div class="min-h-screen flex items-center justify-center">
	<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
</div>