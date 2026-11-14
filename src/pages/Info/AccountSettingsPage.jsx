import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import { clearCurrentUser, getCurrentUser, hasLenderAccess } from '../../services/store';

function AccountSettingsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/account/settings' }, replace: true });
    }
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container-xxl workspace-shell py-5 px-3 px-lg-4">
        <section className="workspace-header">
          <div>
            <p className="eyebrow mb-2">Account settings</p>
            <h1 className="section-title mb-2">Manage your profile</h1>
            <p className="text-muted mb-0">Review your current account details and jump back into lender space when you are ready.</p>
          </div>
        </section>

        <div className="row g-4">
          <div className="col-lg-8">
            <section className="workspace-card h-100">
              <div className="workspace-card__header workspace-card__header--stacked">
                <div>
                  <p className="eyebrow mb-1">Profile</p>
                  <h2 className="h4 mb-0">Saved account details</h2>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6"><div className="metric-card h-100"><span>Name</span><strong>{user.name}</strong></div></div>
                <div className="col-md-6"><div className="metric-card h-100"><span>Email</span><strong>{user.email}</strong></div></div>
                <div className="col-md-6"><div className="metric-card h-100"><span>Primary role</span><strong>{user.primaryRole}</strong></div></div>
                <div className="col-md-6"><div className="metric-card h-100"><span>Lender access</span><strong>{hasLenderAccess(user) ? 'Enabled' : 'Not enabled'}</strong></div></div>
              </div>
            </section>
          </div>

          <div className="col-lg-4">
            <aside className="workspace-card h-100">
              <p className="eyebrow mb-2">Quick actions</p>
              <h2 className="h4 mb-3">Next steps</h2>
              <div className="d-grid gap-2">
                <button type="button" className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/lender/dashboard')}>
                  Back to dashboard
                </button>
                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => { clearCurrentUser(); navigate('/'); }}>
                  Logout
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default AccountSettingsPage;
