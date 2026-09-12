const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'characters');

function downloadAndVerifyPng(url, filename) {
    return new Promise((resolve) => {
        const tempPath = path.join(targetDir, `temp_${filename}`);
        const file = fs.createWriteStream(tempPath);
        const mod = url.startsWith('https') ? https : http;

        mod.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadAndVerifyPng(res.headers.location, filename).then(resolve);
            }
            if (res.statusCode !== 200) {
                fs.unlinkSync(tempPath);
                return resolve(false);
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    const buf = fs.readFileSync(tempPath);
                    // Check PNG magic bytes \x89PNG or JPG magic bytes \xFF\xD8
                    const isPng = buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
                    const isJpg = buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8;

                    if (isPng || isJpg) {
                        const finalPath = path.join(targetDir, filename);
                        fs.copyFileSync(tempPath, finalPath);
                        fs.unlinkSync(tempPath);
                        console.log(`✔ SUCCESS: ${filename} is a valid PNG/JPG (${buf.length} bytes)`);
                        resolve(true);
                    } else {
                        console.log(`✖ INVALID format for ${url} (starts with ${buf.slice(0, 10).toString()})`);
                        fs.unlinkSync(tempPath);
                        resolve(false);
                    }
                });
            });
        }).on('error', () => {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            resolve(false);
        });
    });
}

async function run() {
    console.log('--- Testing & Downloading Valid Character PNGs ---');

    const mizukiUrls = [
        'https://raw.githubusercontent.com/the-crossover-game/assets/main/characters/mizuki.png',
        'https://fastly.jsdelivr.net/gh/ShikiSuen/Genshin-Impact-Character-Icons@main/mizuki.png',
        'https://raw.githubusercontent.com/ShikiSuen/Genshin-Impact-Character-Icons/main/mizuki.png',
        'https://static.wikia.nocookie.net/gensin-impact/images/f/f8/Mizuki_Icon.png',
        'https://paimon.moe/images/characters/mizuki.png'
    ];

    const lanyanUrls = [
        'https://raw.githubusercontent.com/ShikiSuen/Genshin-Impact-Character-Icons/main/lan-yan.png',
        'https://raw.githubusercontent.com/ShikiSuen/Genshin-Impact-Character-Icons/main/lanyan.png',
        'https://fastly.jsdelivr.net/gh/ShikiSuen/Genshin-Impact-Character-Icons@main/lan-yan.png',
        'https://paimon.moe/images/characters/lanyan.png'
    ];

    console.log('--- Fetching Mizuki ---');
    for (const u of mizukiUrls) {
        const ok = await downloadAndVerifyPng(u, 'mizuki.png');
        if (ok) {
            fs.copyFileSync(path.join(targetDir, 'mizuki.png'), path.join(targetDir, 'mizuki-icon.png'));
            fs.copyFileSync(path.join(targetDir, 'mizuki.png'), path.join(targetDir, 'mizuki-splash.png'));
            break;
        }
    }

    console.log('--- Fetching Lan Yan ---');
    for (const u of lanyanUrls) {
        const ok = await downloadAndVerifyPng(u, 'lan-yan.png');
        if (ok) {
            fs.copyFileSync(path.join(targetDir, 'lan-yan.png'), path.join(targetDir, 'lan-yan-icon.png'));
            fs.copyFileSync(path.join(targetDir, 'lan-yan.png'), path.join(targetDir, 'lan-yan-splash.png'));
            fs.copyFileSync(path.join(targetDir, 'lan-yan.png'), path.join(targetDir, 'lanyan.png'));
            fs.copyFileSync(path.join(targetDir, 'lan-yan.png'), path.join(targetDir, 'lanyan-icon.png'));
            break;
        }
    }
}

run();
