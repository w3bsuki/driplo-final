<script lang="ts">
	import LanguageSwitcher from '../LanguageSwitcher.svelte';
	import NotificationBell from './NotificationBell.svelte';
	import UserMenu from './UserMenu.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Session } from '@supabase/supabase-js';
	import type { ExtendedProfile, UserProfile } from '$lib/types';
	
	interface DesktopNavProps {
		user: UserProfile | null;
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
	}: DesktopNavProps = $props();
</script>

<div class="hidden md:flex items-center gap-2 {className}">
	<LanguageSwitcher />
	
	<a 
		href="/wishlist" 
		class="h-9 w-9 flex items-center justify-center rounded-sm hover:bg-muted hover:scale-105 active:scale-95 transition-all duration-100 btn-compact-safe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
	>
		<span class="text-lg" aria-hidden="true">❤️</span>
		<span class="sr-only">{m.header_favorites()}</span>
	</a>
	
	<a 
		href="/orders" 
		class="h-9 w-9 flex items-center justify-center rounded-sm hover:bg-muted hover:scale-105 active:scale-95 transition-all duration-100 btn-compact-safe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
	>
		<span class="text-lg" aria-hidden="true">🛍️</span>
		<span class="sr-only">Orders</span>
	</a>
	
	{#if showUnreadCount}
		<NotificationBell />
	{/if}
	
	<UserMenu {user} {session} {profile} {brandSlug} {onSignOut} />
</div>