<script lang="ts">
	import { onMount } from 'svelte';
	
	let mounted = $state(false);
	let clickCount = $state(0);
	let testResults = $state<string[]>([]);
	
	onMount(() => {
		mounted = true;
		testResults = [...testResults, '✅ Component mounted'];
		
		// Test if window object is available
		if (typeof window !== 'undefined') {
			testResults = [...testResults, '✅ Window object available'];
		} else {
			testResults = [...testResults, '❌ Window object NOT available'];
		}
		
		// Test if document object is available
		if (typeof document !== 'undefined') {
			testResults = [...testResults, '✅ Document object available'];
		} else {
			testResults = [...testResults, '❌ Document object NOT available'];
		}
		
		// Test localStorage
		try {
			localStorage.setItem('test', 'value');
			localStorage.removeItem('test');
			testResults = [...testResults, '✅ LocalStorage working'];
		} catch (e) {
			testResults = [...testResults, '❌ LocalStorage NOT working'];
		}
	});
	
	function handleClick() {
		clickCount++;
		testResults = [...testResults, `✅ Button clicked ${clickCount} times`];
	}
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-2xl mx-auto">
		<h1 class="text-3xl font-bold mb-8">Vercel Deployment Test Page</h1>
		
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">JavaScript Execution Test</h2>
			
			<div class="space-y-2 mb-6">
				<p class="text-sm text-gray-600">
					Mounted: <span class="font-mono">{mounted}</span>
				</p>
				<p class="text-sm text-gray-600">
					Click count: <span class="font-mono">{clickCount}</span>
				</p>
			</div>
			
			<button
				onclick={handleClick}
				class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
			>
				Test Click Handler
			</button>
		</div>
		
		<div class="bg-white rounded-lg shadow-md p-6">
			<h2 class="text-xl font-semibold mb-4">Test Results</h2>
			
			{#if testResults.length === 0}
				<p class="text-gray-500">No tests run yet...</p>
			{:else}
				<ul class="space-y-2">
					{#each testResults as result}
						<li class="text-sm font-mono">{result}</li>
					{/each}
				</ul>
			{/if}
		</div>
		
		<div class="mt-6 text-sm text-gray-500">
			<p>This page tests basic JavaScript functionality on Vercel deployment.</p>
			<p>If you see test results and can click the button, JavaScript is working.</p>
		</div>
	</div>
</div>