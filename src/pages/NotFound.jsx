// Webflow's hosting-level 404 page (no site nav/footer), as served for
// https://www.righthemisphere.studio/does-not-exist. The dev server answers 200, not 404.
export default function NotFound() {
  return (
    <div className="utility-wrapper">
      <div className="utility-container">
        <div className="text-mono">404</div>
        <div className="utility-content">
          <h1>
            Page not found
            <br />
          </h1>
          <p>The page you are looking for doesn&apos;t exist or has been moved.</p>
        </div>
        <div />
      </div>
    </div>
  );
}
