<script lang="ts">
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils/cn';
	import NotificationBell from './NotificationBell.svelte';
	import UserMenu from './UserMenu.svelte';
	import type { User, Session } from '@supabase/supabase-js';
	import type { ExtendedProfile } from '$lib/types/database.extended';
	
	interface MobileActionsProps {
		user: User | null;
		session: Session | null;
		profile: ExtendedProfile | null;
		brandSlug: string | null;
		onSignOut: () => void;
		showUnreadCount?: boolean;
		class?: string;
	}
	
	let {
		user,
	session,
	profile,
		brandSlug,
		onSignOut,
		showUnreadCount = true,
		class: className = ''
	}: MobileActionsProps = $props();
</script>

<div class={cn("flex items-center gap-2 ml-auto md:hidden", className)} role="group" aria-label="Mobile actions">
	{#if user && showUnreadCount}
		<NotificationBell />
	{/if}
	
	<UserMenu {user} {session} {profile} {brandSlug} {onSignOut} isMobile={true} />
</div>