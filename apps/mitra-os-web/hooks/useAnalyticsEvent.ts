import { useCallback } from 'react';

// Extend the window object to include gtag and dataLayer
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

type EventName = 'button_click' | 'form_submission' | 'whatsapp_contact' | string;

export function useAnalyticsEvent() {
  const trackEvent = useCallback((eventName: EventName, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
    } else {
      console.warn('GA4 is not initialized. Event not tracked:', eventName, eventParams);
    }
  }, []);

  return { trackEvent };
}
