import ProductCard from './ProductCard';
import Reveal from './Reveal';

function ProductRail({ title, subtitle, products, eyebrow = 'Curated rail' }) {
  if (!products?.length) return null;

  return (
    <section className="editorial-rail">
      <Reveal className="editorial-rail__header" as="div">
        <div>
          <p className="eyebrow mb-2">{eyebrow}</p>
          <h2 className="section-title mb-0">{title}</h2>
        </div>
        {subtitle && <p className="section-subtitle editorial-rail__copy mb-0">{subtitle}</p>}
      </Reveal>

      <div className="product-rail product-rail--editorial">
        {products.map((product, index) => (
          <Reveal className="product-rail__item" key={product.id} delay={index * 70}>
            <ProductCard product={product} compact />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default ProductRail;
