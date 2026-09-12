const https = require('https');

function checkUrl(url) {
    return new Promise((resolve) => {
        try {
            const req = https.request(url, { method: 'HEAD', timeout: 4000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
                resolve({ url, status: res.statusCode, headers: res.headers });
            });
            req.on('error', (err) => resolve({ url, status: 500, error: err.message }));
            req.on('timeout', () => { req.destroy(); resolve({ url, status: 408 }); });
            req.end();
        } catch (e) {
            resolve({ url, status: 500, error: e.message });
        }
    });
}

async function run() {
    console.log('--- Testing Official Genshin Game Image CDNs ---');

    const candidates = [
        'https://genshin.jmp.blue/characters/lan-yan/icon-big',
        'https://genshin.jmp.blue/characters/lanyan/icon-big',
        'https://genshin.jmp.blue/characters/mizuki/icon-big',
        'https://genshin.jmp.blue/characters/lohen/icon-big',
        'https://assets.paimon.moe/images/characters/lanyan.png',
        'https://assets.paimon.moe/images/characters/lan-yan.png',
        'https://assets.paimon.moe/images/characters/mizuki.png',
        'https://assets.paimon.moe/images/characters/lohen.png',
        'https://api.ambr.top/assets/UI/UI_AvatarIcon_Lanyan.png',
        'https://api.ambr.top/assets/UI/UI_AvatarIcon_Mizuki.png',
        'https://api.ambr.top/assets/UI/UI_AvatarIcon_Lohen.png',
        'https://hakush.in/genshin/UI_AvatarIcon_Lanyan.png',
        'https://hakush.in/genshin/UI_AvatarIcon_Mizuki.png',
        'https://hakush.in/genshin/UI_AvatarIcon_Lohen.png',
    ];

    for (const url of candidates) {
        const res = await checkUrl(url);
        console.log(`${res.status} => ${res.url}`);
    }
}

run();
