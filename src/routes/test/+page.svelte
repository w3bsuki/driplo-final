<script>
  import { onMount } from 'svelte';
  
  let mounted = false;
  let clickCount = 0;
  
  onMount(() => {
    mounted = true;
    console.log('Test page mounted');
  });
  
  function handleClick() {
    clickCount++;
    console.log('Button clicked:', clickCount);
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Debug Test Page</h1>
  
  <div class="space-y-4">
    <div class="p-4 border rounded">
      <p>JavaScript Status: {mounted ? '✅ Working' : '❌ Not Working'}</p>
    </div>
    
    <div class="p-4 border rounded">
      <button 
        onclick={handleClick}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Button (Clicked: {clickCount})
      </button>
    </div>
    
    <div class="p-4 border rounded">
      <p class="text-red-500">Red text test</p>
      <p class="text-green-500">Green text test</p>
      <p class="text-blue-500">Blue text test</p>
    </div>
    
    <div class="p-4 border rounded bg-gray-100">
      <p>Background color test</p>
    </div>
  </div>
</div>