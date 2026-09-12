const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'characters');

function downloadFile(url, destName) {
    return new Promise((resolve) => {
        const destPath = path.join(targetDir, destName);
        const file = fs.createWriteStream(destPath);

        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadFile(res.headers.location, destName).then(resolve);
            }
            if (res.statusCode !== 200) {
                console.log(`HTTP ${res.statusCode} for ${url}`);
                fs.unlinkSync(destPath);
                return resolve(false);
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✔ Downloaded ${destName} from ${url}`);
                resolve(true);
            });
        }).on('error', (err) => {
            if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            console.log(`Err: ${err.message}`);
            resolve(false);
        });
    });
}

async function run() {
    console.log('--- Downloading Direct paimon.moe Assets ---');

    const items = [
        { url: 'https://paimon.moe/images/characters/lanyan.png', name: 'lanyan.png' },
        { url: 'https://paimon.moe/images/characters/lan-yan.png', name: 'lan-yan.png' },
        { url: 'https://paimon.moe/images/characters/mizuki.png', name: 'mizuki.png' },
        { url: 'https://paimon.moe/images/characters/lohen.png', name: 'lohen.png' },
        { url: 'https://paimon.moe/images/characters/varesa.png', name: 'varesa.png' }
    ];

    for (const item of items) {
        await downloadFile(item.url, item.name);
    }
}

run();
