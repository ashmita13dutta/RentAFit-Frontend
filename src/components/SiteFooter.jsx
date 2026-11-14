import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'All products', path: '/products' },
      { label: 'Shirts', path: '/products?category=Shirt' },
      { label: 'Jackets', path: '/products?category=Jacket' },
      { label: 'Sarees', path: '/products?category=Saree' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'About', path: '/about' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Orders', path: '/orders' },
      { label: 'Cart', path: '/cart' },
      { label: 'Lender space', path: '/lender/dashboard' },
    ],
  },
];

function SiteFooter() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (event) => {
    event.preventDefault();
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__backdrop" aria-hidden="true">Rent a Fit</div>
      <div className="container-xxl px-3 px-lg-4 py-5 py-lg-6 position-relative">
        <Reveal className="site-footer__shell" as="div">
          <div className="site-footer__top">
            <div className="site-footer__intro">
              <p className="eyebrow site-footer__eyebrow mb-3">Luxury rental wardrobe</p>
              <p className="site-footer__brand mb-3">Rent a Fit</p>
              <p className="site-footer__copy mb-0">
                Browse standout pieces, rent with confidence, and return them with ease.
              </p>
            </div>

            <form className="site-footer__newsletter" onSubmit={handleNewsletter}>
              <label className="site-footer__newsletter-label" htmlFor="footer-newsletter">Newsletter</label>
              <div className="site-footer__newsletter-row">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="site-footer__input"
                />
                <button type="submit" className="btn btn-light rounded-pill px-4">Join</button>
              </div>
            </form>
          </div>

          <div className="site-footer__grid">
            {footerGroups.map((group) => (
              <div key={group.title} className="site-footer__group">
                <p className="site-footer__heading">{group.title}</p>
                <div className="site-footer__links">
                  {group.links.map((link) => (
                    <Link key={link.label} to={link.path} className="site-footer__link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="site-footer__group site-footer__group--meta">
              <p className="site-footer__heading">Why Rent a Fit</p>
              <p className="site-footer__meta-copy mb-0">
                Curated pricing, careful checks, simple returns, and a wardrobe built for repeat wear.
              </p>
            </div>
          </div>

          <div className="site-footer__bottom">
            <span>Borrow with intent. Return with ease.</span>
            <div className="site-footer__bottom-links">
              <Link to="/about">About</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

export default SiteFooter;
