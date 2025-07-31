<script lang="ts">
	// Search.Filters - Composable filter pills and quick actions
	
	import Button from '$lib/components/ui/button.svelte';
	import { cn } from '$lib/utils/cn';
	import { createEventDispatcher } from 'svelte';

	interface QuickFilter {
		icon: string;
		name: string;
		action: string;
		variant?: 'default' | 'golden' | 'blue' | 'pink' | 'hot' | 'sale';
		ariaLabel?: string;
	}

	interface Props {
		filters?: QuickFilter[];
		maxVisible?: number;
		size?: 'sm' | 'md';
		mode?: 'pills' | 'buttons' | 'compact';
		class?: string;
		showScrollHint?: boolean;
	}

	let {
		filters = [],
		maxVisible,
		size = 'md',
		mode = 'pills',
		class: className = '',
		showScrollHint = true
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		'filter-click': { action: string; filter: QuickFilter };
	}>();

	// Variant color mappings
	const variantStyles = {
		default: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200',
		golden: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200',
		blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200',
		pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200',
		hot: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
		sale: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
	};

	// Size configurations
	const sizeStyles = {
		sm: {
			button: 'px-2.5 py-1 text-xs h-7',
			icon: 'text-sm',
			gap: 'gap-1'
		},
		md: {
			button: 'px-3 py-1.5 text-sm h-8',
			icon: 'text-base',
			gap: 'gap-1.5'
		}
	};

	const currentSize = sizeStyles[size];
	const visibleFilters = maxVisible ? filters.slice(0, maxVisible) : filters;

	function handleFilterClick(filter: QuickFilter) {
		dispatch('filter-click', { action: filter.action, filter });
	}

	// Mode-specific container classes
	const containerClass = $derived(() => {
		const base = cn('flex items-center overflow-x-auto', currentSize.gap, className);
		
		switch (mode) {
			case 'compact':
				return cn(base, 'space-x-1');
			case 'buttons':
				return cn(base, 'flex-wrap');
			default: // pills
				return cn(base, 'scrollbar-hide');
		}
	});
</script>

<div class={containerClass}>
	{#each visibleFilters as filter (filter.action)}
		<Button
			variant="outline"
			onclick={() => handleFilterClick(filter)}
			class={cn(
				'flex items-center whitespace-nowrap flex-shrink-0 rounded-full transition-colors',
				currentSize.button,
				currentSize.gap,
				variantStyles[filter.variant || 'default']
			)}
			aria-label={filter.ariaLabel || filter.name}
		>
			<span class={currentSize.icon} aria-hidden="true">{filter.icon}</span>
			<span>{filter.name}</span>
		</Button>
	{/each}

	{#if showScrollHint && filters.length > (maxVisible || 10)}
		<div class="flex-shrink-0 text-xs text-gray-400 pl-2" aria-hidden="true">
			→
		</div>
	{/if}
</div>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>