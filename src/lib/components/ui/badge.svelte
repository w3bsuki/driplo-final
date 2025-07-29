<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { Package2, Ruler, CheckCircle2, Store, Check } from 'lucide-svelte';
	import { getConditionConfig, type ListingCondition } from '$lib/config/conditions';
	import * as m from '$lib/paraglide/messages.js';

	import type { BadgeProps } from '$lib/types/ui';
	
	// Extended badge props with all consolidated variants
	interface ExtendedBadgeProps extends Omit<BadgeProps, 'variant'> {
		variant?: BadgeProps['variant'] | 
			'condition-new-with-tags' | 'condition-new-without-tags' | 'condition-very-good' | 
			'condition-good' | 'condition-fair' |
			'category' | 'size' | 'verified' | 'brand' | 'chip' | 'interactive';
		
		// Category badge props
		category?: string;
		
		// Size badge props
		sizeValue?: string;
		
		// Verified badge props
		verified?: boolean;
		showText?: boolean;
		
		// Brand badge props
		brand?: string;
		isVerified?: boolean;
		
		// Chip/interactive props
		dismissible?: boolean;
		interactive?: boolean;
		selected?: boolean;
		onclick?: (e: MouseEvent) => void;
		ondismiss?: () => void;
		
		// Condition badge props
		condition?: string | null | undefined;
		
		// General props
		icon?: any;
		iconClass?: string;
	}
	
	type Props = ExtendedBadgeProps;

	let { 
		variant = 'default', 
		size = 'md', 
		class: className, 
		children,
		category,
		sizeValue,
		verified = false,
		showText = true,
		brand,
		isVerified = false,
		dismissible = false,
		interactive = false,
		selected = false,
		onclick,
		ondismiss,
		condition,
		icon,
		iconClass = ''
	}: Props = $props();

	// Get condition configuration for condition badges
	const conditionConfig = $derived(() => {
		if (variant === 'condition' && condition) {
			return getConditionConfig(condition);
		}
		return null;
	});

	// Get localized condition label
	function getLocalizedConditionLabel(labelKey: string): string {
		const messageMap: Record<string, () => string> = {
			'condition_new_with_tags': m.condition_new_with_tags,
			'condition_new_without_tags': m.condition_new_without_tags,
			'condition_like_new': m.condition_like_new,
			'condition_excellent': m.condition_excellent,
			'condition_very_good': m.condition_very_good,
			'condition_good': m.condition_good,
			'condition_fair': m.condition_fair,
			'condition_worn': m.condition_worn
		};
		
		const messageFn = messageMap[labelKey];
		return messageFn ? messageFn() : conditionConfig?.label || '';
	}

	// Get condition variant
	function getConditionVariant(condition: string | null | undefined): string {
		if (!condition) return 'default';
		
		switch(condition) {
			case 'new_with_tags':
				return 'condition-new-with-tags';
			case 'new_without_tags':
				return 'condition-new-without-tags';
			case 'very_good':
				return 'condition-very-good';
			case 'good':
				return 'condition-good';
			case 'fair':
				return 'condition-fair';
			default:
				return 'default';
		}
	}

	const variants = {
		default: 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border-primary)]',
		secondary: 'bg-[var(--color-brand-50)] text-[var(--color-brand-600)] border-[var(--color-brand-200)]',
		success: 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-500)]/20',
		destructive: 'bg-[var(--color-error-50)] text-[var(--color-error-600)] border-[var(--color-error-500)]/20',
		outline: 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] bg-transparent',
		// Condition variants
		'condition-new-with-tags': 'bg-[var(--color-success-500)] text-[var(--color-white)] border-[var(--color-success-500)]',
		'condition-new-without-tags': 'bg-[var(--color-success-500)] text-[var(--color-white)] border-[var(--color-success-500)]',
		'condition-very-good': 'bg-[var(--color-warning-500)] text-[var(--color-gray-950)] border-[var(--color-warning-500)]',
		'condition-good': 'bg-[var(--color-warning-600)] text-[var(--color-white)] border-[var(--color-warning-600)]',
		'condition-fair': 'bg-[var(--color-error-500)] text-[var(--color-white)] border-[var(--color-error-500)]',
		// Specialized variants
		'category': 'bg-[var(--color-brand-50)] text-[var(--color-brand-600)] border-[var(--color-brand-200)]',
		'size': 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] bg-transparent',
		'verified': 'bg-green-100 text-green-700 border-green-200',
		'brand': 'bg-gradient-to-r from-[var(--color-brand-50)] to-[var(--color-info-50)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]',
		'chip': 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200',
		'interactive': 'bg-brand-100 text-brand-700 border-brand-200 hover:bg-brand-200 cursor-pointer'
	};

	const sizes = {
		sm: 'badge-size-sm',
		md: 'badge-size-md',
		lg: 'badge-size-lg'
	};

	// Handle interactive behavior
	function handleClick(e: MouseEvent) {
		if (interactive && onclick) {
			onclick(e);
		}
	}

	function handleDismiss(e: MouseEvent) {
		e.stopPropagation();
		ondismiss?.();
	}

	// Determine the actual variant to use
	const actualVariant = $derived(() => {
		if (variant === 'condition' && condition) {
			return getConditionVariant(condition);
		}
		return variant;
	});

	// Determine if this should be interactive
	const isInteractive = $derived(() => interactive || onclick || dismissible);

	// Determine additional classes
	const additionalClasses = $derived(() => {
		let classes = '';
		
		if (selected) classes += ' ring-2 ring-brand-500 ring-offset-1';
		if (isInteractive) classes += ' active:scale-95 transition-all duration-100';
		
		return classes;
	});
