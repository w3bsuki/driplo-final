<script lang="ts">
	import { cn } from '$lib/utils';
	import { focusTrap } from '$lib/utils/focus-trap';
	import { scale, fade } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import Spinner from './Spinner.svelte';
	import type { ComponentType, SvelteComponent, Snippet } from 'svelte';

	// Size configuration (moved outside component for performance)
	const SIZES = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-none w-full h-full'
	} as const;

	// Position configuration (moved outside component for performance)
	const POSITIONS = {
		center: 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
		top: 'top-0 left-0 right-0',
		bottom: 'bottom-0 left-0 right-0',
		left: 'left-0 top-0 bottom-0 w-80 max-w-sm h-full',
		right: 'right-0 top-0 bottom-0 w-80 max-w-sm h-full'
	} as const;
	
	interface Props {
		// Core state
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		
		// Modal types - consolidates AlertDialog, Dialog, Sheet
		type?: 'dialog' | 'alert' | 'sheet';
		
		// Position (primarily for sheets, but also supports dialog positioning)
		position?: 'center' | 'left' | 'right' | 'top' | 'bottom';
		
		// Size
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		
		// Behavior
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showCloseButton?: boolean;
		preventBodyScroll?: boolean;
		
		// Lazy loading
		lazy?: boolean;
		loader?: () => Promise<{ default: ComponentType<SvelteComponent> }>;
		loadingText?: string;
		
		// Content
		title?: string;
		description?: string;
		
		// Styling
		class?: string;
		contentClass?: string;
		backdropClass?: string;
		
		// Animation
		animationDuration?: number;
		
		// Accessibility
		ariaLabel?: string;
		ariaLabelledby?: string;
		ariaDescribedby?: string;
		
		// Slots
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}
	
	let { 
		open = $bindable(false), 
		onOpenChange,
		type = 'dialog',
		position = 'center',
		size = 'md',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		preventBodyScroll = true,
		lazy = false,
		loader,
		loadingText = 'Loading...',
		title,
		description,
		class: className = '',
		contentClass = '',
		backdropClass = '',
		animationDuration = 200,
		ariaLabel,
		ariaLabelledby,
		ariaDescribedby,
		children,
		header,
		footer
	}: Props = $props();
	
	// Lazy loading state
	let Component: ComponentType<SvelteComponent> | null = null;
	let loading = $state(false);
	let error = $state<Error | null>(null);
	
	
	// Handle close
	function handleClose() {
		open = false;
		onOpenChange?.(false);
	}
	
	// Handle backdrop click
	function handleBackdropClick(e: MouseEvent) {
		if (closeOnBackdrop && e.target === e.currentTarget) {
			handleClose();
		}
	}
	
	// Handle keyboard events
	function handleKeydown(e: KeyboardEvent) {
		if (closeOnEscape && e.key === 'Escape') {
			handleClose();
		}
	}
	
	// Lazy component loading
	async function loadComponent() {
		if (!loader || Component || loading) return;
		
		loading = true;
		error = null;
		
		try {
			const module = await loader();
			Component = module.default;
		} catch (e) {
			error = e as Error;
			console.error('Failed to load modal component:', e);
		} finally {
			loading = false;
		}
	}
	
	// Load when modal opens (for lazy loading)
	$effect(() => {
		if (open && lazy && !Component) {
			loadComponent();
		}
	});
	
	// Body scroll management with proper cleanup
	$effect(() => {
		if (preventBodyScroll && open) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			
			// Cleanup function
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	});
	
	// Export preload function for lazy loading
	export function preload() {
		if (lazy && !Component && !loading) {
			loadComponent();
		}
	}
	
	// Compute content classes based on type and position
	const contentClasses = $derived(() => {
		let classes = '';
		
		// Base classes
		const baseClasses = 'relative bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700';
		
		// Type-specific classes
		switch (type) {
			case 'alert':
				classes = cn(
					baseClasses,
					'rounded-lg p-6',
					SIZES[size] + ' w-full'
				);
				break;
			case 'sheet':
				if (position === 'left' || position === 'right') {
					classes = cn(baseClasses, 'h-full p-6');
				} else {
					classes = cn(baseClasses, 'w-full max-h-[80vh] rounded-t-lg p-6');
				}
				break;
			case 'dialog':
			default:
				classes = cn(
					baseClasses,
					'rounded-lg p-6',
					SIZES[size] + ' w-full'
				);
		}
		
		return cn(classes, contentClass, className);
	});
	
	// Compute backdrop classes
	const computedBackdropClass = $derived(() => {
		return cn(
			'fixed inset-0 bg-black/50',
			type === 'sheet' ? 'backdrop-blur-none' : 'backdrop-blur-sm',
			backdropClass
		);
	});
	
	// Compute positioning classes
	const positionClasses = $derived(() => {
		return POSITIONS[position] || positions.center;
	});
	
	// Determine if we should show header
	const shouldShowHeader = $derived(() => {
		return header || title || description || (showCloseButton && type !== 'sheet');
	});
	
	// Determine the role based on type
	const dialogRole = $derived(() => {
		return type === 'alert' ? 'alertdialog' : 'dialog';
	});
