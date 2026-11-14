import { Link } from "react-router-dom";
import Reveal from "./Reveal";

function CategoryCard({
  title,
  copy,
  image,
  to,
  eyebrow = "Curated category",
  delay = 0,
  position = "center",
}) {
  return (
    <Reveal as="article" className="category-card" delay={delay}>
      <Link
        to={to}
        className="category-card__link"
        style={{
          "--category-image": `url(${image})`,
          "--category-position": position,
        }}
      >
        <div className="category-card__overlay" />
        <div className="category-card__content">
          <p className="eyebrow category-card__eyebrow mb-2">{eyebrow}</p>
          <h3 className="category-card__title">{title}</h3>
          <p className="category-card__copy mb-0">{copy}</p>
        </div>
      </Link>
    </Reveal>
  );
}

export default CategoryCard;
