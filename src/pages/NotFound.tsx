import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section aria-labelledby="notfound-heading">
      <h2 id="notfound-heading">Page not found</h2>
      <p>The page you requested does not exist.</p>
      <p><Link to="/">Back to Overview</Link></p>
    </section>
  );
}
export default NotFound;