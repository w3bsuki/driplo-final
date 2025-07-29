<script lang="ts">
	import { ChevronDown, Menu, Search } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils/cn';
	import { debounce } from '$lib/utils/performance';
	import CategoryDropdown from '$lib/components/shared/CategoryDropdownFixed.svelte';
	import QuickFilterPills from '$lib/components/search/QuickFilterPills.svelte';
	import TrendingSearches from '$lib/components/search/TrendingSearches.svelte';
	import type { Category } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';

	interface QuickFilter {
		icon: string;
		name: string;
		action: string;
		ariaLabel: string;
		variant: string;
	}

	interface Props {
		// Component variant - determines layout and behavior
		variant?: 'header' | 'hero' | 'sticky' | 'inline' | 'modal';
		
		// Search configuration
		value?: string;
		placeholder?: string;
		onSearch?: (query: string) => void;
		debounceDelay?: number;
		
		// Category integration
		categories?: Category[];
		showCategoryButton?: boolean;
		categoryButtonType?: 'icon' | 'dropdown' | 'text';
		onCategorySelect?: (category: string) => void;
		activeCategory?: string;
		
		// Quick filters
		quickFilters?: QuickFilter[];
		onQuickFilterClick?: (action: string) => void;
		showQuickFilters?: boolean;
		maxQuickFilters?: number;
		
		// Trending searches
		trendingSearches?: string[];
		onTrendingClick?: (term: string) => void;
		showTrending?: boolean;
		maxTrending?: number;
		
		// Styling and behavior
		size?: 'sm' | 'md' | 'lg';
		theme?: 'blue' | 'brand' | 'neutral';
		class?: string;
		searchClass?: string;
		
		// Sticky behavior
		visible?: boolean;
		stickyOffset?: number;
		
		// Mobile specific
		mobileLayout?: 'compact' | 'full' | 'modal';
	}

	let {
		variant = 'inline',
		value = $bindable(''),
		placeholder = m.browse_search_placeholder?.() || 'Search...',
		onSearch,
		debounceDelay = 300,
		categories = [],
		showCategoryButton = true,
		categoryButtonType = 'icon',
		onCategorySelect,
		activeCategory = '',
		quickFilters = [],
		onQuickFilterClick,
		showQuickFilters = true,
		maxQuickFilters = 6,
		trendingSearches = [],
		onTrendingClick,
		showTrending = true,
		maxTrending = 3,
		size = 'md',
		theme = 'brand',
		class: className = '',
		searchClass = '',
		visible = true,
		stickyOffset = 0,
		mobileLayout = 'compact'
	}: Props = $props();

	// State management
	let isFocused = $state(false);
	let isCategoryDropdownOpen = $state(false);
	let isSticky = $state(false);
	let searchRef: HTMLInputElement;

	// Theme configuration
	const themes = {
		blue: {
			primary: 'border-blue-500 ring-blue-500',
			secondary: 'border-blue-200 bg-blue-50',
			accent: 'bg-blue-500 text-white hover:bg-blue-600',
			text: 'text-blue-600'
		},
		brand: {
			primary: 'border-brand-500 ring-brand-500',
			secondary: 'border-brand-200 bg-brand-50',
			accent: 'bg-brand-500 text-white hover:bg-brand-600',
			text: 'text-brand-600'
		},
		neutral: {
			primary: 'border-gray-500 ring-gray-500',
			secondary: 'border-gray-200 bg-gray-50',
			accent: 'bg-gray-900 text-white hover:bg-gray-800',
			text: 'text-gray-600'
		}
	};

	const currentTheme = themes[theme];

	// Size configuration
	const sizes = {
		sm: {
			container: 'py-2',
			input: 'h-8 text-sm px-3',
			button: 'h-8 px-3 text-sm',
			gap: 'gap-2'
		},
		md: {
			container: 'py-3',
			input: 'h-10 text-base px-4',
			button: 'h-10 px-4 text-sm',
			gap: 'gap-3'
		},
		lg: {
			container: 'py-4',
			input: 'h-12 text-lg px-5',
			button: 'h-12 px-5 text-base',
			gap: 'gap-4'
		}
	};

	const currentSize = sizes[size];

	// Debounced search handler
	const debouncedSearch = debounce(() => {
		if (onSearch) {
			onSearch(value.trim());
		} else {
			// Default navigation behavior
			if (value.trim()) {
				goto(`/browse?q=${encodeURIComponent(value.trim())}`);
			} else {
				goto('/browse');
			}
		}
	}, debounceDelay);

	// Event handlers
	function handleSearch() {
		debouncedSearch();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSearch();
		}
	}

	function handleFocus() {
		isFocused = true;
	}

	function handleBlur() {
		// Delay blur to allow for clicking on suggestions
		setTimeout(() => {
			isFocused = false;
		}, 150);
	}

	function handleTrendingClick(term: string) {
		value = term;
		if (onTrendingClick) {
			onTrendingClick(term);
		} else {
			handleSearch();
		}
	}

	function handleQuickFilter(action: string) {
		if (onQuickFilterClick) {
			onQuickFilterClick(action);
		} else {
			// Default routing logic
			const routeMap: Record<string, string> = {
				'newest': '/browse?sort=created_at&order=desc',
				'sale': '/browse?filter=sale',
				'hot': '/browse?filter=hot',
				'top-sellers': '/browse?sort=favorites_count&order=desc',
				'men': '/men',
				'women': '/women',
				'shoes': '/shoes',
				'accessories': '/accessories',
				'bags': '/bags'
			};
			goto(routeMap[action] || '/browse');
		}
	}

	function toggleCategoryDropdown() {
		isCategoryDropdownOpen = !isCategoryDropdownOpen;
	}

	function closeCategoryDropdown() {
		isCategoryDropdownOpen = false;
	}

	function handleCategorySelect(categorySlug: string) {
		if (onCategorySelect) {
			onCategorySelect(categorySlug);
		} else {
			goto(categorySlug ? `/${categorySlug}` : '/browse');
		}
		closeCategoryDropdown();
	}

	// Focus management
	export function focus() {
		searchRef?.focus();
	}

	// Calculate container styles based on variant
	const containerClass = $derived(() => {
		const base = cn("relative", className);
		
		switch (variant) {
			case 'hero':
				return cn(base, "bg-gradient-to-b from-brand-50 to-white", currentSize.container);
			case 'sticky':
				return cn(
					base, 
					"fixed left-0 right-0 z-40 bg-white border-b shadow-sm transition-all duration-300",
					visible ? 'translate-y-0' : '-translate-y-full'
				);
			case 'header':
				return cn(base, "bg-white");
			case 'modal':
				return cn(base, "bg-white rounded-lg shadow-lg border p-4");
			default:
				return cn(base, "bg-white", currentSize.container);
		}
	});

	// Search input styling
	const searchInputClass = $derived(() => {
		return cn(
			"w-full rounded-lg border bg-white transition-all duration-200 focus:outline-none focus:ring-2",
			currentSize.input,
			isFocused 
				? cn("border-transparent ring-2", currentTheme.primary)
				: "border-gray-200 hover:border-gray-300",
			searchClass
		);
	});
