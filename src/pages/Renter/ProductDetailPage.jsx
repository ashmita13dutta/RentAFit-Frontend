import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import EditorialProductTile from '../../components/EditorialProductTile';
import FashionImageFrame from '../../components/FashionImageFrame';
import PageContentShell from '../../components/PageContentShell';
import Reveal from '../../components/Reveal';
import SiteFooter from '../../components/SiteFooter';
import TryOnModal from '../../components/TryOnModal';
import { addToCart } from '../../services/store';
import { getProductById, getRecommendedProducts } from '../../services/mockData';
import { formatCurrency } from '../../utils/formatters';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => getProductById(productId), [productId]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.availableSizes?.[0] || product?.size || '');

  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return getRecommendedProducts({
      seedProduct: product,
      limit: 4,
      excludeId: product.id,
    });
  }, [product]);

  if (!product) {
    return (
      <div className="page-shell page-shell--pdp-canvas">
        <AppNavbar />
        <main className="pdp-canvas-page">
          <PageContentShell>
            <div className="empty-view">
              <h2 className="mb-2">Product not found.</h2>
              <button type="button" className="btn btn-primary" onClick={() => navigate('/products')}>
                Back to catalog
              </button>
            </div>
          </PageContentShell>
        </main>
      </div>
    );
  }

  const activeToken = product.imageTokens?.[selectedImage] || product.imageTokens?.[0] || null;

  const handleAddToCart = () => {
    addToCart(product, {
      size: selectedSize || product.size,
      durationKey: '4-days',
      quantity,
    });
  };

  const incrementQuantity = () => setQuantity((current) => current + 1);
  const decrementQuantity = () => setQuantity((current) => Math.max(1, current - 1));

  return (
    <div className="page-shell page-shell--pdp-canvas">
      <AppNavbar />

      <main className="pdp-canvas-page">
        <PageContentShell as="section" className="pdp-canvas">
          <div className="pdp-canvas__layout">
            <Reveal className="pdp-canvas__gallery" offset={18}>
              <div className="pdp-canvas__gallery-inner">
                <div className="pdp-canvas__primary">
                  <FashionImageFrame token={activeToken} fit="contain" priority className="pdp-canvas__primary-frame" />
                </div>

                {product.imageTokens?.length > 1 && (
                  <div className="pdp-canvas__thumbs">
                    {product.imageTokens.map((token, index) => (
                      <button
                        type="button"
                        key={token.id}
                        className={`pdp-canvas__thumb ${selectedImage === index ? 'is-active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                        aria-label={`View ${product.name} image ${index + 1}`}
                      >
                        <FashionImageFrame token={token} fit="contain" className="pdp-canvas__thumb-frame" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal className="pdp-canvas__panel" offset={24} delay={60}>
              <div className="pdp-canvas__intro">
                <p className="eyebrow mb-2">{product.brand} · {product.category}</p>
                <h1 className="pdp-canvas__title">{product.name}</h1>
                <p className="pdp-canvas__copy mb-0">{product.description}</p>
              </div>

              <div className="pdp-canvas__price-row">
                <div>
                  <div className="pdp-canvas__price">{formatCurrency(product.price)}</div>
                  <div className="pdp-canvas__price-note">Original retail {formatCurrency(product.originalPrice)}</div>
                </div>
                {product.badge && <span className="badge-soft">{product.badge}</span>}
              </div>

              <div className="pdp-canvas__meta-grid">
                <div className="pdp-canvas__meta-card"><span>Gender</span><strong>{product.gender}</strong></div>
                <div className="pdp-canvas__meta-card"><span>Material</span><strong>{product.material}</strong></div>
                <div className="pdp-canvas__meta-card"><span>Condition</span><strong>{product.condition}</strong></div>
                <div className="pdp-canvas__meta-card"><span>Style</span><strong>{product.styleTag}</strong></div>
              </div>

              <div className="pdp-canvas__controls">
                <div className="pdp-canvas__control-block">
                  <span className="pdp-canvas__label">Rental size</span>
                  <div className="pdp-canvas__size-actions-row">
                    <div className="pdp-canvas__size-row">
                      {product.availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`size-pill ${selectedSize === size ? 'is-active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <div className="quantity-stepper quantity-stepper--detail" aria-label={`Rental duration for ${product.name}`}>
                      <button type="button" className="quantity-stepper__button" onClick={decrementQuantity} aria-label={`Decrease rental days for ${product.name}`}>
                        −
                      </button>
                      <span className="quantity-stepper__value">{quantity} Day{quantity === 1 ? '' : 's'}</span>
                      <button type="button" className="quantity-stepper__button" onClick={incrementQuantity} aria-label={`Increase rental days for ${product.name}`}>
                        +
                      </button>
                    </div>

                    <TryOnModal product={product} triggerClassName="pdp-canvas__action pdp-canvas__action--ghost pdp-canvas__action--end" />
                  </div>

                  <button type="button" className="btn pdp-canvas__action pdp-canvas__action--primary pdp-canvas__action--full" onClick={handleAddToCart}>
                    Add to cart
                  </button>
                </div>
              </div>

              <div className="pdp-canvas__trust">
                <h3 className="pdp-canvas__trust-title">Rental details</h3>
                <ul className="pdp-canvas__trust-list mb-0">
                  {product.trustNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </PageContentShell>

        <PageContentShell as="section" className="pdp-canvas__related-shell">
          <div className="pdp-canvas__related-head">
            <div>
              <p className="eyebrow mb-2">Recommended edit</p>
              <h2 className="pdp-canvas__related-title mb-0">More pieces in the same mood</h2>
            </div>
            <p className="pdp-canvas__related-copy mb-0">A few more pieces that work with the same look and feel.</p>
          </div>

          <div className="pdp-canvas__related-grid">
            {recommendedProducts.map((item) => (
              <EditorialProductTile key={item.id} product={item} compact className="pdp-canvas__related-tile" />
            ))}
          </div>
        </PageContentShell>
      </main>

      <div className="pdp-canvas__mobile-bar d-lg-none">
        <div>
          <span className="pdp-canvas__mobile-label">From</span>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <button type="button" className="btn pdp-canvas__mobile-action" onClick={handleAddToCart}>
          Add to cart
        </button>
      </div>

      <SiteFooter />
    </div>
  );
}

export default ProductDetailPage;
