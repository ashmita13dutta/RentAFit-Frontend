import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import EditorialBanner from "../components/EditorialBanner";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import TestimonialCard from "../components/TestimonialCard";
import {
  getFeaturedProducts,
  getRecentProducts,
  getTrendingProducts,
} from "../services/mockData";
import { resolveAssetPath } from "../utils/assetPaths";

const heroMoments = [
  {
    label: "Women",
    eyebrow: "Editorial occasionwear",
    title: "Borrow the piece that changes the room.",
    copy: "Statement dresses, polished tailoring, and high-impact occasionwear curated for nights that should feel considered from the first glance.",
    image: resolveAssetPath("/hero_banners/women_banner.jpg"),
    path: "/products?gender=Women",
    position: "84% center",
    textSide: "left",
  },
  {
    label: "Men",
    eyebrow: "Tailored wardrobe",
    title: "Rent sharper layers without owning the closet.",
    copy: "Structured jackets, event-ready shirts, and elevated essentials designed for polished entrances and lighter wardrobes.",
    image: resolveAssetPath("/hero_banners/men_banner.jpg"),
    path: "/products?gender=Men",
    position: "20% 42%",
    textSide: "right",
  },
  {
    label: "Unisex",
    eyebrow: "Shared wardrobe",
    title: "Pieces that move across plans, moods, and styling choices.",
    copy: "Flexible silhouettes and repeat-ready essentials for nights out, travel, and everyday plans.",
    image: resolveAssetPath("/hero_banners/unisex_banner.jpg"),
    path: "/products?gender=Unisex",
    position: "78% 38%",
    textSide: "left",
  },
];

