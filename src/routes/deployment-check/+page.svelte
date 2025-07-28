<script lang="ts">
	import { dev } from '$app/environment';
	import { PUBLIC_APP_URL, PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	
	const buildTime = new Date().toISOString();
	const deploymentInfo = {
		environment: dev ? 'development' : 'production',
		buildTime,
		envVars: {
			PUBLIC_APP_URL: PUBLIC_APP_URL || 'NOT SET',
			PUBLIC_SUPABASE_URL: PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
			PUBLIC_SUPABASE_ANON_KEY: PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
		},
		cssCheck: {
			tailwindVersion: 'v4',
			cssFirstMode: true
		}
	};
</script>

<div class="min-h-screen bg-white p-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold mb-8">Deployment Verification</h1>
		
		<div class="space-y-8">
			<!-- Environment Info -->
			<section class="bg-gray-50 p-6 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">Environment Information</h2>
				<pre class="bg-white p-4 rounded border overflow-x-auto text-sm">{JSON.stringify(deploymentInfo, null, 2)}</pre>
			</section>
			
			<!-- CSS Tests -->
			<section class="bg-gray-50 p-6 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">CSS Tests</h2>
				<div class="space-y-4">
					<!-- Test gradient classes -->
					<div>
						<h3 class="font-medium mb-2">Gradient Test (Should be gray, not blue):</h3>
						<div class="bg-gray-900 text-white p-4 rounded">
							This should have a dark gray background (bg-gray-900)
						</div>
					</div>
					
					<!-- Test blue gradient -->
					<div>
						<h3 class="font-medium mb-2">Blue Gradient Test:</h3>
						<div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded">
							This should have a blue gradient background
						</div>
					</div>
					
					<!-- Test brand color -->
					<div>
						<h3 class="font-medium mb-2">Brand Color Test:</h3>
						<div class="bg-brand-500 text-white p-4 rounded">
							This should have the brand color background (baby blue #87ceeb)
						</div>
					</div>
				</div>
			</section>
			
			<!-- Button Tests -->
			<section class="bg-gray-50 p-6 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">Button Functionality Tests</h2>
				<div class="space-y-4">
					<button 
						onclick={() => alert('Button clicked!')}
						class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
					>
						Test Button (Should Alert)
					</button>
					
					<button 
						onclick={() => console.log('Console log test')}
						class="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
					>
						Console Log Test
					</button>
				</div>
			</section>
			
			<!-- Git Info -->
			<section class="bg-gray-50 p-6 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">Build Information</h2>
				<div class="space-y-2 text-sm">
					<p><strong>Build Time:</strong> {buildTime}</p>
					<p><strong>Last Known Commit:</strong> e100966 (fix: Critical server-side environment variable access for Vercel)</p>
					<p><strong>Adapter:</strong> @sveltejs/adapter-vercel</p>
					<p><strong>Runtime:</strong> nodejs22.x</p>
				</div>
			</section>
			
			<!-- Promotional Banner Test -->
			<section class="bg-gray-50 p-6 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">Promotional Banner Classes</h2>
				<div class="space-y-4">
					<div class="bg-gray-900 text-white p-4 rounded">
						Gradient Variant: bg-gray-900 text-white (Should be dark gray/black)
					</div>
					<div class="bg-brand-500/10 text-brand-600 p-4 rounded">
						Launch Variant: bg-brand-500/10 text-brand-600 (Should be light baby blue)
					</div>
				</div>
			</section>
		</div>
		
		<div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
			<p class="text-sm">
				<strong>Instructions:</strong> Compare this page on localhost:5173 vs Vercel deployment. 
				If colors or functionality differ, there's a build/deployment issue.
			</p>
		</div>
	</div>
</div>