<script>
	let count = 0;
	
	function increment() {
		count += 1;
		console.log('Button clicked, count:', count);
	}
</script>

<h1>Minimal Test Page</h1>
<p>Count: {count}</p>
<button onclick={increment}>Click me</button>

<style>
	h1 { color: red; }
	button { padding: 10px; background: blue; color: white; }
</style>