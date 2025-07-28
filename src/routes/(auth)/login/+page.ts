import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ url }) => {
	const error = url.searchParams.get('error');
	
	return {
		error
	};
};