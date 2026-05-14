let configCache = null;
let fetchGraphQLInstance = null;

async function fetchConfig() {
  if (configCache) return configCache;

  try {
    const cached = sessionStorage.getItem('commerce-config');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.expiry > Date.now()) {
        configCache = parsed.data;
        return configCache;
      }
    }
  } catch (e) { /* no session storage */ }

  try {
    const resp = await fetch('/config.json');
    if (resp.ok) {
      const json = await resp.json();
      const config = {};
      (json.data || []).forEach((row) => {
        config[row.key] = row.value;
      });
      configCache = config;
      try {
        sessionStorage.setItem('commerce-config', JSON.stringify({
          data: config,
          expiry: Date.now() + 2 * 60 * 60 * 1000,
        }));
      } catch (e) { /* ignore */ }
      return config;
    }
  } catch (e) {
    // config not available
  }
  configCache = {};
  return configCache;
}

export async function getConfigValue(key) {
  const config = await fetchConfig();
  return config[key] || '';
}

export function getProductLink(urlKey, sku) {
  return `/products/${urlKey}/${sku}`;
}

export async function isCommerceConnected() {
  const endpoint = await getConfigValue('commerce-endpoint');
  return !!endpoint;
}

export async function getCatalogGraphQL() {
  if (fetchGraphQLInstance) return fetchGraphQLInstance;

  const { FetchGraphQL } = await import('./__dropins__/@dropins/tools/fetch-graphql.js');
  fetchGraphQLInstance = new FetchGraphQL();

  const endpoint = await getConfigValue('commerce-endpoint');
  if (!endpoint) return fetchGraphQLInstance;

  fetchGraphQLInstance.setEndpoint(endpoint);

  const storeCode = await getConfigValue('commerce-store-code');
  const storeViewCode = await getConfigValue('commerce-store-view-code');
  const websiteCode = await getConfigValue('commerce-website-code');
  const customerGroup = await getConfigValue('commerce-customer-group');

  fetchGraphQLInstance.setFetchGraphQlHeaders((prev) => ({
    ...prev,
    'Magento-Store-Code': storeCode,
    'Magento-Store-View-Code': storeViewCode,
    'Magento-Website-Code': websiteCode,
    'Magento-Customer-Group': customerGroup,
  }));

  return fetchGraphQLInstance;
}

export async function initializeCommerce() {
  const connected = await isCommerceConnected();
  if (!connected) return null;

  const { initializers } = await import('./__dropins__/@dropins/tools/initializer.js');
  await getCatalogGraphQL();
  return initializers;
}
