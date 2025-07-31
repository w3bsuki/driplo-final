// Search Component Namespace
// Compositional API for search-related components

export { default as Search } from './Search.svelte';
export { default as SearchInput } from './Search.Input.svelte';
export { default as SearchBar } from './Search.Bar.svelte';
export { default as SearchFilters } from './Search.Filters.svelte';

// Re-export existing components for compatibility
export { default as TrendingSearches } from './TrendingSearches.svelte';
export { default as StickySearchBar } from './StickySearchBar.svelte';

// Types
export interface QuickFilter {
	icon: string;
	name: string;
	action: string;
	variant?: 'default' | 'golden' | 'blue' | 'pink' | 'hot' | 'sale';
	ariaLabel?: string;
}

export interface SearchEvents {
	search: { query: string };
	input: { value: string };
	focus: { event: FocusEvent };
	blur: { event: FocusEvent };
	clear: void;
	keydown: { event: KeyboardEvent };
}