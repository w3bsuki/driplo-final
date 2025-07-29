<script lang="ts">
	import { X, Search, Filter, Sparkles, ChevronRight, Check, ChevronDown } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { throttle } from '$lib/utils/performance';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import CategoryDropdown from './CategoryDropdown.svelte';
	import type { Category } from '$lib/types';
	
	type FilterMode = 'sidebar' | 'horizontal' | 'drawer' | 'pills' | 'section' | 'generic';
	
	interface FilterOption {
		label: string;
		value: string;
		icon?: string;
		count?: string;
	}
	
	interface FilterGroup {
		type: string;
		label: string;
		options: FilterOption[];
		multiSelect?: boolean;
	}
	
	interface QuickFilter {
		icon: string;
		name: string;
		action: string;
		ariaLabel?: string;
		variant?: 'golden' | 'blue' | 'pink' | 'hot' | 'sale' | 'default';
	}
	
	interface Props {
		// Mode determines the layout and behavior
		mode?: FilterMode;
		
		// Common filter options
		filters?: FilterGroup[];
		selectedFilters?: Record<string, string | string[]>;
		onFilterChange?: (type: string, value: string | string[]) => void;
		onClearFilters?: () => void;
		onApplyFilters?: () => void;
		
		// Category/Subcategory support
		categories?: Category[];
		subcategories?: Category[];
		showSubcategories?: boolean;
		selectedCategory?: string;
		selectedSubcategory?: string;
		onCategoryChange?: (category: string) => void;
		onSubcategoryChange?: (subcategory: string) => void;
		
		// Pills mode specific
		quickFilters?: QuickFilter[];
		onQuickFilterClick?: (action: string) => void;
		showScrollHint?: boolean;
		maxVisibleFilters?: number;
		
		// Drawer mode specific
		isOpen?: boolean;
		onClose?: () => void;
		
		// Section mode specific
		showSearch?: boolean;
		searchQuery?: string;
		onSearchChange?: (query: string) => void;
		onSearch?: (params: URLSearchParams) => void;
		showCategoryButton?: boolean;
		categoryButtonType?: 'icon' | 'dropdown' | 'icon-only';
		
		// Theming
		theme?: 'blue' | 'pink';
		variant?: 'default' | 'with-dropdown' | 'icon-dropdown' | 'modal';
		
		// Styling
		class?: string;
		containerClass?: string;
		searchClass?: string;
		filterClass?: string;
	}
	
	let {
		mode = 'generic',
		filters = [],
		selectedFilters = {},
		onFilterChange,
		onClearFilters,
		onApplyFilters,
		categories = [],
		subcategories = [],
		showSubcategories = false,
		selectedCategory = '',
		selectedSubcategory = 'all',
		onCategoryChange,
		onSubcategoryChange,
		quickFilters = [],
		onQuickFilterClick,
		showScrollHint = true,
		maxVisibleFilters,
		isOpen = false,
		onClose,
		showSearch = false,
		searchQuery: propSearchQuery = '',
		onSearchChange,
		onSearch,
		showCategoryButton = true,
		categoryButtonType = 'icon',
		theme = 'blue',
		variant = 'default',
		class: className = '',
		containerClass = '',
		searchClass = '',
		filterClass = ''
	}: Props = $props();
	
	// Internal state
	let searchQuery = $state(propSearchQuery);
	let showCategoryModal = $state(false);
	let categoryDropdownOpen = $state(false);
	let containerRef: HTMLElement;
	let showScrollArrow = $state(true);
	let dynamicBrands = $state<FilterOption[]>([]);
	let expandedGroups = $state<Record<string, boolean>>({});
	
	// Default filter configurations
	const defaultPriceRanges = [
		{ label: m.filter_price_under_20?.() || 'Under £20', value: '0-20' },
		{ label: m.filter_price_20_50?.() || '£20-50', value: '20-50' },
		{ label: m.filter_price_50_100?.() || '£50-100', value: '50-100' },
		{ label: m.filter_price_100_200?.() || '£100-200', value: '100-200' },
		{ label: m.filter_price_200_plus?.() || '£200+', value: '200-999' }
	];
	
	const defaultSizes = [
		{ label: 'XS', value: 'xs' },
		{ label: 'S', value: 's' },
		{ label: 'M', value: 'm' },
		{ label: 'L', value: 'l' },
		{ label: 'XL', value: 'xl' },
		{ label: 'XXL', value: 'xxl' }
	];
	
	const defaultBrands = [
		{ label: 'Nike', value: 'nike' },
		{ label: 'Adidas', value: 'adidas' },
		{ label: 'Zara', value: 'zara' },
		{ label: 'H&M', value: 'hm' },
		{ label: 'Gucci', value: 'gucci' },
		{ label: 'Louis Vuitton', value: 'lv' },
		{ label: 'Chanel', value: 'chanel' },
		{ label: 'Prada', value: 'prada' }
	];
	
	const defaultConditions = [
		{ label: m.listing_condition_new?.() || 'New with tags', value: 'new' },
		{ label: m.listing_condition_like_new?.() || 'Like new', value: 'likenew' },
		{ label: m.condition_very_good?.() || 'Very good', value: 'verygood' },
		{ label: m.condition_good?.() || 'Good', value: 'good' },
		{ label: m.condition_fair?.() || 'Fair', value: 'fair' }
	];
	
	const defaultSortOptions = [
		{ label: m.filter_sort_recent?.() || 'Most Recent', value: 'recent', icon: '🆕' },
		{ label: m.filter_sort_price_low?.() || 'Price: Low to High', value: 'price-low', icon: '📈' },
		{ label: m.filter_sort_price_high?.() || 'Price: High to Low', value: 'price-high', icon: '📉' },
		{ label: m.filter_sort_popular?.() || 'Most Popular', value: 'popular', icon: '🔥' },
		{ label: m.filter_sort_ending?.() || 'Ending Soon', value: 'ending', icon: '⏰' }
	];
	
	// Build filters from props or defaults
	const activeFilters = $derived(() => {
		if (filters.length > 0) return filters;
		
		// Build default filters based on mode
		const defaultFilters: FilterGroup[] = [];
		
		if (mode !== 'pills') {
			defaultFilters.push(
				{ type: 'price', label: 'Price', options: defaultPriceRanges },
				{ type: 'size', label: 'Size', options: defaultSizes, multiSelect: true },
				{ type: 'brand', label: 'Brand', options: dynamicBrands.length > 0 ? dynamicBrands : defaultBrands },
				{ type: 'condition', label: 'Condition', options: defaultConditions, multiSelect: true }
			);
			
			if (mode === 'horizontal' || mode === 'drawer') {
				defaultFilters.push({ type: 'sort', label: 'Sort', options: defaultSortOptions });
			}
		}
		
		return defaultFilters;
	});
	
	// Computed values
	const activeFilterCount = $derived(() => {
		let count = 0;
		if (selectedCategory) count++;
		if (selectedSubcategory && selectedSubcategory !== 'all') count++;
		
		Object.entries(selectedFilters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				count += value.length;
			} else if (value && value !== 'recent' && value !== '') {
				count++;
			}
		});
		
		return count;
	});
	
	const hasActiveFilters = $derived(
		searchQuery || activeFilterCount > 0
	);
	
	const currentPriceRange = $derived(() => {
		const price = selectedFilters['price'];
		if (typeof price === 'string') return price;
		const min = selectedFilters['min_price'];
		const max = selectedFilters['max_price'];
		if (min && max) return `${min}-${max}`;
		if (min) return `${min}-`;
		return '';
	});
	
	// Quick categories for modal
	const quickCategories = [
		{ name: 'All', value: '', count: '5.2M' },
		{ name: 'Women', value: 'women', count: '2.3M' },
		{ name: 'Men', value: 'men', count: '1.8M' },
		{ name: 'Kids', value: 'kids', count: '982K' },
		{ name: 'Designer', value: 'designer', count: '156K' },
		{ name: 'Shoes', value: 'shoes', count: '743K' },
		{ name: 'Bags', value: 'bags', count: '421K' }
	];
	
	const popularItems = [
		{ name: 'T-shirts', value: 'tshirts', emoji: '👕' },
		{ name: 'Jeans', value: 'jeans', emoji: '👖' },
		{ name: 'Dresses', value: 'dresses', emoji: '👗' },
		{ name: 'Trainers', value: 'trainers', emoji: '👟' },
		{ name: 'Jackets', value: 'jackets', emoji: '🧥' },
		{ name: 'Handbags', value: 'handbags', emoji: '👜' }
	];
	
	// Effects
	$effect(() => {
		searchQuery = propSearchQuery;
	});
	
	$effect(() => {
		if (onSearchChange && searchQuery !== propSearchQuery) {
			onSearchChange(searchQuery);
		}
	});
	
	// Lifecycle
	onMount(async () => {
		// Fetch dynamic brands for drawer mode
		if (mode === 'drawer' && dynamicBrands.length === 0) {
			try {
				const response = await fetch('/api/filters/data');
				if (response.ok) {
					const data = await response.json();
					if (data.brands?.length > 0) {
						dynamicBrands = data.brands.map(b => ({
							label: b.brand || b.label,
							value: (b.brand || b.value).toLowerCase().replace(/\s+/g, '-')
						}));
					}
				}
			} catch (error) {
				console.error('Failed to fetch brands:', error);
			}
		}
	});
	
	// Handlers
	function updateFilter(filterType: string, value: string) {
		if (!onFilterChange) {
			// Default URL param update behavior
			const params = new URLSearchParams($page.url.searchParams);
			
			if (value) {
				if (filterType === 'price' && value.includes('-')) {
					const [min, max] = value.split('-');
					params.set('min_price', min);
					if (max && max !== '999') params.set('max_price', max);
					else params.delete('max_price');
				} else {
					params.set(filterType, value);
				}
			} else {
				params.delete(filterType);
				if (filterType === 'price') {
					params.delete('min_price');
					params.delete('max_price');
				}
			}
			
			goto(`?${params.toString()}`, { replaceState: true });
		} else {
			// Use provided handler
			const filter = activeFilters().find(f => f.type === filterType);
			if (filter?.multiSelect) {
				const currentValue = selectedFilters[filterType];
				const currentArray = Array.isArray(currentValue) ? currentValue : [];
				const newArray = currentArray.includes(value)
					? currentArray.filter(v => v !== value)
					: [...currentArray, value];
				onFilterChange(filterType, newArray);
			} else {
				onFilterChange(filterType, selectedFilters[filterType] === value ? '' : value);
			}
		}
	}
	
	function handleClearFilters() {
		if (onClearFilters) {
			onClearFilters();
		} else {
			goto($page.url.pathname, { replaceState: true });
		}
		searchQuery = '';
	}
	
	function handleApplyFilters() {
		if (onApplyFilters) {
			onApplyFilters();
		} else if (mode === 'drawer' || mode === 'section') {
			const params = new URLSearchParams();
			
			// Add search query
			if (searchQuery.trim()) {
				params.set('q', searchQuery.trim());
			}
			
			// Add filters
			Object.entries(selectedFilters).forEach(([key, value]) => {
				if (Array.isArray(value) && value.length > 0) {
					params.set(key === 'size' ? 'sizes' : key === 'condition' ? 'conditions' : key + 's', value.join(','));
				} else if (value && value !== 'recent' && value !== '') {
					params.set(key, value as string);
				}
			});
			
			// Handle category navigation
			const url = selectedCategory 
				? `/${selectedCategory}${params.toString() ? '?' + params.toString() : ''}`
				: `/browse${params.toString() ? '?' + params.toString() : ''}`;
			
			if (onClose) onClose();
			goto(url);
		}
	}
	
	function handleSearch() {
		if (onSearch) {
			const params = new URLSearchParams();
			if (searchQuery.trim()) {
				params.set('q', searchQuery.trim());
			}
			Object.entries(selectedFilters).forEach(([key, value]) => {
				if (value && value !== '') {
					params.set(key, value as string);
				}
			});
			onSearch(params);
		} else {
			handleApplyFilters();
		}
	}
	
	function clearFilter(filterType: string) {
		if (filterType === 'search') {
			searchQuery = '';
			if (onSearchChange) onSearchChange('');
		} else {
			updateFilter(filterType, '');
		}
	}
	
	function isFilterActive(type: string, value: string): boolean {
		const currentValue = selectedFilters[type];
		if (Array.isArray(currentValue)) {
			return currentValue.includes(value);
		}
		return currentValue === value;
	}
	
	function getFilterLabel(filterType: string): string {
		const filter = activeFilters().find(f => f.type === filterType);
		const value = selectedFilters[filterType];
		
		if (!value || value === '') return filter?.label || filterType;
		
		if (Array.isArray(value)) {
			return value.length > 0 ? value.join(', ') : filter?.label || filterType;
		}
		
		const option = filter?.options.find(o => o.value === value);
		return option?.label || filter?.label || filterType;
	}
	
	function toggleGroup(type: string) {
		expandedGroups[type] = !expandedGroups[type];
	}
	
	function selectQuickCategory(category: string) {
		showCategoryModal = false;
		const params = new URLSearchParams();
		if (category) {
			params.set('category', category);
		}
		window.location.href = `/browse${params.toString() ? '?' + params.toString() : ''}`;
	}
	
	// Scroll handling for pills mode
	function handleScroll() {
		if (containerRef) {
			showScrollArrow = containerRef.scrollLeft < 10;
		}
	}
	
	const throttledHandleScroll = throttle(handleScroll, 100);
	
	function handleKeyDown(event: KeyboardEvent, action: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (onQuickFilterClick) onQuickFilterClick(action);
		}
	}
	
	// Pill variant classes
	const getFilterClasses = (variant?: string) => cn(
		"flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 flex-shrink-0",
		{
			'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0': variant === 'blue',
			'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0': variant === 'pink', 
			'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0': variant === 'golden',
			'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0': variant === 'hot',
			'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0': variant === 'sale',
			'border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300': !variant || variant === 'default'
		}
	);
