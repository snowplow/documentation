(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const host = window.location.hostname;

  const isProdBuild = process.env.NODE_ENV === 'production';
  const isDocsHost =
    host === 'docs.snowplow.io' ||
    host.endsWith('snowplow-docs.netlify.app'); // deploy-preview-xxxx--snowplow-docs.netlify.app

  // Only load Qualified on real docs + Netlify previews
  if (!isProdBuild || !isDocsHost) {
    console.log('Qualified tracking not loaded (non-docs or non-preview host).');
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
