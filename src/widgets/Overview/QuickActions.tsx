import { useTransientMessage } from './useTransientMessage';

export function QuickActionsPlaceholder() {
  return (
    <div className="overview-quick-actions skeleton" aria-label="Quick actions loading placeholder">
      <div className="btn-placeholder" />
      <div className="btn-placeholder" />
    </div>
  );
}

export function QuickActions() {
  const { message, push } = useTransientMessage();
  function trigger(action: string) { push(`${action} not implemented in demo`); }
  return (
  <section className="overview-quick-actions" aria-labelledby="qa-heading">
      <h3 id="qa-heading" className="visually-hidden">Quick actions</h3>
      <div className="actions-row">
        <button type="button" onClick={()=>trigger('Transfer')} className="btn-primary" aria-label="Transfer funds">Transfer</button>
        <button type="button" onClick={()=>trigger('Pay')} className="btn-primary" aria-label="Pay a bill">Pay</button>
      </div>
      <div aria-live="polite" className="qa-toast-region">
        {message && <output className="qa-toast">{message}</output>}
      </div>
    </section>
  );
}
