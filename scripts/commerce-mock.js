const MOCK_PRODUCTS = [
  {
    sku: 'MV-001',
    name: 'Halden Wool Coat',
    urlKey: 'halden-wool-coat',
    price: { regular: 480, final: 480, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-01.jpg', label: 'Halden Wool Coat' },
      { url: '/drafts/images/product-01b.jpg', label: 'Halden Wool Coat alt' },
    ],
    attributes: [{ name: 'color', value: 'Camel' }],
    badge: 'New',
    inStock: true,
  },
  {
    sku: 'MV-002',
    name: 'Silk Slip Dress',
    urlKey: 'silk-slip-dress',
    price: { regular: 220, final: 220, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-02.jpg', label: 'Silk Slip Dress' },
      { url: '/drafts/images/product-02b.jpg', label: 'Silk Slip Dress alt' },
    ],
    attributes: [{ name: 'color', value: 'Ink' }],
    badge: null,
    inStock: true,
  },
  {
    sku: 'MV-003',
    name: 'Pleated Trouser',
    urlKey: 'pleated-trouser',
    price: { regular: 180, final: 180, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-03.jpg', label: 'Pleated Trouser' },
      { url: '/drafts/images/product-03b.jpg', label: 'Pleated Trouser alt' },
    ],
    attributes: [{ name: 'color', value: 'Charcoal' }],
    badge: null,
    inStock: true,
  },
  {
    sku: 'MV-004',
    name: 'Leather Loafer',
    urlKey: 'leather-loafer',
    price: { regular: 240, final: 240, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-04.jpg', label: 'Leather Loafer' },
      { url: '/drafts/images/product-04b.jpg', label: 'Leather Loafer alt' },
    ],
    attributes: [{ name: 'color', value: 'Espresso' }],
    badge: 'New',
    inStock: true,
  },
  {
    sku: 'MV-005',
    name: 'Cashmere Crewneck',
    urlKey: 'cashmere-crewneck',
    price: { regular: 195, final: 195, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-05.jpg', label: 'Cashmere Crewneck' },
      { url: '/drafts/images/product-05b.jpg', label: 'Cashmere Crewneck alt' },
    ],
    attributes: [{ name: 'color', value: 'Oat' }],
    badge: null,
    inStock: true,
  },
  {
    sku: 'MV-006',
    name: 'Cotton Poplin Shirt',
    urlKey: 'cotton-poplin-shirt',
    price: { regular: 145, final: 145, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-06.jpg', label: 'Cotton Poplin Shirt' },
      { url: '/drafts/images/product-06b.jpg', label: 'Cotton Poplin Shirt alt' },
    ],
    attributes: [{ name: 'color', value: 'Ivory' }],
    badge: null,
    inStock: true,
  },
  {
    sku: 'MV-007',
    name: 'Tailored Blazer',
    urlKey: 'tailored-blazer',
    price: { regular: 380, final: 380, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-07.jpg', label: 'Tailored Blazer' },
      { url: '/drafts/images/product-07b.jpg', label: 'Tailored Blazer alt' },
    ],
    attributes: [{ name: 'color', value: 'Navy' }],
    badge: 'New',
    inStock: true,
  },
  {
    sku: 'MV-008',
    name: 'Wide-leg Denim',
    urlKey: 'wide-leg-denim',
    price: { regular: 165, final: 165, currency: 'USD' },
    images: [
      { url: '/drafts/images/product-08.jpg', label: 'Wide-leg Denim' },
      { url: '/drafts/images/product-08b.jpg', label: 'Wide-leg Denim alt' },
    ],
    attributes: [{ name: 'color', value: 'Indigo' }],
    badge: null,
    inStock: true,
  },
];

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format(price.final);
}

/**
 * Mock Commerce API — simulates @dropins/storefront-product-discovery search()
 * Replace this with real drop-in initialization when connecting to Adobe Commerce.
 */
export async function searchProducts({
  pageSize = 8,
  currentPage = 1,
  categoryPath = '',
} = {}) {
  let filtered = [...MOCK_PRODUCTS];
  if (categoryPath) {
    filtered = filtered.filter((p) => p.urlKey.includes(categoryPath));
  }
  const start = (currentPage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return {
    items,
    totalCount: filtered.length,
    pageInfo: { currentPage, pageSize, totalPages: Math.ceil(filtered.length / pageSize) },
  };
}

export function getProductLink(urlKey, sku) {
  return `/products/${urlKey}/${sku}`;
}

export function renderProductCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = getProductLink(product.urlKey, product.sku);

  const media = document.createElement('div');
  media.className = 'product-card-media';

  product.images.forEach((img, i) => {
    const picture = document.createElement('picture');
    const imgEl = document.createElement('img');
    imgEl.src = img.url;
    imgEl.alt = i === 0 ? product.name : '';
    imgEl.loading = 'lazy';
    imgEl.width = 800;
    imgEl.height = 1000;
    picture.append(imgEl);
    if (i > 0) picture.classList.add('product-card-alt');
    media.append(picture);
  });

  if (product.badge) {
    const badge = document.createElement('span');
    badge.className = 'product-card-badge';
    badge.textContent = product.badge;
    media.append(badge);
  }

  const addBtn = document.createElement('button');
  addBtn.className = 'product-card-add';
  addBtn.textContent = 'Add to bag';
  addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addBtn.textContent = 'Added ✓';
    addBtn.classList.add('added');
    setTimeout(() => {
      addBtn.textContent = 'Add to bag';
      addBtn.classList.remove('added');
    }, 1200);
  });
  media.append(addBtn);

  const body = document.createElement('div');
  body.className = 'product-card-body';

  const name = document.createElement('h3');
  name.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'product-card-price';
  price.textContent = formatPrice(product.price);

  body.append(name);
  body.append(price);

  const colorAttr = product.attributes.find((a) => a.name === 'color');
  if (colorAttr) {
    const color = document.createElement('p');
    color.className = 'product-card-color';
    color.textContent = colorAttr.value;
    body.append(color);
  }

  card.append(media);
  card.append(body);
  return card;
}
