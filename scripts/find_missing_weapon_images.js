const Database = require('better-sqlite3');
const https = require('https');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'genshin-guide.db');
const db = new Database(dbPath);

function checkUrl(url) {
    return new Promise((resolve) => {
        try {
            const req = https.request(url, { method: 'HEAD', timeout: 3000 }, (res) => {
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
    const weapons = db.prepare('SELECT id, name, type, rarity FROM weapons').all();
    console.log(`Total weapons to audit: ${weapons.length}`);

    const failing = [];
    const working = [];

    for (const w of weapons) {
        const jmpUrl = `https://genshin.jmp.blue/weapons/${w.id}/icon`;
        const code = await checkUrl(jmpUrl);
        if (code === 200) {
            working.push(w.id);
        } else {
            failing.push({ id: w.id, name: w.name, type: w.type, rarity: w.rarity, code });
        }
    }

    console.log(`Working CDN weapons: ${working.length}`);
    console.log(`Failing CDN weapons (${failing.length}):`);
    console.log(JSON.stringify(failing, null, 2));
}

run();
