import { getCatalogGraphQL } from '../commerce.js';

export default async function initCart() {
  const { initializers } = await import('../__dropins__/@dropins/tools/initializer.js');
  const { initialize, setEndpoint } = await import('../__dropins__/@dropins/storefront-cart/api.js');

  const graphql = await getCatalogGraphQL();
  setEndpoint(graphql);
  return initializers.mountImmediately(initialize, {});
}
