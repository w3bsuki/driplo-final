import { error, fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types.js'
import { setCacheHeaders, cachePresets } from '$lib/utils/cache-headers'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '$env/static/private'
import { z } from 'zod'
import { generateCSRFToken, csrfProtectedAction } from '$lib/server/csrf'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-06-30.basil'
})

export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession }, setHeaders }) => {
	// Get session first to check authentication
	const { session } = await safeGetSession()
	
	// Set cache headers for product pages
	setCacheHeaders({ setHeaders, request: { url: { pathname: `/listings/${params?.id}` } } as any } , cachePresets?.product)

	// First, get the main listing
	const { data: listing, error: listingError } = await supabase
		.from('listings')
		.select(`
			*,
			seller:profiles!seller_id(
				id,
				username,
				full_name,
				avatar_url,
				bio,
				location,
				created_at,
				account_type,
				is_verified
			),
			category:categories!category_id(
				id,
				name,
				slug,
				icon_url
			)
		`)
		.eq('id', params?.id)
		.eq('status', 'active')
		.single()

	if (listingError || !listing) {
		throw error(404, 'Listing not found')
	}

	// Now execute all dependent queries in parallel
	const [
		followersResult,
		listingsCountResult,
		sellerListingsResult,
		relatedListingsResult,
		followCheckResult,
		favoriteCheckResult
	] = await Promise?.all([
		// Get seller's followers count
		listing?.seller
			? supabase
					.from('user_follows')
					.select('id', { count: 'exact', head: true })
					.eq('following_id', listing?.seller.id)
			: Promise?.resolve({ count: 0 }),

		// Get seller's active listings count
		listing?.seller
			? supabase
					.from('listings')
					.select('id', { count: 'exact', head: true })
					.eq('seller_id', listing?.seller.id)
					.eq('status', 'active')
			: Promise?.resolve({ count: 0 }),

		// Get seller's other listings
		supabase
			.from('listings')
			.select(`
				id,
				title,
				price,
				images,
				created_at
			`)
			.eq('seller_id', listing?.seller_id)
			.eq('status', 'active')
			.neq('id', params?.id)
			.limit(6),

		// Get related listings from same category
		supabase
			.from('listings')
			.select(`
				id,
				title,
				price,
				images,
				size,
				brand,
				condition,
				seller:profiles!seller_id(username, avatar_url, account_type, is_verified)
			`)
			.eq('category_id', listing?.category_id)
			.eq('status', 'active')
			.neq('id', params?.id)
			.limit(8),

		// Check if current user is following the seller
		session?.user
			? supabase
					.from('user_follows')
					.select('id')
					.eq('follower_id', session.user.id)
					.eq('following_id', listing?.seller_id)
					.maybeSingle()
			: Promise?.resolve({ data: null }),
		
		// Check if current user has favorited this listing
		session?.user
			? supabase
					.from('favorites')
					.select('id')
					.eq('user_id', session.user.id)
					.eq('listing_id', params?.id)
					.maybeSingle()
			: Promise?.resolve({ data: null })
	])

	// Update seller stats
	if (listing?.seller) {
		if (listing.seller) {
			listing.seller.followers_count = followersResult?.count || 0
			listing.seller.listings_count = listingsCountResult?.count || 0
		}
	}

	// Track view using our new stored procedure (fire and forget)
	if (session?.user) {
		try {
			await supabase?.rpc('track_listing_view', {
				p_listing_id: params?.id,
				p_viewer_id: session.user.id
			});
		} catch (error) {
			// Silent failure - view count is not critical
			console.debug('View tracking failed:', error);
		}
	} else {
		// For anonymous users, we'd need IP and session tracking
		// This would require client-side tracking instead
	}

	return {
		csrfToken: generateCSRFToken(),
		listing,
		sellerListings: sellerListingsResult?.data || [],
		relatedListings: relatedListingsResult?.data || [],
		isFollowing: !!followCheckResult?.data,
		isLiked: !!favoriteCheckResult?.data,
		user: session?.user || null
	
	}
}

// Validation schemas
const shippingAddressSchema = z?.object({
	name: z?.string().min(1, 'Full name is required'),
	address_line1: z?.string().min(1, 'Address is required'),
	address_line2: z?.string().optional(),
	city: z?.string().min(1, 'City is required'),
	state: z?.string().min(1, 'State is required'),
	postal_code: z?.string().min(1, 'Postal code is required'),
	country: z?.string().default('BG')
})

const createPaymentIntentSchema = z?.object({
	listing_id: z?.string().uuid(),
	shipping_address: shippingAddressSchema
})

const confirmPaymentSchema = z?.object({
	payment_method_id: z?.string(),
	client_secret: z?.string(),
	shipping_address: shippingAddressSchema
})

