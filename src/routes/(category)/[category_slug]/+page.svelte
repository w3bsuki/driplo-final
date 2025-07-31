<script lang="ts">
  import type { PageData } from './$types';
  import CategoryLanding from '$lib/components/category/CategoryLanding.svelte';
  import CategorySEO from '$lib/components/seo/CategorySEO.svelte';
  
  let { data }: { data: PageData } = $props();
  
  // Only women category uses pink theme
  const theme = data.category?.slug === 'women' ? 'pink' : undefined;
</script>

<CategorySEO category={data.category} />

<CategoryLanding 
  category={data.category}
  subcategories={data.subcategories}
  products={data.products}
  topSellers={data.topSellers}
  {theme}
/>