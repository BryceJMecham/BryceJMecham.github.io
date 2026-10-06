const GOOGLE_ANALYTICS_ID = "G-PS6KTWR5VN"; 

  // ---------- Analytics Handling ----------
  function loadAnalytics() {
    if (document.getElementById("ga-script")) return;
    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GOOGLE_ANALYTICS_ID);
  }

  function removeAnalytics() {
    const gaScript = document.getElementById("ga-script");
    if (gaScript) gaScript.remove();
    window.dataLayer = [];
    delete window.gtag;
  }

  // ---------- Banner Logic ----------
  async function initCookieConsent(forceShow = false) {
    const banner = document.getElementById('cookie-banner');
    const manageButton = document.getElementById('manage-cookies');
    const consent = localStorage.getItem('cookieConsent');

    if (!forceShow && (consent === 'accepted')) {
      loadAnalytics();
      return;
    } else if (!forceShow && (consent === 'rejected' || consent === 'dismissed')) {
      return;
    }

    // Detect region
    let isStrictRegion = false;
    try {
        const regionData = await fetch('https://ipapi.co/json/').then(r => r.json());
        const country = regionData && regionData.country_code;
        
        const strictCountries = [
            // EEA + UK + Switzerland
            'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT',
            'LU','MT','NL','PL','PT','RO','SK','SI','ES','SE', // EU countries
            'IS','LI','NO', // EEA non-EU
            'GB','CH', // UK, Switzerland
            // Optional: GDPR-like laws
            'CA','BR','KR'
        ];

        isStrictRegion = strictCountries.includes(country);
    } catch (e) {
        console.warn('Region detection failed (StrictRegion set to true), Error: ', e);
        isStrictRegion = true;
    }

    banner.classList.remove('hidden');
    banner.style.display = 'block';

    if (isStrictRegion) {
      // ---- EEA: Full Opt-In ----
      banner.innerHTML = `
        <p>We use cookies to enhance your experience and analyze site traffic. 
        Analytics cookies are only used with your consent. See our 
        <a href="privacypolicy.html">Privacy Policy</a> to learn more.</p>
        <div>
          <button class="btn-accept">Accept</button>
          <button class="btn-reject">Reject</button>
        </div>
      `;

      banner.querySelector('.btn-accept').onclick = () => {
        loadAnalytics();
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.add('hidden');
      };
      banner.querySelector('.btn-reject').onclick = () => {
        removeAnalytics();
        localStorage.setItem('cookieConsent', 'rejected');
        banner.classList.add('hidden');
      };

    } else {
      // ---- Other Regions: Informational Opt-Out ----
      loadAnalytics();
      banner.innerHTML = `
        <p>We use cookies to analyze traffic and improve your experience. 
        By continuing, you consent to our use of cookies. See our 
        <a href="privacypolicy.html">Privacy Policy</a> to learn more.</p>
        <div>
          <button class="btn-dismiss">Dismiss</button>
          <button class="btn-reject">Opt Out</button>
        </div>
      `;

      banner.querySelector('.btn-dismiss').onclick = () => {
        localStorage.setItem('cookieConsent', 'dismissed');
        banner.classList.add('hidden');
      };
      banner.querySelector('.btn-reject').onclick = () => {
        removeAnalytics();
        localStorage.setItem('cookieConsent', 'rejected');
        banner.classList.add('hidden');
      };
    }
  }

  // ---------- Manage Cookies Button ----------
  document.getElementById('manage-cookies').addEventListener('click', () => {
    initCookieConsent(true);
  });

  // ---------- Initialize ----------
  initCookieConsent();