(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const clientID = '9d5ce3177176441';
  const script = document.createElement('script');
  script.src = `https://static.reo.dev/${clientID}/reo.js`;
  script.defer = true;

  script.onload = function () {
    if (window.Reo && typeof window.Reo.init === 'function') {
      window.Reo.init({ clientID });
    } else {
      console.warn('⚠️ Reo script loaded, but Reo.init not found');
    }
  };

  document.head.appendChild(script);
})();
