const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// match { id: "one-piece", ... thumbnail: "url" }
const regex = /id:\s*"([^"]+)",[\s\S]*?thumbnail:\s*"([^"]+)"/g;
const imgMap = {};
let match;
while ((match = regex.exec(indexHtml)) !== null) {
    imgMap[match[1]] = match[2];
}

let moduleHtml = fs.readFileSync('universal-anime-module.html', 'utf8');

// replace in universal.html: { animeId: "one-piece", ... poster: "url" }
const moduleRegex = /animeId:\s*"([^"]+)"([\s\S]*?)poster:\s*"([^"]+)"/g;
moduleHtml = moduleHtml.replace(moduleRegex, (fullMatch, id, midPart, oldUrl) => {
    if (imgMap[id]) {
        return `animeId: "${id}"${midPart}poster: "${imgMap[id]}"`;
    }
    return fullMatch;
});

// also fix aspect ratio in universal
moduleHtml = moduleHtml.replace(/aspect-ratio:\s*16\s*\/\s*9;/g, 'aspect-ratio: 3/4;');

fs.writeFileSync('universal-anime-module.html', moduleHtml, 'utf8');
console.log('Updated universal-anime-module.html posters from index.html');