export const actions: Actions = {
	createPaymentIntent: async ({ request, params, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession()
		
		if (!session) {
			return fail(401, { error: 'Please log in to make a purchase' })
		}

		const formData = await request?.formData()
		const data = Object?.fromEntries(formData)
		
		// Parse shipping address from form data
		const shipping_address = {
			name: data?.['shipping_name'] as string,
			address_line1: data?.['shipping_address_line1'] as string,
			address_line2: data?.['shipping_address_line2'] as string || '',
			city: data?.['shipping_city'] as string,
			state: data?.['shipping_state'] as string,
			postal_code: data?.['shipping_postal_code'] as string,
			country: data?.['shipping_country'] as string || 'BG'
		}

		// Validate input
		const validationResult = createPaymentIntentSchema?.safeParse({
			listing_id: params?.id,
			shipping_address
		})

		if (!validationResult?.success) {
			return fail(400, { 
				error: 'Invalid shipping information',
				fieldErrors: validationResult?.error.flatten().fieldErrors 
			})
		}

		// Get listing details
		const { data: listing, error: listingError } = await supabase
			.from('listings')
			.select('*')
			.eq('id', params?.id)
			.single()

		if (listingError || !listing) {
			return fail(404, { error: 'Listing not found' })
		}

		// Validation checks
		if (listing?.seller_id === session.user.id) {
			return fail(400, { error: 'Cannot buy your own item' })
		}

		if (listing?.status !== 'active') {
			return fail(400, { error: 'Listing is no longer available' })
		}

		// Calculate fees
		const itemPrice = Number(listing?.price)
		const shippingPrice = Number(listing?.shipping_cost || 0)
		const subtotal = itemPrice + shippingPrice
		const buyerFeePercentage = 5.0;
		const buyerFeeFixed = 1.00;
		const buyerFeeAmount = (subtotal * buyerFeePercentage / 100) + buyerFeeFixed
		const totalAmount = Math?.round((subtotal + buyerFeeAmount) * 100)
		const sellerPayoutAmount = subtotal

		// Generate unique order reference
		const orderRef = `DRIPLO-${Date.now()}-${listing?.id?.slice(-6)}`;

		try {
			// Create Stripe payment intent
			const paymentIntent = await stripe?.paymentIntents.create({
				amount: totalAmount,
				currency: 'usd',
				metadata: {
					order_id: orderRef,
					listing_id: listing?.id,
					buyer_id: session.user.id,
					seller_id: listing?.seller_id,
					item_price: itemPrice?.toString(),
					shipping_cost: shippingPrice?.toString(),
					buyer_fee: buyerFeeAmount?.toFixed(2),
					seller_payout: sellerPayoutAmount?.toFixed(2)
				},
				description: `Purchase: ${listing?.title}`,
				capture_method: 'automatic',
				receipt_email: session.user.email
			})

			// Create transaction record
			const { error: transactionError } = await supabase
				.from('transactions')
				.insert({
					id: orderRef,
					listing_id: listing?.id,
					buyer_id: session.user.id,
					seller_id: listing?.seller_id,
					amount: subtotal,
					currency: 'USD',
					status: 'pending',
					payment_method: 'stripe',
					stripe_payment_intent_id: paymentIntent?.id,
					buyer_fee_amount: buyerFeeAmount,
					buyer_fee_percentage: buyerFeePercentage,
					platform_fee_amount: buyerFeeAmount,
					seller_payout_amount: sellerPayoutAmount,
					seller_payout_status: 'pending',
					shipping_address: shipping_address,
					created_at: new Date().toISOString()
				})

			if (transactionError) {
				// Cancel payment intent if transaction creation fails
				await stripe?.paymentIntents.cancel(paymentIntent?.id)
				return fail(500, { error: 'Failed to create order' })
			}

			return {
				success: true,
				clientSecret: paymentIntent?.client_secret,
				orderId: orderRef,
				totalAmount: subtotal + buyerFeeAmount
			}

		} catch (error) {
			console?.error('Payment intent creation error:', error)
			return fail(500, { error: 'Failed to initialize payment' })
		}
	},

	confirmPayment: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession()
		
		if (!session) {
			return fail(401, { error: 'Please log in to complete payment' })
		}

		const formData = await request?.formData()
		const data = Object?.fromEntries(formData)
		
		const payment_method_id = data?.['payment_method_id'] as string
		const client_secret = data?.['client_secret'] as string
		
		// Parse shipping address
		const shipping_address = {
			name: data?.['shipping_name'] as string,
			address_line1: data?.['shipping_address_line1'] as string,
			address_line2: data?.['shipping_address_line2'] as string || '',
			city: data?.['shipping_city'] as string,
			state: data?.['shipping_state'] as string,
			postal_code: data?.['shipping_postal_code'] as string,
			country: data?.['shipping_country'] as string || 'BG'
		}

		// Validate input
		const validationResult = confirmPaymentSchema?.safeParse({
			payment_method_id,
			client_secret,
			shipping_address
		})

		if (!validationResult?.success) {
			return fail(400, { 
				error: 'Invalid payment information',
				fieldErrors: validationResult?.error.flatten().fieldErrors 
			})
		}

		try {
			// Confirm the payment with Stripe
			const paymentIntent = await stripe?.paymentIntents.confirm(client_secret, {
				payment_method: payment_method_id,
				payment_method_data: {
					type: 'card',
					billing_details: {
						name: shipping_address?.name,
						address: {
							line1: shipping_address?.address_line1,
							line2: shipping_address?.address_line2,
							city: shipping_address?.city,
							state: shipping_address?.state,
							postal_code: shipping_address?.postal_code,
							country: shipping_address?.country
						}
					}
				},
				return_url: `${request?.url.origin}/order-confirmation`
			})

			if (paymentIntent?.status === 'succeeded') {
				// Update transaction status
				const { error: updateError } = await supabase
					.from('transactions')
					.update({ 
						status: 'completed',
						completed_at: new Date().toISOString()
					})
					.eq('stripe_payment_intent_id', paymentIntent?.id)

				if (updateError) {
					console?.error('Failed to update transaction status:', updateError)
				}

				// Update listing status to sold
				const { error: listingUpdateError } = await supabase
					.from('listings')
					.update({ status: 'sold' })
					.eq('id', paymentIntent?.metadata['listing_id'])

				if (listingUpdateError) {
					console?.error('Failed to update listing status:', listingUpdateError)
				}

				// Redirect to order confirmation
				throw redirect(303, `/order-confirmation?order_id=${paymentIntent?.metadata['order_id']}`)
			} else if (paymentIntent?.status === 'requires_action') {
				// 3D Secure or other authentication required
				return {
					success: false,
					requiresAction: true,
					clientSecret: paymentIntent?.client_secret,
					actionUrl: paymentIntent?.next_action?.redirect_to_url?.url
				}
			} else {
				return fail(400, { error: 'Payment failed. Please try again.' })
			}

		} catch (error) {
			if (error instanceof Error && 'status' in error && error?.status === 303) {
				throw error // Re-throw redirect
			}
			
			console?.error('Payment confirmation error:', error)
			return fail(500, { error: 'Failed to process payment' })
		}
	},

	createRevolutPayment: async ({ request, params, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession()
		
		if (!session) {
			return fail(401, { error: 'Please log in to make a purchase' })
		}

		const formData = await request?.formData()
		const data = Object?.fromEntries(formData)
		
		// Parse shipping address
		const shipping_address = {
			full_name: data?.['shipping_name'] as string,
			street_address: data?.['shipping_address_line1'] as string,
			city: data?.['shipping_city'] as string,
			state_province: data?.['shipping_state'] as string,
			postal_code: data?.['shipping_postal_code'] as string,
			country: data?.['shipping_country'] as string || 'BG',
			phone: data?.['shipping_phone'] as string || ''
		}

		// Get listing details
		const { data: listing, error: listingError } = await supabase
			.from('listings')
			.select('*, seller:profiles!seller_id(revtag)')
			.eq('id', params?.id)
			.single()

		if (listingError || !listing) {
			return fail(404, { error: 'Listing not found' })
		}

		// Calculate amounts
		const itemPrice = Number(listing?.price)
		const shippingPrice = Number(listing?.shipping_cost || 0)
		const subtotal = itemPrice + shippingPrice
		const buyerFeeAmount = (subtotal * 0.05) + 1.00;
		const totalAmount = subtotal + buyerFeeAmount;

		// Generate order ID
		const orderId = `REV-${Date.now()}-${listing?.id?.slice(-6)}`;

		// Create transaction
		const { error: transactionError } = await supabase
			.from('transactions')
			.insert({
				id: orderId,
				listing_id: listing?.id,
				buyer_id: session.user.id,
				seller_id: listing?.seller_id,
				amount: subtotal,
				currency: 'USD',
				status: 'pending',
				payment_method: 'revolut_manual',
				buyer_fee_amount: buyerFeeAmount,
				buyer_fee_percentage: 5.0,
				platform_fee_amount: buyerFeeAmount,
				seller_payout_amount: subtotal,
				seller_payout_status: 'pending',
				shipping_address: shipping_address,
				created_at: new Date().toISOString()
			})

		if (transactionError) {
			return fail(500, { error: 'Failed to create order' })
		}

		// Get seller's Revtag
		const sellerRevtag = listing?.seller?.revtag || '@unknown'

		return {
			success: true,
			orderId,
			totalAmount,
			sellerRevtag,
			paymentInstructions: `Please send ${totalAmount?.toFixed(2)} USD to ${sellerRevtag} via Revolut`
		}
	}
}