const fs = require('fs');

const popupCode = `<script type="text/javascript" src="//pl29472106.effectivecpmnetwork.com/c4/cb/f7/c4cbf773d8e201248cf8298b5a841385.js"></script>`;
const socialbarCode = `<script type="text/javascript" src="//pl29472105.effectivecpmnetwork.com/43/1d/ee/431deebc7b9ba5fda21853cd10384129.js"></script>`;

// Reset and run again properly
require('child_process').execSync('git checkout index.html universal-anime-module.html');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const desktopBannerSrcdoc = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body><script>  atOptions = { 'key' : 'b19e6bc99ede23f262204103c751db9b', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };</script><script src="https://www.highperformanceformat.com/b19e6bc99ede23f262204103c751db9b/invoke.js"></script></body></html>`.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const mobileBannerSrcdoc = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body><script>  atOptions = { 'key' : '9a562e58c10f0dd20674583f3b5b78da', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };</script><script src="https://www.highperformanceformat.com/9a562e58c10f0dd20674583f3b5b78da/invoke.js"></script></body></html>`.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const dynamicAdHTML = `
<div class="ad-responsive-container" style="width:100%; display:flex; justify-content:center; align-items:center; margin: 20px 0; overflow:hidden;">
    <iframe class="desktop-ad" srcdoc="${desktopBannerSrcdoc}" width="728" height="90" frameborder="0" scrolling="no" style="display:block;max-width:100%;"></iframe>
    <iframe class="mobile-ad" srcdoc="${mobileBannerSrcdoc}" width="320" height="50" frameborder="0" scrolling="no" style="display:none;max-width:100%;"></iframe>
</div>
`.trim();

if (!indexHtml.includes('.desktop-ad { display: block; }')) {
    indexHtml = indexHtml.replace('</style>', `
        .desktop-ad { display: block; }
        .mobile-ad { display: none; }
        @media (max-width: 768px) {
            .desktop-ad { display: none !important; }
            .mobile-ad { display: flex !important; }
        }
    </style>`);
}

// Ensure the regex replaces global correctly
const adRegex = /<div class="ad-placeholder.*?<\/div>\s*<\/div>/gs;
indexHtml = indexHtml.replace(adRegex, (match) => {
    if (match.includes('floating-ad')) {
        return `
        <div id="floating-ad" style="position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 320px; height: 50px; z-index: 99; display: flex;">
            <div class="close-ad" onclick="this.parentElement.style.display='none'" style="position: absolute; top: -10px; right: -10px; background: var(--primary-accent); color: #fff; width: 22px; height: 22px; border-radius: 50%; text-align: center; line-height: 22px; cursor: pointer; font-size: 12px; z-index: 10; font-weight: bold;"><i class="fa-solid fa-xmark"></i></div>
            <iframe srcdoc="${mobileBannerSrcdoc}" width="320" height="50" frameborder="0" scrolling="no"></iframe>
        </div>
        `.trim();
    }
    return dynamicAdHTML;
});

indexHtml = indexHtml.replace(/<div class="ad-placeholder ad-top.*?<\/div>/gs, dynamicAdHTML);
indexHtml = indexHtml.replace(/<div class="ad-placeholder ad-content.*?<\/div>/gs, dynamicAdHTML);
indexHtml = indexHtml.replace(/<div class="ad-placeholder ad-top">[\s\S]*?<\/div>/g, dynamicAdHTML);
indexHtml = indexHtml.replace(/<div class="ad-placeholder ad-sidebar">[\s\S]*?<\/div>/g, dynamicAdHTML);
indexHtml = indexHtml.replace(/<!-- Popup Ad Modal -->[\s\S]*?<\/div>\s*<\/div>/g, '');

// Important: add the global scripts before the final </html> to avoid replacing the wrong </body>
indexHtml = indexHtml.replace(/<\/html>/i, `\n${popupCode}\n${socialbarCode}\n</html>`);

fs.writeFileSync('index.html', indexHtml, 'utf8');

// module html
let moduleHtml = fs.readFileSync('universal-anime-module.html', 'utf8');

if (!moduleHtml.includes('.desktop-ad { display: block; }')) {
    moduleHtml = moduleHtml.replace('</style>', `
    .desktop-ad { display: block; }
    .mobile-ad { display: none; }
    @media (max-width: 768px) {
        .desktop-ad { display: none !important; }
        .mobile-ad { display: flex !important; }
    }
</style>`);
}

moduleHtml = moduleHtml.replace(/<div class="aes-ad-placeholder.*?<\/div>\s*<\/div>/gs, dynamicAdHTML);
moduleHtml = moduleHtml.replace(/<div class="aes-ad-placeholder aes-ad-top">[\s\S]*?<\/div>/gs, dynamicAdHTML);
moduleHtml = moduleHtml.replace(/<div class="aes-ad-placeholder aes-ad-bottom">[\s\S]*?<\/div>/gs, dynamicAdHTML);
// handle if the placeholder lacks extra inner tags
moduleHtml = moduleHtml.replace(/<div class="aes-ad-placeholder">[\s\S]*?<\/div>/gs, dynamicAdHTML); 

moduleHtml = moduleHtml.replace(/<\/html>/i, `\n${popupCode}\n${socialbarCode}\n</html>`);
// Universal anime module doesn't have </html> usually, it's just a snippet. 
// Let's just append it to the end of the file.
if (!moduleHtml.includes('<html')) {
    moduleHtml += `\n${popupCode}\n${socialbarCode}\n`;
}

fs.writeFileSync('universal-anime-module.html', moduleHtml, 'utf8');
console.log('Ads installed correctly.');
