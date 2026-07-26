export const initAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    return;
  }

  if (window.gtag) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
  });
};

export const trackPageView = (path) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId || !window.gtag) {
    return;
  }

  window.gtag("config", measurementId, {
    page_path: path,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
};
