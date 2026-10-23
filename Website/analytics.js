/* Basic GA4 measurement, loaded only after a visitor opts in. */
(() => {
  'use strict';
  if (!['acloudyday.net', 'www.acloudyday.net'].includes(location.hostname)) return;

  const measurementId = 'G-TMS4PX6SKX';
  const preferenceKey = 'acloudyday.analytics';
  const preferenceLifetime = 180 * 24 * 60 * 60 * 1000;
  let started = false;
  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey));
    if (saved && Date.now() - saved.time < preferenceLifetime &&
        ['granted', 'denied'].includes(saved.value)) choice = saved.value;
  } catch (_) { /* A storage restriction must not prevent the site working. */ }

  const banner = document.createElement('section');
  banner.className = 'analytics-choice';
  banner.setAttribute('aria-label', 'Visitor analytics preference');
  banner.innerHTML = '<p>Allow Google Analytics cookies to measure visits to this site? Advertising features are off. <a href="privacy.html">Privacy details</a></p>' +
    '<div><button type="button" data-allow>Allow analytics</button> <button type="button" data-decline>Decline</button></div>';
  document.body.appendChild(banner);

  function start() {
    if (started) return;
    started = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    let referrer = '';
    try {
      const url = new URL(document.referrer);
      referrer = url.origin + url.pathname;
    } catch (_) { /* Empty or invalid referrer. */ }
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000,
      page_location: location.origin + location.pathname,
      page_referrer: referrer
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }

  function choose(value) {
    choice = value;
    try {
      localStorage.setItem(preferenceKey, JSON.stringify({ value, time: Date.now() }));
    } catch (_) { /* Preference applies to this page if storage is unavailable. */ }
    if (value === 'granted') {
      if (started) location.reload();
      else start();
    } else {
      window['ga-disable-' + measurementId] = true;
      if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name === '_ga' || name.startsWith('_ga_')) {
          ['', '; Domain=acloudyday.net', '; Domain=www.acloudyday.net'].forEach(domain => {
            document.cookie = name + '=; Max-Age=0; Path=/' + domain;
          });
        }
      });
      // Unload Google's timers after withdrawing consent.
      if (started) location.reload();
    }
    banner.hidden = true;
  }

  banner.querySelector('[data-allow]').addEventListener('click', () => choose('granted'));
  banner.querySelector('[data-decline]').addEventListener('click', () => choose('denied'));
  document.querySelectorAll('[data-analytics-settings]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector(choice === 'granted' ? '[data-decline]' : '[data-allow]').focus();
    });
  });
  banner.hidden = choice !== null;
  if (choice === 'granted') start();
})();
