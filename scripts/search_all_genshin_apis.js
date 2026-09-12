const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'characters');

function checkAndDownload(url, filename) {
    return new Promise((resolve) => {
        const temp = path.join(targetDir, `test_${filename}`);
        const file = fs.createWriteStream(temp);

        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return checkAndDownload(res.headers.location, filename).then(resolve);
            }
            if (res.statusCode !== 200) {
                fs.unlinkSync(temp);
                return resolve(false);
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    const buf = fs.readFileSync(temp);
                    const isPng = buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
                    const isJpg = buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8;
                    const isWebp = buf.length > 12 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;

                    if (isPng || isJpg || isWebp) {
                        const ext = isPng ? '.png' : isJpg ? '.jpg' : '.webp';
                        const finalName = filename.replace(/\.\w+$/, ext);
                        fs.copyFileSync(temp, path.join(targetDir, finalName));
                        fs.unlinkSync(temp);
                        console.log(`✔ FOUND VALID IMAGE (${buf.length} bytes): ${url} -> ${finalName}`);
                        resolve(true);
                    } else {
                        fs.unlinkSync(temp);
                        resolve(false);
                    }
                });
            });
        }).on('error', () => {
            if (fs.existsSync(temp)) fs.unlinkSync(temp);
            resolve(false);
        });
    });
}

async function run() {
    console.log('--- Searching Genshin CDNs for Mizuki & Lan Yan ---');

    const mizukiUrls = [
        'https://gi.yatta.top/assets/UI/UI_AvatarIcon_Mizuki.png',
        'https://gi.yatta.top/assets/UI/UI_AvatarIcon_Yumeharu.png',
        'https://api.ambr.top/assets/UI/UI_AvatarIcon_Mizuki.png',
        'https://vignette.wikia.nocookie.net/gensin-impact/images/thumb/Mizuki_Icon.png/256px-Mizuki_Icon.png',
        'https://static.wikia.nocookie.net/gensin-impact/images/5/52/Mizuki_Icon.png',
        'https://static.wikia.nocookie.net/gensin-impact/images/a/a6/Mizuki_Card.png',
        'https://raw.githubusercontent.com/GenshinData/GenshinData/main/Texture2D/UI_AvatarIcon_Mizuki.png'
    ];

    const lanyanUrls = [
        'https://gi.yatta.top/assets/UI/UI_AvatarIcon_Lanyan.png',
        'https://gi.yatta.top/assets/UI/UI_AvatarIcon_LanYan.png',
        'https://api.ambr.top/assets/UI/UI_AvatarIcon_Lanyan.png',
        'https://static.wikia.nocookie.net/gensin-impact/images/0/07/Lan_Yan_Icon.png',
        'https://static.wikia.nocookie.net/gensin-impact/images/a/a2/Lan_Yan_Card.png',
        'https://raw.githubusercontent.com/GenshinData/GenshinData/main/Texture2D/UI_AvatarIcon_Lanyan.png'
    ];

    console.log('Searching Mizuki...');
    for (const u of mizukiUrls) {
        const ok = await checkAndDownload(u, 'mizuki.png');
        if (ok) break;
    }

    console.log('Searching Lan Yan...');
    for (const u of lanyanUrls) {
        const ok = await checkAndDownload(u, 'lan-yan.png');
        if (ok) break;
    }
}

run();
