const fs = require('fs');

const popupCode = `<script type="text/javascript" src="//pl29472106.effectivecpmnetwork.com/c4/cb/f7/c4cbf773d8e201248cf8298b5a841385.js"></script>`;
const socialbarCode = `<script type="text/javascript" src="//pl29472105.effectivecpmnetwork.com/43/1d/ee/431deebc7b9ba5fda21853cd10384129.js"></script>`;

const desktopBannerSrcdoc = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body><script>  atOptions = { 'key' : 'b19e6bc99ede23f262204103c751db9b', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };</script><script src="https://www.highperformanceformat.com/b19e6bc99ede23f262204103c751db9b/invoke.js"></script></body></html>`.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const mobileBannerSrcdoc = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body><script>  atOptions = { 'key' : '9a562e58c10f0dd20674583f3b5b78da', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };</script><script src="https://www.highperformanceformat.com/9a562e58c10f0dd20674583f3b5b78da/invoke.js"></script></body></html>`.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const dynamicAdHTML = `
<div class="ad-responsive-container" style="width:100%; display:flex; justify-content:center; align-items:center; margin: 20px 0; overflow:hidden;">
    <iframe class="desktop-ad" srcdoc="${desktopBannerSrcdoc}" width="728" height="90" frameborder="0" scrolling="no" style="display:block;max-width:100%;"></iframe>
    <iframe class="mobile-ad" srcdoc="${mobileBannerSrcdoc}" width="320" height="50" frameborder="0" scrolling="no" style="display:none;max-width:100%;"></iframe>
</div>
`.trim();

// read index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace everything between <div class="ad-responsive-container" and </div>\n</div> and the </iframe> completely 
indexHtml = indexHtml.replace(/<div class="ad-responsive-container"[\s\S]*?<\/iframe>\n<\/div>/g, dynamicAdHTML);

fs.writeFileSync('index.html', indexHtml, 'utf8');

// read universal-anime-module.html
let moduleHtml = fs.readFileSync('universal-anime-module.html', 'utf8');
moduleHtml = moduleHtml.replace(/<div class="ad-responsive-container"[\s\S]*?<\/iframe>\n<\/div>/g, dynamicAdHTML);
fs.writeFileSync('universal-anime-module.html', moduleHtml, 'utf8');

console.log('Cleaned up attributes.');
