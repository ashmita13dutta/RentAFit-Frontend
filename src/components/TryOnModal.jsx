import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { resolveAssetPath } from "../utils/assetPaths";
import { saveTryOnFeedback } from "../services/store";

const FORCED_WEARING_PREVIEW = {
  L0046: "/product_images/L0046/L0046_tryon_result.png",
};

const RATING_VALUES = [1, 2, 3, 4, 5];

const RATING_PARAMETERS = [
  { key: "overallQuality", label: "Overall Quality", hint: "How good is this result overall?" },
  { key: "productFidelity", label: "Product Fidelity", hint: "Garment shape, print & color match the reference" },
  { key: "naturalness", label: "Naturalness", hint: "Looks like a real, natural photo" },
  { key: "artifactFree", label: "Artifact-Free", hint: "No glitches, blur, or warping in the result" },
];

const EMPTY_RATINGS = RATING_PARAMETERS.reduce((acc, param) => ({ ...acc, [param.key]: 0 }), {});

function TryOnModal({ product, triggerClassName = "" }) {
  const modalId = `tryon-${product.id}`;
  const modalRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [ratings, setRatings] = useState(EMPTY_RATINGS);
  const [hovered, setHovered] = useState({ key: null, value: 0 });
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const ratedValues = RATING_PARAMETERS.map((param) => ratings[param.key]).filter(Boolean);
  const allParametersRated = ratedValues.length === RATING_PARAMETERS.length;
  const overallRating = ratedValues.length
    ? Math.round((ratedValues.reduce((sum, value) => sum + value, 0) / ratedValues.length) * 10) / 10
    : 0;

  const productImageUrl = product.mainImageUrl || product.imageTokens?.[0]?.imageUrl;
  const forcedWearingPreviewUrl = FORCED_WEARING_PREVIEW[product.id]
    ? resolveAssetPath(FORCED_WEARING_PREVIEW[product.id])
    : null;
  const wearingPreviewUrl = forcedWearingPreviewUrl || previewUrl;

  useEffect(() => {
    const node = modalRef.current;
    if (!node) return undefined;

    const handleHidden = () => {
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      setShowResult(false);
      setRatings(EMPTY_RATINGS);
      setHovered({ key: null, value: 0 });
      setComment("");
      setFeedbackSubmitted(false);
    };

    node.addEventListener("hidden.bs.modal", handleHidden);
    return () => node.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleTryOn = () => {
    setShowResult(true);
  };

  const handleTryAnotherPhoto = () => {
    setShowResult(false);
    setRatings(EMPTY_RATINGS);
    setHovered({ key: null, value: 0 });
    setComment("");
    setFeedbackSubmitted(false);
  };

  const handleSubmitFeedback = () => {
    if (!allParametersRated) return;
    saveTryOnFeedback({
      productId: product.id,
      productName: product.name,
      ratings,
      overallRating,
      comment,
    });
    setFeedbackSubmitted(true);
  };

  return (
    <>
      <button
        type="button"
        className={`btn product-card__action product-card__action--dark ${triggerClassName}`.trim()}
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        Try On
      </button>

      {createPortal(
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true" ref={modalRef}>
          <div className={`modal-dialog modal-dialog-centered ${showResult ? "modal-lg" : "modal-xl"}`}>
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <div>
                  <p className="eyebrow mb-1">{showResult ? "Try-On Result" : "Style Preview"}</p>
                  <h5 className="modal-title">{product.name}</h5>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body pt-3">
                {showResult ? (
                  <>
                    <div className="row g-4 align-items-stretch">
                      <div className="col-md-6">
                        <div className="tryon-stage h-100">
                          <img src={productImageUrl} alt={product.name} className="tryon-stage__preview-image" />
                          <span className="tryon-stage__badge">Product</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="tryon-stage h-100">
                          {wearingPreviewUrl ? (
                            <img src={wearingPreviewUrl} alt="Simulated try-on result" className="tryon-stage__preview-image" />
                          ) : (
                            <div className="tryon-stage__placeholder">
                              <span className="tryon-stage__title">Wearing preview</span>
                              <p className="mb-0 text-muted">No photo was uploaded.</p>
                            </div>
                          )}
                          <span className="tryon-stage__badge">Try-on preview</span>
                        </div>
                      </div>
                    </div>
                    <div className="tryon-feedback mt-4">
                      {feedbackSubmitted ? (
                        <p className="text-center text-muted mb-0">
                          Thanks — you rated this preview <strong>{overallRating.toFixed(1)} / 5</strong> overall. It helps us improve future try-ons.
                        </p>
                      ) : (
                        <>
                          <p className="tryon-feedback__label text-center mb-3">Rate this try-on</p>

                          <div className="tryon-feedback__params">
                            {RATING_PARAMETERS.map((param) => {
                              const activeValue = hovered.key === param.key ? hovered.value : ratings[param.key];
                              return (
                                <div className="tryon-feedback__param" key={param.key}>
                                  <div className="tryon-feedback__param-head">
                                    <span className="tryon-feedback__param-label">{param.label}</span>
                                    <span className="tryon-feedback__param-hint">{param.hint}</span>
                                  </div>
                                  <div
                                    className="tryon-feedback__stars tryon-feedback__stars--sm"
                                    role="radiogroup"
                                    aria-label={`Rate ${param.label}`}
                                  >
                                    {RATING_VALUES.map((value) => (
                                      <button
                                        key={value}
                                        type="button"
                                        className={`tryon-feedback__star ${activeValue >= value ? "is-filled" : ""}`}
                                        onMouseEnter={() => setHovered({ key: param.key, value })}
                                        onMouseLeave={() => setHovered({ key: null, value: 0 })}
                                        onClick={() => setRatings((prev) => ({ ...prev, [param.key]: value }))}
                                        aria-label={`${param.label}: ${value} star${value === 1 ? "" : "s"}`}
                                        aria-pressed={ratings[param.key] === value}
                                      >
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {ratedValues.length > 0 && (
                            <p className="tryon-feedback__overall text-center">
                              Overall <strong>{overallRating.toFixed(1)}</strong> / 5
                            </p>
                          )}

                          <label className="tryon-feedback__note-label" htmlFor={`tryon-review-${product.id}`}>
                            Detailed review (optional)
                          </label>
                          <textarea
                            id={`tryon-review-${product.id}`}
                            className="form-control tryon-feedback__note"
                            rows="3"
                            placeholder="Anything specific about accuracy, draping, lighting, or artifacts you noticed?"
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                          />

                          <div className="text-center mt-2">
                            <button
                              type="button"
                              className="btn btn-primary rounded-pill btn-sm"
                              disabled={!allParametersRated}
                              onClick={handleSubmitFeedback}
                            >
                              Submit rating
                            </button>
                            {!allParametersRated && (
                              <p className="tryon-feedback__submit-hint mb-0 mt-1">Rate all four to submit</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <button type="button" className="btn btn-outline-secondary rounded-pill btn-sm" onClick={handleTryAnotherPhoto}>
                        Try another photo
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="row g-4 align-items-stretch">
                    <div className="col-md-7">
                      <div className="tryon-stage h-100">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Your upload preview" className="tryon-stage__preview-image" />
                        ) : (
                          <div className="tryon-stage__placeholder">
                            <span className="tryon-stage__title">Preview workspace</span>
                            <p className="mb-0 text-muted">
                              Upload a photo to prepare a styling preview for this outfit.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="d-grid gap-3">
                        <div>
                          <label className="form-label">Upload your photo</label>
                          <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <button type="button" className="btn btn-primary rounded-pill" onClick={handleTryOn}>
                          Try On
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

export default TryOnModal;
