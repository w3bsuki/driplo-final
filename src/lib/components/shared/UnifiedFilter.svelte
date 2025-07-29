<script lang="ts">
	import { X, Filter, ChevronDown, Sparkles } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { Category } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';

	interface FilterOption {
		label: string;
		value: string;
		count?: number;
	}

	interface FilterGroup {
		type: string;
		label: string;
		options: FilterOption[];
		multiple?: boolean;
	}

	interface Props {
		// Component variant - determines layout and behavior
		variant?: 'inline' | 'dropdown' | 'modal' | 'drawer' | 'pills';
		
		// Filter configuration
		filters: FilterGroup[];
		selectedFilters: Record<string, string | string[]>;
		onFilterChange: (type: string, value: string | string[]) => void;
		onClearFilters: () => void;
		
		// Subcategory support
		subcategories?: Category[];
		showSubcategories?: boolean;
		selectedSubcategory?: string;
		onSubcategoryChange?: (subcategory: string) => void;
		
		// Sorting
		sortOptions?: FilterOption[];
		selectedSort?: string;
		onSortChange?: (sort: string) => void;
		
		// Theming and styling
		theme?: 'blue' | 'pink' | 'brand' | 'neutral';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		
		// Behavior
		autoApply?: boolean;
		showClearAll?: boolean;
		collapsible?: boolean;
		
		// Mobile specific
		mobileBreakpoint?: 'sm' | 'md' | 'lg';
		mobileVariant?: 'pills' | 'drawer' | 'modal';
	}

	let {
		variant = 'inline',
		filters = [],
		selectedFilters = {},
		onFilterChange,
		onClearFilters,
		subcategories = [],
		showSubcategories = false,
		selectedSubcategory = 'all',
		onSubcategoryChange,
		sortOptions = [],
		selectedSort = '',
		onSortChange,
		theme = 'brand',
		size = 'md',
		class: className = '',
		autoApply = true,
		showClearAll = true,
		collapsible = false,
		mobileBreakpoint = 'md',
		mobileVariant = 'pills'
	}: Props = $props();

	// State management
	let showAllFilters = $state(false);
	let expandedGroups = $state<Record<string, boolean>>({});

	// Theme configuration
	const themes = {
		blue: {
			active: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
			inactive: 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50',
			accent: 'bg-blue-500 text-white hover:bg-blue-600',
			text: 'text-blue-600'
		},
		pink: {
			active: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
			inactive: 'bg-white border-gray-200 hover:border-pink-200 hover:bg-pink-50',
			accent: 'bg-pink-500 text-white hover:bg-pink-600',
			text: 'text-pink-600'
		},
		brand: {
			active: 'bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100',
			inactive: 'bg-white border-gray-200 hover:border-brand-200 hover:bg-brand-50',
			accent: 'bg-brand-500 text-white hover:bg-brand-600',
			text: 'text-brand-600'
		},
		neutral: {
			active: 'bg-gray-100 border-gray-300 text-gray-800',
			inactive: 'bg-white border-gray-200 hover:bg-gray-50',
			accent: 'bg-gray-900 text-white hover:bg-gray-800',
			text: 'text-gray-600'
		}
	};

	const currentTheme = themes[theme];

	// Size configuration
	const sizes = {
		sm: {
			text: 'text-xs',
			padding: 'px-2 py-1',
			height: 'h-8',
			gap: 'gap-1'
		},
		md: {
			text: 'text-sm',
			padding: 'px-3 py-2',
			height: 'h-9',
			gap: 'gap-2'
		},
		lg: {
			text: 'text-base',
			padding: 'px-4 py-3',
			height: 'h-11',
			gap: 'gap-3'
		}
	};

	const currentSize = sizes[size];

	// Computed values
	const activeFilterCount = $derived(() => {
		let count = 0;
		if (selectedSubcategory && selectedSubcategory !== 'all') count++;
		
		Object.entries(selectedFilters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				count += value.filter(v => v).length;
			} else if (value && value !== '' && value !== 'recent') {
				count++;
			}
		});
		
		return count;
	});

	// Filter management functions
	function handleFilterChange(type: string, value: string) {
		const currentValue = selectedFilters[type];
		const filterGroup = filters.find(f => f.type === type);
		
		if (filterGroup?.multiple) {
			// Handle multi-select
			const currentArray = Array.isArray(currentValue) ? currentValue : [];
			const newArray = currentArray.includes(value)
				? currentArray.filter(v => v !== value)
				: [...currentArray, value];
			onFilterChange(type, newArray);
		} else {
			// Handle single select
			onFilterChange(type, currentValue === value ? '' : value);
		}

		if (autoApply) {
			applyFilters();
		}
	}

	function clearFilter(type: string) {
		const filterGroup = filters.find(f => f.type === type);
		onFilterChange(type, filterGroup?.multiple ? [] : '');
		
		if (autoApply) {
			applyFilters();
		}
	}

	function applyFilters() {
		// URL-based filter application
		const params = new URLSearchParams($page.url.searchParams);
		
		// Apply filters to URL params
		Object.entries(selectedFilters).forEach(([key, value]) => {
			if (Array.isArray(value) && value.length > 0) {
				params.set(key, value.join(','));
			} else if (value && value !== '') {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});

		// Apply subcategory
		if (selectedSubcategory && selectedSubcategory !== 'all' && onSubcategoryChange) {
			params.set('subcategory', selectedSubcategory);
		}

		// Apply sort
		if (selectedSort && onSortChange) {
			params.set('sort', selectedSort);
		}

		goto(`${$page.url.pathname}?${params.toString()}`, { replaceState: true });
	}

	function isFilterActive(type: string, value: string): boolean {
		const currentValue = selectedFilters[type];
		
		if (Array.isArray(currentValue)) {
			return currentValue.includes(value);
		}
		
		return currentValue === value;
	}

	function getFilterLabel(type: string): string {
		const filter = filters.find(f => f.type === type);
		const value = selectedFilters[type];
		
		if (!value || (Array.isArray(value) && value.length === 0)) {
			return filter?.label || type;
		}
		
		if (Array.isArray(value)) {
			return value.length === 1 
				? filter?.options.find(o => o.value === value[0])?.label || value[0]
				: `${value.length} selected`;
		}
		
		const option = filter?.options.find(o => o.value === value);
		return option?.label || value;
	}

	function toggleGroup(type: string) {
		expandedGroups[type] = !expandedGroups[type];
	}
</script>

<!-- Subcategories (if enabled) -->
{#if showSubcategories && subcategories.length > 0}
	<div class="bg-white border-b sticky top-0 z-20">
		<div class="container mx-auto px-4 py-4">
			<div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
				<button
					onclick={() => onSubcategoryChange?.('all')}
					class={cn(
						"flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all",
						currentSize.text,
						selectedSubcategory === 'all'
							? currentTheme.accent
							: currentTheme.inactive
					)}
				>
					All
				</button>
				{#each subcategories as subcategory}
					<button
						onclick={() => onSubcategoryChange?.(subcategory.id)}
						class={cn(
							"flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap",
							currentSize.text,
							selectedSubcategory === subcategory.id
								? currentTheme.accent
								: currentTheme.inactive
						)}
					>
						{subcategory.icon} {subcategory?.name || ''}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- Main Filter Container -->
<div class={cn("bg-gray-50 border-b", className)}>
	<div class="container px-4 py-2">
		{#if variant === 'pills'}
			<!-- Pills Variant (Mobile-first) -->
			<div class="flex items-center gap-1 overflow-x-auto scrollbar-hide">
				{#each filters as filter}
					<div class="relative flex-shrink-0">
						<select
							value={Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type]?.[0] || '' : selectedFilters[filter.type] || ''}
							onchange={(e) => handleFilterChange(filter.type, e.currentTarget.value)}
							class={cn(
								"appearance-none rounded-lg border cursor-pointer transition-all duration-200 font-medium focus:outline-none focus:ring-2",
								currentSize.text,
								currentSize.padding,
								currentSize.height,
								selectedFilters[filter.type] && (Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type]?.length > 0 : selectedFilters[filter.type])
									? currentTheme.active
									: currentTheme.inactive
							)}
						>
							<option value="">{filter.label}</option>
							{#each filter.options as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						
						<!-- Clear button -->
						{#if selectedFilters[filter.type]}
							<button
								onclick={() => clearFilter(filter.type)}
								class="absolute right-2 top-1/2 -translate-y-1/2"
							>
								<X class={cn("w-3 h-3", currentTheme.text)} />
							</button>
						{/if}
					</div>
				{/each}
				
				<!-- Sort (if provided) -->
				{#if sortOptions.length > 0}
					<select
						value={selectedSort}
						onchange={(e) => onSortChange?.(e.currentTarget.value)}
						class={cn(
							"appearance-none rounded-lg border cursor-pointer transition-all duration-200 font-medium min-w-[90px] focus:outline-none focus:ring-2",
							currentSize.text,
							currentSize.padding,
							currentSize.height,
							currentTheme.inactive
						)}
					>
						{#each sortOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				{/if}
			</div>

		{:else if variant === 'inline'}
			<!-- Inline Variant (Desktop) -->
			<div class="flex items-center justify-between">
				<div class={cn("flex items-center", currentSize.gap)}>
					{#each filters as filter}
						<div class="relative group">
							<button
								onclick={() => toggleGroup(filter.type)}
								class={cn(
									"flex items-center border font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2",
									currentSize.text,
									currentSize.padding,
									currentSize.gap,
									selectedFilters[filter.type] && (Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type]?.length > 0 : selectedFilters[filter.type])
										? currentTheme.active
										: currentTheme.inactive
								)}
							>
								<span>{getFilterLabel(filter.type)}</span>
								{#if selectedFilters[filter.type] && (Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type]?.length > 0 : selectedFilters[filter.type])}
									<X class="w-3 h-3 ml-1" onclick={(e) => { e.stopPropagation(); clearFilter(filter.type); }} />
								{:else}
									<ChevronDown class="w-3 h-3 ml-1" />
								{/if}
							</button>
							
							<!-- Dropdown -->
							{#if expandedGroups[filter.type]}
								<div class="absolute top-full left-0 mt-2 bg-white rounded-lg border border-gray-200 p-2 min-w-[150px] shadow-lg z-10">
									<div class="max-h-48 overflow-y-auto">
										{#each filter.options as option}
											<button
												onclick={() => handleFilterChange(filter.type, option.value)}
												class={cn(
													"w-full text-left px-3 py-2 rounded-md transition-colors duration-100 flex items-center justify-between",
													currentSize.text,
													isFilterActive(filter.type, option.value)
														? currentTheme.active
														: "hover:bg-gray-100"
												)}
											>
												<span>{option.label}</span>
												{#if option.count}
													<span class="text-xs text-gray-500">({option.count})</span>
												{/if}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/each}
					
					{#if showClearAll && activeFilterCount() > 0}
						<button
							onclick={onClearFilters}
							class={cn("font-medium ml-2 hover:underline", currentSize.text, currentTheme.text)}
						>
							Clear all ({activeFilterCount()})
						</button>
					{/if}
				</div>
				
				<!-- Sort Dropdown -->
				{#if sortOptions.length > 0}
					<div class={cn("flex items-center", currentSize.gap)}>
						<Sparkles class="w-4 h-4 text-gray-400" />
						<select
							value={selectedSort}
							onchange={(e) => onSortChange?.(e.currentTarget.value)}
							class={cn(
								"border rounded-lg font-medium cursor-pointer focus:outline-none focus:ring-2",
								currentSize.text,
								currentSize.padding,
								currentTheme.inactive
							)}
						>
							{#each sortOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	
	/* Custom select styling */
	select {
		background-image: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}
	
	select::-ms-expand {
		display: none;
	}
</style>