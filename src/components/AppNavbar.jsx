import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import { clearCurrentUser, getCartCount, getCurrentUser, hasLenderAccess } from "../services/store";

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 .98.8h8.84a1 1 0 0 0 .98-.8L21 7H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M20 20l-3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5.5 19c1.4-3 4-4.5 6.5-4.5s5.1 1.5 6.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function AccountMenu({ navigate, user, profileLabel, handleLogout, compact = false }) {
  return (
    <div className="dropdown">
      <button
        className={"icon-chip dropdown-toggle profile-chip" + (compact ? " icon-chip--compact profile-chip--compact" : "")}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Open account menu"
      >
        <ProfileIcon />
        {!compact && <span className="d-none d-md-inline">{profileLabel}</span>}
      </button>
      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm p-2">
        {user ? (
          <>
            <li><span className="dropdown-item-text fw-semibold">{user.name}</span></li>
            <li><button type="button" className="dropdown-item" onClick={() => navigate("/orders")}>Orders</button></li>
            <li><button type="button" className="dropdown-item" onClick={() => navigate("/cart")}>Cart</button></li>
            <li>
              <button type="button" className="dropdown-item" onClick={() => navigate("/lender/dashboard")}>
                {hasLenderAccess(user) ? "Lender dashboard" : "Become a lender"}
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><button type="button" className="dropdown-item" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><button type="button" className="dropdown-item" onClick={() => navigate("/login")}>Login</button></li>
            <li><button type="button" className="dropdown-item" onClick={() => navigate("/signup")}>Signup</button></li>
          </>
        )}
      </ul>
    </div>
  );
}

const desktopLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Rent" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(getCartCount());
  const [user, setUser] = useState(getCurrentUser());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setCartCount(getCartCount());
      setUser(getCurrentUser());
    };
    window.addEventListener("rentafit:cart-updated", refresh);
    window.addEventListener("rentafit:user-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("rentafit:cart-updated", refresh);
      window.removeEventListener("rentafit:user-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    const syncScroll = () => setIsScrolled(window.scrollY > 12);
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const profileLabel = useMemo(() => user?.name?.split(" ")[0] || "Account", [user]);
  const isHome = location.pathname === "/";

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/");
  };

  const handleLenderClick = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: "/lender/dashboard" } });
      return;
    }
    navigate("/lender/dashboard");
  };

  return (
    <>
      <nav className={"app-navbar sticky-top" + (isScrolled ? " app-navbar--scrolled" : "") + (isHome && !isScrolled ? " app-navbar--overlay" : "")} aria-label="Primary site navigation">
        <div className="container-xxl px-3 px-lg-4 app-navbar__shell">
          <div className="app-navbar__desktop">
            <ul className="app-navbar__desktop-nav" aria-label="Primary navigation">
              {desktopLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="app-nav-link app-nav-link--quiet">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <NavLink to="/" className="app-navbar__brand app-navbar__brand--center" aria-label="Go to homepage">
              <span className="brand-wordmark">Rent a Fit</span>
            </NavLink>

            <div className="app-navbar__desktop-actions" aria-label="Utility actions">
              <button type="button" className="icon-chip icon-chip--compact icon-chip--minimal" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="Open search">
                <SearchIcon />
              </button>

              <button type="button" className="icon-chip icon-chip--compact icon-chip--minimal position-relative" onClick={() => navigate("/cart")} aria-label="Go to cart">
                <CartIcon />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              <AccountMenu navigate={navigate} user={user} profileLabel={profileLabel} handleLogout={handleLogout} compact />

              <button type="button" className="btn btn-primary px-4 app-nav-cta app-nav-cta--compact" onClick={handleLenderClick}>
                Lender space
              </button>
            </div>
          </div>

          <div className="app-navbar__mobile-row">
            <button
              type="button"
              className={"app-navbar__toggler" + (isMobileMenuOpen ? " is-open" : "")}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="rentafit-mobile-menu"
            >
              <span className="app-navbar__toggler-line" />
              <span className="app-navbar__toggler-line" />
            </button>

            <NavLink to="/" className="app-navbar__brand app-navbar__brand--mobile" aria-label="Go to homepage">
              <span className="brand-wordmark">Rent a Fit</span>
            </NavLink>

            <div className="app-navbar__quick-actions">
              <button type="button" className="icon-chip icon-chip--compact" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="Open search">
                <SearchIcon />
              </button>

              <button type="button" className="icon-chip icon-chip--compact position-relative" onClick={() => navigate("/cart")} aria-label="Go to cart">
                <CartIcon />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              <AccountMenu navigate={navigate} user={user} profileLabel={profileLabel} handleLogout={handleLogout} compact />
            </div>
          </div>

          <div id="rentafit-mobile-menu" className={"app-navbar__mobile-menu" + (isMobileMenuOpen ? " is-open" : "")}>
            <ul className="app-navbar__mobile-nav" aria-label="Mobile navigation">
              {desktopLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="app-nav-link">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="app-navbar__mobile-panel">
              <button type="button" className="btn btn-primary app-nav-cta w-100" onClick={handleLenderClick}>
                Lender space
              </button>
            </div>
          </div>
        </div>
      </nav>
      <SearchModal />
    </>
  );
}

export default AppNavbar;
