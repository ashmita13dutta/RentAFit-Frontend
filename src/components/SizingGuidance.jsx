import { useMemo, useState } from 'react';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL'];

const HEIGHT_BASELINE_CM = [
  { max: 155, size: 'XS' },
  { max: 165, size: 'S' },
  { max: 175, size: 'M' },
  { max: 183, size: 'L' },
  { max: Infinity, size: 'XL' },
];

const FIT_PREFERENCES = [
  { value: 'slim', label: 'Slim / fitted' },
  { value: 'true-to-size', label: 'True to size' },
  { value: 'relaxed', label: 'Relaxed / loose' },
];

function estimateSize(heightCm, fitPreference) {
  const baseline = HEIGHT_BASELINE_CM.find((band) => heightCm <= band.max).size;
  const baselineIndex = SIZE_ORDER.indexOf(baseline);
  const shift = fitPreference === 'slim' ? -1 : fitPreference === 'relaxed' ? 1 : 0;
  const shiftedIndex = Math.min(Math.max(baselineIndex + shift, 0), SIZE_ORDER.length - 1);
  return SIZE_ORDER[shiftedIndex];
}

function SizingGuidance({ product }) {
  const [height, setHeight] = useState('');
  const [fitPreference, setFitPreference] = useState('true-to-size');

  const heightCm = Number(height);
  const isValidHeight = height.trim() !== '' && Number.isFinite(heightCm) && heightCm >= 120 && heightCm <= 220;

  const tip = useMemo(() => {
    if (!isValidHeight) return null;

    const availableSizes = product.availableSizes || [];
    if (availableSizes.length === 1 && availableSizes[0] === 'Free') {
      return 'This piece is one-size (Free) — no size selection needed.';
    }

    const suggestedSize = estimateSize(heightCm, fitPreference);
    if (availableSizes.includes(suggestedSize)) {
      return `Size ${suggestedSize} looks like a good match for your height and fit preference.`;
    }

    const suggestedIndex = SIZE_ORDER.indexOf(suggestedSize);
    const closestAvailable = availableSizes
      .filter((size) => SIZE_ORDER.includes(size))
      .sort((a, b) => Math.abs(SIZE_ORDER.indexOf(a) - suggestedIndex) - Math.abs(SIZE_ORDER.indexOf(b) - suggestedIndex))[0];

    if (!closestAvailable) {
      return `We'd suggest size ${suggestedSize} based on your height and fit preference, but couldn't compare it against this listing's sizes.`;
    }

    const direction = SIZE_ORDER.indexOf(closestAvailable) > suggestedIndex ? 'larger' : 'smaller';
    return `Based on your height and fit preference, we'd suggest size ${suggestedSize}. This listing is only available in ${closestAvailable}, which runs ${direction} than your estimate.`;
  }, [isValidHeight, heightCm, fitPreference, product.availableSizes]);

  return (
    <div className="sizing-guidance">
      <span className="pdp-canvas__label">Sizing guidance</span>
      <p className="sizing-guidance__note text-muted mb-2">
        A rough estimate from height and fit preference — not a substitute for the size chart.
      </p>
      <div className="sizing-guidance__row">
        <input
          className="form-control"
          type="number"
          inputMode="numeric"
          placeholder="Height (cm)"
          value={height}
          onChange={(event) => setHeight(event.target.value)}
          min="120"
          max="220"
        />
        <select
          className="form-select"
          value={fitPreference}
          onChange={(event) => setFitPreference(event.target.value)}
        >
          {FIT_PREFERENCES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {tip && <p className="sizing-guidance__tip mb-0">{tip}</p>}
    </div>
  );
}

export default SizingGuidance;
