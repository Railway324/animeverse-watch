const fs = require('fs');
const https = require('https');

const titles = [
    "One Piece", "Demon Slayer", "Naruto Shippuden", "Naruto", "My Hero Academia",
    "Chainsaw Man", "Solo Leveling", "Jujutsu Kaisen", "Attack on Titan", "Boruto: Naruto Next Generations",
    "Dragon Ball Z", "Dragon Ball Super", "Bleach", "Hunter x Hunter", "Death Note",
    "Black Clover", "One Punch Man", "Spy x Family", "Dr. Stone", "Tokyo Revengers",
    "Fullmetal Alchemist: Brotherhood", "Steins;Gate", "Sword Art Online", "Tokyo Ghoul", "Haikyuu!!",
    "Cyberpunk: Edgerunners", "Blue Lock", "Kaiju No. 8", "Wind Breaker"
];

async function fetchCover(title) {
    const query = `
        query ($search: String) {
            Media (search: $search, type: ANIME) {
                title { romaji english }
                coverImage { large extraLarge }
            }
        }
    `;

    return new Promise((resolve, reject) => {
        const req = https.request('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.data.Media.coverImage.extraLarge || json.data.Media.coverImage.large);
                    } catch(e) {
                         resolve(null);
                    }
                } else if (res.statusCode === 429) {
                    resolve("RATE_LIMIT");
                }else {
                    resolve(null);
                }
            });
        });
        req.on('error', reject);
        req.write(JSON.stringify({ query, variables: { search: title } }));
        req.end();
    });
}

(async () => {
    let html = fs.readFileSync('index.html', 'utf8');
    for (const title of titles) {
        let cover = null;
        while(true) {
            cover = await fetchCover(title);
            if (cover === "RATE_LIMIT") {
                console.log("Rate limited, waiting 2s...");
                await new Promise(r => setTimeout(r, 2000));
            } else {
                break;
            }
        }
        if (cover) {
            console.log(`Found cover for ${title}: ${cover}`);
            // Find the object in index.html and replace thumbnail
            const regex = new RegExp(`title:\\s*"${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?thumbnail:\\s*"([^"]+)"`);
            html = html.replace(regex, (match, oldThumb) => {
                return match.replace(oldThumb, cover);
            });
        } else {
            console.log(`NO COVER found for ${title}`);
            // Fallback: Use Jikan API for Jikan covers
            const fallbackCover = await fetchFallbackCover(title);
            if (fallbackCover) {
                console.log(`Fallback cover for ${title}: ${fallbackCover}`);
                 const regex = new RegExp(`title:\\s*"${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?thumbnail:\\s*"([^"]+)"`);
                html = html.replace(regex, (match, oldThumb) => {
                    return match.replace(oldThumb, fallbackCover);
                });
            }
        }
        await new Promise(r => setTimeout(r, 800)); // To prevent arbitrary rate limiting
    }
    
    // Change aspect ratio of cards to 3/4 since covers are portrait (original movie poster format)
    html = html.replace(/aspect-ratio: 16\/9;/g, 'aspect-ratio: 3/4;');
    
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Done updating index.html");
})();

async function fetchFallbackCover(title) {
    return new Promise((resolve) => {
        const req = https.request(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`, {
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.data[0].images.jpg.large_image_url);
                    } catch(e) { resolve(null); }
                } else {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
        req.end();
    });
}
