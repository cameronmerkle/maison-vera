/**
 * Product List Page block — Adobe Commerce drop-in integration
 *
 * When connected to Commerce (commerce-endpoint set in /config.json),
 * renders the real @dropins/storefront-product-discovery containers.
 * Falls back to mock data when no backend is configured.
 */

import { readBlockConfig } from '../../scripts/aem.js';
import { isCommerceConnected, getProductLink } from '../../scripts/commerce.js';

const DROPIN_BASE = '../../scripts/__dropins__/@dropins';

async function decorateWithDropin(block, config) {
  const { search } = await import(`${DROPIN_BASE}/storefront-product-discovery/api.js`);
  const { render: provider } = await import(`${DROPIN_BASE}/storefront-product-discovery/render.js`);
  const SearchResults = (await import(`${DROPIN_BASE}/storefront-product-discovery/containers/SearchResults.js`)).default;
  const Pagination = (await import(`${DROPIN_BASE}/storefront-product-discovery/containers/Pagination.js`)).default;

  const initSearch = (await import('../../scripts/initializers/search.js')).default;
  await initSearch();

  const wrapper = document.createElement('div');
  wrapper.className = 'plp-wrapper';

  const productList = document.createElement('div');
  productList.className = 'plp-product-list';
  wrapper.append(productList);

  const pagination = document.createElement('div');
  pagination.className = 'plp-pagination';
  wrapper.append(pagination);

  block.append(wrapper);

  const pageSize = parseInt(config.pagesize, 10) || 8;
  const categoryPath = config.urlpath || '';

  const filter = [];
  if (categoryPath) {
    filter.push({ attribute: 'categoryPath', eq: categoryPath });
  }
  filter.push({ attribute: 'visibility', in: ['Search', 'Catalog, Search'] });

  search({
    phrase: '',
    currentPage: 1,
    pageSize,
    sort: [{ attribute: 'position', direction: 'DESC' }],
    filter,
  });

  provider.render(SearchResults, {
    routeProduct: (product) => getProductLink(product.urlKey, product.sku),
  })(productList);

  provider.render(Pagination, {
    onPageChange: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  })(pagination);
}

async function decorateWithMock(block, config) {
  const { searchProducts, renderProductCard } = await import('../../scripts/commerce-mock.js');

  const pageSize = parseInt(config.pagesize, 10) || 8;
  const categoryPath = config.urlpath || '';

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

  const showing = result.items.length;
  const { totalCount } = result;
  if (showing < totalCount) {
    resultInfo.textContent = `Showing ${showing} of ${totalCount} products`;
  } else {
    resultInfo.textContent = `${totalCount} products`;
  }

  result.items.forEach((product) => {
    productList.append(renderProductCard(product));
  });
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';

  const connected = await isCommerceConnected();
  if (connected) {
    await decorateWithDropin(block, config);
  } else {
    await decorateWithMock(block, config);
  }
}
