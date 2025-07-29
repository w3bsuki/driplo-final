<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
		children?: Snippet;
	}

	let { 
		class: className = undefined,
		children,
		...restProps
	}: AlertTitleProps = $props();
</script>

<h5
	class={cn('mb-1 font-medium leading-none tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</h5>