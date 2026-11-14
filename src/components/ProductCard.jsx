import { Link } from 'react-router-dom';
import ProductVisual from './ProductVisual';
import { formatCurrency } from '../utils/formatters';

function ProductCardArrowIcon() {
  return (
    <svg className="product-card__cta-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5 11L11 5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 5H11V9.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductCard({ product, compact = false, featured = false, visualFit = 'cover' }) {
  const visualHeight = compact
    ? 'clamp(160px, 30vh, 240px)'
    : featured
      ? 'clamp(220px, 46vh, 373px)'
      : 'clamp(180px, 38vh, 313px)';

  return (
    <article className={`product-card ${compact ? 'product-card--compact' : ''} ${featured ? 'product-card--featured' : ''}`.trim()}>
      <Link to={`/products/${product.id}`} className="product-card__visual-link" aria-label={`Open ${product.name}`}>
        <ProductVisual token={product.imageTokens?.[0]} height={visualHeight} small={compact} fit={visualFit} />
      </Link>

      <div className="product-card__body">
        <div className="product-card__head">
          <p className="product-card__meta mb-0">{product.brand} · {product.category}</p>
          {product.badge && <span className="badge-soft">{product.badge}</span>}
        </div>

        <div className="product-card__copy">
          <h3 className="product-card__title mb-0">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="product-card__description mb-0">{product.shortDescription}</p>
        </div>

        <div className="product-card__footer">
          <div className="product-card__pricing">
            <div className="product-card__price">{formatCurrency(product.price)}</div>
            <div className="product-card__subtext">Size {product.size} · {product.gender}</div>
          </div>
          <Link to={`/products/${product.id}`} className="product-card__cta">
            <span>View piece</span>
            <ProductCardArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
