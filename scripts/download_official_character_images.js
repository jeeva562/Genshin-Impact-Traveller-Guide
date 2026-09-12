const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'characters');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

function downloadFile(url, dest) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://genshin-impact.fandom.com/'
            }
        };

        https.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadFile(res.headers.location, dest).then(resolve);
            }
            if (res.statusCode !== 200) {
                console.log(`Failed HTTP ${res.statusCode} for ${url}`);
                fs.unlinkSync(dest);
                return resolve(false);
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✔ Downloaded official image to ${path.basename(dest)}`);
                resolve(true);
            });
        }).on('error', (err) => {
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            console.log(`Error downloading ${url}: ${err.message}`);
            resolve(false);
        });
    });
}

async function run() {
    console.log('--- Downloading Official Character Assets ---');

    const targets = [
        {
            name: 'lan-yan',
            urls: [
                'https://assets.paimon.moe/images/characters/lan-yan.png',
                'https://assets.paimon.moe/images/characters/lanyan.png',
                'https://fastly.jsdelivr.net/gh/Mar-7th/StarRailRes@main/icon/character/1001.png'
            ]
        },
        {
            name: 'mizuki',
            urls: [
                'https://assets.paimon.moe/images/characters/mizuki.png',
                'https://fastly.jsdelivr.net/gh/Mar-7th/StarRailRes@main/icon/character/1222.png',
                'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/character/1222.png'
            ]
        },
        {
            name: 'lohen',
            urls: [
                'https://assets.paimon.moe/images/characters/lohen.png'
            ]
        }
    ];

    for (const t of targets) {
        let success = false;
        for (const u of t.urls) {
            const destPng = path.join(targetDir, `${t.name}.png`);
            success = await downloadFile(u, destPng);
            if (success) {
                // Also copy as -icon and -splash
                fs.copyFileSync(destPng, path.join(targetDir, `${t.name}-icon.png`));
                fs.copyFileSync(destPng, path.join(targetDir, `${t.name}-splash.png`));
                break;
            }
        }
    }
}

run();
