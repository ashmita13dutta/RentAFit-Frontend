import catalogProducts from '../data/products.generated.json';
import { resolveAssetPath } from '../utils/assetPaths';

const LENDER_STORAGE_KEY = 'rentafit-lender-listings';

const GENDER_FILTER_COMPATIBILITY = {
  Women: new Set(['Women', 'Unisex']),
  Men: new Set(['Men', 'Unisex']),
  Unisex: new Set(['Unisex']),
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function readStoredListings() {
  const raw = localStorage.getItem(LENDER_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildImageToken(product, imageUrl, index = 0) {
  return {
    id: `${product.id}-img-${index + 1}`,
    label: `${product.brand} ${product.category}`,
    imageUrl,
    alt: `${product.name} image ${index + 1}`,
    palette: product.colorTheme || ['#7B1E2B', '#F5E9DC'],
  };
}

function enrichProduct(product, index = 0) {
  const imageUrls = Array.isArray(product.imageUrls) && product.imageUrls.length > 0
    ? product.imageUrls
    : (product.mainImageUrl ? [product.mainImageUrl] : []);
  const resolvedImageUrls = imageUrls.map((url) => resolveAssetPath(url));
  const resolvedMainImageUrl = resolveAssetPath(product.mainImageUrl || resolvedImageUrls[0] || '');

  const price = Number(product.price ?? product.providerPrice ?? 0);
  const originalPrice = Number(product.originalPrice ?? 0);

  return {
    ...product,
    price,
    providerPrice: Number(product.providerPrice ?? price),
    originalPrice,
    availableSizes: Array.isArray(product.availableSizes) && product.availableSizes.length > 0
      ? product.availableSizes
      : [product.size].filter(Boolean),
    styleTags: product.styleTags || [],
    occasionTags: product.occasionTags || [],
    searchKeywords: product.searchKeywords || [],
    imageUrls: resolvedImageUrls,
    mainImageUrl: resolvedMainImageUrl,
    imageTokens: resolvedImageUrls.map((url, imageIndex) => buildImageToken(product, url, imageIndex)),
    recentlyAddedLabel: product.recent ? 'Just added' : 'Curated pick',
    uploader: product.source === 'lender' ? 'Community lender' : 'Curated catalog',
    createdAt: product.createdAt || `2026-03-${String((index % 18) + 1).padStart(2, '0')}`,
    rating: Number(product.rating ?? 4.4),
    badge: product.badge || (product.featured ? 'Featured' : product.trending ? 'Trending' : ''),
  };
}

const BASE_CATALOG = catalogProducts.map((product, index) => enrichProduct({ ...product, source: 'catalog' }, index));

export function getBaseCatalog() {
  return BASE_CATALOG;
}

export function getStoredLenderListings() {
  return readStoredListings().map((item, index) => enrichProduct({ ...item, source: 'lender' }, index + 1000));
}

export function saveLenderListing(listing) {
  const existing = getStoredLenderListings().map(({ imageTokens, uploader, recentlyAddedLabel, ...rest }) => rest);
  const next = [listing, ...existing];
  localStorage.setItem(LENDER_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('rentafit:listings-updated'));
}

export function getAllProducts() {
  return [...getStoredLenderListings(), ...getBaseCatalog()];
}

export function getProductById(productId) {
  return getAllProducts().find((product) => product.id === productId) || null;
}

export function getTrendingProducts(limit = 6) {
  return getAllProducts().filter((product) => product.trending).slice(0, limit);
}

export function getRecentProducts(limit = 8) {
  return [...getAllProducts()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
}

export function getFeaturedProducts(limit = 6) {
  return getAllProducts().filter((product) => product.featured).slice(0, limit);
}

export function searchProducts(query) {
  const term = String(query || '').trim().toLowerCase();
  if (!term) return [];
  return getAllProducts().filter((product) => {
    return [
      product.name,
      product.brand,
      product.category,
      product.gender,
      product.material,
      product.styleTag,
      ...(product.searchKeywords || []),
      ...(product.occasionTags || []),
      ...(product.styleTags || []),
    ].join(' ').toLowerCase().includes(term);
  });
}

export function getRecommendedProducts({ seedProduct, limit = 6, excludeId = null }) {
  if (!seedProduct) return getFeaturedProducts(limit);
  const products = getAllProducts().filter((product) => product.id !== (excludeId || seedProduct.id));
  const scored = products.map((product) => {
    let score = 0;
    if (product.category === seedProduct.category) score += 5;
    if (product.gender === seedProduct.gender) score += 4;
    if (product.gender === 'Unisex' || seedProduct.gender === 'Unisex') score += 2;
    if (product.material === seedProduct.material) score += 3;
    if (product.size === seedProduct.size) score += 2;
    if (product.brand === seedProduct.brand) score += 1.2;
    score += Math.max(0, 2 - Math.abs(product.price - seedProduct.price) / Math.max(seedProduct.price, 1));
    score += product.trending ? 0.8 : 0;
    score += product.recent ? 0.4 : 0;
    return { product, score };
  }).sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.product);
}

export function getProductsByFilters({ gender = 'All', category = 'All', search = '', priceBand = 'All', sort = 'featured' }) {
  let items = getAllProducts();

  if (gender !== 'All') {
    const allowedGenders = GENDER_FILTER_COMPATIBILITY[gender] || new Set([gender]);
    items = items.filter((product) => allowedGenders.has(product.gender));
  }

  if (category !== 'All') {
    items = items.filter((product) => product.category === category);
  }

  if (search) {
    const term = search.toLowerCase();
    items = items.filter((product) => {
      return [product.name, product.brand, product.category, ...(product.searchKeywords || [])].join(' ').toLowerCase().includes(term);
    });
  }

  if (priceBand !== 'All') {
    const [min, max] = priceBand.split('-').map(Number);
    items = items.filter((product) => product.price >= min && product.price <= max);
  }

  const sorted = [...items];
  if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price);
  if (sort === 'recent') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sort === 'trending') sorted.sort((a, b) => Number(b.trending) - Number(a.trending) || b.rating - a.rating);
  if (sort === 'featured') sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);

  return sorted;
}

