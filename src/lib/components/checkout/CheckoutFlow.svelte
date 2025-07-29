<script lang="ts">
	import { onMount } from 'svelte';
	import { formatCurrency } from '$lib/utils/currency';
	import { X, CreditCard, Lock, Truck, Check, ChevronRight, ChevronLeft } from 'lucide-svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { getStripe } from '$lib/stores/stripe';
	import * as m from '$lib/paraglide/messages.js';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	interface Props {
		listing: any;
		isOpen: boolean;
		onClose: () => void;
	}

	let { listing, isOpen, onClose }: Props = $props();

	// Multi-step state
	let currentStep = $state(1); // 1: Order Summary, 2: Payment, 3: Completion
	let isProcessing = $state(false);
	
	// Stripe elements
	let stripe: any;
	let elements: any;
	let cardElement: any;
	let clientSecret = $state('');
	let paymentMethodId = $state('');
	
	// Form data
	let shippingAddress = $state({
		name: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		postal_code: '',
		country: 'BG'
	});
	
	let paymentProvider = $state<'stripe' | 'revolut_manual'>('stripe');
	let orderData = $state<any>(null);
	let formElement: HTMLFormElement;
	
	// Calculated values
	let itemPrice = $derived(listing?.price || 0);
	let shippingCost = $derived(listing?.shipping_cost || 0);
	let buyerFee = $derived(itemPrice * 0.05 + 1); // 5% + $1
	let totalAmount = $derived(itemPrice + shippingCost + buyerFee);
	
	// Navigation functions
	function goToStep(step: number) {
		currentStep = step;
	}
	
	function handleNextStep() {
		if (currentStep === 1 && validateShipping()) {
			// Submit form to create payment intent
			if (formElement) {
				const submitButton = formElement.querySelector('button[name="action"][value="createPaymentIntent"]') as HTMLButtonElement;
				if (submitButton) {
					submitButton.click();
				}
			}
		} else if (currentStep === 2) {
			// Process payment will be handled by form submission
			if (formElement) {
				const submitButton = formElement.querySelector('button[name="action"][value="confirmPayment"]') as HTMLButtonElement;
				if (submitButton) {
					submitButton.click();
				}
			}
		}
	}
	
	function handlePreviousStep() {
		if (currentStep > 1) {
			goToStep(currentStep - 1);
		}
	}
	
	function validateShipping() {
		if (!shippingAddress.name.trim()) {
			toast.error('Please enter your full name');
			return false;
		}
		if (!shippingAddress.address_line1.trim()) {
			toast.error('Please enter your address');
			return false;
		}
		if (!shippingAddress.city.trim()) {
			toast.error('Please enter your city');
			return false;
		}
		if (!shippingAddress.postal_code.trim()) {
			toast.error('Please enter your postal code');
			return false;
		}
		return true;
	}
	
	// Initialize Stripe Elements when we have a client secret
	$effect(() => {
		if (clientSecret && currentStep === 2 && paymentProvider === 'stripe') {
			initializeStripeElements();
		}
	});
	
	async function initializeStripeElements() {
		try {
			stripe = await getStripe();
			if (!stripe) throw new Error('Stripe not loaded');
			
			elements = stripe.elements({ clientSecret });
			
			// Wait for next tick
			await new Promise(resolve => setTimeout(resolve, 100));
			
			// Create and mount card element
			const cardElementContainer = document.getElementById('card-element-new');
			if (cardElementContainer) {
				cardElement = elements.create('card', {
					style: {
						base: {
							fontSize: '16px',
							color: '#424770',
							'::placeholder': { color: '#aab7c4' }
						}
					}
				});
				cardElement.mount(cardElementContainer);
				
				// Listen for changes to get payment method
				cardElement.on('change', (event: any) => {
					if (event.error) {
						console.error('Card element error:', event.error);
					}
				});
			}
		} catch (error) {
			console.error('Stripe initialization error:', error);
			toast.error('Failed to load payment form');
		}
	}
	
	// Handle payment confirmation before form submission
	async function handlePaymentSubmit() {
		if (!stripe || !cardElement || !clientSecret) {
			toast.error('Payment system not ready');
			return false;
		}
		
		try {
			isProcessing = true;
			
			// Create payment method
			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement,
				billing_details: {
					name: shippingAddress.name,
					address: {
						line1: shippingAddress.address_line1,
						line2: shippingAddress.address_line2,
						city: shippingAddress.city,
						state: shippingAddress.state,
						postal_code: shippingAddress.postal_code,
						country: shippingAddress.country
					}
				}
			});
			
			if (error) {
				toast.error(error.message || 'Payment method creation failed');
				return false;
			}
			
			paymentMethodId = paymentMethod.id;
			return true;
		} catch (error) {
			console.error('Payment method error:', error);
			toast.error('Failed to process payment method');
			return false;
		} finally {
			isProcessing = false;
		}
	}
	
	// Handle form enhancement for progressive enhancement
	function handleFormEnhance() {
		return async ({ formElement, formData, action, cancel }: any) => {
			if (action.search.includes('confirmPayment') && paymentProvider === 'stripe') {
				// Create payment method before submitting
				const success = await handlePaymentSubmit();
				if (!success) {
					cancel();
					return;
				}
				
				// Add payment method ID to form data
				formData.set('payment_method_id', paymentMethodId);
				formData.set('client_secret', clientSecret);
			}
			
			isProcessing = true;
			
			return async ({ result, update }: any) => {
				isProcessing = false;
				
				if (result.type === 'success') {
					if (result.data?.clientSecret) {
						// Payment intent created, move to payment step
						clientSecret = result.data.clientSecret;
						orderData = {
							orderId: result.data.orderId,
							totalAmount: result.data.totalAmount
						};
						goToStep(2);
					} else if (result.data?.requiresAction) {
						// 3D Secure required
						if (result.data.actionUrl) {
							window.location.href = result.data.actionUrl;
						}
					} else if (result.data?.success && paymentProvider === 'revolut_manual') {
						// Manual payment created
						orderData = {
							orderId: result.data.orderId,
							amount: result.data.totalAmount,
							paymentMethod: 'revolut_manual',
							paymentInstructions: result.data.paymentInstructions,
							sellerRevtag: result.data.sellerRevtag
						};
						goToStep(3);
					}
				} else if (result.type === 'failure') {
					toast.error(result.data?.error || 'Operation failed');
					if (result.data?.fieldErrors) {
						console.error('Field errors:', result.data.fieldErrors);
					}
				} else if (result.type === 'redirect') {
					// Let SvelteKit handle the redirect
					return;
				}
				
				// Prevent default update to handle manually
				update({ reset: false });
			};
		};
	}
	
	function handleClose() {
		// Cleanup
		if (cardElement) {
			cardElement.destroy();
			cardElement = null;
		}
		if (elements) {
			elements = null;
		}
		clientSecret = '';
		currentStep = 1;
		onClose();
	}
	
	// Cleanup on unmount
	$effect(() => {
		return () => {
			if (cardElement) {
				cardElement.destroy();
			}
		};
	});
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[var(--spacing-4)]" transition:fade={{ duration: 200 }}>
		<div class="bg-[var(--color-surface-primary)] rounded-[var(--border-radius-2xl)] max-w-lg w-full max-h-[90vh] overflow-hidden" transition:scale={{ duration: 200 }}>
			<form 
				method="POST" 
				use:enhance={handleFormEnhance}
				bind:this={formElement}
			>
				<!-- Header -->
				<div class="bg-[var(--color-surface-primary)] border-b border-[var(--color-border-primary)] p-[var(--spacing-6)] flex items-center justify-between">
				<div class="flex items-center gap-[var(--spacing-4)]">
					<h2 class="text-[var(--font-size-xl)] font-bold text-[var(--color-text-primary)]">
						{#if currentStep === 1}
							{m.checkout_order_summary()}
						{:else if currentStep === 2}
							{m.checkout_payment_details()}
						{:else}
							{m.checkout_order_complete()}
						{/if}
					</h2>
					<!-- Step indicator -->
					<div class="flex items-center gap-[var(--spacing-2)]">
						{#each [1, 2, 3] as step}
							<div class="flex items-center">
								<div class={`w-8 h-8 rounded-full flex items-center justify-center text-[var(--font-size-sm)] font-medium transition-colors ${
									step <= currentStep ? 'bg-[var(--color-brand-500)] text-[var(--color-white)]' : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)]'
								}`}>
									{step}
								</div>
								{#if step < 3}
									<ChevronRight class="w-4 h-4 text-[var(--color-text-tertiary)] mx-[var(--spacing-1)]" />
								{/if}
							</div>
						{/each}
					</div>
				</div>
				<button
					onclick={handleClose}
					class="p-[var(--spacing-2)] hover:bg-[var(--color-surface-hover)] rounded-full transition-colors"
				>
					<X class="w-5 h-5 text-[var(--color-text-tertiary)]" />
				</button>
			</div>

			<!-- Content -->
			<div class="overflow-y-auto relative max-h-[calc(90vh-200px)]">
				{#if isProcessing}
					<Spinner overlay text="Processing payment..." />
				{/if}
				
				{#if currentStep === 1}
					<!-- Step 1: Order Summary & Shipping -->
					<div class="p-[var(--spacing-6)]" transition:slide>
						<!-- Product Details -->
						<div class="mb-[var(--spacing-6)]">
							<h3 class="text-[var(--font-size-lg)] font-semibold text-[var(--color-text-primary)] mb-[var(--spacing-4)]">Item Details</h3>
							<div class="bg-[var(--color-surface-secondary)] rounded-[var(--border-radius-xl)] p-[var(--spacing-4)]">
								<div class="flex gap-[var(--spacing-4)]">
									<img
										src={listing.images[0]}
										alt={listing.title}
										class="w-20 h-20 object-cover rounded-[var(--border-radius-lg)]"
									/>
									<div class="flex-1">
										<h4 class="font-semibold text-[var(--color-text-primary)]">{listing.title}</h4>
										<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] mt-[var(--spacing-1)]">Size: {listing.size || 'N/A'}</p>
										<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">Condition: {listing.condition}</p>
										<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">Seller: {listing.seller?.username || 'Unknown'}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Shipping Address -->
						<div class="mb-[var(--spacing-6)]">
							<h3 class="text-[var(--font-size-lg)] font-semibold text-[var(--color-text-primary)] mb-[var(--spacing-4)] flex items-center gap-[var(--spacing-2)]">
								<Truck class="w-5 h-5" />
								Shipping Address
							</h3>
							<div class="space-y-[var(--spacing-4)]">
								<input
									bind:value={shippingAddress.name}
									placeholder="Full Name"
									class="w-full px-[var(--spacing-4)] py-[var(--spacing-3)] border border-[var(--color-border-primary)] rounded-[var(--border-radius-lg)] focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-[var(--color-brand-500)]"
									required
								/>
								<input
									bind:value={shippingAddress.address_line1}
									placeholder="Address Line 1"
									class="w-full px-[var(--spacing-4)] py-[var(--spacing-3)] border border-[var(--color-border-primary)] rounded-[var(--border-radius-lg)] focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-[var(--color-brand-500)]"
									required
								/>
								<input
									bind:value={shippingAddress.address_line2}
									placeholder="Address Line 2 (Optional)"
									class="w-full px-[var(--spacing-4)] py-[var(--spacing-3)] border border-[var(--color-border-primary)] rounded-[var(--border-radius-lg)] focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-[var(--color-brand-500)]"
								/>
								<div class="grid grid-cols-2 gap-[var(--spacing-4)]">
									<input
										bind:value={shippingAddress.city}
										placeholder="City"
										class="w-full px-[var(--spacing-4)] py-[var(--spacing-3)] border border-[var(--color-border-primary)] rounded-[var(--border-radius-lg)] focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-[var(--color-brand-500)]"
										required
									/>
									<input
										bind:value={shippingAddress.state}
										placeholder="State/Province"
										class="w-full px-[var(--spacing-4)] py-[var(--spacing-3)] border border-[var(--color-border-primary)] rounded-[var(--border-radius-lg)] focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-[var(--color-brand-500)]"
										required
									/>
								</div>
								<input
									bind:value={shippingAddress.postal_code}
									placeholder="Postal Code"
									class="w-full px-[var(--spacing-4)] py-[var(--spacing-3)] border border-[var(--color-border-primary)] rounded-[var(--border-radius-lg)] focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-[var(--color-brand-500)]"
									required
								/>
							</div>
						</div>

						<!-- Price Breakdown -->
						<div class="bg-[var(--color-brand-50)] rounded-[var(--border-radius-xl)] p-[var(--spacing-4)]">
							<div class="space-y-[var(--spacing-2)]">
								<div class="flex justify-between text-[var(--font-size-sm)]">
									<span>Item Price</span>
									<span class="font-medium">{formatCurrency(itemPrice)}</span>
								</div>
								<div class="flex justify-between text-[var(--font-size-sm)]">
									<span>Shipping</span>
									<span class="font-medium">{shippingCost > 0 ? formatCurrency(shippingCost) : 'Free'}</span>
								</div>
								<div class="flex justify-between text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
									<span>Buyer Protection (5% + $1)</span>
									<span>{formatCurrency(buyerFee)}</span>
								</div>
								<div class="border-t border-[var(--color-brand-100)] pt-[var(--spacing-2)] mt-[var(--spacing-2)]">
									<div class="flex justify-between font-semibold text-[var(--font-size-lg)]">
										<span>Total</span>
										<span class="text-[var(--color-brand-600)]">{formatCurrency(totalAmount)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else if currentStep === 2}
					<!-- Step 2: Payment -->
					<div class="p-[var(--spacing-6)]" transition:slide>
						<h3 class="text-[var(--font-size-lg)] font-semibold text-[var(--color-text-primary)] mb-[var(--spacing-4)] flex items-center gap-[var(--spacing-2)]">
							<CreditCard class="w-5 h-5" />
							Payment Method
						</h3>

						<!-- Payment Method Selection -->
						<div class="space-y-[var(--spacing-3)] mb-[var(--spacing-6)]">
							<label class="flex items-center p-[var(--spacing-4)] border rounded-[var(--border-radius-lg)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors {paymentProvider === 'stripe' ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]' : 'border-[var(--color-border-primary)]'}">
								<input
									type="radio"
									value="stripe"
									bind:group={paymentProvider}
									class="text-[var(--color-brand-500)]"
								/>
								<div class="ml-[var(--spacing-3)] flex-1">
									<p class="font-medium">Credit/Debit Card</p>
									<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">Secure payment via Stripe</p>
								</div>
								<Lock class="w-4 h-4 text-[var(--color-text-tertiary)]" />
							</label>
							
							<label class="flex items-center p-[var(--spacing-4)] border rounded-[var(--border-radius-lg)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors {paymentProvider === 'revolut_manual' ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]' : 'border-[var(--color-border-primary)]'}">
								<input
									type="radio"
									value="revolut_manual"
									bind:group={paymentProvider}
									class="text-[var(--color-brand-500)]"
									disabled
								/>
								<div class="ml-[var(--spacing-3)] flex-1">
									<p class="font-medium">Revolut Transfer</p>
									<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">Manual payment (temporarily disabled)</p>
								</div>
							</label>
						</div>

						{#if paymentProvider === 'stripe'}
							<!-- Card Details -->
							<div class="mb-[var(--spacing-6)]">
								<label class="block text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)] mb-[var(--spacing-2)]">
									Card Information
								</label>
								<div id="card-element-new" class="p-[var(--spacing-4)] border border-[var(--color-border-primary)] rounded-[var(--border-radius-lg)]"></div>
							</div>
						{/if}

						<!-- Order Summary (Compact) -->
						<div class="bg-[var(--color-surface-secondary)] rounded-[var(--border-radius-lg)] p-[var(--spacing-4)] mb-[var(--spacing-6)]">
							<div class="flex justify-between items-center">
								<div class="flex items-center gap-[var(--spacing-3)]">
									<img
										src={listing.images[0]}
										alt={listing.title}
										class="w-12 h-12 object-cover rounded-[var(--border-radius-sm)]"
									/>
									<div>
										<p class="font-medium text-[var(--font-size-sm)]">{listing.title}</p>
										<p class="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">Total: {formatCurrency(totalAmount)}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Security Notice -->
						<div class="flex items-center gap-[var(--spacing-2)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
							<Lock class="w-4 h-4" />
							<p>Your payment information is secure and encrypted</p>
						</div>
					</div>
				{:else}
					<!-- Step 3: Order Complete -->
					<div class="p-[var(--spacing-6)] text-center" transition:slide>
						<div class="mb-[var(--spacing-6)]">
							<div class="w-20 h-20 bg-[var(--color-success-50)] rounded-full flex items-center justify-center mx-auto mb-[var(--spacing-4)]">
								<Check class="w-10 h-10 text-[var(--color-success-600)]" />
							</div>
							<h3 class="text-[var(--font-size-2xl)] font-bold text-[var(--color-text-primary)] mb-[var(--spacing-2)]">Order Successful!</h3>
							<p class="text-[var(--color-text-secondary)]">Your order has been placed successfully.</p>
						</div>

						{#if orderData}
							<div class="bg-[var(--color-surface-secondary)] rounded-[var(--border-radius-lg)] p-[var(--spacing-4)] text-left mb-[var(--spacing-6)]">
								<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] mb-[var(--spacing-1)]">Order ID</p>
								<p class="font-mono text-[var(--font-size-sm)]">{orderData.orderId}</p>
								<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] mt-[var(--spacing-3)] mb-[var(--spacing-1)]">Total Amount</p>
								<p class="font-semibold">{formatCurrency(orderData.amount)}</p>
							</div>

							{#if orderData.paymentInstructions}
								<div class="bg-[var(--color-info-50)] rounded-[var(--border-radius-lg)] p-[var(--spacing-4)] text-left">
									<p class="font-medium text-[var(--color-info-600)] mb-[var(--spacing-2)]">Payment Instructions</p>
									<p class="text-[var(--font-size-sm)] text-[var(--color-info-600)]/80">{orderData.paymentInstructions}</p>
								</div>
							{/if}
						{/if}

						<p class="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] mt-[var(--spacing-6)]">
							Redirecting to your orders in 3 seconds...
						</p>
					</div>
				{/if}
			</div>

			<!-- Hidden submit buttons for form actions -->
			<button
				type="submit"
				name="action"
				value="createPaymentIntent"
				formaction="?/createPaymentIntent"
				style="display: none;"
				aria-hidden="true"
			/>
			<button
				type="submit"
				name="action"
				value="confirmPayment"
				formaction="?/confirmPayment"
				style="display: none;"
				aria-hidden="true"
			/>
			<button
				type="submit"
				name="action"
				value="createRevolutPayment"
				formaction="?/createRevolutPayment"
				style="display: none;"
				aria-hidden="true"
			/>

			<!-- Footer -->
			<div class="border-t border-[var(--color-border-primary)] p-[var(--spacing-6)] bg-[var(--color-surface-secondary)]">
				<div class="flex items-center justify-between">
					{#if currentStep > 1 && currentStep < 3}
						<button
							onclick={handlePreviousStep}
							class="flex items-center gap-[var(--spacing-2)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
							disabled={isProcessing}
						>
							<ChevronLeft class="w-4 h-4" />
							Back
						</button>
					{:else}
						<div></div>
					{/if}
					
					{#if currentStep < 3}
						<button
							onclick={handleNextStep}
							disabled={isProcessing}
							class="px-[var(--spacing-6)] py-[var(--spacing-3)] bg-[var(--color-brand-500)] text-[var(--color-white)] rounded-[var(--border-radius-lg)] font-medium hover:bg-[var(--color-brand-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[var(--spacing-2)]"
						>
							{#if isProcessing}
								<Spinner size="sm" color="white" />
							{:else if currentStep === 1}
								Continue to Payment
								<ChevronRight class="w-4 h-4" />
							{:else}
								Pay {formatCurrency(totalAmount)}
							{/if}
						</button>
					{:else}
						<button
							onclick={() => window.location.href = '/orders'}
							class="px-[var(--spacing-6)] py-[var(--spacing-3)] bg-[var(--color-brand-500)] text-[var(--color-white)] rounded-[var(--border-radius-lg)] font-medium hover:bg-[var(--color-brand-600)] transition-colors"
						>
							View Orders
						</button>
					{/if}
				</div>
			</div>
			</form>
		</div>
	</div>
{/if}