</script>

<!-- Sidebar Mode -->
{#if mode === 'sidebar'}
	<div class="space-y-3 {className}">
		{#each activeFilters() as filter}
			<div>
				<h3 class="text-sm font-semibold text-gray-900 mb-2">{filter.label}</h3>
				<div class="space-y-1">
					{#each filter.options as option}
						<label class="flex items-center gap-1 cursor-pointer">
							<input
								type={filter.multiSelect ? 'checkbox' : 'radio'}
								name={filter.type}
								value={option.value}
								checked={isFilterActive(filter.type, option.value)}
								onchange={() => updateFilter(filter.type, option.value)}
								class="text-purple-600 focus:ring-purple-500"
							/>
							<span class="text-sm text-gray-700">{option.label}</span>
						</label>
					{/each}
				</div>
			</div>
		{/each}
		
		{#if activeFilterCount > 0}
			<button 
				onclick={handleClearFilters}
				class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
			>
				Clear Filters
			</button>
		{/if}
	</div>

<!-- Horizontal Mode -->
{:else if mode === 'horizontal'}
	<section class="bg-white border-t border-b border-gray-200 mb-3 {containerClass}">
		<div class="container px-2 py-2">
			<!-- Mobile Layout -->
			<div class="md:hidden">
				<div class="flex items-center gap-1 overflow-x-auto scrollbar-hide">
					{#each activeFilters() as filter}
						<div class="relative">
							<select
								value={Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type][0] || '' : selectedFilters[filter.type] || ''}
								onchange={(e) => updateFilter(filter.type, e.currentTarget.value)}
								class={cn(
									"filter-select appearance-none pl-3 pr-7 py-2 rounded-sm text-xs font-medium border cursor-pointer transition-all duration-100 min-w-[80px] focus:outline-none focus:ring-1 focus:ring-brand-300/20 focus:border-brand-500",
									isFilterActive(filter.type, '')
										? "bg-white border-gray-200 hover:border-brand-200 hover:bg-brand-50"
										: "bg-brand-50 border-brand-200 text-brand-500"
								)}
							>
								<option value="">{filter.label}</option>
								{#each filter.options as option}
									<option value={option.value}>{option.icon ? `${option.icon} ${option.label}` : option.label}</option>
								{/each}
							</select>
							{#if !isFilterActive(filter.type, '')}
								<button
									onclick={() => clearFilter(filter.type)}
									class="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-brand-100 rounded-full p-0.5"
								>
									<X class="h-3 w-3 text-brand-400" />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
			
			<!-- Desktop Layout -->
			<div class="hidden md:flex items-center justify-between">
				<div class="flex items-center gap-2">
					{#each activeFilters() as filter}
						{#if filter.type !== 'sort'}
							<div class="relative group">
								<button
									onclick={() => toggleGroup(filter.type)}
									class={cn(
										"flex items-center gap-1.5 px-3 py-2 rounded-sm border font-medium transition-all duration-100",
										!isFilterActive(filter.type, '')
											? "bg-brand-100 border-brand-200 text-brand-500 hover:bg-brand-100"
											: "bg-white border-gray-200 hover:border-brand-200 hover:bg-brand-50"
									)}
								>
									<span>{filter.label}</span>
									{#if !isFilterActive(filter.type, '')}
										<span class="text-sm">: {getFilterLabel(filter.type)}</span>
										<X class="h-3 w-3 ml-1" onclick={(e) => { e.stopPropagation(); clearFilter(filter.type); }} />
									{/if}
								</button>
								
								<!-- Dropdown -->
								{#if expandedGroups[filter.type]}
									<div class="absolute top-full left-0 mt-2 bg-white rounded-sm border border-gray-200 p-2 min-w-[150px] z-10 shadow-md">
										{#each filter.options as option}
											<button
												onclick={() => updateFilter(filter.type, option.value)}
												class={cn(
													"w-full text-left px-3 py-2 rounded-sm text-sm transition-colors duration-100",
													isFilterActive(filter.type, option.value)
														? "bg-brand-100 text-brand-500"
														: "hover:bg-gray-100"
												)}
											>
												{option.label}
											</button>
										{/each}
									</div>
								{/if}
							</div>
						{/if}
					{/each}
					
					{#if activeFilterCount > 0}
						<button
							onclick={handleClearFilters}
							class="text-sm text-gray-600 hover:text-brand-400 font-medium ml-2"
						>
							Clear all
						</button>
					{/if}
				</div>
				
				<!-- Sort Dropdown -->
				{#if activeFilters().find(f => f.type === 'sort')}
					<div class="flex items-center gap-1">
						<Sparkles class="h-4 w-4 text-gray-400" />
						<select
							value={selectedFilters['sort'] || 'recent'}
							onchange={(e) => updateFilter('sort', e.currentTarget.value)}
							class="bg-white border border-gray-200 rounded-sm px-3 py-2 text-sm font-medium hover:border-brand-200 focus:outline-none focus:ring-1 focus:ring-brand-300/20"
						>
							{#each activeFilters().find(f => f.type === 'sort')?.options || [] as option}
								<option value={option.value}>{option.icon} {option.label}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		</div>
	</section>

<!-- Drawer Mode -->
{:else if mode === 'drawer'}
	<!-- Backdrop -->
	{#if isOpen}
		<div 
			class="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
			onclick={() => onClose?.()}
		></div>
	{/if}
	
	<!-- Drawer -->
	<div class={cn(
		"fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl z-[70] transition-transform duration-300 ease-out",
		isOpen ? "translate-y-0" : "translate-y-full",
		className
	)}>
		<div class="max-h-[80vh] flex flex-col">
			<!-- Header -->
			<div class="flex items-center justify-between p-3 border-b border-border">
				<div class="flex items-center gap-2">
					<h2 class="text-base font-bold text-foreground">{m.nav_filters?.() || 'Filters'}</h2>
					{#if activeFilterCount > 0}
						<span class="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
							{activeFilterCount}
						</span>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					{#if activeFilterCount > 0}
						<button
							onclick={handleClearFilters}
							class="text-xs text-primary hover:text-primary/90 font-medium px-2 py-1 rounded-lg hover:bg-primary/10"
						>
							{m.filter_clear_all?.() || 'Clear all'}
						</button>
					{/if}
					<button
						onclick={() => onClose?.()}
						class="p-1.5 hover:bg-muted rounded-lg transition-colors"
					>
						<X class="h-4 w-4 text-muted-foreground" />
					</button>
				</div>
			</div>
			
			<!-- Content -->
			<div class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
				<!-- Categories -->
				{#if categories.length > 0}
					<div>
						<h3 class="text-sm font-semibold text-foreground mb-2">{m.filter_categories?.() || 'Categories'}</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each categories as category}
								<button
									onclick={() => onCategoryChange?.(category.id)}
									class={cn(
										"flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left",
										selectedCategory === category.id
											? "bg-primary/10 border-primary text-primary"
											: "bg-background border-border hover:border-primary hover:bg-primary/5"
									)}
								>
									<span class="text-base">{category.icon}</span>
									<div class="flex-1 min-w-0">
										<div class="font-medium text-xs">{category.name}</div>
										{#if category.count}
											<div class="text-xs text-muted-foreground">{category.count}</div>
										{/if}
									</div>
									{#if selectedCategory === category.id}
										<Check class="h-3 w-3 text-primary flex-shrink-0" />
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- Subcategories -->
				{#if subcategories.length > 0}
					<div>
						<h3 class="text-sm font-semibold text-foreground mb-2">{m.filter_what_looking_for?.() || 'What are you looking for?'}</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each subcategories as subcategory}
								<button
									onclick={() => onSubcategoryChange?.(subcategory.id)}
									class={cn(
										"flex items-center gap-1.5 p-2 rounded-lg border transition-all duration-200 text-left",
										selectedSubcategory === subcategory.id
											? "bg-primary/10 border-primary text-primary"
											: "bg-background border-border hover:border-primary hover:bg-primary/5"
									)}
								>
									<span class="text-sm">{subcategory.icon}</span>
									<span class="font-medium text-xs flex-1">{subcategory.name}</span>
									{#if selectedSubcategory === subcategory.id}
										<Check class="h-3 w-3 text-primary flex-shrink-0" />
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- Filters -->
				{#each activeFilters() as filter}
					<div>
						<h3 class="text-sm font-semibold text-foreground mb-2">{filter.label}</h3>
						{#if filter.type === 'price'}
							<div class="grid grid-cols-2 gap-2">
								{#each filter.options as option}
									<button
										onclick={() => updateFilter(filter.type, option.value)}
										class={cn(
											"p-2 rounded-lg border text-center font-medium text-xs transition-all duration-200",
											isFilterActive(filter.type, option.value)
												? "bg-primary border-primary text-primary-foreground"
												: "bg-background border-border text-foreground hover:border-primary hover:bg-primary/5"
										)}
									>
										{option.label}
									</button>
								{/each}
							</div>
						{:else if filter.type === 'size'}
							<div class="flex flex-wrap gap-2">
								{#each filter.options as option}
									<button
										onclick={() => updateFilter(filter.type, option.value)}
										class={cn(
											"px-3 py-1.5 rounded-lg border font-medium text-xs transition-all duration-200 min-w-[45px]",
											isFilterActive(filter.type, option.value)
												? "bg-primary border-primary text-primary-foreground"
												: "bg-background border-border text-foreground hover:border-primary hover:bg-primary/5"
										)}
									>
										{option.label}
									</button>
								{/each}
							</div>
						{:else if filter.type === 'brand'}
							<div class="grid grid-cols-2 gap-2">
								{#each filter.options as option}
									<button
										onclick={() => updateFilter(filter.type, option.value)}
										class={cn(
											"p-2 rounded-lg border text-center font-medium text-xs transition-all duration-200",
											isFilterActive(filter.type, option.value)
												? theme === 'pink' ? "bg-pink-500 border-pink-500 text-white" : "bg-blue-500 border-blue-500 text-white"
												: "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
										)}
									>
										{option.label}
									</button>
								{/each}
							</div>
						{:else}
							<div class="space-y-2">
								{#each filter.options as option}
									<button
										onclick={() => updateFilter(filter.type, option.value)}
										class={cn(
											"w-full p-2 rounded-lg border text-left font-medium text-xs transition-all duration-200 flex items-center justify-between",
											isFilterActive(filter.type, option.value)
												? "bg-primary/10 border-primary text-primary"
												: "bg-background border-border text-foreground hover:border-primary hover:bg-primary/5"
										)}
									>
										<span class="flex items-center gap-2">
											{#if option.icon}<span class="text-sm">{option.icon}</span>{/if}
											<span>{option.label}</span>
										</span>
										{#if isFilterActive(filter.type, option.value)}
											<Check class="h-3 w-3 text-primary" />
										{/if}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
			
			<!-- Footer -->
			<div class="border-t border-border p-3 bg-muted">
				<button
					onclick={handleApplyFilters}
					class="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm"
				>
					{#if activeFilterCount > 0}
						{m.filter_apply_count?.({ count: activeFilterCount }) || `Apply ${activeFilterCount} Filters`}
					{:else}
						{m.filter_browse_all?.() || 'Browse All'}
					{/if}
				</button>
			</div>
		</div>
	</div>

<!-- Pills Mode -->
{:else if mode === 'pills'}
	<div class="relative overflow-hidden {className}">
		<div
			bind:this={containerRef}
			onscroll={throttledHandleScroll}
			class="flex items-center gap-2 overflow-x-auto scrollbar-hide"
			role="group"
			aria-label={m.filter_categories?.() || 'Filter categories'}
		>
			{#each maxVisibleFilters ? quickFilters.slice(0, maxVisibleFilters) : quickFilters as filter}
				<button
					onclick={() => onQuickFilterClick?.(filter.action)}
					onkeydown={(e) => handleKeyDown(e, filter.action)}
					aria-label={filter.ariaLabel || filter.name}
					class={getFilterClasses(filter.variant)}
				>
					<span class="text-sm" aria-hidden="true">{filter.icon}</span>
					<span>{filter.name}</span>
				</button>
			{/each}
		</div>
		
		{#if showScrollHint && showScrollArrow && quickFilters.length > (maxVisibleFilters || 0)}
			<div
				class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-2"
				aria-hidden="true"
			>
				<span class="text-blue-400 text-sm animate-pulse">→</span>
			</div>
		{/if}
	</div>

<!-- Section Mode -->
{:else if mode === 'section'}
	<section class="py-4 border-b {variant === 'default' ? 'bg-white' : 'bg-background'} {containerClass}">
		<div class="container px-4">
			<!-- Search Bar -->
			{#if showSearch}
				<div class="max-w-4xl mx-auto mb-4">
					<div class="flex gap-3">
						<!-- Category Button (if enabled) -->
						{#if showCategoryButton}
							<div class="flex-shrink-0">
								{#if categoryButtonType === 'icon'}
									<button
										onclick={() => showCategoryModal = true}
										class="flex items-center justify-center w-12 h-12 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-primary/30 transition-all duration-200"
										aria-label="Browse categories"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
										</svg>
									</button>
								{:else if categoryButtonType === 'dropdown'}
									<CategoryDropdown 
										isOpen={categoryDropdownOpen}
										onToggle={() => categoryDropdownOpen = !categoryDropdownOpen}
										onClose={() => categoryDropdownOpen = false}
									/>
								{:else if categoryButtonType === 'icon-only'}
									<button
										onclick={() => categoryDropdownOpen = !categoryDropdownOpen}
										class="flex items-center justify-center w-11 h-11 rounded-lg border border-input bg-background hover:bg-muted hover:border-primary/30 transition-all duration-200"
										aria-label="Browse categories"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
										</svg>
									</button>
									{#if categoryDropdownOpen}
										<CategoryDropdown 
											isOpen={categoryDropdownOpen}
											onToggle={() => categoryDropdownOpen = !categoryDropdownOpen}
											onClose={() => categoryDropdownOpen = false}
											class="absolute left-0"
										/>
									{/if}
								{/if}
							</div>
						{/if}
						
						<!-- Search Input -->
						<div class="relative flex-1">
							<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
							<input
								type="search"
								placeholder="Search for items, brands, or users..."
								bind:value={searchQuery}
								onkeydown={(e) => e.key === 'Enter' && handleSearch()}
								class={cn(
									variant === 'default' 
										? "w-full rounded-xl border border-neutral-200 bg-white pl-12 pr-4 py-3 text-base placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all duration-200"
										: "w-full rounded-lg border border-input bg-background pl-12 pr-4 py-2.5 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm",
									searchClass
								)}
							/>
						</div>
					</div>
				</div>
			{/if}
			
			{#if hasActiveFilters}
				<div class="flex justify-end mb-3">
					<button
						onclick={handleClearFilters}
						class="text-sm text-muted-foreground hover:text-foreground"
					>
						Clear all
					</button>
				</div>
			{/if}
			
			<!-- Mobile Filters -->
			<div class="flex gap-1.5 overflow-x-auto pb-1 md:hidden scrollbar-hide {filterClass}">
				{#each activeFilters() as filter}
					<select
						value={Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type][0] || '' : selectedFilters[filter.type] || ''}
						onchange={(e) => updateFilter(filter.type, e.currentTarget.value)}
						class="rounded-full border border-input bg-background px-2.5 py-1.5 text-xs flex-shrink-0 min-w-20"
					>
						<option value="">{filter.label}</option>
						{#each filter.options as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				{/each}
			</div>
			
			<!-- Desktop Filters -->
			<div class="hidden md:flex items-center gap-3 {filterClass}">
				{#each activeFilters() as filter}
					<select
						value={Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type][0] || '' : selectedFilters[filter.type] || ''}
						onchange={(e) => updateFilter(filter.type, e.currentTarget.value)}
						class="rounded-lg border border-input bg-background px-3 py-2 text-sm"
					>
						<option value="">{filter.label}</option>
						{#each filter.options as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				{/each}
			</div>
			
			<!-- Active Filter Pills -->
			{#if hasActiveFilters}
				<div class="flex flex-wrap gap-2 mt-3">
					{#if searchQuery}
						<div class="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
							<span>"{searchQuery}"</span>
							<button onclick={() => clearFilter('search')}>
								<X class="h-3 w-3" />
							</button>
						</div>
					{/if}
					{#each activeFilters() as filter}
						{#if selectedFilters[filter.type] && selectedFilters[filter.type] !== ''}
							<div class="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
								<span>{getFilterLabel(filter.type)}</span>
								<button onclick={() => clearFilter(filter.type)}>
									<X class="h-3 w-3" />
								</button>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</section>
	
	<!-- Quick Categories Modal -->
	{#if showCategoryModal && variant === 'modal'}
		<div class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
			<div class="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl max-h-[80vh] overflow-hidden">
				<div class="flex flex-col h-full max-h-[80vh]">
					<!-- Header -->
					<div class="flex items-center justify-between p-4 border-b bg-background rounded-t-2xl">
						<h2 class="text-lg font-semibold">Quick Categories</h2>
						<button 
							onclick={() => showCategoryModal = false}
							class="p-2 hover:bg-muted rounded-lg"
							aria-label="Close categories"
						>
							<X class="h-5 w-5" />
						</button>
					</div>
					
					<!-- Categories Content -->
					<div class="flex-1 overflow-y-auto p-4">
						<div class="space-y-6">
							<!-- Main Categories -->
							<div>
								<h3 class="text-sm font-semibold text-muted-foreground mb-3">
									Main Categories
								</h3>
								<div class="grid grid-cols-2 gap-2">
									{#each quickCategories as category}
										<button
											onclick={() => selectQuickCategory(category.value)}
											class="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
										>
											<div class="flex items-center justify-between">
												<span class="font-medium">{category.name}</span>
												<span class="text-xs text-muted-foreground">{category.count}</span>
											</div>
										</button>
									{/each}
								</div>
							</div>
							
							<!-- Popular Items -->
							<div>
								<h3 class="text-sm font-semibold text-muted-foreground mb-3">
									Popular Items
								</h3>
								<div class="grid grid-cols-2 gap-2">
									{#each popularItems as item}
										<button
											onclick={() => selectQuickCategory(item.value)}
											class="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
										>
											<div class="flex items-center gap-2">
												<span class="text-lg">{item.emoji}</span>
												<span class="font-medium">{item.name}</span>
											</div>
										</button>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

<!-- Generic Mode (ReusableFilters style) -->
{:else}
	<!-- Subcategories (if enabled) -->
	{#if showSubcategories && subcategories.length > 0}
		<div class="bg-white border-b sticky top-0 z-20">
			<div class="container mx-auto px-4 py-4">
				<div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
					<button
						onclick={() => onSubcategoryChange?.('all')}
						class={cn(
							"flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
							selectedSubcategory === 'all'
								? theme === 'pink' ? "bg-pink-500 text-white" : "bg-blue-500 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						)}
					>
						All
					</button>
					{#each subcategories as subcategory}
						<button
							onclick={() => onSubcategoryChange?.(subcategory.id)}
							class={cn(
								"flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
								selectedSubcategory === subcategory.id
									? theme === 'pink' ? "bg-pink-500 text-white" : "bg-blue-500 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							)}
						>
							{subcategory.icon} {subcategory.name}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Main Filters -->
	<section class="bg-gray-50 border-b sticky top-[60px] z-30 {containerClass}">
		<div class="container px-4 py-2">
			<!-- Mobile Layout -->
			<div class="md:hidden">
				<div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
					{#each activeFilters() as filter}
						<div class="relative">
							<select
								value={Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type][0] || '' : selectedFilters[filter.type] || ''}
								onchange={(e) => updateFilter(filter.type, e.currentTarget.value)}
								class={cn(
									"w-full pl-3 pr-8 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-all duration-200 min-w-[80px] max-w-[130px] shadow-sm focus:outline-none focus:ring-2",
									selectedFilters[filter.type] && (Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type].length > 0 : selectedFilters[filter.type])
										? theme === 'pink' 
											? "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 focus:ring-pink-200"
											: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-blue-200"
										: "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700 focus:ring-blue-200"
								)}
							>
								<option value="">{filter.label}</option>
								{#each filter.options as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
							<!-- Chevron Icon -->
							<div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
								<svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</div>
							{#if selectedFilters[filter.type] && (Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type].length > 0 : selectedFilters[filter.type])}
								<button
									onclick={() => clearFilter(filter.type)}
									class="absolute right-1.5 top-1/2 -translate-y-1/2"
								>
									<X class="h-2.5 w-2.5 text-blue-600" />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
			
			<!-- Desktop Layout -->
			<div class="hidden md:flex items-center justify-between">
				<div class="flex items-center gap-3">
					{#each activeFilters() as filter}
						<div class="relative">
							<select
								value={Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type][0] || '' : selectedFilters[filter.type] || ''}
								onchange={(e) => updateFilter(filter.type, e.currentTarget.value)}
								class={cn(
									"w-full pl-4 pr-10 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 min-w-[140px] font-medium text-sm shadow-sm focus:outline-none focus:ring-2",
									selectedFilters[filter.type] && (Array.isArray(selectedFilters[filter.type]) ? selectedFilters[filter.type].length > 0 : selectedFilters[filter.type])
										? theme === 'pink' 
											? "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 hover:border-pink-300 focus:ring-pink-200"
											: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 focus:ring-blue-200"
										: "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700 focus:ring-blue-200"
								)}
							>
								<option value="">{filter.label}</option>
								{#each filter.options as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
							<!-- Chevron Icon -->
							<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
								<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					{/each}
					
					{#if activeFilterCount > 0}
						<button
							onclick={handleClearFilters}
							class="text-sm text-gray-600 hover:text-blue-600 font-medium ml-2"
						>
							Clear all
						</button>
					{/if}
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	
	select {
		background-image: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}
	
	select::-ms-expand {
		display: none;
	}
	
	select option {
		background-color: white;
		color: var(--color-gray-700);
		padding: 0.5rem;
	}
	
	select:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
</style>