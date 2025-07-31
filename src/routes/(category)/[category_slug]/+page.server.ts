import type { PageServerLoad } from './$types';
import { loadCategoryPage } from '$lib/server/category';

export const load: PageServerLoad = async ({ params, locals }) => {
  return await loadCategoryPage(params.category_slug, locals.supabase);
};