export const MOCK_FAQ = [
  {
    question: 'What rental duration options are available right now?',
    answer: 'Rentals start at 3 days. You can increase the rental period from the bag before placing your request.',
  },
  {
    question: 'How is the rental total calculated?',
    answer: 'Each order includes the listed rental price plus a base duration charge of Rs. 300 for the first 3 days. Every extra day adds Rs. 100, and the total updates as you adjust the rental period.',
  },
  {
    question: 'Can I change rental duration after adding an item to cart?',
    answer: 'Yes. The cart lets you increase or decrease the rental duration for each item, and the pricing summary recalculates immediately so you can review the updated cost before checkout.',
  },
  {
    question: 'Do I need an account to browse the catalog?',
    answer: 'No. You can browse the catalog, use search, and add pieces to your bag without logging in. An account is only needed for orders and lender tools.',
  },
  {
    question: 'Where can I track my current and past rentals?',
    answer: 'After logging in, you can open the Orders page from the profile menu. It groups current and past orders and shows status details such as placed, confirmed, delivered, active rental, and returned states.',
  },
  {
    question: 'How do search, trending, and recommendations work?',
    answer: 'Search helps you find pieces by name, brand, or category. The homepage highlights popular and newly added styles, while product and bag pages suggest related pieces.',
  },
  {
    question: 'Can I become a lender and upload my own clothing?',
    answer: 'Yes. You can sign up as a lender or unlock lender access later, then upload a piece, review the suggested range, and save it to your dashboard.',
  },
  {
    question: 'What happens after I submit a lender listing?',
    answer: 'Your listing appears in the lender dashboard, where you can check its status and follow any incoming requests.',
  },
  {
    question: 'How do I know an outfit is safe to rent?',
    answer: 'Each listing includes clear condition details, prepared-for-rental notes, and return information so you can book with confidence.',
  },
  {
    question: 'Is virtual try-on available now?',
    answer: 'Yes. A try-on preview entry point is available from supported product cards and product detail pages so users can explore the styling experience directly from shopping flows.',
  },
  {
    question: 'What happens if an item is returned late or comes back damaged?',
    answer: 'Additional charges may apply for late returns or damage. Return details are shown clearly during the shopping journey.',
  },
  {
    question: 'Will my cart and account data stay saved on this device?',
    answer: 'Your bag and account stay saved in the browser on the same device, so you can return to them later.',
  },
];

const MOCK_USER_ORDERS = [
  {
    id: 'ord-1001',
    productId: 'L0012',
    productName: 'Rose Dress',
    status: 'OUT_FOR_DELIVERY',
    durationLabel: '4 Days',
    rentalWindow: '02 Apr - 06 Apr',
    size: 'S',
    total: 2664,
    timeline: [
      { label: 'Placed', note: 'Order created successfully.', complete: true },
      { label: 'Confirmed', note: 'Rental request confirmed.', complete: true },
      { label: 'Out for delivery', note: 'Delivery partner is on the way.', complete: true },
      { label: 'Active rental', note: 'Starts once the outfit is delivered.', complete: false },
    ],
  },
  {
    id: 'ord-1002',
    productId: 'L0001',
    productName: 'Black Shirt',
    status: 'ACTIVE_RENTAL',
    durationLabel: '1 Week',
    rentalWindow: '10 Apr - 17 Apr',
    size: 'XL',
    total: 5194,
    timeline: [
      { label: 'Placed', note: 'Order created successfully.', complete: true },
      { label: 'Confirmed', note: 'Rental request confirmed.', complete: true },
      { label: 'Delivered', note: 'Outfit delivered to renter address.', complete: true },
      { label: 'Active rental', note: 'Rental is currently live.', complete: true },
    ],
  },
  {
    id: 'ord-1003',
    productId: 'L0016',
    productName: 'White Shirt',
    status: 'RETURNED',
    durationLabel: '4 Days',
    rentalWindow: '18 Mar - 22 Mar',
    size: 'M',
    total: 220,
    timeline: [],
  },
  {
    id: 'ord-1004',
    productId: 'L0024',
    productName: 'Ivory Lehenga',
    status: 'COMPLETED',
    durationLabel: '1 Week',
    rentalWindow: '01 Mar - 08 Mar',
    size: 'L',
    total: 3200,
    timeline: [],
  },
];

export function getUserOrders() {
  return MOCK_USER_ORDERS.map((order) => ({ ...order, product: getProductById(order.productId) }));
}

export function getLenderOrderRequests(listings = getStoredLenderListings()) {
  const source = listings.filter((listing) => ['ACTIVE', 'PENDING_REVIEW', 'REAPPROVAL_REQUIRED'].includes(listing.status)).slice(0, 4);
  return source.map((listing, index) => ({
    id: `req-${index + 1}`,
    listingId: listing.id,
    productName: listing.name,
    customerName: ['Rhea Sen', 'Kabir Arora', 'Megha Shah', 'Arjun Dey'][index % 4],
    durationLabel: ['4 Days', '1 Week', '2 Weeks', '4 Days'][index % 4],
    size: listing.availableSizes?.[0] || listing.size,
    value: listing.price,
    status: index % 2 === 0 ? 'Awaiting confirmation' : 'Reply today',
  }));
}
