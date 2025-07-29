<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui';
</script>

<svelte:head>
	<title>Error - Messages | Driplo</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="max-w-md w-full text-center">
		<div class="bg-white rounded-lg shadow-sm border p-8">
			<!-- Error icon -->
			<div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
				<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
				</svg>
			</div>

			<!-- Error details -->
			<h1 class="text-2xl font-bold text-gray-900 mb-2">
				{#if $page.status === 404}
					Message Not Found
				{:else if $page.status === 403}
					Access Denied
				{:else if $page.status === 500}
					Server Error
				{:else}
					Something Went Wrong
				{/if}
			</h1>
			
			<p class="text-gray-600 mb-6">
				{#if $page.status === 404}
					The conversation you're looking for doesn't exist or has been deleted.
				{:else if $page.status === 403}
					You don't have permission to access this conversation.
				{:else if $page.status === 500}
					We're experiencing technical difficulties. Please try again later.
				{:else}
					{$page.error?.message || 'An unexpected error occurred while loading your messages.'}
				{/if}
			</p>

			<!-- Action buttons -->
			<div class="space-y-3">
				<Button
					onclick={() => goto('/messages')}
					size="lg"
					class="w-full"
				>
					Back to Messages
				</Button>
				
				<button
					onclick={() => window.location.reload()}
					class="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors"
				>
					Try Again
				</button>
			</div>

			<!-- Status code (for debugging) -->
			{#if $page.status}
				<p class="text-xs text-gray-400 mt-6">
					Error {$page.status}
				</p>
			{/if}
		</div>
	</div>
</div>