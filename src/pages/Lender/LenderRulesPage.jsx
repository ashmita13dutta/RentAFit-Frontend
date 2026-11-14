import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import { getCurrentUser, hasLenderAccess } from '../../services/store';

const ruleGroups = [
  {
    title: 'Upload photos',
    items: [
      'Every listing must include one clean front-view image and one clear detail shot.',
      'Use a simple background and good lighting so stitching, texture, and shape are easy to review.',
      'Avoid cropped garments, blurry photos, heavy filters, or mirrored screenshots.',
    ],
  },
  {
    title: 'Listing details',
    items: [
      'Fill in brand, category, gender, size, material, condition, and description accurately.',
      'The written description should mention fit, standout details, and anything a renter should know before booking.',
      'Only upload pieces that match the product type and details shown in the images.',
    ],
  },
  {
    title: 'Pricing and review',
    items: [
      'Enter a realistic rental price so the review range and dashboard recommendations stay useful.',
      'Pending, rejected, and reapproval statuses must be resolved from the lender dashboard before a listing can go live.',
      'Published availability depends on passing review and keeping the listing information current.',
    ],
  },
];

function LenderRulesPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/lender/rules' }, replace: true });
      return;
    }
    if (!hasLenderAccess(user)) {
      navigate('/lender/dashboard', { replace: true });
    }
  }, [navigate, user]);

  if (!user || !hasLenderAccess(user)) return null;

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container-xxl workspace-shell py-5 px-3 px-lg-4">
        <section className="workspace-header">
          <div>
            <p className="eyebrow mb-2">Lender rules</p>
            <h1 className="section-title mb-2">Upload standards for lender space</h1>
            <p className="text-muted mb-0">These rules apply specifically to lender uploads, review quality, and dashboard readiness.</p>
          </div>
        </section>

        <div className="row g-4">
          {ruleGroups.map((group) => (
            <div key={group.title} className="col-lg-4">
              <section className="workspace-card h-100">
                <div className="workspace-card__header workspace-card__header--stacked">
                  <div>
                    <p className="eyebrow mb-1">Guideline</p>
                    <h2 className="h4 mb-0">{group.title}</h2>
                  </div>
                </div>
                <ul className="rules-list mb-0">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default LenderRulesPage;
