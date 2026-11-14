import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { hasLenderAccess, loginUser } from '../../services/store';
import { resolveAssetPath } from '../../utils/assetPaths';

const highlights = [
  'Keep your bag, orders, and saved pieces in one place.',
  'Switch into lender tools when you want to list your own wardrobe.',
  'Pick up where you left off with one account.',
];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = loginUser(formData);

    if (!user) {
      setError('Account not found. Create an account to continue.');
      return;
    }

    const redirectTo = location.state?.redirectTo || (hasLenderAccess(user) ? '/lender/dashboard' : '/');
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="auth-page min-vh-100">
      <div className="container-xxl py-4 py-lg-5 px-3 px-lg-4">
        <div className="auth-stage">
          <section className="auth-stage__visual auth-stage__visual--shared">
            <img src={resolveAssetPath('/hero_banners/unisex_banner.jpg')} alt="Shared wardrobe editorial" className="auth-stage__image" />
            <div className="auth-stage__veil" aria-hidden="true" />
            <div className="auth-stage__orb auth-stage__orb--one" aria-hidden="true" />
            <div className="auth-stage__orb auth-stage__orb--two" aria-hidden="true" />

            <div className="auth-stage__content">
              <div>
                <Link to="/" className="brand-wordmark auth-stage__brand">Rent a Fit</Link>
                <p className="eyebrow auth-stage__kicker mb-2">Welcome back</p>
                <h1 className="section-title auth-stage__title mb-3">Return to your wardrobe in one login.</h1>
                <p className="auth-stage__copy mb-0">One account keeps your bag, orders, and listings together.</p>
              </div>

              <div className="auth-stage__notes">
                <div className="auth-stage__highlights">
                  {highlights.map((item) => (
                    <div className="auth-stage__highlight" key={item}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="auth-stage__panel">
            <div className="auth-stage__panel-head">
              <p className="eyebrow mb-2">Account access</p>
              <h2 className="section-title mb-2">Login</h2>
              <p className="text-muted mb-0">Use your email and password to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="d-grid gap-3 mt-4 auth-stage__form">
              <div className="lux-form-field">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control form-control-lg lux-input" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="lux-form-field">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control form-control-lg lux-input" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
              </div>
              {error && <div className="auth-stage__error" role="alert">{error}</div>}
              <button type="submit" className="btn btn-primary btn-lg auth-stage__submit mt-2">Login</button>
            </form>

            <div className="auth-stage__panel-footer mt-4">
              <p className="mb-0 text-muted">New here? <Link to="/signup">Create an account</Link></p>
              <Link to="/" className="auth-stage__text-link">Back to home</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