</script>

{#if variant === 'verified' && !verified}
	<!-- Don't render verified badge if not verified -->
{:else if isInteractive}
	<button
		onclick={handleClick}
		class={cn(
			'inline-flex items-center justify-center rounded-[var(--radius-sm)] border',
			variants[actualVariant],
			sizes[size],
			additionalClasses,
			className
		)}
	>
		<!-- Badge content based on variant -->
		{#if variant === 'category' && category}
			<Package2 class={cn("w-3 h-3 mr-1", iconClass)} />
			{category}
		{:else if variant === 'size' && sizeValue}
			<Ruler class={cn("w-3 h-3 mr-1", iconClass)} />
			Size {sizeValue}
		{:else if variant === 'verified'}
			<Check class={cn("w-3 h-3", showText ? "mr-1" : "", iconClass)} />
			{#if showText}
				<span>Verified</span>
			{/if}
		{:else if variant === 'brand' && brand}
			<Store class={cn("w-3 h-3 mr-1", iconClass)} />
			<span>{brand}</span>
			{#if isVerified}
				<CheckCircle2 class={cn("w-3 h-3 ml-1", iconClass)} />
			{/if}
		{:else if variant === 'condition' && conditionConfig}
			{getLocalizedConditionLabel(conditionConfig.labelKey)}
		{:else if icon}
			<svelte:component this={icon} class={cn("w-3 h-3 mr-1", iconClass)} />
			{@render children()}
		{:else}
			{@render children()}
		{/if}
		
		<!-- Dismiss button for dismissible badges -->
		{#if dismissible}
			<button
				onclick={handleDismiss}
				class="ml-1.5 -mr-1 p-0.5 rounded-sm hover:bg-black/10 transition-colors duration-100"
				aria-label="Remove"
			>
				<svg class="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
					<path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>
		{/if}
	</button>
{:else}
	<span
		class={cn(
			'inline-flex items-center justify-center rounded-[var(--radius-sm)] border',
			variants[actualVariant],
			sizes[size],
			additionalClasses,
			className
		)}
	>
		<!-- Badge content based on variant -->
		{#if variant === 'category' && category}
			<Package2 class={cn("w-3 h-3 mr-1", iconClass)} />
			{category}
		{:else if variant === 'size' && sizeValue}
			<Ruler class={cn("w-3 h-3 mr-1", iconClass)} />
			Size {sizeValue}
		{:else if variant === 'verified'}
			<Check class={cn("w-3 h-3", showText ? "mr-1" : "", iconClass)} />
			{#if showText}
				<span>Verified</span>
			{/if}
		{:else if variant === 'brand' && brand}
			<Store class={cn("w-3 h-3 mr-1", iconClass)} />
			<span>{brand}</span>
			{#if isVerified}
				<CheckCircle2 class={cn("w-3 h-3 ml-1", iconClass)} />
			{/if}
		{:else if variant === 'condition' && conditionConfig}
			{getLocalizedConditionLabel(conditionConfig.labelKey)}
		{:else if icon}
			<svelte:component this={icon} class={cn("w-3 h-3 mr-1", iconClass)} />
			{@render children()}
		{:else}
			{@render children()}
		{/if}
		
		<!-- Dismiss button for dismissible badges -->
		{#if dismissible}
			<button
				onclick={handleDismiss}
				class="ml-1.5 -mr-1 p-0.5 rounded-sm hover:bg-black/10 transition-colors duration-100 touch-safe min-w-[20px] min-h-[20px]"
				aria-label="Remove"
			>
				<svg class="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
					<path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>
		{/if}
	</span>
{/if}