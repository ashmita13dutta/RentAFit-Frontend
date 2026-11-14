function FashionImageFrame({ token, className = '', imageClassName = '', fit = 'contain', priority = false }) {
  const imageUrl = token?.imageUrl;
  const alt = token?.alt || token?.label || 'Product image';
  const label = token?.label || 'Rent a Fit';
  const palette = token?.palette || ['#c9bca7', '#f7f2ea'];

  return (
    <div
      className={[
        'fashion-image-frame',
        imageUrl ? 'fashion-image-frame--image' : 'fashion-image-frame--fallback',
        fit === 'contain' ? 'fashion-image-frame--contain' : 'fashion-image-frame--cover',
        className,
      ].filter(Boolean).join(' ')}
      style={{ '--frame-primary': palette[0], '--frame-secondary': palette[1] }}
    >
      {imageUrl ? (
        <img
          className={['fashion-image-frame__image', imageClassName].filter(Boolean).join(' ')}
          src={imageUrl}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="fashion-image-frame__fallback">
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

export default FashionImageFrame;
