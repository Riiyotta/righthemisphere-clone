import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';

// Shared shell for inner routes: homepage Navbar + Footer, unchanged apart from the
// current-link marking. `active` is the pathname that owns .w--current (null: none).
export default function PageShell({ active = null, children }) {
  return (
    <div className="page-wrapper">
      <Navbar active={active} />
      <main className="main-wrapper">{children}</main>
      <Footer currentPath={active} />
    </div>
  );
}
