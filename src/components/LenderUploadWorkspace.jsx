import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  GENDER_OPTIONS,
  MATERIAL_OPTIONS,
  SIZE_OPTIONS,
} from '../data/itemOptions';
import { predictListingDecision, predictRentalPrice } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const EMPTY_FORM_STATE = {
  productName: '',
  brand: '',
  category: '',
  gender: '',
  size: '',
  material: '',
  condition: '',
  age: '',
  originalPrice: '',
  description: '',
};

const IMAGE_FIELDS = [
  {
    key: 'frontImage',
    label: 'Clean front view',
    note: 'Upload the full garment from the front against a simple background.',
  },
  {
    key: 'closeupImage',
    label: 'Close-up detail',
    note: 'Show texture, stitching, buttons, embroidery, or any important surface detail.',
  },
];

const readLatestDraft = () => {
  try {
    const stored = sessionStorage.getItem('latestItemDraft');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

function LenderUploadWorkspace({ onBack }) {
  const navigate = useNavigate();
  const latestDraft = readLatestDraft();
  const [formData, setFormData] = useState(() => latestDraft ? {
    productName: latestDraft.productName || '',
    brand: latestDraft.brand || '',
    category: latestDraft.category || '',
    gender: latestDraft.gender || '',
    size: latestDraft.size || '',
    material: latestDraft.material || '',
    condition: latestDraft.condition || '',
    age: latestDraft.age != null ? String(latestDraft.age) : '',
    originalPrice: latestDraft.originalPrice != null ? String(latestDraft.originalPrice) : '',
    description: latestDraft.description || '',
  } : EMPTY_FORM_STATE);
  const [previews, setPreviews] = useState(() => ({
    frontImage: latestDraft?.previews?.frontImage || '',
    closeupImage: latestDraft?.previews?.closeupImage || '',
  }));
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (fieldName, file) => {
    setApiError('');
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [fieldName]: nextUrl }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const missingImages = IMAGE_FIELDS.filter((item) => !previews[item.key]);

    if (!form.checkValidity() || missingImages.length > 0) {
      event.stopPropagation();
      setValidated(true);
      if (missingImages.length > 0) {
        setApiError('Upload both required photos before continuing.');
      }
      return;
    }

    setValidated(true);
    setIsSubmitting(true);
    setApiError('');

    const ageMonths = Number(formData.age);
    const originalPrice = Number(formData.originalPrice);
    const modelAPayload = {
      brand: formData.brand,
      category: formData.category,
      material: formData.material,
      size: formData.size,
      condition: formData.condition,
      age_months: ageMonths,
      original_price: originalPrice,
    };

    try {
      const priceData = await predictRentalPrice(modelAPayload);
      const derivedProviderPrice = Number(priceData.predicted_price_mid || priceData.final_price_range?.min_price || 0);

      const modelBPayload = {
      brand: formData.brand,
      category: formData.category,
      gender: formData.gender,
      material: formData.material,
      size: formData.size,
      condition: formData.condition,
      garment_age_months: ageMonths,
      original_price: originalPrice,
      provider_price: derivedProviderPrice,
      listing_created_at: new Date().toISOString().slice(0, 10),
      as_of_date: new Date().toISOString().slice(0, 10),
      current_status: 'PENDING_REVIEW',
      };
      const decisionData = await predictListingDecision(modelBPayload);

      const payload = {
        ...formData,
        age: ageMonths,
        originalPrice,
        previews,
      };

      sessionStorage.setItem('latestItemDraft', JSON.stringify(payload));
      sessionStorage.setItem('predictedRange', JSON.stringify(priceData.final_price_range));
      sessionStorage.setItem('predictedMid', JSON.stringify(priceData.predicted_price_mid));
      sessionStorage.setItem('modelBDecision', JSON.stringify(decisionData));

      navigate('/lender/price', {
        state: {
          itemDetails: payload,
          predictedRange: priceData.final_price_range,
          predictedMid: priceData.predicted_price_mid,
          modelBDecision: decisionData,
        },
      });
    } catch (error) {
      setApiError(error?.response?.data?.detail || error?.message || 'Unable to process the listing right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const draftSummary = [
    ['Product', formData.productName || 'Not set'],
    ['Brand', formData.brand || 'Not set'],
    ['Category', formData.category || 'Not set'],
    ['Condition', formData.condition || 'Not set'],
    ['Image set', 'Front view + close-up'],
    ['Original price', formData.originalPrice ? formatCurrency(Number(formData.originalPrice)) : 'Not set'],
  ];

  return (
    <div className="lender-space-board lender-space-board--stack">
      {apiError ? <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-0">{apiError}</div> : null}
      <form className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
        <div className="upload-workspace">
          <div className="workspace-card upload-workspace__main">
            <div className="workspace-card__header workspace-card__header--stacked">
              <div>
                <p className="eyebrow mb-1">Upload</p>
                <h2 className="h4 mb-0">Upload a product</h2>
                <p className="text-muted mb-0">Add two photos and the key details for your listing without leaving the dashboard.</p>
              </div>
            </div>

            <section className="workspace-section">
              <div className="workspace-card__header">
                <div>
                  <p className="eyebrow mb-1">Image set</p>
                  <h2 className="h4 mb-0">Upload two photos</h2>
                </div>
              </div>

              <div className="upload-preview-grid upload-preview-grid--two">
                {IMAGE_FIELDS.map((item) => (
                  <div className="upload-preview-card" key={item.key}>
                    <label className="form-label">{item.label}</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(event) => handleImageChange(item.key, event.target.files?.[0])}
                    />
                    <span className="upload-preview-card__note">{item.note}</span>
                    <div className="upload-preview-card__frame mt-3">
                      {previews[item.key] ? (
                        <img src={previews[item.key]} alt={`${item.label} preview`} className="upload-preview-card__img" />
                      ) : (
                        <span className="upload-preview-card__empty">No preview yet</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="workspace-section">
              <div className="workspace-card__header">
                <div>
                  <p className="eyebrow mb-1">Listing metadata</p>
                  <h2 className="h4 mb-0">Describe the piece clearly</h2>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Product name</label>
                  <input className="form-control form-control-lg" name="productName" value={formData.productName} onChange={handleChange} placeholder="e.g. Midnight Cocktail Dress" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Brand</label>
                  <select className="form-select form-select-lg" name="brand" value={formData.brand} onChange={handleChange} required>
                    <option value="">Select brand</option>
                    {BRAND_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select className="form-select form-select-lg" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Gender</label>
                  <select className="form-select form-select-lg" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Size</label>
                  <select className="form-select form-select-lg" name="size" value={formData.size} onChange={handleChange} required>
                    <option value="">Select size</option>
                    {SIZE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Material</label>
                  <select className="form-select form-select-lg" name="material" value={formData.material} onChange={handleChange} required>
                    <option value="">Select material</option>
                    {MATERIAL_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Condition</label>
                  <select className="form-select form-select-lg" name="condition" value={formData.condition} onChange={handleChange} required>
                    <option value="">Select condition</option>
                    {CONDITION_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Age (months)</label>
                  <input type="number" min="0" className="form-control form-control-lg" name="age" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Original price</label>
                  <input type="number" min="0" className="form-control form-control-lg" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required />
                </div>
                <div className="col-md-8">
                  <label className="form-label">Description</label>
                  <textarea className="form-control form-control-lg" rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the piece, fit, and standout details." required />
                </div>
              </div>
            </section>

            <section className="workspace-section">
              <div className="d-flex flex-wrap gap-3">
                <button type="submit" className="btn btn-primary btn-lg rounded-pill px-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'See price and review'}
                </button>
                {onBack ? <button type="button" className="btn btn-outline-primary btn-lg rounded-pill px-4" onClick={onBack}>Back to dashboard</button> : null}
              </div>
            </section>
          </div>

          <aside className="workspace-card upload-workspace__aside">
            <p className="eyebrow mb-2">Submission notes</p>
            <h2 className="h4 mb-3">Listing checklist</h2>
            <ul className="rules-list mb-4">
              <li>Add one front view and one detail shot.</li>
              <li>Include brand, category, size, material, and condition.</li>
              <li>Set the price you want to list at.</li>
              <li>Use the description to call out fit, fabric, and standout details.</li>
            </ul>

            <div className="draft-summary">
              {draftSummary.map(([label, value]) => (
                <div className="draft-summary__row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

export default LenderUploadWorkspace;
