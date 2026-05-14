/**
 * Product List Page block — Commerce drop-in pattern
 *
 * Currently uses mock data from scripts/commerce-mock.js.
 * To connect to Adobe Commerce, replace the mock import with:
 *   import { search } from '@dropins/storefront-product-discovery/api.js';
 *   import SearchResults from '@dropins/storefront-product-discovery/containers/SearchResults.js';
 *   import { render as provider } from '@dropins/storefront-product-discovery/render.js';
 */

import { readBlockConfig } from '../../scripts/aem.js';
import { searchProducts, renderProductCard } from '../../scripts/commerce-mock.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const pageSize = parseInt(config.pagesize, 10) || 8;
  const categoryPath = config.urlpath || '';

  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'plp-wrapper';

  const header = document.createElement('div');
  header.className = 'plp-header';

  const resultInfo = document.createElement('div');
  resultInfo.className = 'plp-result-info';

  header.append(resultInfo);
  wrapper.append(header);

  const productList = document.createElement('div');
  productList.className = 'plp-product-list';
  wrapper.append(productList);

  block.append(wrapper);

  const result = await searchProducts({ pageSize, currentPage: 1, categoryPath });

  resultInfo.textContent = `${result.totalCount} products`;

  result.items.forEach((product) => {
    productList.append(renderProductCard(product));
  });
}
