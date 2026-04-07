(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const host = window.location.hostname;

  const isProdBuild = process.env.NODE_ENV === 'production';
  // Only load Qualified on the production docs site
  if (!isProdBuild || host !== 'docs.snowplow.io') {
    console.log('Qualified tracking not loaded (non-production host).');
    return;
  }

  // Bootstrap queue (same as original embed)
  (function (w, q) {
    w['QualifiedObject'] = q;
    w[q] =
      w[q] ||
      function () {
        (w[q].q = w[q].q || []).push(arguments);
      };
  })(window, 'qualified');

  // Load external Qualified script
  const script = document.createElement('script');
  script.src = 'https://js.qualified.com/qualified.js?token=JZrwGj5n8H5UJwdg';
  script.async = true;

  document.head.appendChild(script);
})();
