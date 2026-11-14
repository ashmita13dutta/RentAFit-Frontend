import { Link } from 'react-router-dom';
import FashionImageFrame from './FashionImageFrame';
import { formatCurrency } from '../utils/formatters';

function EditorialProductTile({ product, feature = false, compact = false, className = '' }) {
  return (
    <article
      className={[
        'editorial-product-tile',
        feature ? 'editorial-product-tile--feature' : '',
        compact ? 'editorial-product-tile--compact' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <Link to={`/products/${product.id}`} className="editorial-product-tile__media-link" aria-label={`Open ${product.name}`}>
        <FashionImageFrame
          token={product.imageTokens?.[0]}
          fit="contain"
          className="editorial-product-tile__media"
        />
      </Link>

      <div className="editorial-product-tile__body">
        <div className="editorial-product-tile__head">
          <p className="editorial-product-tile__meta mb-0">{product.brand} · {product.category}</p>
          {product.badge && <span className="badge-soft">{product.badge}</span>}
        </div>

        <div className="editorial-product-tile__copy">
          <h3 className="editorial-product-tile__title mb-0">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          {!compact && <p className="editorial-product-tile__description mb-0">{product.shortDescription}</p>}
        </div>

        <div className="editorial-product-tile__footer">
          <div className="editorial-product-tile__pricing">
            <div className="editorial-product-tile__price">{formatCurrency(product.price)}</div>
            <div className="editorial-product-tile__subtext">Size {product.size} · {product.gender}</div>
          </div>

          <Link to={`/products/${product.id}`} className="editorial-product-tile__cta">
            <span>View piece</span>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5 11L11 5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6.5 5H11V9.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EditorialProductTile;
