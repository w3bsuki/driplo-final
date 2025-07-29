<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
	}

	let { 
		class: className = undefined,
		children,
		...restProps
	}: AlertDescriptionProps = $props();
</script>

<div
	class={cn('text-sm [&_p]:leading-relaxed', className)}
	{...restProps}
>
	{@render children?.()}
</div>