declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_ID = 'G-LBV7LSXJDD';

export function trackPageView(path: string, title?: string) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, {
    page_path: path,
    page_title: title ?? document.title,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

export function trackCtaClick(location: 'navbar' | 'hero' | 'bottom_cta') {
  trackEvent('cta_click', { button_location: location });
}

export function trackFormSubmit(role: string) {
  trackEvent('generate_lead', { role });
}
