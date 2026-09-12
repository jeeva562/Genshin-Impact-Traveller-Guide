const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'genshin-guide.db');
const db = new Database(dbPath);

console.log('--- Auditing All Character Build Presets & Info ---');

const chars = db.prepare('SELECT id, name, vision, weapon_type, rarity, nation FROM characters').all();
const weapons = new Set(db.prepare('SELECT id FROM weapons').all().map(w => w.id));
const artifacts = new Set(db.prepare('SELECT id FROM artifact_sets').all().map(a => a.id));

let issues = [];

chars.forEach(c => {
    // Check build presets
    const presets = db.prepare('SELECT * FROM build_presets WHERE character_id = ?').all(c.id);
    if (presets.length === 0) {
        issues.push(`[${c.name}] Missing build presets`);
    } else {
        presets.forEach(p => {
            try {
                const wList = JSON.parse(p.weapon_ids || '[]');
                const invalidW = wList.filter(wId => !weapons.has(wId));
                if (invalidW.length > 0) {
                    issues.push(`[${c.name}] Invalid recommended weapon IDs: ${invalidW.join(', ')}`);
                }
            } catch {
                issues.push(`[${c.name}] Failed to parse weapon_ids JSON`);
            }

            try {
                const aList = JSON.parse(p.artifact_set_ids || '[]');
                const invalidA = aList.filter(aId => !artifacts.has(aId));
                if (invalidA.length > 0) {
                    issues.push(`[${c.name}] Invalid recommended artifact IDs: ${invalidA.join(', ')}`);
                }
            } catch {
                issues.push(`[${c.name}] Failed to parse artifact_set_ids JSON`);
            }
        });
    }
});

console.log(`Total Characters Audited: ${chars.length}`);
console.log(`Build Issues Found: ${issues.length}`);
if (issues.length > 0) {
    console.log(issues.slice(0, 30).join('\n'));
} else {
    console.log('✔ All character build recommendations, weapon IDs, and artifact IDs are 100% valid!');
}
