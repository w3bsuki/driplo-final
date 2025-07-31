<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import { focusTrap } from '$lib/utils/focus-trap';
	import { scale, fade } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import Spinner from '../Spinner.svelte';
	import type { ComponentType, SvelteComponent } from 'svelte';
	
	interface Props {
		// Basic modal props
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		children?: any;
		class?: string;
		
		// Modal variants
		variant?: 'default' | 'lazy' | 'checkout' | 'welcome' | 'fullscreen' | 'drawer';
		
		// Size variants
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		
		// Behavior
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showCloseButton?: boolean;
		preventBodyScroll?: boolean;
		
		// Lazy loading (for variant="lazy")
		loader?: () => Promise<{ default: ComponentType<SvelteComponent> }>;
		preloadOnMount?: boolean;
		loadingText?: string;
		
		// Header configuration
		title?: string;
		description?: string;
		showHeader?: boolean;
		
		// Footer configuration
		showFooter?: boolean;
		footerContent?: any;
		
		// Animation
		animationDuration?: number;
		
		// Positioning (for drawer variant)
		position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
		
		// Styling
		backdropClass?: string;
		contentClass?: string;
		
		// Accessibility
		ariaLabel?: string;
		ariaLabelledby?: string;
		ariaDescribedby?: string;
	}
	
	let { 
		open = $bindable(false), 
		onOpenChange,
		children,
		class: className = '',
		variant = 'default',
		size = 'md',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		preventBodyScroll = true,
		loader,
		preloadOnMount = false,
		loadingText = 'Loading...',
		title,
		description,
		showHeader = false,
		showFooter = false,
		footerContent,
		animationDuration = 200,
		position = 'center',
		backdropClass = '',
		contentClass = '',
		ariaLabel,
		ariaLabelledby,
		ariaDescribedby
	}: Props = $props();
	
	// Lazy loading state
	let Component: ComponentType<SvelteComponent> | null = null;
	let loading = $state(false);
	let error = $state<Error | null>(null);
	
	// Size configuration
	const sizes = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-none w-full h-full'
	};
	
	// Position configuration for drawer variant
	const positions = {
		center: 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
		top: 'top-0 left-0 right-0',
		bottom: 'bottom-0 left-0 right-0',
		left: 'left-0 top-0 bottom-0',
		right: 'right-0 top-0 bottom-0'
	};
	
	// Handle close
	function handleClose() {
		if (variant === 'checkout' && loading) {
			// Don't close checkout modal while processing
			return;
		}
		
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
	
	// Load when modal opens (for lazy variant)
	$effect(() => {
		if (open && variant === 'lazy' && !Component) {
			loadComponent();
		}
	});
	
	// Preload on mount if requested
	onMount(() => {
		if (preloadOnMount && variant === 'lazy') {
			loadComponent();
		}
		
		// Handle body scroll prevention
		if (preventBodyScroll && open) {
			document.body.style.overflow = 'hidden';
		}
		
		return () => {
			if (preventBodyScroll) {
				document.body.style.overflow = '';
			}
		};
	});
	
	// Body scroll management
	$effect(() => {
		if (preventBodyScroll) {
			if (open) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});
	
	// Export preload function for lazy variant
	export function preload() {
		if (variant === 'lazy' && !Component && !loading) {
			loadComponent();
		}
	}
	
	// Compute content classes based on variant
	const contentClasses = $derived(() => {
		let classes = '';
		
		switch (variant) {
			case 'drawer':
				if (position === 'left' || position === 'right') {
					classes = 'h-full w-80 max-w-sm';
				} else {
					classes = 'w-full max-h-[80vh]';
				}
				break;
			case 'fullscreen':
				classes = 'w-full h-full max-w-none';
				break;
			case 'checkout':
				classes = 'max-w-md w-full max-h-[90vh] overflow-y-auto';
				break;
			case 'welcome':
				classes = 'max-w-md border-2 border-blue-100';
				break;
			default:
				classes = sizes[size] + ' w-full';
		}
		
		return cn(
			'relative bg-white rounded-lg shadow-lg border',
			variant !== 'fullscreen' && 'p-6',
			classes,
			contentClass,
			className
		);
	});
	
	// Compute backdrop classes
	const computedBackdropClass = $derived(() => {
		return cn(
			'fixed inset-0 bg-black/50',
			variant === 'drawer' ? 'backdrop-blur-none' : 'backdrop-blur-sm',
			backdropClass
		);
	});
	
	// Compute positioning classes
	const positionClasses = $derived(() => {
		if (variant === 'drawer') {
			return positions[position];
		}
		return positions.center;
	});
</script>

{#if open}
	<div 
		class="fixed inset-0 z-50" 
		role="dialog" 
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
		
		<!-- Dialog content -->
		<div 
			class={cn("fixed z-50", positionClasses())}
			use:focusTrap={{ enabled: open, onDeactivate: handleClose }}
		>
			<div 
				class={contentClasses()}
				transition:scale={{ duration: animationDuration }}
				onclick={(e) => e.stopPropagation()}
			>
				{#if variant === 'lazy'}
					<!-- Lazy loading content -->
					{#if loading}
						<div class="flex flex-col items-center justify-center p-8">
							<Spinner size="lg" />
							<p class="mt-4 text-sm text-gray-500">{loadingText}</p>
						</div>
					{:else if error}
						<div class="p-8 text-center">
							<h3 class="text-lg font-semibold text-red-600">Loading Error</h3>
							<p class="mt-2 text-sm text-gray-500">
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
						<Component {...$$restProps} />
					{/if}
				{:else}
					<!-- Regular content -->
					{#if showHeader && (title || description || showCloseButton)}
						<div class="flex items-center justify-between pb-4 border-b">
							<div>
								{#if title}
									<h2 id="modal-title" class="text-xl font-semibold text-gray-900">
										{title}
									</h2>
								{/if}
								{#if description}
									<p id="modal-description" class="mt-1 text-sm text-gray-500">
										{description}
									</p>
								{/if}
							</div>
							{#if showCloseButton}
								<button
									onclick={handleClose}
									class="p-2 hover:bg-gray-100 rounded-full transition-colors"
									aria-label="Close modal"
								>
									<X class="w-5 h-5 text-gray-500" />
								</button>
							{/if}
						</div>
					{:else if showCloseButton && variant !== 'fullscreen'}
						<button
							onclick={handleClose}
							class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
							aria-label="Close modal"
						>
							<X class="w-5 h-5 text-gray-500" />
						</button>
					{/if}
					
					<!-- Main content -->
					<div class={showHeader ? 'pt-4' : ''}>
						{@render children?.()}
					</div>
					
					<!-- Footer -->
					{#if showFooter && footerContent}
						<div class="pt-4 border-t mt-4">
							{@render footerContent()}
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}