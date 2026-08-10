/** Google Analytics 4 (gtag.js) — measurement ID G-N6B85V6N32 */
const GA_MEASUREMENT_ID = 'G-N6B85V6N32';

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = gtag;

gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

const script = document.createElement('script');
script.async = true;
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
document.head.appendChild(script);
