import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import Reveal from '../../components/Reveal';

const businessPillars = [
  {
    number: '01',
    title: 'Dress for the moment',
    copy: 'Borrow standout pieces for weddings, evenings, travel, and celebrations without buying for one occasion.',
  },
  {
    number: '02',
    title: 'Keep every booking clear',
    copy: 'Sizing, condition, delivery, and returns should feel easy to understand before you place a request.',
  },
  {
    number: '03',
    title: 'Make lending simple',
    copy: 'Uploading, pricing, and managing listings should feel as polished as the storefront.',
  },
];

const operatingNotes = [
  {
    label: 'Curated pricing',
    copy: 'Each listing sits in a considered rental range so the wardrobe stays balanced.',
  },
  {
    label: 'Quality review',
    copy: 'Every piece is checked before it appears in the wardrobe.',
  },
  {
    label: 'Smart recommendations',
    copy: 'Related pieces help you keep browsing without starting over.',
  },
  {
    label: 'Try-on preview',
    copy: 'Selected pieces can be previewed before you decide.',
  },
];

const principles = [
  {
    title: 'Fashion first',
    copy: 'The site should always feel like a fashion product, not a utility tool.',
  },
  {
    title: 'Wear more, own less',
    copy: 'The wardrobe works best when beautiful pieces can be worn again and again.',
  },
  {
    title: 'Clear from first click',
    copy: 'From browsing to returns, every step should feel direct and easy to follow.',
  },
];

const quotes = [
  {
    quote: 'It feels like one clear wardrobe instead of a stack of separate screens.',
    by: 'Rhea Sen · Renter',
  },
  {
    quote: 'The lender side feels like the same brand world, not a different product.',
    by: 'Kabir Arora · Lender',
  },
  {
    quote: 'The details are easy to trust, and the whole experience feels more polished.',
    by: 'Megha Shah · Repeat renter',
  },
];

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell about-page">
      <AppNavbar />

      <main>
        <section className="container-xxl px-3 px-lg-4 py-4 py-lg-5">
          <Reveal className="section-shell about-hero" as="div" offset={24}>
            <div className="about-hero__intro">
              <p className="eyebrow mb-2">About Rent a Fit</p>
              <h1 className="section-title mb-3 about-hero__title">A wardrobe system for access, trust, and repeat use.</h1>
              <p className="section-subtitle mb-0 about-hero__copy">
                Rent a Fit makes occasion dressing easier by turning standout pieces into a wardrobe you can return to.
              </p>

              <div className="about-hero__actions mt-4">
                <button type="button" className="btn btn-primary px-4" onClick={() => navigate('/products')}>
                  Browse the catalog
                </button>
                <button type="button" className="btn btn-outline-primary px-4" onClick={() => navigate('/lender')}>
                  Open lender space
                </button>
              </div>
            </div>

            <div className="about-hero__quote-wrap">
              <div className="about-hero__quote">
                <p className="eyebrow mb-2">The idea in one line</p>
                <p className="about-hero__quote-text mb-0">Make premium dressing feel lighter through access, clarity, and repeat wear.</p>
              </div>
              <div className="about-hero__mini-grid">
                <div className="about-mini-card">
                  <span>For renters</span>
                  <strong>Browse standout pieces, book with clarity, and wear more often.</strong>
                </div>
                <div className="about-mini-card">
                  <span>For lenders</span>
                  <strong>List pieces beautifully, set prices with confidence, and manage requests in one place.</strong>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-2 py-lg-3">
          <Reveal className="section-heading section-heading--stacked" as="div" offset={22}>
            <p className="eyebrow mb-0">What the business is built around</p>
            <h2 className="section-title mb-0">Three ideas shape the whole wardrobe.</h2>
            <p className="section-subtitle mb-0">
              The wardrobe works best when access feels effortless, details feel clear, and listing pieces feels as considered as renting them.
            </p>
          </Reveal>

          <div className="about-rhythm">
            <div className="about-rhythm__line" aria-hidden="true" />
            {businessPillars.map((pillar, index) => (
              <Reveal className="about-rhythm__step" key={pillar.title} delay={index * 110} offset={18}>
                <span className="about-rhythm__number">{pillar.number}</span>
                <div className="about-rhythm__card">
                  <h3 className="detail-title mb-2">{pillar.title}</h3>
                  <p className="mb-0">{pillar.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-4">
          <Reveal className="section-heading section-heading--stacked" as="div" offset={22}>
            <p className="eyebrow mb-0">How the wardrobe works</p>
            <h2 className="section-title mb-0">Every part of the experience is designed to feel clear from the start.</h2>
            <p className="section-subtitle mb-0">
              Pricing, product review, recommendations, and try-on moments all work together to keep browsing simple.
            </p>
          </Reveal>

          <div className="about-operating-grid">
            {operatingNotes.map((note, index) => (
              <Reveal className="about-operating-card" key={note.label} delay={index * 85} offset={16}>
                <p className="eyebrow mb-2">{note.label}</p>
                <p className="mb-0">{note.copy}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-2">
          <Reveal className="about-inline-quotes__intro" as="div" offset={18}>
            <p className="eyebrow mb-0">What people should feel</p>
            <h2 className="section-title mb-0">Calm, clarity, and confidence should come through without the interface trying too hard.</h2>
          </Reveal>

          <div className="about-inline-quotes">
            {quotes.map((item, index) => (
              <Reveal className="about-inline-quotes__card" key={item.by} delay={index * 90} offset={18}>
                <blockquote>{item.quote}</blockquote>
                <cite>{item.by}</cite>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-2 pb-5">
          <Reveal className="about-manifest" as="div" offset={24}>
            <div className="about-manifest__copy">
              <p className="eyebrow mb-2">What should stay true</p>
              <h2 className="section-title mb-3">Rent a Fit should feel like a fashion product first, with the practical details handled quietly in the background.</h2>
            </div>

            <div className="about-principles-grid">
              {principles.map((principle, index) => (
                <Reveal className="experience-step about-principle" key={principle.title} delay={index * 90} offset={16}>
                  <h3 className="experience-step__title">{principle.title}</h3>
                  <p className="experience-step__copy mb-0">{principle.copy}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default AboutPage;
