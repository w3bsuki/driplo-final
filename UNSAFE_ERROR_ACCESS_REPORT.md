================================================================================
UNSAFE ERROR PROPERTY ACCESS ANALYSIS REPORT
================================================================================

SUMMARY:
  Total files analyzed: 140
  Files with unsafe patterns: 43
  Total unsafe patterns found: 97
    - Critical: 15
    - High: 15
    - Medium: 67

================================================================================
CRITICAL SEVERITY ISSUES (15 found)
================================================================================

File: K:\driplo.bg-main\src/routes/api/health/stripe/+server.ts
Line: 28
Catch parameter: error: any
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: False

Context:
  s: 'error',
      service: 'stripe',
      error: error.message || 'Stripe connection failed',
      timestamp: n

Catch block context:
  return json({
      status: 'error',
      service: 'stripe',
      error: error.message || 'Stripe connection failed',
      timestamp: new Date().toISOString()
    }, { status: 503 });

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/storage-client.ts
Line: 114
Catch parameter: fetchError: any
Error variable: fetchError
Unsafe pattern: fetchError.name
Property accessed: name
Access type: direct_access
Has type check: False

Context:
  clearTimeout(timeoutId);
				if (fetchError.name === 'AbortError') {
					lastError = new Error(`U

Catch block context:
  clearTimeout(timeoutId);
				if (fetchError.name === 'AbortError') {
					lastError = new Error(`Upload timed out after ${timeout/1000}s. Please try again with a smaller image.`);
				} else {
					la...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/onboarding/ProfileSetupWizard.svelte
Line: 214
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: False

Context:
  toast.error(error.message || 'Failed to save progress');

Catch block context:
  toast.error(error.message || 'Failed to save progress');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/onboarding/ProfileSetupWizard.svelte
Line: 234
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: False

Context:
  toast.error(error.message || 'Failed to complete setup');

Catch block context:
  toast.error(error.message || 'Failed to complete setup');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/LazyCheckoutFlow.svelte
Line: 32
Catch parameter: e
Error variable: e
Unsafe pattern: e.error
Property accessed: error
Access type: direct_access
Has type check: False

Context:
  error = e as Error;
			console.error('Failed to load checkout flow:', e);

Catch block context:
  error = e as Error;
			console.error('Failed to load checkout flow:', e);

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/ui/dialog/dialog.svelte
Line: 145
Catch parameter: e
Error variable: e
Unsafe pattern: e.error
Property accessed: error
Access type: direct_access
Has type check: False

Context:
  error = e as Error;
			console.error('Failed to load modal component:', e);

Catch block context:
  error = e as Error;
			console.error('Failed to load modal component:', e);

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(app)/sell/+page.server.ts
Line: 44
Catch parameter: error
Error variable: error
Unsafe pattern: error.code
Property accessed: code
Access type: direct_access
Has type check: False

Context:
  If error is "no rows returned", that's fine
		if (error.code !== 'PGRST116') {
			console.error('Failed to che

Catch block context:
  // If error is "no rows returned", that's fine
		if (error.code !== 'PGRST116') {
			console.error('Failed to check payment account:', error)
		}

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(app)/sell/+page.server.ts
Line: 156
Catch parameter: error: any
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: False

Context:
  rror)
			return fail(500, { 
				form,
				error: error.message || 'Failed to create listing' 
			})

Catch block context:
  // If it's a redirect, rethrow it
			if (error.status === 303) {
				throw error
			}
			
			console.error('Listing creation error:', error)
			return fail(500, { 
				form,
				error: error.message |...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(app)/sell/+page.server.ts
Line: 156
Catch parameter: error: any
Error variable: error
Unsafe pattern: error.status
Property accessed: status
Access type: direct_access
Has type check: False

Context:
  // If it's a redirect, rethrow it
			if (error.status === 303) {
				throw error
			}
			
			console.er

Catch block context:
  // If it's a redirect, rethrow it
			if (error.status === 303) {
				throw error
			}
			
			console.error('Listing creation error:', error)
			return fail(500, { 
				form,
				error: error.message |...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/web-vitals.ts
Line: 212
Catch parameter: e
Error variable: e
Unsafe pattern: e.error
Property accessed: error
Access type: direct_access
Has type check: False

Context:
  console.error('Failed to measure performance:', e);

Catch block context:
  console.error('Failed to measure performance:', e);

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/onboarding/AvatarPicker.svelte
Line: 124
Catch parameter: error: any
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: False

Context:
  toast.error(error.message || 'Failed to upload avatar');

Catch block context:
  toast.error(error.message || 'Failed to upload avatar');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/account/setup/+server.ts
Line: 146
Catch parameter: error: any
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: False

Context:
  error: 'Internal server error', 
			details: error.message,
			stack: error.stack 
		}, { status: 500 });

Catch block context:
  console.error('Payment account setup error:', error);
		return json({ 
			error: 'Internal server error', 
			details: error.message,
			stack: error.stack 
		}, { status: 500 });

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/account/setup/+server.ts
Line: 146
Catch parameter: error: any
Error variable: error
Unsafe pattern: error.stack
Property accessed: stack
Access type: direct_access
Has type check: False

Context:
  ver error', 
			details: error.message,
			stack: error.stack 
		}, { status: 500 });

Catch block context:
  console.error('Payment account setup error:', error);
		return json({ 
			error: 'Internal server error', 
			details: error.message,
			stack: error.stack 
		}, { status: 500 });

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/stores/onboarding.svelte.ts
Line: 94
Catch parameter: e
Error variable: e
Unsafe pattern: e.error
Property accessed: error
Access type: direct_access
Has type check: False

Context:
  console.error('Failed to parse onboarding state:', e);

Catch block context:
  console.error('Failed to parse onboarding state:', e);

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/ui/LazyModal.svelte
Line: 33
Catch parameter: e
Error variable: e
Unsafe pattern: e.error
Property accessed: error
Access type: direct_access
Has type check: False

Context:
  error = e as Error;
			console.error('Failed to load modal component:', e);

Catch block context:
  error = e as Error;
			console.error('Failed to load modal component:', e);

--------------------------------------------------------------------------------

================================================================================
HIGH SEVERITY ISSUES (15 found)
================================================================================

File: K:\driplo.bg-main\src/lib/utils/error-handling.ts
Line: 126
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.code
Property accessed: code
Access type: optional_chaining
Has type check: False

Context:
  error?.status === 404 || // Not found
        error?.code === 'auth/invalid-credentials' ||
        error?.

Catch block context:
  lastError = error;

      // Don't retry certain errors
      if (
        error?.status === 401 || // Unauthorized
        error?.status === 403 || // Forbidden
        error?.status === 404 || // No...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/error-handling.ts
Line: 126
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.code
Property accessed: code
Access type: optional_chaining
Has type check: False

Context:
  r?.code === 'auth/invalid-credentials' ||
        error?.code === 'payment/card-declined'
      ) {
        thr

Catch block context:
  lastError = error;

      // Don't retry certain errors
      if (
        error?.status === 401 || // Unauthorized
        error?.status === 403 || // Forbidden
        error?.status === 404 || // No...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/error-handling.ts
Line: 126
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.status
Property accessed: status
Access type: optional_chaining
Has type check: False

Context:
  // Don't retry certain errors
      if (
        error?.status === 401 || // Unauthorized
        error?.status

Catch block context:
  lastError = error;

      // Don't retry certain errors
      if (
        error?.status === 401 || // Unauthorized
        error?.status === 403 || // Forbidden
        error?.status === 404 || // No...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/error-handling.ts
Line: 126
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.status
Property accessed: status
Access type: optional_chaining
Has type check: False

Context:
  error?.status === 401 || // Unauthorized
        error?.status === 403 || // Forbidden
        error?.status ===

Catch block context:
  lastError = error;

      // Don't retry certain errors
      if (
        error?.status === 401 || // Unauthorized
        error?.status === 403 || // Forbidden
        error?.status === 404 || // No...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/error-handling.ts
Line: 126
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.status
Property accessed: status
Access type: optional_chaining
Has type check: False

Context:
  error?.status === 403 || // Forbidden
        error?.status === 404 || // Not found
        error?.code === '

Catch block context:
  lastError = error;

      // Don't retry certain errors
      if (
        error?.status === 401 || // Unauthorized
        error?.status === 403 || // Forbidden
        error?.status === 404 || // No...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/listings/CreateListingForm/CreateListingForm.svelte
Line: 228
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: False

Context:
  e?.preventDefault()
			toast?.error(error?.message)
			return

Catch block context:
  e?.preventDefault()
			toast?.error(error?.message)
			return

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/brands/settings/+page.svelte
Line: 186
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: False

Context:
  toast?.error(error?.message || 'Failed to upgrade account');

Catch block context:
  toast?.error(error?.message || 'Failed to upgrade account');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/brands/settings/+page.svelte
Line: 237
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: False

Context:
  toast?.error(error?.message || 'Failed to update brand info');

Catch block context:
  toast?.error(error?.message || 'Failed to update brand info');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/brands/settings/+page.svelte
Line: 301
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: False

Context:
  toast?.error(error?.message || 'Failed to submit verification');

Catch block context:
  toast?.error(error?.message || 'Failed to submit verification');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/upload/simple/+server.ts
Line: 118
Catch parameter: err: any
Error variable: err
Unsafe pattern: err?.message
Property accessed: message
Access type: optional_chaining
Has type check: False

Context:
  rr?.status) {
			throw err
		}
		throw error(500, err?.message || 'Internal server error')

Catch block context:
  console?.error('Upload error:', err)
		if (err?.status) {
			throw err
		}
		throw error(500, err?.message || 'Internal server error')

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/upload/simple/+server.ts
Line: 118
Catch parameter: err: any
Error variable: err
Unsafe pattern: err?.status
Property accessed: status
Access type: optional_chaining
Has type check: False

Context:
  console?.error('Upload error:', err)
		if (err?.status) {
			throw err
		}
		throw error(500, err?.messa

Catch block context:
  console?.error('Upload error:', err)
		if (err?.status) {
			throw err
		}
		throw error(500, err?.message || 'Internal server error')

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/drafts/listing/+server.ts
Line: 37
Catch parameter: err: any
Error variable: err
Unsafe pattern: err?.status
Property accessed: status
Access type: optional_chaining
Has type check: False

Context:
  console?.error('Draft save error:', err)
		if (err?.status) throw err
		throw error(500, 'Internal server er

Catch block context:
  console?.error('Draft save error:', err)
		if (err?.status) throw err
		throw error(500, 'Internal server error')

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/drafts/listing/+server.ts
Line: 72
Catch parameter: err: any
Error variable: err
Unsafe pattern: err?.status
Property accessed: status
Access type: optional_chaining
Has type check: False

Context:
  console?.error('Draft load error:', err)
		if (err?.status) throw err
		throw error(500, 'Internal server er

Catch block context:
  console?.error('Draft load error:', err)
		if (err?.status) throw err
		throw error(500, 'Internal server error')

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/drafts/listing/+server.ts
Line: 99
Catch parameter: err: any
Error variable: err
Unsafe pattern: err?.status
Property accessed: status
Access type: optional_chaining
Has type check: False

Context:
  console?.error('Draft delete error:', err)
		if (err?.status) throw err
		throw error(500, 'Internal server er

Catch block context:
  console?.error('Draft delete error:', err)
		if (err?.status) throw err
		throw error(500, 'Internal server error')

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(app)/profile/settings/+page.svelte
Line: 215
Catch parameter: error: any
Error variable: error
Unsafe pattern: error?.code
Property accessed: code
Access type: optional_chaining
Has type check: False

Context:
  nsole?.error('Save profile error:', error)
			if (error?.code === '23505') {
				toast?.error(m?.settings_usern

Catch block context:
  console?.error('Save profile error:', error)
			if (error?.code === '23505') {
				toast?.error(m?.settings_username_taken())
			} else {
				toast?.error(m?.settings_save_error())
			}

--------------------------------------------------------------------------------

================================================================================
MEDIUM SEVERITY ISSUES (67 found)
================================================================================

File: K:\driplo.bg-main\src/routes/(app)/onboarding/+page.server.ts
Line: 55
Catch parameter: err
Error variable: err
Unsafe pattern: err.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  alse,
				p_error_message: err instanceof Error ? err.message : 'Unknown error'
			});

			return fail(500, { e

Catch block context:
  console.error('Onboarding completion error:', err);
			
			// Log failed attempt
			await supabase.rpc('log_auth_event', {
				user_id: user.id,
				p_action: 'onboarding_completed',
				p_success: fa...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/onboarding/complete/+server.ts
Line: 39
Catch parameter: err
Error variable: err
Unsafe pattern: err.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  false,
			p_error_message: err instanceof Error ? err.message : 'Unknown error'
		});

		throw error(500, 'Fail

Catch block context:
  console.error('Onboarding completion error:', err);
		
		// Log failed attempt
		await supabase.rpc('log_auth_event', {
			user_id: user.id,
			p_action: 'onboarding_completed',
			p_success: false,
	...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/stripe/webhooks/+server.ts
Line: 383
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  .update({
        error: error instanceof Error ? error?.message : 'Unknown error'
      })
      .eq('stripe_even

Catch block context:
  // Record error
    await supabase
      .from('stripe_webhook_events')
      .update({
        error: error instanceof Error ? error?.message : 'Unknown error'
      })
      .eq('stripe_event_id', s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/create-intent/+server.ts
Line: 259
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  ApiError(
          `Payment processing error: ${error?.message}`,
          400,
          ApiErrorType?.EXTERNA

Catch block context:
  // Handle Stripe-specific errors
      if (error instanceof stripe?.errors.StripeError) {
        throw new ApiError(
          `Payment processing error: ${error?.message}`,
          400,
          ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/create-intent/+server.ts
Line: 259
Catch parameter: error
Error variable: error
Unsafe pattern: error?.code
Property accessed: code
Access type: optional_chaining
Has type check: True

Context:
  type: error?.type,
            stripe_error_code: error?.code
          }
        );
      }
      
      // Re

Catch block context:
  // Handle Stripe-specific errors
      if (error instanceof stripe?.errors.StripeError) {
        throw new ApiError(
          `Payment processing error: ${error?.message}`,
          400,
          ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/create-intent/+server.ts
Line: 259
Catch parameter: error
Error variable: error
Unsafe pattern: error?.type
Property accessed: type
Access type: optional_chaining
Has type check: True

Context:
  VICE,
          { 
            stripe_error_type: error?.type,
            stripe_error_code: error?.code

Catch block context:
  // Handle Stripe-specific errors
      if (error instanceof stripe?.errors.StripeError) {
        throw new ApiError(
          `Payment processing error: ${error?.message}`,
          400,
          ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(app)/listings/[id]/+page.server.ts
Line: 396
Catch parameter: error
Error variable: error
Unsafe pattern: error?.status
Property accessed: status
Access type: optional_chaining
Has type check: True

Context:
  f (error instanceof Error && 'status' in error && error?.status === 303) {
				throw error // Re-throw redirect

Catch block context:
  if (error instanceof Error && 'status' in error && error?.status === 303) {
				throw error // Re-throw redirect
			}
			
			console?.error('Payment confirmation error:', error)
			return fail(500, { ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  // Handle specific Supabase auth errors
				if (error?.message.includes('duplicate key') || error?.message.inclu

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  if (error?.message.includes('duplicate key') || error?.message.includes('already registered')) {
					toast?.err

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  dy exists. Please login instead.')
				} else if (error?.message.includes('username') && error?.message.includes('

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  } else if (error?.message.includes('username') && error?.message.includes('unique')) {
					toast?.error('This use

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  dy taken. Please choose another.')
				} else if (error?.message.includes('rate limit')) {
					toast?.error('Too

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  ttempts. Please try again later.')
				} else if (error?.message.includes('invalid email')) {
					toast?.error('P

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  ase enter a valid email address.')
				} else if (error?.message.includes('weak password')) {
					toast?.error('P

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 137
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  ronger password.')
				} else {
					toast?.error(error?.message || 'Registration failed')
				}
			} else {
				t

Catch block context:
  if (error instanceof z?.ZodError) {
				// Zod validation errors
				error?.issues.forEach((issue) => {
					toast?.error(issue?.message)
				})
			} else if (error instanceof Error) {
				// Handle s...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/register/+page.svelte
Line: 175
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  if (error instanceof Error) {
				toast?.error(error?.message || 'OAuth registration failed')
			} else {
				t

Catch block context:
  if (error instanceof Error) {
				toast?.error(error?.message || 'OAuth registration failed')
			} else {
				toast?.error('OAuth registration failed')
			}
			loading = false

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/storage.ts
Line: 120
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  url: '', 
			error: error instanceof Error ? error?.message : 'Failed to upload image' 
		}

Catch block context:
  console?.error('Upload error:', error)
		return { 
			url: '', 
			error: error instanceof Error ? error?.message : 'Failed to upload image' 
		}

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/orders/+server.ts
Line: 259
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  r instanceof Error) {
            return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: erro

Catch block context:
  if (error instanceof Error) {
            return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId);
        }
        return apiError(
            'Failed ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/orders/+server.ts
Line: 259
Catch parameter: error
Error variable: error
Unsafe pattern: error?.name
Property accessed: name
Access type: optional_chaining
Has type check: True

Context:
  sage, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId);
        }
        return apiError(

Catch block context:
  if (error instanceof Error) {
            return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId);
        }
        return apiError(
            'Failed ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/brands/brand-onboarding-wizard/hooks/useImageUpload.svelte.ts
Line: 208
Catch parameter: err
Error variable: err
Unsafe pattern: err.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  const errorMessage = err instanceof Error ? err.message : 'Upload failed';
			error = errorMessage;
			lo

Catch block context:
  const errorMessage = err instanceof Error ? err.message : 'Upload failed';
			error = errorMessage;
			logger.error('❌ File upload failed:', err);
			
			return {
				success: false,
				error: errorM...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/brands/brand-onboarding-wizard/hooks/useImageUpload.svelte.ts
Line: 276
Catch parameter: err
Error variable: err
Unsafe pattern: err.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  const errorMessage = err instanceof Error ? err.message : 'Upload failed';
			logger.error('❌ Image uploa

Catch block context:
  const errorMessage = err instanceof Error ? err.message : 'Upload failed';
			logger.error('❌ Image upload failed:', err);
			toast.error(errorMessage);
			
			return {
				success: false,
				error: ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/brands/brand-onboarding-wizard/hooks/useImageUpload.svelte.ts
Line: 307
Catch parameter: err
Error variable: err
Unsafe pattern: err.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  const errorMessage = err instanceof Error ? err.message : 'Delete failed';
			logger.error('❌ Image delet

Catch block context:
  const errorMessage = err instanceof Error ? err.message : 'Delete failed';
			logger.error('❌ Image deletion failed:', err);
			
			return {
				success: false,
				error: errorMessage
			};

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/server/api-response.ts
Line: 122
Catch parameter: error
Error variable: error
Unsafe pattern: error.status
Property accessed: status
Access type: direct_access
Has type check: True

Context:
  anceof ApiError) {
        return apiError(error, error.status, event);
      }
      
      // Handle Supabase

Catch block context:
  // Handle known API errors
      if (error instanceof ApiError) {
        return apiError(error, error.status, event);
      }
      
      // Handle Supabase errors
      if (error && typeof error ==...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte
Line: 98
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  Handle different types of payment errors
				if (error?.message.includes('authentication')) {
					errorMessage =

Catch block context:
  logger?.error('❌ Payment processing failed:', error);
			
			// Enhanced error handling with specific error types
			let errorMessage = 'Payment failed';
			
			if (error instanceof Error) {
				// Ha...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte
Line: 98
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  ion failed. Please log in again.';
				} else if (error?.message.includes('insufficient')) {
					errorMessage = '

Catch block context:
  logger?.error('❌ Payment processing failed:', error);
			
			// Enhanced error handling with specific error types
			let errorMessage = 'Payment failed';
			
			if (error instanceof Error) {
				// Ha...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte
Line: 98
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  try a different payment method.';
				} else if (error?.message.includes('declined')) {
					errorMessage = 'Paym

Catch block context:
  logger?.error('❌ Payment processing failed:', error);
			
			// Enhanced error handling with specific error types
			let errorMessage = 'Payment failed';
			
			if (error instanceof Error) {
				// Ha...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte
Line: 98
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  ent details or try another card.';
				} else if (error?.message.includes('network')) {
					errorMessage = 'Netwo

Catch block context:
  logger?.error('❌ Payment processing failed:', error);
			
			// Enhanced error handling with specific error types
			let errorMessage = 'Payment failed';
			
			if (error instanceof Error) {
				// Ha...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte
Line: 98
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  and try again.';
				} else {
					errorMessage = error?.message;
				}
			}
			
			onPaymentError(errorMessage);

Catch block context:
  logger?.error('❌ Payment processing failed:', error);
			
			// Enhanced error handling with specific error types
			let errorMessage = 'Payment failed';
			
			if (error instanceof Error) {
				// Ha...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(auth)/login/+page.svelte
Line: 98
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  if (error instanceof Error) {
				toast?.error(error?.message || m?.auth_oauth_failed())
			} else {
				toast?

Catch block context:
  if (error instanceof Error) {
				toast?.error(error?.message || m?.auth_oauth_failed())
			} else {
				toast?.error(m?.auth_oauth_failed())
			}

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/layout/header/Header.svelte
Line: 80
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  brandSlugError = error instanceof Error ? error?.message : 'Unknown error occurred';
			console?.error('Fa

Catch block context:
  brandSlugError = error instanceof Error ? error?.message : 'Unknown error occurred';
			console?.error('Failed to fetch brand slug:', error);

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/wishlist/+server.ts
Line: 119
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  if (error instanceof Error) {
			return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: erro

Catch block context:
  if (error instanceof Error) {
			return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId)
		}
		return apiError(
			'An unexpected error occurred',
			500,...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/wishlist/+server.ts
Line: 119
Catch parameter: error
Error variable: error
Unsafe pattern: error?.name
Property accessed: name
Access type: optional_chaining
Has type check: True

Context:
  sage, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId)
		}
		return apiError(
			'An unexp

Catch block context:
  if (error instanceof Error) {
			return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId)
		}
		return apiError(
			'An unexpected error occurred',
			500,...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/wishlist/+server.ts
Line: 166
Catch parameter: error
Error variable: error
Unsafe pattern: error?.message
Property accessed: message
Access type: optional_chaining
Has type check: True

Context:
  if (error instanceof Error) {
			return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: erro

Catch block context:
  if (error instanceof Error) {
			return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId)
		}
		return apiError(
			'An unexpected error occurred',
			500,...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/wishlist/+server.ts
Line: 166
Catch parameter: error
Error variable: error
Unsafe pattern: error?.name
Property accessed: name
Access type: optional_chaining
Has type check: True

Context:
  sage, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId)
		}
		return apiError(
			'An unexp

Catch block context:
  if (error instanceof Error) {
			return apiError(error?.message, 500, ApiErrorType?.INTERNAL_ERROR, { error: error?.name }, requestId)
		}
		return apiError(
			'An unexpected error occurred',
			500,...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 144
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, request

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to create payment',
			500,
			ApiErrorType.IN...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 144
Catch parameter: error
Error variable: error
Unsafe pattern: error.status
Property accessed: status
Access type: direct_access
Has type check: True

Context:
  eof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		ret

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to create payment',
			500,
			ApiErrorType.IN...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 144
Catch parameter: error
Error variable: error
Unsafe pattern: error.details
Property accessed: details
Access type: direct_access
Has type check: True

Context:
  apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to create payment',
			500,
			ApiErrorType.IN...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 144
Catch parameter: error
Error variable: error
Unsafe pattern: error.type
Property accessed: type
Access type: direct_access
Has type check: True

Context:
  {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to create payment',
			500,
			ApiErrorType.IN...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 205
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, request

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to confirm payment',
			500,
			ApiErrorType.I...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 205
Catch parameter: error
Error variable: error
Unsafe pattern: error.status
Property accessed: status
Access type: direct_access
Has type check: True

Context:
  eof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		ret

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to confirm payment',
			500,
			ApiErrorType.I...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 205
Catch parameter: error
Error variable: error
Unsafe pattern: error.details
Property accessed: details
Access type: direct_access
Has type check: True

Context:
  apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to confirm payment',
			500,
			ApiErrorType.I...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/payment/revolut/manual-payment/+server.ts
Line: 205
Catch parameter: error
Error variable: error
Unsafe pattern: error.type
Property accessed: type
Access type: direct_access
Has type check: True

Context:
  {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'Failed to confirm payment',
			500,
			ApiErrorType.I...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/(app)/browse/+page.server.ts
Line: 113
Catch parameter: err
Error variable: err
Unsafe pattern: err.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  led to load browse page: ${err instanceof Error ? err.message : 'Unknown error'}`)

Catch block context:
  console.error('Browse page error:', err)
		throw error(500, `Failed to load browse page: ${err instanceof Error ? err.message : 'Unknown error'}`)

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/utils/api-client.ts
Line: 69
Catch parameter: error: any
Error variable: error
Unsafe pattern: error.name
Property accessed: name
Access type: direct_access
Has type check: True

Context:
  (timeoutId);

    // Handle abort/timeout
    if (error.name === 'AbortError') {
      throw new AppError('Req

Catch block context:
  clearTimeout(timeoutId);

    // Handle abort/timeout
    if (error.name === 'AbortError') {
      throw new AppError('Request timed out', 'network/timeout', 408);
    }

    // Re-throw if already an...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/server/api-utils.ts
Line: 480
Catch parameter: err
Error variable: err
Unsafe pattern: err.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  (err instanceof ApiError) {
      return apiError(err.message, err.status, err.type, err.details, context.reque

Catch block context:
  if (dev) {
      console.error(`[${context.requestId}] Error:`, err, monitor.getMetrics());
    }
    
    if (err instanceof ApiError) {
      return apiError(err.message, err.status, err.type, err.d...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/server/api-utils.ts
Line: 480
Catch parameter: err
Error variable: err
Unsafe pattern: err.status
Property accessed: status
Access type: direct_access
Has type check: True

Context:
  of ApiError) {
      return apiError(err.message, err.status, err.type, err.details, context.requestId);
    }

Catch block context:
  if (dev) {
      console.error(`[${context.requestId}] Error:`, err, monitor.getMetrics());
    }
    
    if (err instanceof ApiError) {
      return apiError(err.message, err.status, err.type, err.d...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/server/api-utils.ts
Line: 480
Catch parameter: err
Error variable: err
Unsafe pattern: err.details
Property accessed: details
Access type: direct_access
Has type check: True

Context:
  eturn apiError(err.message, err.status, err.type, err.details, context.requestId);
    }
    
    return apiErr

Catch block context:
  if (dev) {
      console.error(`[${context.requestId}] Error:`, err, monitor.getMetrics());
    }
    
    if (err instanceof ApiError) {
      return apiError(err.message, err.status, err.type, err.d...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/server/api-utils.ts
Line: 480
Catch parameter: err
Error variable: err
Unsafe pattern: err.type
Property accessed: type
Access type: direct_access
Has type check: True

Context:
  {
      return apiError(err.message, err.status, err.type, err.details, context.requestId);
    }

Catch block context:
  if (dev) {
      console.error(`[${context.requestId}] Error:`, err, monitor.getMetrics());
    }
    
    if (err instanceof ApiError) {
      return apiError(err.message, err.status, err.type, err.d...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useStripePayment.svelte.ts
Line: 188
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  r) {
				// Handle specific Stripe errors
				if (error.message.includes('card_declined')) {
					errorMessage =

Catch block context:
  logger.error('❌ Unexpected error during payment processing:', error);
			
			// Enhanced error handling for different error types
			let errorMessage = 'An unexpected error occurred. Please try again....

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useStripePayment.svelte.ts
Line: 188
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  try a different payment method.';
				} else if (error.message.includes('insufficient_funds')) {
					errorMessa

Catch block context:
  logger.error('❌ Unexpected error during payment processing:', error);
			
			// Enhanced error handling for different error types
			let errorMessage = 'An unexpected error occurred. Please try again....

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useStripePayment.svelte.ts
Line: 188
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  try a different payment method.';
				} else if (error.message.includes('network')) {
					errorMessage = 'Netwo

Catch block context:
  logger.error('❌ Unexpected error during payment processing:', error);
			
			// Enhanced error handling for different error types
			let errorMessage = 'An unexpected error occurred. Please try again....

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useRevolutPayment.svelte.ts
Line: 89
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  nt';
			
			if (error instanceof Error) {
				if (error.message.includes('rate_limit')) {
					errorMessage = 'To

Catch block context:
  logger.error('❌ Failed to create manual payment:', error);
			
			// Enhanced error handling with user-friendly messages
			let errorMessage = 'Failed to create payment';
			
			if (error instanceof E...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useRevolutPayment.svelte.ts
Line: 89
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  ase wait a moment and try again.';
				} else if (error.message.includes('network')) {
					errorMessage = 'Netwo

Catch block context:
  logger.error('❌ Failed to create manual payment:', error);
			
			// Enhanced error handling with user-friendly messages
			let errorMessage = 'Failed to create payment';
			
			if (error instanceof E...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useRevolutPayment.svelte.ts
Line: 89
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  r. Please check your connection.';
				} else if (error.message.includes('server')) {
					errorMessage = 'Server

Catch block context:
  logger.error('❌ Failed to create manual payment:', error);
			
			// Enhanced error handling with user-friendly messages
			let errorMessage = 'Failed to create payment';
			
			if (error instanceof E...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useRevolutPayment.svelte.ts
Line: 89
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  y again later.';
				} else {
					errorMessage = error.message;
				}
			}
			
			toast.error(errorMessage);

Catch block context:
  logger.error('❌ Failed to create manual payment:', error);
			
			// Enhanced error handling with user-friendly messages
			let errorMessage = 'Failed to create payment';
			
			if (error instanceof E...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/checkout/checkout-modal/hooks/useRevolutPayment.svelte.ts
Line: 154
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  const errorMessage = error instanceof Error ? error.message : 'Failed to confirm payment';
			toast.error(err

Catch block context:
  logger.error('❌ Failed to confirm manual payment:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to confirm payment';
			toast.error(errorMessage);
			return { succ...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/auth/TwoFactorVerification.svelte
Line: 45
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  toast.error(error instanceof Error ? error.message : 'Failed to verify code');

Catch block context:
  toast.error(error instanceof Error ? error.message : 'Failed to verify code');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/auth/TwoFactorSetup.svelte
Line: 38
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  toast.error(error instanceof Error ? error.message : 'Failed to start 2FA setup');

Catch block context:
  toast.error(error instanceof Error ? error.message : 'Failed to start 2FA setup');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/auth/TwoFactorSetup.svelte
Line: 68
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  toast.error(error instanceof Error ? error.message : 'Failed to verify code');

Catch block context:
  toast.error(error instanceof Error ? error.message : 'Failed to verify code');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/auth/resend-verification/+server.ts
Line: 131
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, request

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'An unexpected error occurred',
			500,
			ApiErrorTyp...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/auth/resend-verification/+server.ts
Line: 131
Catch parameter: error
Error variable: error
Unsafe pattern: error.status
Property accessed: status
Access type: direct_access
Has type check: True

Context:
  eof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		ret

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'An unexpected error occurred',
			500,
			ApiErrorTyp...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/auth/resend-verification/+server.ts
Line: 131
Catch parameter: error
Error variable: error
Unsafe pattern: error.details
Property accessed: details
Access type: direct_access
Has type check: True

Context:
  apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'An unexpe

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'An unexpected error occurred',
			500,
			ApiErrorTyp...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/routes/api/auth/resend-verification/+server.ts
Line: 131
Catch parameter: error
Error variable: error
Unsafe pattern: error.type
Property accessed: type
Access type: direct_access
Has type check: True

Context:
  {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError

Catch block context:
  if (error instanceof ApiError) {
			return apiError(error.message, error.status, error.type, error.details, requestId);
		}
		return apiError(
			'An unexpected error occurred',
			500,
			ApiErrorTyp...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/server/scheduled/cleanup-rate-limits.ts
Line: 15
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  ess: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

Catch block context:
  console.error('[Rate Limit Cleanup] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/listings/listing-card/useLikeToggle.svelte.ts
Line: 75
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  const errorMessage = error instanceof Error ? error.message : m.listing_favorite_error();
			apiError = error

Catch block context:
  // Revert on error
			liked = originalLiked;
			likeCount = originalCount;
			
			const errorMessage = error instanceof Error ? error.message : m.listing_favorite_error();
			apiError = errorMessage;
...

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/auth/TwoFactorSettings.svelte
Line: 66
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  toast.error(error instanceof Error ? error.message : 'Failed to disable 2FA');

Catch block context:
  toast.error(error instanceof Error ? error.message : 'Failed to disable 2FA');

--------------------------------------------------------------------------------

File: K:\driplo.bg-main\src/lib/components/auth/TwoFactorSettings.svelte
Line: 99
Catch parameter: error
Error variable: error
Unsafe pattern: error.message
Property accessed: message
Access type: direct_access
Has type check: True

Context:
  toast.error(error instanceof Error ? error.message : 'Failed to regenerate backup codes');

Catch block context:
  toast.error(error instanceof Error ? error.message : 'Failed to regenerate backup codes');

--------------------------------------------------------------------------------
