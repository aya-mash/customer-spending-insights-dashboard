import { useNavigate } from 'react-router-dom';

export function ErrorFallback() {
  const navigate = useNavigate();
  return (
    <div role="alert" className="error-fallback">
      <h2>Something went wrong</h2>
      <p>Please try reloading this section.</p>
      <button
        type="button"
        onClick={() => {
          navigate(0); // reload current route
        }}
      >
        Try again
      </button>
    </div>
  );
}