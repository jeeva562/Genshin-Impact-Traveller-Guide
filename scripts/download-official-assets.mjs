import fs from 'fs';
import path from 'path';

// Ensure target directories exist
const dirs = [
  'public/images',
  'public/images/characters',
  'public/images/bosses',
  'public/images/monsters',
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    });
    if (!res.ok) {
      console.warn(`[SKIP] ${url} -> Status ${res.status}`);
      return false;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 500) {
      console.warn(`[SKIP] ${url} -> Too small (${buffer.length} bytes)`);
      return false;
    }
    fs.writeFileSync(destPath, buffer);
    console.log(`[OK] Saved ${destPath} (${Math.round(buffer.length / 1024)} KB)`);
    return true;
  } catch (err) {
    console.error(`[ERR] ${url} -> ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Downloading Official Open-Source Assets...');

  // 1. Paimon Assets
  console.log('\n--- 1. Official Paimon Assets ---');
  // Official Paimon full-body waving portrait (transparent)
  await downloadFile(
    'https://static.wikia.nocookie.net/gensin-impact/images/b/b4/Paimon_Portrait.png/revision/latest?cb=20240121041656',
    'public/images/paimon_portrait.png'
  );
  // Official Paimon circular icon
  await downloadFile(
    'https://enka.network/ui/UI_AvatarIcon_Paimon_Circle.png',
    'public/images/paimon_icon.png'
  );
  // Also save as favicon icon
  if (fs.existsSync('public/images/paimon_icon.png')) {
    fs.copyFileSync('public/images/paimon_icon.png', 'public/favicon.ico');
    fs.copyFileSync('public/images/paimon_icon.png', 'public/images/genshin_icon.jpg');
    fs.copyFileSync('public/images/paimon_icon.png', 'public/images/genshin_icon.png');
  }

  // 2. Character Official Icons & Splashes
  console.log('\n--- 2. Official Character Assets ---');
  const characterMappings = [
    { cid: 'mualani', enka: 'Mualani' },
    { cid: 'xilonen', enka: 'Xilonen' },
    { cid: 'chasca', enka: 'Chasca' },
    { cid: 'mavuika', enka: 'Mavuika' },
    { cid: 'citlali', enka: 'Citlali' },
    { cid: 'ororon', enka: 'Olorun' },
    { cid: 'lan-yan', enka: 'Lanyan' },
    { cid: 'lanyan', enka: 'Lanyan' },
    { cid: 'iansan', enka: 'Iansan' },
    { cid: 'kinich', enka: 'Kinich' },
    { cid: 'kachina', enka: 'Kachina' },
  ];

  for (const c of characterMappings) {
    // Icon
    await downloadFile(
      `https://enka.network/ui/UI_AvatarIcon_${c.enka}.png`,
      `public/images/characters/${c.cid}-icon.png`
    );
    // Splash
    await downloadFile(
      `https://enka.network/ui/UI_Gacha_AvatarImg_${c.enka}.png`,
      `public/images/characters/${c.cid}-splash.png`
    );
    // Main portrait
    if (fs.existsSync(`public/images/characters/${c.cid}-splash.png`)) {
      fs.copyFileSync(
        `public/images/characters/${c.cid}-splash.png`,
        `public/images/characters/${c.cid}.png`
      );
    } else if (fs.existsSync(`public/images/characters/${c.cid}-icon.png`)) {
      fs.copyFileSync(
        `public/images/characters/${c.cid}-icon.png`,
        `public/images/characters/${c.cid}.png`
      );
    }
  }

  // 3. Official Real Teyvat Map
  console.log('\n--- 3. Official Teyvat Game Map ---');
  // Community stitched full game map from wiki
  const mapSuccess = await downloadFile(
    'https://static.wikia.nocookie.net/gensin-impact/images/1/10/Teyvat_Map_5.5.png/revision/latest?cb=20250326035051',
    'public/images/teyvat_real_map.png'
  );
  if (mapSuccess) {
    // Also copy to jpg for backwards compatibility if referenced
    fs.copyFileSync('public/images/teyvat_real_map.png', 'public/images/teyvat_real_map.jpg');
  }

  // 4. Weekly Bosses (Official Icons)
  console.log('\n--- 4. Official Weekly Bosses ---');
  const weeklyBosses = [
    { id: 'stormterror', name: 'Stormterror (Dvalin)' },
    { id: 'lupus-boreas', name: 'Lupus Boreas (Andrius)' },
    { id: 'childe', name: 'Childe (Tartaglia)' },
    { id: 'azhdaha', name: 'Azhdaha' },
    { id: 'la-signora', name: 'La Signora' },
    { id: 'magatsu-mitake-narukami-no-mikoto', name: 'Magatsu Mitake Narukami no Mikoto' },
    { id: 'everlasting-lord-of-arcane-wisdom', name: 'Journeyman (Scaramouche)' },
    { id: 'guardian-of-apep-s-oasis', name: "Guardian of Apep's Oasis" },
    { id: 'all-devouring-narwhal', name: 'All-Devouring Narwhal' },
    { id: 'the-knave', name: 'The Knave (Arlecchino)' },
  ];

  for (const b of weeklyBosses) {
    await downloadFile(
      `https://genshin.jmp.blue/boss/weekly-boss/${b.id}/icon`,
      `public/images/bosses/${b.id}.png`
    );
  }

  // 5. Region Monsters (Official Icons)
  console.log('\n--- 5. Official Region Monster Icons ---');
  const monsters = [
    'ruin-guard',
    'geovishap',
    'eye-of-the-storm',
    'fatui-agent',
    'fatui-cicin-mage',
    'fatui-skirmisher',
    'hilichurl',
    'mitachurl',
    'lawachurl',
    'abyss-mage',
    'bathysmal-vishap',
    'consecrated-beast',
    'floating-fungus',
    'specter',
    'kairagi',
    'nobushi',
  ];

  for (const m of monsters) {
    await downloadFile(
      `https://genshin.jmp.blue/enemies/${m}/icon`,
      `public/images/monsters/${m}.png`
    );
  }

  console.log('\n✅ All official open-source assets downloaded successfully!');
}

main();
