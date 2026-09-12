const Database = require('better-sqlite3');
const https = require('https');
const http = require('http');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'genshin-guide.db');
const db = new Database(dbPath);

function checkUrl(url) {
    return new Promise((resolve) => {
        try {
            const mod = url.startsWith('https') ? https : http;
            const req = mod.request(url, { method: 'HEAD', timeout: 4000 }, (res) => {
                resolve(res.statusCode);
            });
            req.on('error', () => resolve(500));
            req.on('timeout', () => { req.destroy(); resolve(408); });
            req.end();
        } catch {
            resolve(500);
        }
    });
}

async function run() {
    console.log('--- Testing Character CDN URLs ---');
    const chars = ['lan-yan', 'mizuki', 'lohen', 'mualani', 'xilonen', 'chasca', 'mavuika', 'furina', 'hu-tao', 'raiden'];
    for (const c of chars) {
        const paimonUrl = `https://assets.paimon.moe/images/characters/${c}.png`;
        const jmpUrl = `https://genshin.jmp.blue/characters/${c}/icon-big`;
        const wikiUrl = `https://static.wikia.nocookie.net/gensin-impact/images/thumb/${c}.png`;

        const s1 = await checkUrl(paimonUrl);
        const s2 = await checkUrl(jmpUrl);
        console.log(`${c}: paimon => ${s1}, jmp.blue => ${s2}`);
    }

    console.log('--- Testing Sample Weapon CDN URLs ---');
    const weapons = db.prepare('SELECT id, name FROM weapons LIMIT 20').all();
    for (const w of weapons) {
        const paimonUrl = `https://assets.paimon.moe/images/weapons/${w.id}.png`;
        const jmpUrl = `https://genshin.jmp.blue/weapons/${w.id}/icon`;

        const s1 = await checkUrl(paimonUrl);
        const s2 = await checkUrl(jmpUrl);
        console.log(`${w.id} (${w.name}): paimon => ${s1}, jmp.blue => ${s2}`);
    }
}

run();
