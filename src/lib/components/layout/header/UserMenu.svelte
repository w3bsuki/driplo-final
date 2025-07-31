<script lang="ts">
	import { User as UserIcon, ChevronDown } from 'lucide-svelte';
	import { DropdownMenu } from '$lib/components/ui';
	import ProfileDropdownContent from '../ProfileDropdownContent.svelte';
	import type { User, Session } from '@supabase/supabase-js';
	import type { ExtendedProfile } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	
	interface UserMenuProps {
		user: User | null;
		session: Session | null;
		profile: ExtendedProfile | null;
		brandSlug: string | null;
		onSignOut: () => void;
		isMobile?: boolean;
		class?: string;
	}
	
	let {
		user,
	session,
	profile,
		brandSlug,
		onSignOut,
		isMobile = false,
		class: className = ''
	}: UserMenuProps = $props();
	
	// Badge configuration
	const badgeConfig: Record<string, { emoji: string; label: string }> = {
		brand: { emoji: '🏪', label: 'Brand' },
		top_seller: { emoji: '⭐', label: 'Top Seller' },
		verified: { emoji: '✅', label: 'Verified' },
		power_seller: { emoji: '🔥', label: 'Power Seller' },
		rising_star: { emoji: '🌟', label: 'Rising Star' },
		admin: { emoji: '👑', label: 'Admin' }
	};
	
	const avatarSizeClass = isMobile ? 'h-9 w-9' : 'h-[var(--button-height-lg)] w-[var(--button-height-lg)]';
	const avatarSize = isMobile ? 36 : 40; // 40px = --button-height-lg
	const primaryBadge = (profile as any)?.badges?.[0];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="relative rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 hover:scale-105 active:scale-95 transition-all duration-100 {className}"
		aria-label="Account menu"
	>
		{#if user}
			<img 
				src={profile?.avatar_url || `https://api?.dicebear.com/7?.x/avataaars/svg?seed=${profile?.username || user?.email}`} 
				alt={`${profile?.username || user?.email} profile`} 
				width={avatarSize}
				height={avatarSize}
				class={cn(
					avatarSizeClass,
					"rounded-sm object-cover border border-border",
					"hover:border-secondary transition-colors duration-100"
				)}
				loading="lazy"
			/>
			{#if primaryBadge && badgeConfig[primaryBadge]}
				<div class="absolute -top-1 -right-1 bg-background rounded-sm px-1 border border-border">
					<span class="text-xs" title={badgeConfig[primaryBadge].label}>
						{badgeConfig[primaryBadge].emoji}
					</span>
				</div>
			{/if}
		{:else}
			<div 
				class={cn(
					avatarSizeClass,
					"rounded-sm bg-muted flex items-center justify-center",
					"border border-border hover:border-secondary transition-colors duration-100"
				)}
				aria-label="Guest user"
			>
				<UserIcon class="h-5 w-5 text-muted-foreground" aria-hidden="true" />
			</div>
		{/if}
		<div class="absolute -bottom-1 -right-1 bg-background rounded-sm p-0.5 border border-border">
			<ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content 
		align="end" 
		sideOffset={8}
		class="w-72 rounded-sm border border-border bg-popover p-0 shadow-lg z-[10000]"
	>
		<ProfileDropdownContent {user} {session} {profile} {brandSlug} {onSignOut} />
	</DropdownMenu.Content>
</DropdownMenu.Root>