</script>

{#if visible}
	<div class={containerClass} style:top={variant === 'sticky' ? `${stickyOffset}px` : undefined}>
		{#if variant === 'hero'}
			<!-- Hero Layout -->
			<div class="container px-4">
				<div class="max-w-3xl mx-auto">
					<!-- Desktop Layout -->
					<div class="hidden md:block">
						<div class="relative bg-white rounded-lg border border-gray-200 shadow-sm">
							<div class="flex items-center min-w-0 py-3 px-4">
								<!-- Category Button -->
								{#if showCategoryButton}
									<div class="relative flex-shrink-0 mr-3">
										<button
											onclick={toggleCategoryDropdown}
											class={cn(
												"flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-all",
												isCategoryDropdownOpen 
													? currentTheme.accent
													: "bg-gray-900 text-white hover:bg-gray-800"
											)}
										>
											{#if categoryButtonType === 'text'}
												<span class="text-sm">{m.header_categories?.() || 'Categories'}</span>
											{/if}
											<ChevronDown class={cn(
												"w-4 h-4",
												isCategoryDropdownOpen && "rotate-180"
											)} />
										</button>
									</div>
								{/if}
								
								<!-- Search Input -->
								<div class="flex-1 flex items-center">
									<Search class="w-5 h-5 text-gray-400 mr-3" />
									<input
										bind:this={searchRef}
										type="search"
										{placeholder}
										bind:value
										onfocus={handleFocus}
										onblur={handleBlur}
										onkeydown={handleKeyDown}
										oninput={handleSearch}
										class="flex-1 border-0 focus:ring-0 bg-transparent text-base"
									/>
									<button
										onclick={handleSearch}
										class={cn(
											"ml-3 flex items-center justify-center w-10 h-10 rounded-md transition-opacity",
											currentTheme.accent
										)}
									>
										<Search class="w-5 h-5" />
									</button>
								</div>
							</div>
							
							{#if showQuickFilters && quickFilters.length > 0}
								<!-- Quick Filters -->
								<div class="border-t border-gray-100 py-3 px-4">
									<div class="flex items-center gap-2 overflow-x-auto">
										<span class="text-xs text-gray-500 flex-shrink-0">
											{m.search_trending?.() || 'Trending'}:
										</span>
										<QuickFilterPills
											filters={quickFilters.slice(0, maxQuickFilters)}
											onFilterClick={handleQuickFilter}
											class="flex-1"
										/>
									</div>
								</div>
							{/if}
						</div>
						
						<!-- Category Dropdown for Desktop -->
						{#if isCategoryDropdownOpen && showCategoryButton}
							<CategoryDropdown
								{categories}
								isOpen={isCategoryDropdownOpen}
								onToggle={toggleCategoryDropdown}
								onClose={closeCategoryDropdown}
								class="absolute top-full left-0 right-0 mt-2"
							/>
						{/if}
					</div>
					
					<!-- Mobile Layout -->
					<div class="block md:hidden">
						<div class="relative bg-white rounded-lg border border-gray-200 shadow-sm">
							<div class="flex items-center py-3 px-4 gap-3">
								<!-- Category Button -->
								{#if showCategoryButton}
									<button
										onclick={toggleCategoryDropdown}
										class="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-md flex items-center justify-center"
									>
										<Menu class="w-5 h-5" />
									</button>
								{/if}
								
								<!-- Search Input -->
								<div class="flex-1 relative">
									<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										bind:this={searchRef}
										type="search"
										{placeholder}
										bind:value
										onfocus={handleFocus}
										onblur={handleBlur}
										onkeydown={handleKeyDown}
										oninput={handleSearch}
										class="w-full h-10 pl-10 pr-4 border-0 focus:ring-0 bg-transparent text-base"
									/>
								</div>
								
								<button
									onclick={handleSearch}
									class="flex-shrink-0 w-10 h-10 bg-brand-500 text-white rounded-md flex items-center justify-center"
								>
									<Search class="w-4 h-4" />
								</button>
							</div>
							
							{#if isCategoryDropdownOpen}
								<div class="border-t border-gray-200">
									<CategoryDropdown
										{categories}
										isOpen={isCategoryDropdownOpen}
										onToggle={toggleCategoryDropdown}
										onClose={closeCategoryDropdown}
										class="w-full"
									/>
								</div>
							{/if}
							
							{#if showQuickFilters && quickFilters.length > 0}
								<div class="border-t border-gray-200 py-2 px-4">
									<div class="overflow-x-auto">
										<div class="flex items-center gap-2">
											<QuickFilterPills
												filters={quickFilters}
												onFilterClick={handleQuickFilter}
												class="flex-shrink-0"
											/>
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>
					
					<!-- Trending Searches -->
					{#if showTrending && trendingSearches.length > 0}
						<TrendingSearches
							searches={trendingSearches.slice(0, maxTrending)}
							onSearchClick={handleTrendingClick}
							class="mt-3"
						/>
					{/if}
				</div>
			</div>

		{:else if variant === 'sticky'}
			<!-- Sticky Layout -->
			<div class="container mx-auto px-4 py-2">
				<div class="flex items-center gap-3 max-w-3xl mx-auto">
					{#if showCategoryButton}
						<button
							onclick={toggleCategoryDropdown}
							class="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center"
						>
							<Menu class="w-4 h-4" />
						</button>
					{/if}
					
					<div class="relative flex-1">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							bind:this={searchRef}
							type="search"
							{placeholder}
							bind:value
							onfocus={handleFocus}
							onblur={handleBlur}
							onkeydown={handleKeyDown}
							oninput={handleSearch}
							class={searchInputClass}
							style="padding-left: 2.5rem;"
						/>
						<button
							onclick={handleSearch}
							class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-500 text-white rounded-md text-xs font-medium hover:bg-brand-600 transition-colors"
						>
							{m.quick_filter_search_button?.() || 'Search'}
						</button>
					</div>
				</div>
			</div>

		{:else}
			<!-- Inline/Header Layout -->
			<div class={cn("flex items-center", currentSize.gap)}>
				{#if showCategoryButton && categoryButtonType === 'dropdown'}
					<CategoryDropdown 
						{categories}
						isOpen={isCategoryDropdownOpen}
						onToggle={toggleCategoryDropdown}
						onClose={closeCategoryDropdown}
					/>
				{/if}
				
				<div class="relative flex-1">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						bind:this={searchRef}
						type="search"
						{placeholder}
						bind:value
						onfocus={handleFocus}
						onblur={handleBlur}
						onkeydown={handleKeyDown}
						oninput={handleSearch}
						class={searchInputClass}
						style="padding-left: 2.5rem;"
					/>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Custom search input styling */
	input[type="search"]::-webkit-search-decoration,
	input[type="search"]::-webkit-search-cancel-button,
	input[type="search"]::-webkit-search-results-button,
	input[type="search"]::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
	
	/* Scrollbar hiding */
	.overflow-x-auto {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.overflow-x-auto::-webkit-scrollbar {
		display: none;
	}
</style>