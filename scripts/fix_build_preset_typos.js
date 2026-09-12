const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'genshin-guide.db');
const db = new Database(dbPath);

console.log('--- Fixing Build Preset ID Typos ---');

const presets = db.prepare('SELECT id, weapon_ids, artifact_set_ids FROM build_presets').all();

const replacements = {
    'dragons-bane': 'dragon-s-bane',
    'nymphs-dream': 'nymph-s-dream',
    'wolfs-gravestone': 'wolf-s-gravestone',
    'tome-of-the-eternal-flow': 'tome-of-the-eternal-flow',
    'tulaytullahs-remembrance': 'tulaytullah-s-remembrance',
    'kaguras-verity': 'kagura-s-verity',
    'gladiators-finale': 'gladiator-s-finale'
};

const updateStmt = db.prepare('UPDATE build_presets SET weapon_ids = ?, artifact_set_ids = ? WHERE id = ?');

presets.forEach(p => {
    let wStr = p.weapon_ids || '[]';
    let aStr = p.artifact_set_ids || '[]';

    Object.entries(replacements).forEach(([from, to]) => {
        wStr = wStr.replaceAll(from, to);
        aStr = aStr.replaceAll(from, to);
    });

    updateStmt.run(wStr, aStr, p.id);
});

console.log('✔ Fixed build preset weapon and artifact ID typos');