const testimonials = [
  {
    quote:
      "The browsing finally feels paced like a fashion brand instead of a grid trying to sell me everything at once.",
    name: "Rhea Sen",
    role: "Renter · Occasion edit",
    accent: "light",
  },
  {
    quote:
      "The lender side feels premium now. I can upload confidently without feeling like I entered a generic admin panel.",
    name: "Kabir Arora",
    role: "Lender · Tailored wardrobe",
    accent: "dark",
  },
  {
    quote:
      "Product detail, cart, and order touchpoints now feel like one continuous brand system rather than separate screens.",
    name: "Megha Shah",
    role: "Renter · Repeat bookings",
    accent: "light",
  },
  {
    quote:
      "The pacing makes it easy to trust what you are renting, and the whole wardrobe feels easier to use.",
    name: "Aarav Mehta",
    role: "Member · Shared wardrobe",
    accent: "light",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const featuredProducts = useMemo(() => getFeaturedProducts(8), []);
  const popularProducts = useMemo(() => getTrendingProducts(8), []);
  const newProducts = useMemo(() => getRecentProducts(8), []);
  const communityImages = useMemo(
    () => [...featuredProducts, ...newProducts].slice(0, 6),
    [featuredProducts, newProducts],
  );
  const communityRailItems = useMemo(
    () => [...communityImages, ...communityImages],
    [communityImages],
  );

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("featured");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroMoments.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const activeHero = heroMoments[activeHeroIndex];
  const railTabs = {
    featured: featuredProducts,
    popular: popularProducts,
    new: newProducts,
  };

  return (
    <div className="page-shell luxury-home">
      <AppNavbar />

      <main>
        <section
          className="lux-hero"
          style={{
            "--hero-image": "url(" + activeHero.image + ")",
            "--hero-position": activeHero.position,
          }}
        >
          <div className="container-xxl px-0 lux-hero__container">
            <Reveal
              className={`lux-hero__stage ${activeHero.textSide === "right" ? "lux-hero__stage--reverse" : ""}`}
              offset={12}
            >
              <div className="lux-hero__caption">
                <p className="eyebrow lux-hero__eyebrow mb-3">
                  {activeHero.eyebrow}
                </p>
                <h1 className="lux-hero__title">
                  Borrow the look. Keep the <em>moment.</em>
                </h1>
                <p className="lux-hero__copy">
                  Rent standout fashion through an image-led wardrobe built for
                  weddings, evenings, travel, and everything in between.
                </p>
                <div className="lux-hero__actions">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4 px-lg-5"
                    onClick={() => navigate(activeHero.path)}
                  >
                    Shop {activeHero.label}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light rounded-pill px-4 px-lg-5"
                    onClick={() => navigate("/lender")}
                  >
                    Open lender space
                  </button>
                </div>
              </div>

              <div className="lux-hero__stage-footer">
                <div className="lux-hero__foot-copy">
                  <p className="lux-hero__collection mb-2">
                    {activeHero.label}
                  </p>
                  <h2 className="lux-hero__foot-title">{activeHero.title}</h2>
                  <p className="lux-hero__detail-copy mb-0">
                    {activeHero.copy}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="lux-section lux-section--surface">
          <div className="container-xxl px-3 px-lg-4">
            <Reveal className="lux-section__intro" as="div">
              <p className="eyebrow mb-2">Featured products</p>
              <div className="lux-section__heading-row">
                <h2 className="section-title mb-0">
                  A moving rail of the pieces shaping the current edit.
                </h2>
                <div
                  className="lux-tabs"
                  role="tablist"
                  aria-label="Curated rail tabs"
                >
                  {[
                    { key: "featured", label: "Featured" },
                    { key: "popular", label: "Popular" },
                    { key: "new", label: "New" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={
                        "lux-tabs__button" +
                        (activeTab === tab.key ? " is-active" : "")
                      }
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="product-rail product-rail--editorial product-rail--campaign">
              {railTabs[activeTab].map((product, index) => (
                <Reveal
                  className="product-rail__item"
                  key={product.id}
                  delay={index * 60}
                >
                  <ProductCard product={product} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="lux-section lux-section--dark">
          <div className="container-xxl px-3 px-lg-4">
            <EditorialBanner
              image={resolveAssetPath("/hero_banners/unisex_banner.jpg")}
              eyebrow="Editorial banner"
              title="Luxury rental should feel like a campaign, not a compromise."
              copy="Keep the product language slow, image-led, and high-clarity while the commerce logic runs quietly underneath."
              ctaLabel="Browse the full catalog"
              to="/products"
              align="left"
            />
          </div>
        </section>

        <section className="lux-section lux-section--light">
          <div className="container-xxl px-3 px-lg-4">
            <Reveal className="lux-section__intro" as="div">
              <p className="eyebrow mb-2">In motion</p>
              <div className="lux-section__heading-row">
                <h2 className="section-title mb-0">
                  A softer visual strip that keeps the wardrobe moving.
                </h2>
                <p className="section-subtitle mb-0">
                  A moving strip of current favorites, new arrivals, and pieces
                  worth a second look.
                </p>
              </div>
            </Reveal>

            <div
              className="community-strip-marquee"
              aria-label="In motion fashion rail"
            >
              <div className="community-strip community-strip--editorial community-strip--marquee">
                {communityRailItems.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="community-strip__item"
                    aria-hidden={index >= communityImages.length}
                  >
                    <button
                      type="button"
                      className="community-strip__media"
                      onClick={() => navigate("/products/" + product.id)}
                    >
                      <img
                        src={product.mainImageUrl}
                        alt={product.name}
                        loading="lazy"
                      />
                      <span
                        className="community-strip__shade"
                        aria-hidden="true"
                      />
                      <span className="community-strip__label">
                        {product.name}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="lux-section lux-section--surface lux-section--testimonials">
          <div className="container-xxl px-3 px-lg-4">
            <div className="testimonial-popups-stage">
              <Reveal
                className="testimonial-popups__intro"
                as="div"
                offset={18}
              >
                <p className="eyebrow mb-2">Testimonials</p>
                <h2 className="section-title mb-0">
                  A quieter layer of proof from both sides of the wardrobe.
                </h2>
                <p className="section-subtitle mb-0">
                  A few words from people using the wardrobe, without pulling
                  focus from the clothes.
                </p>
              </Reveal>

              <div
                className="testimonial-popups"
                aria-label="Customer testimonials"
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    className={`testimonial-popups__item testimonial-popups__item--${index + 1}`}
                    key={testimonial.name}
                  >
                    <TestimonialCard {...testimonial} delay={index * 80} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default LandingPage;
