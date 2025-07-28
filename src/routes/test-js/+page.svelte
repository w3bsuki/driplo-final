<script>
	import { onMount } from 'svelte';
	
	let clickCount = $state(0);
	let mounted = $state(false);
	
	onMount(() => {
		mounted = true;
		console.log('[TEST] Component mounted');
	});
	
	function handleClick() {
		clickCount++;
		console.log('[TEST] Button clicked, count:', clickCount);
	}
</script>

<div class="container mx-auto p-8">
	<h1 class="text-2xl font-bold mb-4">JavaScript Test Page</h1>
	
	<div class="space-y-4">
		<p>Component mounted: <span class="font-bold">{mounted ? 'Yes' : 'No'}</span></p>
		
		<button 
			onclick={handleClick}
			class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
		>
			Click me (clicked {clickCount} times)
		</button>
		
		<div class="mt-4 p-4 bg-gray-100 rounded">
			<p>If JavaScript is working:</p>
			<ul class="list-disc list-inside">
				<li>Component mounted should show "Yes"</li>
				<li>Clicking the button should increase the counter</li>
				<li>Check browser console for log messages</li>
			</ul>
		</div>
	</div>
</div>