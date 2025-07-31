<script lang="ts">
	// Example usage of compositional Search components
	// This demonstrates the "prove abstractions first" approach
	
	import Search from './Search.svelte';
	import SearchInput from './Search.Input.svelte';
	import SearchBar from './Search.Bar.svelte';
	import SearchFilters from './Search.Filters.svelte';
	import type { QuickFilter } from './index.ts';

	// Example state
	let searchQuery = $state('');
	let isCategoryOpen = $state(false);

	// Example filters (same data structure as existing components)
	const quickFilters: QuickFilter[] = [
		{ icon: '⭐', name: 'Top Sellers', action: 'top-sellers', variant: 'golden' },
		{ icon: '👨', name: 'Men', action: 'men', variant: 'blue' },
		{ icon: '👩', name: 'Women', action: 'women', variant: 'pink' },
		{ icon: '🔥', name: 'Hot', action: 'hot', variant: 'hot' },
		{ icon: '💸', name: 'Sale', action: 'sale', variant: 'sale' }
	];

	// Event handlers
	function handleSearch(event: CustomEvent<{ query: string }>) {
		console.log('Search:', event.detail.query);
		// Navigate or trigger search logic
	}

	function handleFilterClick(event: CustomEvent<{ action: string; filter: QuickFilter }>) {
		console.log('Filter clicked:', event.detail.action);
		// Handle filter selection
	}

	function handleCategoryToggle() {
		console.log('Category dropdown toggled');
	}
</script>

<!-- Example 1: Simple Search Input -->
<div class="space-y-6 p-6">
	<div>
		<h3 class="text-lg font-semibold mb-3">Simple Search Input</h3>
		<SearchInput
			bind:value={searchQuery}
			placeholder="Search products..."
			size="md"
			onsearch={handleSearch}
		/>
	</div>

	<!-- Example 2: Search Bar with Category Button -->
	<div>
		<h3 class="text-lg font-semibold mb-3">Search Bar with Categories</h3>
		<SearchBar
			bind:value={searchQuery}
			bind:isCategoryOpen
			placeholder="Search everything..."
			size="md"
			variant="hero"
			onsearch={handleSearch}
			on:category-toggle={handleCategoryToggle}
		/>
	</div>

	<!-- Example 3: Compositional Usage -->
	<div>
		<h3 class="text-lg font-semibold mb-3">Compositional Search</h3>
		<Search class="space-y-3">
			{#snippet children()}
				<!-- Search input -->
				<SearchInput
					bind:value={searchQuery}
					placeholder="Find your style..."
					size="lg"
					variant="outline"
					onsearch={handleSearch}
				/>
				
				<!-- Filter pills -->
				<SearchFilters
					filters={quickFilters}
					size="md"
					mode="pills"
					maxVisible={4}
					on:filter-click={handleFilterClick}
				/>
			{/snippet}
		</Search>
	</div>

	<!-- Example 4: Compact Mode -->
	<div>
		<h3 class="text-lg font-semibold mb-3">Compact Search</h3>
		<div class="flex items-center gap-3">
			<SearchInput
				bind:value={searchQuery}
				placeholder="Quick search..."
				size="sm"
				variant="filled"
				showClearButton={false}
				onsearch={handleSearch}
				class="flex-1"
			/>
			<SearchFilters
				filters={quickFilters.slice(0, 3)}
				size="sm"
				mode="compact"
				showScrollHint={false}
				on:filter-click={handleFilterClick}
			/>
		</div>
	</div>
</div>