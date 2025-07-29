# SvelteKit 2 Best Practices Guide

## Table of Contents
1. [Project Structure and File Conventions](#project-structure-and-file-conventions)
2. [Data Loading (Load Functions)](#data-loading-load-functions)
3. [Form Actions and Progressive Enhancement](#form-actions-and-progressive-enhancement)
4. [Routing Patterns](#routing-patterns)
5. [Error Handling](#error-handling)
6. [SSR/CSR/Prerendering Strategies](#ssrcsrprerendering-strategies)
7. [API Routes and Endpoints](#api-routes-and-endpoints)
8. [Deployment and Adapter Configuration](#deployment-and-adapter-configuration)

## Project Structure and File Conventions

### Standard Project Layout
```
my-project/
├ src/
│ ├ lib/
│ │ ├ server/
│ │ │ └ [your server-only lib files]
│ │ └ [your lib files]
│ ├ params/
│ │ └ [your param matchers]
│ ├ routes/
│ │ └ [your routes]
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ ├ hooks.server.js
│ └ service-worker.js
├ static/
│ └ [your static assets]
├ tests/
│ └ [your tests]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

### Key Files

#### app.html
The main HTML template with SvelteKit placeholders:
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

#### error.html
Fallback error page for unrecoverable errors:
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Error</title>
	</head>
	<body>
		<h1>Error</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

#### svelte.config.js
```javascript
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

### File-Based Routing Conventions

- `+page.svelte` - Page component
- `+page.js` - Universal load function and page options
- `+page.server.js` - Server-only load function and form actions
- `+layout.svelte` - Layout component
- `+layout.js` - Universal layout load function
- `+layout.server.js` - Server-only layout load function
- `+error.svelte` - Error boundary component
- `+server.js` - API endpoint handlers

## Data Loading (Load Functions)

### Universal Load Functions (+page.js/+layout.js)

Run on both server and client:
```javascript
/** @type {import('./$types').PageLoad} */
export function load({ params, url, route, fetch, setHeaders, depends, parent }) {
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
}
```

### Server Load Functions (+page.server.js/+layout.server.js)

Run only on the server, have access to databases and private environment variables:
```javascript
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals, cookies }) {
	return {
		post: await db.getPost(params.slug),
		user: locals.user
	};
}
```

### Combining Server and Universal Load Functions

Server data is passed to universal load functions:
```javascript
// +page.server.js
export async function load() {
	return {
		serverMessage: 'hello from server load function'
	};
}

// +page.js
export async function load({ data }) {
	return {
		serverMessage: data.serverMessage,
		universalMessage: 'hello from universal load function'
	};
}
```

### Streaming Promises

Improve perceived performance by streaming data:
```javascript
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		// Stream comments while loading post
		comments: loadComments(params.slug),
		post: await loadPost(params.slug) // await at the end
	};
}
```

### Using Parent Data

Access data from parent layouts:
```javascript
/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { user } = await parent();
	return {
		profile: await fetchProfile(user.id)
	};
}
```

### Best Practices

1. **Use server load functions for**:
   - Database queries
   - Accessing private API keys
   - Operations that should only run server-side

2. **Use universal load functions for**:
   - Data that needs to be reactive on the client
   - Operations that should run during client-side navigation

3. **Always use the SvelteKit-provided `fetch`**:
   - Inherits credentials
   - Supports relative URLs on the server
   - Works during SSR and hydration

## Form Actions and Progressive Enhancement

### Basic Form Action

```javascript
// +page.server.js
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		
		// Validate and process
		if (!email) {
			return fail(400, { email, missing: true });
		}
		
		// Set session cookie
		cookies.set('sessionid', await createSession(email), { path: '/' });
		
		return { success: true };
	}
};
```

### Named Actions

```javascript
export const actions = {
	login: async (event) => {
		// Handle login
	},
	register: async (event) => {
		// Handle registration
	}
};
```

### Progressive Enhancement with use:enhance

```svelte
<script>
	import { enhance } from '$app/forms';
	
	let { form } = $props();
</script>

<form method="POST" use:enhance>
	<input name="email" type="email">
	<button>Submit</button>
</form>

{#if form?.success}
	<p>Success!</p>
{/if}
```

### Custom Enhancement Behavior

```svelte
<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// Pre-submission logic
		
		return async ({ result, update }) => {
			// Post-submission logic
			if (result.type === 'success') {
				// Custom handling
			}
			update(); // Trigger default behavior
		};
	}}
>
```

### Best Practices

1. **Always use POST for form actions**
2. **Return meaningful error states** using `fail()`
3. **Use progressive enhancement** for better UX
4. **Validate on both client and server**
5. **Handle loading states** in your enhance function

## Routing Patterns

### Dynamic Routes

Use square brackets for dynamic segments:
```
src/routes/blog/[slug]/+page.svelte
src/routes/[category]/[...path]/+page.svelte
```

### Route Groups

Group routes without affecting URLs using parentheses:
```
src/routes/
  (app)/
    dashboard/
    profile/
    +layout.svelte
  (marketing)/
    about/
    blog/
    +layout.svelte
```

### Layout Resets

Break out of layout hierarchy:
- `+page@.svelte` - Reset to root layout
- `+page@(app).svelte` - Reset to (app) layout

### Custom Matchers

Create parameter validators:
```javascript
// src/params/integer.js
export function match(param) {
	return /^\d+$/.test(param);
}
```

Use in routes:
```
src/routes/post/[id=integer]/+page.svelte
```

### Route Priority

SvelteKit prioritizes routes in this order:
1. Exact matches
2. Dynamic parameters
3. Rest parameters

### Best Practices

1. **Use route groups** to organize related routes
2. **Create custom matchers** for type safety
3. **Use layout resets** sparingly
4. **Keep URLs RESTful and semantic**

## Error Handling

### Error Pages (+error.svelte)

```svelte
<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error.message}</h1>
```

### Throwing Errors in Load Functions

```javascript
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await getPost(params.slug);
	
	if (!post) {
		error(404, {
			message: 'Post not found',
			code: 'NOT_FOUND'
		});
	}
	
	return { post };
}
```

### Expected vs Unexpected Errors

- **Expected errors** (4xx): Shown to users
- **Unexpected errors** (5xx): Generic message shown, details logged

### Global Error Handling

```javascript
// hooks.server.js
export async function handleError({ error, event, status, message }) {
	// Log to error reporting service
	console.error(error);
	
	return {
		message: status === 500 ? 'Internal error' : message
	};
}
```

### Best Practices

1. **Use proper HTTP status codes**
2. **Provide helpful error messages** for 4xx errors
3. **Log detailed errors** server-side
4. **Create custom error pages** for better UX
5. **Handle errors at appropriate levels** (page, layout, or app)

## SSR/CSR/Prerendering Strategies

### Page Options

Export from `+page.js` or `+page.server.js`:

```javascript
// Prerender at build time
export const prerender = true; // or false, or 'auto'

// Server-side rendering
export const ssr = true; // or false

// Client-side rendering
export const csr = true; // or false
```

### Prerendering

Best for static content:
```javascript
export const prerender = true;

export async function load({ fetch }) {
	// This runs at build time
	const posts = await fetch('/api/posts').then(r => r.json());
	return { posts };
}
```

### SSR with CSR

Default behavior - good for dynamic content:
```javascript
export const ssr = true;
export const csr = true;
```

### SPA Mode

Client-only rendering:
```javascript
export const ssr = false;
export const csr = true;
```

### Incremental Static Regeneration (ISR)

With Vercel adapter:
```javascript
export const config = {
	isr: {
		expiration: 60, // seconds
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

### Best Practices

1. **Prerender marketing pages** for best performance
2. **Use SSR for dynamic content** with SEO needs
3. **Consider ISR** for content that updates periodically
4. **Avoid disabling both SSR and CSR**
5. **Test your choices** with real-world scenarios

## API Routes and Endpoints

### Basic API Route (+server.js)

```javascript
import { json } from '@sveltejs/kit';

export async function GET({ url, params, locals }) {
	const limit = url.searchParams.get('limit') ?? 10;
	const posts = await getPosts(limit);
	
	return json(posts);
}

export async function POST({ request }) {
	const data = await request.json();
	const id = await createPost(data);
	
	return json({ id }, { status: 201 });
}
```

### Response Types

```javascript
// JSON response
return json({ message: 'Hello' });

// Text response
return new Response('Hello World');

// Redirect
import { redirect } from '@sveltejs/kit';
redirect(303, '/success');

// Streaming
return new Response(
	new ReadableStream({
		start(controller) {
			// Stream data
		}
	})
);
```

### Content Negotiation

```javascript
export async function GET({ request }) {
	const accept = request.headers.get('accept');
	
	if (accept?.includes('application/json')) {
		return json(data);
	}
	
	return new Response(renderHTML(data), {
		headers: { 'content-type': 'text/html' }
	});
}
```

### CORS Handling

```javascript
export async function OPTIONS() {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
}
```

### Best Practices

1. **Use proper HTTP methods** (GET, POST, PUT, DELETE)
2. **Return appropriate status codes**
3. **Handle errors gracefully**
4. **Validate input data**
5. **Use TypeScript** for better type safety
6. **Consider rate limiting** for public APIs

## Deployment and Adapter Configuration

### Adapter Options

#### adapter-auto (Default)
Zero-config for supported platforms:
```javascript
import adapter from '@sveltejs/adapter-auto';

export default {
	kit: { adapter: adapter() }
};
```

#### adapter-node
For custom servers:
```javascript
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true,
			envPrefix: 'APP_'
		})
	}
};
```

#### adapter-vercel
With ISR support:
```javascript
import adapter from '@sveltejs/adapter-vercel';

export default {
	kit: {
		adapter: adapter({
			runtime: 'nodejs20.x',
			split: false,
			regions: ['iad1']
		})
	}
};
```

#### adapter-cloudflare
For Workers/Pages:
```javascript
import adapter from '@sveltejs/adapter-cloudflare';

export default {
	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<prerendered>']
			}
		})
	}
};
```

#### adapter-static
For static hosting:
```javascript
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		})
	}
};
```

### Environment Variables

```javascript
// $env/static/private - Server only, known at build time
import { API_KEY } from '$env/static/private';

