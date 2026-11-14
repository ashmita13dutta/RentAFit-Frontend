import { Link } from 'react-router-dom';
import Reveal from './Reveal';

function EditorialBanner({ image, eyebrow, title, copy, ctaLabel, to, align = 'left' }) {
  return (
    <Reveal as="section" className={`editorial-banner editorial-banner--${align}`}>
      <div className="editorial-banner__media" style={{ '--editorial-image': `url(${image})` }}>
        <div className="editorial-banner__scrim" />
        <div className="editorial-banner__body">
          <p className="eyebrow editorial-banner__eyebrow mb-2">{eyebrow}</p>
          <h2 className="editorial-banner__title">{title}</h2>
          <p className="editorial-banner__copy">{copy}</p>
          <Link to={to} className="btn btn-light px-4 editorial-banner__cta">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export default EditorialBanner;
