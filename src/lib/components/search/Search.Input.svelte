<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import { Search, X } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import { debounce } from '$lib/utils/performance';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		// Core input props
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		
		// Styling
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'outline' | 'filled' | 'ghost';
		class?: string;
		
		// Search-specific
		debounceDelay?: number;
		showSearchIcon?: boolean;
		showClearButton?: boolean;
		searchButtonText?: string;
		
		// Accessibility
		'aria-label'?: string;
		'aria-describedby'?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		disabled = false,
		readonly = false,
		size = 'md',
		variant = 'default',
		class: className = '',
		debounceDelay = 300,
		showSearchIcon = true,
		showClearButton = true,
		searchButtonText,
		'aria-label': ariaLabel,
		'aria-describedby': ariaDescribedBy
	}: Props = $props();

	// State
	let isFocused = $state(false);
	let inputRef: HTMLInputElement | null = null;

	// Event dispatcher for Svelte 4 compatibility if needed
	const dispatch = createEventDispatcher<{
		search: { query: string };
		input: { value: string };
		focus: { event: FocusEvent };
		blur: { event: FocusEvent };
		clear: void;
		keydown: { event: KeyboardEvent };
	}>();

	// Size configurations
	const sizeConfig = {
		sm: {
			input: 'h-8 text-sm px-3',
			button: 'h-6 w-6 text-xs',
			icon: 'h-3.5 w-3.5',
			padding: 'pl-8 pr-8'
		},
		md: {
			input: 'h-10 text-base px-4',
			button: 'h-8 w-8 text-sm',
			icon: 'h-4 w-4',
			padding: 'pl-10 pr-10'
		},
		lg: {
			input: 'h-12 text-lg px-5',
			button: 'h-10 w-10 text-base',
			icon: 'h-5 w-5',
			padding: 'pl-12 pr-12'
		}
	};

	// Variant configurations
	const variantConfig = {
		default: 'border-gray-200 bg-white focus:border-brand-500 focus:ring-brand-500',
		outline: 'border-gray-300 bg-transparent focus:border-brand-500 focus:ring-brand-500',
		filled: 'border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-brand-500',
		ghost: 'border-transparent bg-gray-100 focus:bg-white focus:border-brand-500 focus:ring-brand-500'
	};

	const currentSize = sizeConfig[size];
	const currentVariant = variantConfig[variant];

	// Debounced search handler
	const debouncedSearch = debounce(() => {
		dispatch('search', { query: value.trim() });
	}, debounceDelay);

	// Event handlers
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		dispatch('input', { value });
		debouncedSearch();
	}

	function handleFocus(event: FocusEvent) {
		isFocused = true;
		dispatch('focus', { event });
	}

	function handleBlur(event: FocusEvent) {
		isFocused = false;
		dispatch('blur', { event });
	}

	function handleKeydown(event: KeyboardEvent) {
		dispatch('keydown', { event });
		if (event.key === 'Enter') {
			event.preventDefault();
			dispatch('search', { query: value.trim() });
		}
		if (event.key === 'Escape') {
			inputRef?.blur();
		}
	}

	function handleClear() {
		value = '';
		dispatch('clear');
		dispatch('input', { value: '' });
		inputRef?.focus();
	}

	function handleSearch() {
		dispatch('search', { query: value.trim() });
	}

	// Computed classes
	const inputClasses = $derived(() => {
		return cn(
			'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50',
			currentSize.input,
			currentVariant,
			showSearchIcon && currentSize.padding,
			disabled && 'cursor-not-allowed opacity-50',
			readonly && 'cursor-default',
			className
		);
	});

	// Public API for parent components
	export function focus() {
		inputRef?.focus();
	}

	export function blur() {
		inputRef?.blur();
	}

	export function select() {
		inputRef?.select();
	}
</script>

<div class="relative">
	<!-- Search Icon -->
	{#if showSearchIcon}
		<div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
			<Search class={cn(currentSize.icon, 'text-gray-400')} />
		</div>
	{/if}

	<!-- Input -->
	<input
		bind:this={inputRef}
		type="search"
		{placeholder}
		{disabled}
		{readonly}
		bind:value
		oninput={handleInput}
		onfocus={handleFocus}
		onblur={handleBlur}
		onkeydown={handleKeydown}
		aria-label={ariaLabel || placeholder}
		aria-describedby={ariaDescribedBy}
		class={inputClasses}
		autocomplete="off"
		spellcheck="false"
	/>

	<!-- Clear Button -->
	{#if showClearButton && value && !disabled && !readonly}
		<div class="absolute right-3 top-1/2 -translate-y-1/2">
			<Button
				size="icon"
				variant="ghost"
				onclick={handleClear}
				class={cn('hover:bg-gray-100', currentSize.button)}
				aria-label="Clear search"
			>
				<X class={cn(currentSize.icon, 'text-gray-400')} />
			</Button>
		</div>
	{/if}

	<!-- Search Button (optional) -->
	{#if searchButtonText}
		<div class="absolute right-3 top-1/2 -translate-y-1/2">
			<Button
				size={size === 'sm' ? 'sm' : 'default'}
				onclick={handleSearch}
				disabled={disabled || !value.trim()}
				class="bg-brand-500 text-white hover:bg-brand-600"
			>
				{searchButtonText}
			</Button>
		</div>
	{/if}
</div>

<style>
	/* Remove default search input styling */
	input[type="search"]::-webkit-search-decoration,
	input[type="search"]::-webkit-search-cancel-button,
	input[type="search"]::-webkit-search-results-button,
	input[type="search"]::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
</style>