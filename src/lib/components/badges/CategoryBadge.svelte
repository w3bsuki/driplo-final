<script lang="ts">
	import Badge from '$lib/components/ui/badge.svelte';
	import { Package2 } from 'lucide-svelte';
	import type { CategoryBadgeProps } from '$lib/types/components';
	
	let { 
		category, 
		size = 'sm', 
		class: className
	}: CategoryBadgeProps = $props();
</script>

<Badge variant="secondary" {size} class={className}>
	<Package2 class="w-3 h-3 mr-1" />
	{category}
</Badge>