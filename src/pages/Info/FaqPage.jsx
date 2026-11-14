import AppNavbar from '../../components/AppNavbar';
import Reveal from '../../components/Reveal';
import SiteFooter from '../../components/SiteFooter';
import { MOCK_FAQ } from '../../services/mockData';

function FaqPage() {
  return (
    <div className="page-shell faq-page">
      <AppNavbar />
      <main>
        <section className="container-xxl px-3 px-lg-4 py-4 py-lg-5">
          <Reveal className="faq-hero" as="div" offset={24}>
            <div>
              <p className="eyebrow mb-2">Help center</p>
              <h1 className="section-title mb-3">Clear answers for renting, returning, and listing.</h1>
              <p className="section-subtitle mb-0">
                Everything you need to know about rental days, returns, orders, and listing your own pieces.
              </p>
            </div>
            <div className="faq-hero__meta">
              <div className="faq-hero__pill">Renter support</div>
              <div className="faq-hero__pill">Lender guidance</div>
              <div className="faq-hero__pill">Returns and trust</div>
            </div>
          </Reveal>
        </section>

        <section className="container-xxl px-3 px-lg-4 pb-5">
          <Reveal className="faq-layout__intro" as="div" offset={18}>
            <p className="eyebrow mb-2">Popular questions</p>
            <h2 className="detail-title mb-3">Everything you need before you book.</h2>
            <p className="mb-0 text-muted">
              Find quick answers on fit, rental days, returns, delivery, and listing your own pieces.
            </p>
          </Reveal>

          <Reveal className="faq-layout__main faq-layout__main--full" as="div" offset={28}>
            <div className="accordion accordion-flush faq-accordion" id="faqAccordion">
              {MOCK_FAQ.map((item, index) => (
                <div className="accordion-item" key={item.question}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq-${index}`}
                      aria-expanded={index === 0 ? 'true' : 'false'}
                      aria-controls={`faq-${index}`}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div
                    id={`faq-${index}`}
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default FaqPage;
