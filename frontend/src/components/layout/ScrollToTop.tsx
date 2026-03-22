import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Explicitly set behavior to "instant" to override any global CSS smooth scrolling
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
