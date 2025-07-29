<script lang="ts">
	import Badge from '$lib/components/ui/badge.svelte';
	import { Ruler } from 'lucide-svelte';
	import type { SizeBadgeProps } from '$lib/types/components';
	
	let { 
		size, 
		variant = 'outline', 
		class: className = ''
	}: SizeBadgeProps = $props();
</script>

<Badge {variant} class={className}>
	<Ruler class="w-3 h-3 mr-1" />
	Size {size}
</Badge>