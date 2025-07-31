<script lang="ts">
	// Search.Bar - A complete search bar with input, category dropdown, and filters
	
	import SearchInput from './Search.Input.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { ChevronDown, Menu } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		// Input props
		value?: string;
		placeholder?: string;
		size?: 'sm' | 'md' | 'lg';
		
		// Category functionality
		showCategoryButton?: boolean;
		categoryButtonText?: string;
		categoryButtonIcon?: 'chevron' | 'menu';
		isCategoryOpen?: boolean;
		
		// Styling
		variant?: 'default' | 'hero' | 'compact';
		class?: string;
		
		// Accessibility
		'aria-label'?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		size = 'md',
		showCategoryButton = true,
		categoryButtonText = 'Categories',
		categoryButtonIcon = 'chevron',
		isCategoryOpen = false,
		variant = 'default',
		class: className = '',
		'aria-label': ariaLabel
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		search: { query: string };
		'category-toggle': void;
		'category-open': void;
		'category-close': void;
	}>();

	// Variant styles
	const variantStyles = {
		default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
		hero: 'bg-white border border-gray-200 rounded-lg shadow-md',
		compact: 'bg-gray-50 border border-gray-200 rounded-md'
	};

	function handleSearch(event: CustomEvent<{ query: string }>) {
		dispatch('search', event.detail);
	}

	function handleCategoryToggle() {
		isCategoryOpen = !isCategoryOpen;
		dispatch('category-toggle');
		if (isCategoryOpen) {
			dispatch('category-open');
		} else {
			dispatch('category-close');
		}
	}
</script>

<div class={cn('flex items-center', variantStyles[variant], className)} role="search" aria-label={ariaLabel}>
	<!-- Category Button -->
	{#if showCategoryButton}
		<div class="flex-shrink-0 border-r border-gray-200 pr-3 ml-3">
			<Button
				variant="ghost"
				{size}
				onclick={handleCategoryToggle}
				class="gap-2"
				aria-expanded={isCategoryOpen}
				aria-label="Toggle categories"
			>
				<span class="text-sm font-medium">{categoryButtonText}</span>
				{#if categoryButtonIcon === 'chevron'}
					<ChevronDown class={cn(
						'transition-transform duration-200',
						size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
						isCategoryOpen && 'rotate-180'
					)} />
				{:else}
					<Menu class={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
				{/if}
			</Button>
		</div>
	{/if}

	<!-- Search Input -->
	<div class={cn('flex-1', showCategoryButton ? 'ml-3' : 'ml-3')}>
		<SearchInput
			bind:value
			{placeholder}
			{size}
			variant="ghost"
			showSearchIcon={!showCategoryButton}
			onsearch={handleSearch}
			class="border-0 shadow-none"
		/>
	</div>
</div>