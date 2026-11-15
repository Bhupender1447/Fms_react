import React, { forwardRef, useId } from 'react';

export const Button = forwardRef(function Button({ variant = 'primary', className = '', type = 'button', ...props }, ref) {
  return <button ref={ref} type={type} className={`iso-button iso-button--${variant} ${className}`} {...props} />;
});

function Field({ as: Control, label, id, help, error, className = '', ...props }) {
  const generatedId = useId();
  const controlId = id || generatedId;
  const descriptionId = `${controlId}-description`;
  const descriptions = [props['aria-describedby'], (error || help) && descriptionId].filter(Boolean).join(' ') || undefined;
  return <div className={`iso-field ${className}`}>
    <label className="iso-field__label" htmlFor={controlId}>{label}</label>
    <Control {...props} id={controlId} className="iso-control" aria-invalid={error ? true : undefined} aria-describedby={descriptions} />
    {(error || help) && <span id={descriptionId} className={error ? 'iso-field__error' : 'iso-field__help'}>{error || help}</span>}
  </div>;
}

export function Input(props) { return <Field as="input" {...props} />; }
export function Select(props) { return <Field as="select" {...props} />; }
export function Badge({ tone = 'neutral', className = '', ...props }) { return <span className={`iso-badge iso-badge--${tone} ${className}`} {...props} />; }
export function Card({ as: Element = 'section', className = '', ...props }) { return <Element className={`iso-card ${className}`} {...props} />; }
export function Alert({ tone = 'info', title, children, action, className = '' }) {
  return <div className={`iso-alert iso-alert--${tone} ${className}`} role={tone === 'danger' ? 'alert' : 'status'}>
    <div className="iso-alert__body"><strong>{title}</strong><div>{children}</div></div>{action}
  </div>;
}
export function EmptyState({ title, children, loading = false }) {
  return <div className="iso-empty" role={loading ? 'status' : undefined}><strong>{title}</strong>{children && <p>{children}</p>}</div>;
}
export function PageHeader({ eyebrow, title, children, actions }) {
  return <header className="iso-page-header"><div>{eyebrow && <span className="iso-page-header__eyebrow">{eyebrow}</span>}<h1>{title}</h1>{children && <p>{children}</p>}</div>{actions && <div className="iso-page-header__actions">{actions}</div>}</header>;
}