</script>

{#if open}
	<div 
		class="fixed inset-0 z-50" 
		role={dialogRole}
		aria-modal="true"
		{ariaLabel}
		aria-labelledby={ariaLabelledby || (title ? 'modal-title' : undefined)}
		aria-describedby={ariaDescribedby || (description ? 'modal-description' : undefined)}
		onkeydown={handleKeydown}
		transition:fade={{ duration: animationDuration }}
	>
		<!-- Backdrop -->
		<button
			class={computedBackdropClass()}
			onclick={handleBackdropClick}
			aria-label="Close dialog"
			tabindex="-1"
		></button>
		
		<!-- Modal content -->
		<div 
			class={cn("fixed z-50", positionClasses())}
			use:focusTrap={{ enabled: open, onDeactivate: handleClose }}
		>
			<div 
				class={contentClasses()}
				transition:scale={{ duration: animationDuration }}
				onclick={(e) => e.stopPropagation()}
			>
				{#if lazy}
					<!-- Lazy loading content -->
					{#if loading}
						<div class="flex flex-col items-center justify-center p-8">
							<Spinner size="lg" />
							<p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{loadingText}</p>
						</div>
					{:else if error}
						<div class="p-8 text-center">
							<h3 class="text-lg font-semibold text-red-600">Loading Error</h3>
							<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
								We encountered an error loading this content. Please try again.
							</p>
							<button 
								class="mt-4 px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
								onclick={() => {
									error = null;
									loadComponent();
								}}
							>
								Retry
							</button>
						</div>
					{:else if Component}
						<Component />
					{/if}
				{:else}
					<!-- Regular content -->
					{#if shouldShowHeader()}
						<div class="flex items-start justify-between mb-4">
							<div class="flex-1">
								{#if header}
									{@render header()}
								{:else}
									{#if title}
										<h2 id="modal-title" class={cn(
											"text-lg font-semibold text-gray-900 dark:text-white",
											type === 'alert' && "text-center sm:text-left"
										)}>
											{title}
										</h2>
									{/if}
									{#if description}
										<p id="modal-description" class={cn(
											"mt-2 text-sm text-gray-500 dark:text-gray-400",
											type === 'alert' && "text-center sm:text-left"
										)}>
											{description}
										</p>
									{/if}
								{/if}
							</div>
							
							{#if showCloseButton && type !== 'sheet'}
								<button
									onclick={handleClose}
									class="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
									aria-label="Close modal"
								>
									<X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
								</button>
							{/if}
						</div>
					{/if}
					
					{#if showCloseButton && type === 'sheet'}
						<button
							onclick={handleClose}
							class="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
							aria-label="Close modal"
						>
							<X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
						</button>
					{/if}
					
					<!-- Main content -->
					<div class={cn(
						shouldShowHeader() ? 'space-y-4' : '',
						type === 'alert' && 'text-center sm:text-left'
					)}>
						{#if children}
							{@render children()}
						{/if}
					</div>
					
					<!-- Footer -->
					{#if footer}
						<div class={cn(
							"mt-6 pt-4 border-t border-gray-200 dark:border-gray-700",
							type === 'alert' && "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0"
						)}>
							{@render footer()}
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}