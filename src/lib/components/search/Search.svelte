<script lang="ts">
	// Search namespace root component
	// This provides the main container and context for search-related components
	
	import { setContext } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		children?: any;
	}

	let { 
		class: className = '',
		children 
	}: Props = $props();

	// Search context for child components
	const searchContext = {
		// Add shared state/methods here if needed in the future
	};

	setContext('search', searchContext);
</script>

<div class={cn('search-container', className)}>
	{@render children?.()}
</div>