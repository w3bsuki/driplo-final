<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null as HTMLParagraphElement | null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> & { children?: Snippet } = $props();
</script>

<p
	bind:this={ref!}
	data-slot="card-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
>
	{@render children?.()}
</p>