// $env/static/public - Universal, known at build time
import { PUBLIC_API_URL } from '$env/static/public';

// $env/dynamic/private - Server only, dynamic
import { env } from '$env/dynamic/private';

// $env/dynamic/public - Universal, dynamic
import { env as publicEnv } from '$env/dynamic/public';
```

### Build Configuration

```javascript
export default {
	kit: {
		paths: {
			base: '/app', // for subdirectory deployment
			assets: 'https://cdn.example.com'
		},
		version: {
			name: process.env.COMMIT_REF
		},
		serviceWorker: {
			register: false
		},
		csrf: {
			checkOrigin: true
		}
	}
};
```

### Best Practices

1. **Choose the right adapter** for your platform
2. **Configure environment variables** properly
3. **Set up proper caching** headers
4. **Enable precompression** when possible
5. **Use CDN** for static assets
6. **Monitor performance** after deployment
7. **Set up error tracking**
8. **Configure CSP headers** for security

## Performance Tips

1. **Preload critical data** in `hooks.server.js`
2. **Use `<link rel="preload">` for fonts**
3. **Lazy load** heavy components
4. **Optimize images** with Vite plugins
5. **Enable HTTP/2 push** where supported
6. **Use `prefetch` for likely navigation**
7. **Minimize JavaScript** with proper code splitting

## Security Best Practices

1. **Always validate** user input
2. **Use CSRF protection** (enabled by default)
3. **Sanitize HTML** when using `{@html}`
4. **Set secure cookie options**
5. **Use HTTPS** in production
6. **Implement CSP headers**
7. **Keep dependencies updated**
8. **Avoid exposing** sensitive data in load functions

This guide covers the essential best practices for SvelteKit 2. Always refer to the [official documentation](https://kit.svelte.dev) for the most up-to-date information and advanced topics.