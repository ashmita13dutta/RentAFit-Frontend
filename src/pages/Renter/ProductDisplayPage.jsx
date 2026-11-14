import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import PageContentShell from "../../components/PageContentShell";
import ProductCard from "../../components/ProductCard";
import SiteFooter from "../../components/SiteFooter";
import {
  CATEGORY_OPTIONS,
  CATALOG_GENDER_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS,
  SORT_OPTIONS,
} from "../../data/itemOptions";
import { getProductsByFilters } from "../../services/mockData";

function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 12h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 17h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProductDisplayPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = {
    gender: searchParams.get("gender") || "All",
    category: searchParams.get("category") || "All",
    search: searchParams.get("search") || "",
    priceBand: searchParams.get("price") || "All",
    sort: searchParams.get("sort") || "featured",
  };

  const products = useMemo(
    () => getProductsByFilters(filters),
    [
      filters.gender,
      filters.category,
      filters.search,
      filters.priceBand,
      filters.sort,
    ],
  );

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  const contextText = filters.search
    ? `Search: "${filters.search}"`
    : "Browse by gender, category, and price to find the right piece faster.";

  return (
    <div className="page-shell page-shell--rent-atelier">
      <AppNavbar />
      <main className="rent-atelier-page">
        <PageContentShell as="section" className="rent-atelier">
          {mobileFiltersOpen && (
            <button
              type="button"
              className="rent-atelier__backdrop"
              aria-label="Close filters"
              onClick={() => setMobileFiltersOpen(false)}
            />
          )}

          <div className="rent-atelier__layout">
            <aside
              className={`rent-atelier__filters ${mobileFiltersOpen ? "is-open" : ""}`}
            >
              <div className="rent-atelier__filters-head">
                <div>
                  <p className="eyebrow mb-1">Filters</p>
                  <h2 className="rent-atelier__filters-title mb-0">
                    Refine the edit
                  </h2>
                </div>
                <div className="rent-atelier__filters-actions">
                  <button
                    type="button"
                    className="rent-atelier__clear"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="rent-atelier__close"
                    aria-label="Close filters"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6L18 18M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="rent-atelier__filter-stack">
                <label className="rent-atelier__field">
                  <span>Gender</span>
                  <select
                    className="form-select"
                    value={filters.gender === "Unisex" ? "All" : filters.gender}
                    onChange={(event) =>
                      updateFilter("gender", event.target.value)
                    }
                  >
                    <option value="All">All</option>
                    {CATALOG_GENDER_FILTER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rent-atelier__field">
                  <span>Category</span>
                  <select
                    className="form-select"
                    value={filters.category}
                    onChange={(event) =>
                      updateFilter("category", event.target.value)
                    }
                  >
                    <option value="All">All</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rent-atelier__field">
                  <span>Price range</span>
                  <select
                    className="form-select"
                    value={filters.priceBand}
                    onChange={(event) =>
                      updateFilter("price", event.target.value)
                    }
                  >
                    {PRICE_FILTER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rent-atelier__field">
                  <span>Sort</span>
                  <select
                    className="form-select"
                    value={filters.sort}
                    onChange={(event) =>
                      updateFilter("sort", event.target.value)
                    }
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rent-atelier__filter-summary">
                <span>{products.length} items found</span>
              </div>
            </aside>

            <section className="rent-atelier__content">
              <header className="rent-atelier__header">
                <div className="rent-atelier__header-copy">
                  <p className="eyebrow mb-2 d-none d-lg-block">Products</p>
                  <h1 className="rent-atelier__title">
                    Browse the current rental edit
                  </h1>
                  <p className="rent-atelier__copy mb-0">{contextText}</p>
                </div>
              </header>

              <div className="rent-atelier__toolbar d-lg-none">
                <p className="eyebrow mb-0">Products</p>
                <div className="rent-atelier__toolbar-actions">
                  <span className="rent-atelier__count">
                    {products.length} items
                  </span>
                  <button
                    type="button"
                    className="rent-atelier__toggle"
                    aria-label="Open filters"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <FilterIcon />
                  </button>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="rent-atelier__grid">
                  {products.map((product, index) => {
                    const isFeature = index % 6 === 0 || index % 6 === 5;
                    return (
                      <div
                        key={product.id}
                        className={`rent-atelier__grid-item ${isFeature ? "rent-atelier__grid-item--feature" : ""}`}
                      >
                        <ProductCard
                          product={product}
                          compact={!isFeature}
                          featured={isFeature}
                          visualFit="contain"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-view mt-2">
                  <h3 className="mb-2">No products match these filters.</h3>
                  <p className="text-muted mb-0">
                    Clear the filters to return to the full catalog.
                  </p>
                </div>
              )}
            </section>
          </div>
        </PageContentShell>
      </main>
      ̇ <SiteFooter />
    </div>
  );
}

export default ProductDisplayPage;
