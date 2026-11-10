import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const origin = 'https://registrations.alcheringa.co.in';
let lastPath;
export default function PageMetadata() {
 const { pathname } = useLocation();
 useEffect(() => {
  const publicPage = ['/', '/modules', '/competitions'].includes(pathname) || /^\/modules\/[^/]+$/.test(pathname);
  const title = pathname === '/' ? 'Alcheringa 2027 Registration | IIT Guwahati' : publicPage ? 'Competitions | Alcheringa 2027' : 'Registration Portal | Alcheringa 2027';
  document.title = title;
  document.querySelector('meta[name="robots"]').content = publicPage ? 'index,follow' : 'noindex,follow';
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[property="og:url"]').content = origin + pathname;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = origin + (pathname === '/competitions' ? '/modules' : pathname);
  const id = process.env.REACT_APP_GA_MEASUREMENT_ID;
  if (process.env.NODE_ENV !== 'production' || !/^G-[A-Z0-9]+$/.test(id || '')) return;
  if (!window.gtag) {
   window.dataLayer = window.dataLayer || [];
   window.gtag = function () { window.dataLayer.push(arguments); };
   window.gtag('js', new Date());
   window.gtag('config', id, { send_page_view: false, allow_google_signals: false });
   const script = document.createElement('script'); script.async = true;
   script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
   document.head.appendChild(script);
  }
  // Track public discovery only; omit private routes, query strings and identifiers.
  if (publicPage && lastPath !== pathname) window.gtag('event', 'page_view', { page_location: origin + (pathname.startsWith('/modules/') ? '/modules' : pathname), page_title: title, page_referrer: '' });
  lastPath = pathname;
 }, [pathname]);
 return null;
}
