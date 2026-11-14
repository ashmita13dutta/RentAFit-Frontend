import Reveal from './Reveal';

function TestimonialCard({ quote, name, role, delay = 0, accent = 'light' }) {
  return (
    <Reveal as="article" className={`testimonial-card testimonial-card--${accent}`} delay={delay}>
      <p className="testimonial-card__quote">“{quote}”</p>
      <div className="testimonial-card__meta">
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
    </Reveal>
  );
}

export default TestimonialCard;
