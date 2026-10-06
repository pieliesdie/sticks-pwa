export default function Snackbar({ message, icon }) {
  return (
    <div className={`snackbar ${message ? 'show' : ''}`} role="status" aria-live="polite">
      {icon && <span className="snack-icon">{icon}</span>}
      <span>{message}</span>
    </div>
  );
}
