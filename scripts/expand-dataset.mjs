/**
 * Dataset Expansion Script
 * Adds missing characters (Mualani, Xilonen, Chasca, Ororon, Mavuika, Citlali, Lan Yan, Iansan),
 * weapons (Surf's Up, Fang of the Mountain King, Peak Patrol Song, Astral Vulture's Crimson Plumage,
 * A Thousand Blazing Suns, Starcaller's Watch, Absolution, Silvershower Heartstrings, Natlan craftables),
 * and artifact sets (Scroll of the Hero of Cinder City, Obsidian Codex).
 */

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'genshin-guide.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

console.log('🚀 Starting Dataset Expansion...');

const insertChar = db.prepare(`INSERT OR REPLACE INTO characters 
  (id, name, title, vision, weapon_type, rarity, nation, affiliation, description,
   constellation_name, birthday, release_date, gender, vision_key, weapon_type_key)
  VALUES (@id, @name, @title, @vision, @weapon_type, @rarity, @nation, @affiliation, @description,
   @constellation_name, @birthday, @release_date, @gender, @vision_key, @weapon_type_key)`);

const insertWeapon = db.prepare(`INSERT OR REPLACE INTO weapons
  (id, name, type, rarity, base_attack, sub_stat, passive_name, passive_desc, location, ascension_material)
  VALUES (@id, @name, @type, @rarity, @base_attack, @sub_stat, @passive_name, @passive_desc, @location, @ascension_material)`);

const insertArtifact = db.prepare(`INSERT OR REPLACE INTO artifact_sets
  (id, name, max_rarity, two_piece_bonus, four_piece_bonus)
  VALUES (@id, @name, @max_rarity, @two_piece_bonus, @four_piece_bonus)`);

const insertBuild = db.prepare(`INSERT OR REPLACE INTO build_presets
  (character_id, preset_name, preset_type, weapon_ids, artifact_set_ids, artifact_sets_config,
   main_stats, sub_stats, stat_targets, talent_priority, constellation_notes, role, notes)
  VALUES (@character_id, @preset_name, @preset_type, @weapon_ids, @artifact_set_ids, @artifact_sets_config,
   @main_stats, @sub_stats, @stat_targets, @talent_priority, @constellation_notes, @role, @notes)`);

const insertSearch = db.prepare(`INSERT OR REPLACE INTO search_index (entity_id, entity_type, name, keywords)
  VALUES (?, ?, ?, ?)`);

// New Characters
const newCharacters = [
  {
    id: 'mualani',
    name: 'Mualani',
    title: 'Splish-Splash Wavechaser',
    vision: 'Hydro',
    weapon_type: 'Catalyst',
    rarity: 5,
    nation: 'Natlan',
    affiliation: 'People of the Springs',
    description: 'A well-known guide and water-sports gear shop owner in Natlan, skilled in navigating the diverse waterways of the nation on her shark surfboard.',
    constellation_name: 'Phoca Neomonachus',
    birthday: '09-03',
    release_date: '2024-08-28',
    gender: 'Female',
    vision_key: 'HYDRO',
    weapon_type_key: 'CATALYST'
  },
  {
    id: 'xilonen',
    name: 'Xilonen',
    title: 'Nameless Wilds, Hearth of Forging',
    vision: 'Geo',
    weapon_type: 'Sword',
    rarity: 5,
    nation: 'Natlan',
    affiliation: 'Children of Echoes',
    description: 'A passionate smith from the Children of Echoes tribe, master of crafting ancient name engravings and forging sacred weapons with rhythm and fire.',
    constellation_name: 'Panthera Oca',
    birthday: '03-24',
    release_date: '2024-10-09',
    gender: 'Female',
    vision_key: 'GEO',
    weapon_type_key: 'SWORD'
  },
  {
    id: 'chasca',
    name: 'Chasca',
    title: 'Sky-Roving Feather',
    vision: 'Anemo',
    weapon_type: 'Bow',
    rarity: 5,
    nation: 'Natlan',
    affiliation: 'Flower-Feather Clan',
    description: 'The premier peacekeeper of the Flower-Feather Clan, soaring through the sky on her Soulesprit revolver gun to maintain balance across Natlan.',
    constellation_name: 'Vultur Gryphus',
    birthday: '12-09',
    release_date: '2024-11-20',
    gender: 'Female',
    vision_key: 'ANEMO',
    weapon_type_key: 'BOW'
  },
  {
    id: 'ororon',
    name: 'Ororon',
    title: 'Shadow of the Night-Wind',
    vision: 'Electro',
    weapon_type: 'Bow',
    rarity: 4,
    nation: 'Natlan',
    affiliation: 'Masters of the Night-Wind',
    description: 'A quiet yet perceptive youth from the Masters of the Night-Wind, capable of perceiving spirits and unraveling deep ancestral mysteries.',
    constellation_name: 'Vespertilio',
    birthday: '10-01',
    release_date: '2024-11-20',
    gender: 'Male',
    vision_key: 'ELECTRO',
    weapon_type_key: 'BOW'
  },
  {
    id: 'mavuika',
    name: 'Mavuika',
    title: 'The Habitation of Fire',
    vision: 'Pyro',
    weapon_type: 'Claymore',
    rarity: 5,
    nation: 'Natlan',
    affiliation: 'Natlan Archon',
    description: 'The revered Pyro Archon of Natlan, master of the Sacred Flame who rides across the battlefield with boundless passion and burning resolve.',
    constellation_name: 'Sol Invictus',
    birthday: '08-15',
    release_date: '2025-01-01',
    gender: 'Female',
    vision_key: 'PYRO',
    weapon_type_key: 'CLAYMORE'
  },
  {
    id: 'citlali',
    name: 'Citlali',
    title: 'Obsidian Star-Weaver',
    vision: 'Cryo',
    weapon_type: 'Catalyst',
    rarity: 5,
    nation: 'Natlan',
    affiliation: 'Masters of the Night-Wind',
    description: 'A venerable yet dramatic shaman from the Masters of the Night-Wind who commands obsidian spirits and starry frost shields.',
    constellation_name: 'Itzpapalotl',
    birthday: '01-20',
    release_date: '2025-01-01',
    gender: 'Female',
    vision_key: 'CRYO',
    weapon_type_key: 'CATALYST'
  },
  {
    id: 'lan-yan',
    name: 'Lan Yan',
    title: 'Verdant Breeze of Yilong',
    vision: 'Anemo',
    weapon_type: 'Catalyst',
    rarity: 4,
    nation: 'Liyue',
    affiliation: 'Chenyu Vale',
    description: 'A skilled martial artist and tea merchant from Chenyu Vale who weaves gentle breezes and martial arts in harmony.',
    constellation_name: 'Hirundo Viridis',
    birthday: '04-18',
    release_date: '2025-01-22',
    gender: 'Female',
    vision_key: 'ANEMO',
    weapon_type_key: 'CATALYST'
  },
  {
    id: 'iansan',
    name: 'Iansan',
    title: 'Roaring Flame Champion',
    vision: 'Electro',
    weapon_type: 'Polearm',
    rarity: 4,
    nation: 'Natlan',
    affiliation: 'Collective of Plenty',
    description: 'The fierce athletic coach of Natlan who pushes warriors to their absolute limits with lightning-fast combat workouts.',
    constellation_name: 'Capra Aegagrus',
    birthday: '05-12',
    release_date: '2025-02-15',
    gender: 'Female',
    vision_key: 'ELECTRO',
    weapon_type_key: 'POLEARM'
  }
];

// New Weapons
const newWeapons = [
  {
    id: 'surf-s-up',
    name: "Surf's Up",
    type: 'Catalyst',
    rarity: 5,
    base_attack: 542,
    sub_stat: 'CRIT DMG 88.2%',
    passive_name: 'Aqua Crest',
    passive_desc: 'Max HP increased by 20%. Once every 15s, for 14s after using an Elemental Skill: Gain 4 stacks of Scorching Summer. Each stack increases Normal Attack DMG by 12%. When triggering Vaporize on an opponent, consumes 1 stack.',
    location: 'Gacha',
    ascension_material: 'Blazing Sacrificial Heart'
  },
  {
    id: 'fang-of-the-mountain-king',
    name: 'Fang of the Mountain King',
    type: 'Claymore',
    rarity: 5,
    base_attack: 608,
    sub_stat: 'CRIT Rate 33.1%',
    passive_name: 'Turquoise Canopy',
    passive_desc: 'Gain 1 stack of Canopy\'s Favor when hitting an opponent with an Elemental Skill. Can be triggered once every 0.5s. After triggering Burning or Burgeon, gain 3 stacks. Each stack increases Elemental Skill and Burst DMG by 10%. Max 6 stacks.',
    location: 'Gacha',
    ascension_material: 'Delirious Decadence of the Sacred Lord'
  },
  {
    id: 'peak-patrol-song',
    name: 'Peak Patrol Song',
    type: 'Sword',
    rarity: 5,
    base_attack: 542,
    sub_stat: 'DEF 82.7%',
    passive_name: 'Ode to Rolling Sands',
    passive_desc: 'Gain the "Ode to Rolling Sands" effect when Normal/Plunging attacks hit opponents: Gain DEF +8% and 10% All Elemental DMG Bonus for 6s. When in Nightsoul\'s Blessing, grants all nearby party members 25.6% All Elemental DMG Bonus.',
    location: 'Gacha',
    ascension_material: 'Blazing Sacrificial Heart'
  },
  {
    id: 'astral-vulture-s-crimson-plumage',
    name: "Astral Vulture's Crimson Plumage",
    type: 'Bow',
    rarity: 5,
    base_attack: 608,
    sub_stat: 'CRIT DMG 66.2%',
    passive_name: 'Searing Quills',
    passive_desc: 'Triggering a Swirl reaction grants the equipping character 24% ATK for 12s. Furthermore, when there are at least 1/2 characters in the party of a different Elemental Type from the equipping character, Charged Attack DMG dealt is increased by 20%/48%.',
    location: 'Gacha',
    ascension_material: 'Delirious Decadence of the Sacred Lord'
  },
  {
    id: 'a-thousand-blazing-suns',
    name: 'A Thousand Blazing Suns',
    type: 'Claymore',
    rarity: 5,
    base_attack: 741,
    sub_stat: 'CRIT Rate 11.0%',
    passive_name: 'Flames of Judgment',
    passive_desc: 'Increases CRIT DMG by 28%. When in Nightsoul\'s Blessing, Elemental Burst DMG is increased by 40%. Triggering Nightsoul Burst restores 12 Energy to the equipping character.',
    location: 'Gacha',
    ascension_material: 'Blazing Sacrificial Heart'
  },
  {
    id: 'starcaller-s-watch',
    name: "Starcaller's Watch",
    type: 'Catalyst',
    rarity: 5,
    base_attack: 542,
    sub_stat: 'CRIT DMG 88.2%',
    passive_name: 'Starlight Veil',
    passive_desc: 'Shield Strength increased by 30%. When creating a shield or triggering a Frozen/Melt reaction, grants 28% All Elemental DMG Bonus to nearby party members for 15s.',
    location: 'Gacha',
    ascension_material: 'Delirious Decadence of the Sacred Lord'
  },
  {
    id: 'absolution',
    name: 'Absolution',
    type: 'Sword',
    rarity: 5,
    base_attack: 674,
    sub_stat: 'CRIT DMG 44.1%',
    passive_name: 'Flowing Light',
    passive_desc: 'CRIT DMG increased by 20%. Increasing the value of a Bond of Life increases DMG dealt by 16% for 6s. Max 3 stacks.',
    location: 'Gacha',
    ascension_material: 'Ancient Chord of Fontaine'
  },
  {
    id: 'silvershower-heartstrings',
    name: 'Silvershower Heartstrings',
    type: 'Bow',
    rarity: 5,
    base_attack: 542,
    sub_stat: 'HP 66.2%',
    passive_name: 'Remedy Song',
    passive_desc: 'The equipping character can gain the Remedy effect. Max HP is increased by 12%/24%/40% and Elemental Burst CRIT Rate is increased by 28%.',
    location: 'Gacha',
    ascension_material: 'Ancient Chord of Fontaine'
  },
  {
    id: 'earth-shaker',
    name: 'Earth Shaker',
    type: 'Claymore',
    rarity: 4,
    base_attack: 565,
    sub_stat: 'ATK 27.6%',
    passive_name: 'Oath of the Heavy Blade',
    passive_desc: 'After a party member triggers a Pyro-related reaction, the equipping character\'s Elemental Skill DMG is increased by 16% for 8s.',
    location: 'Forge (Natlan)',
    ascension_material: 'Blazing Sacrificial Heart'
  },
  {
    id: 'footprint-of-the-rainbow',
    name: 'Footprint of the Rainbow',
    type: 'Polearm',
    rarity: 4,
    base_attack: 510,
    sub_stat: 'DEF 51.7%',
    passive_name: 'Vessel of Springs',
    passive_desc: 'Using an Elemental Skill increases DEF by 16% for 15s.',
    location: 'Forge (Natlan)',
    ascension_material: 'Delirious Decadence of the Sacred Lord'
  },
  {
    id: 'flute-of-ezpitzal',
    name: 'Flute of Ezpitzal',
    type: 'Sword',
    rarity: 4,
    base_attack: 454,
    sub_stat: 'DEF 69.0%',
    passive_name: 'Smoldering Song',
    passive_desc: 'Using an Elemental Skill increases DEF by 16% for 15s.',
    location: 'Forge (Natlan)',
    ascension_material: 'Blazing Sacrificial Heart'
  },
  {
    id: 'ring-of-yaxche',
    name: 'Ring of Yaxche',
    type: 'Catalyst',
    rarity: 4,
    base_attack: 510,
    sub_stat: 'HP 41.3%',
    passive_name: 'Echoing Plunge',
    passive_desc: 'Using an Elemental Skill increases Normal Attack DMG by 0.6% for every 1,000 Max HP for 10s. Max DMG increase: 32%.',
    location: 'Forge (Natlan)',
    ascension_material: 'Delirious Decadence of the Sacred Lord'
  },
  {
    id: 'chain-breaker',
    name: 'Chain Breaker',
    type: 'Bow',
    rarity: 4,
    base_attack: 565,
    sub_stat: 'ATK 27.6%',
    passive_name: 'Flow of Plumes',
    passive_desc: 'For every party member from Natlan or who has a different Elemental Type from the equipper, gain 4.8% ATK and 24 Elemental Mastery.',
    location: 'Forge (Natlan)',
    ascension_material: 'Blazing Sacrificial Heart'
  }
];

// New Artifact Sets
const newArtifacts = [
  {
    id: 'scroll-of-the-hero-of-cinder-city',
    name: 'Scroll of the Hero of Cinder City',
    max_rarity: 5,
    two_piece_bonus: 'When a nearby party member triggers a Nightsoul Burst, the equipping character regenerates 6 Elemental Energy.',
    four_piece_bonus: 'After the equipping character triggers an Elemental Reaction related to their Elemental Type, all nearby party members gain 12% Elemental DMG Bonus for the elements involved for 15s. If in Nightsoul\'s Blessing, this bonus is increased by 28% (total 40%).'
  },
  {
    id: 'obsidian-codex',
    name: 'Obsidian Codex',
    max_rarity: 5,
    two_piece_bonus: 'While the equipping character is in Nightsoul\'s Blessing and is on the field, their DMG dealt is increased by 15%.',
    four_piece_bonus: 'After the equipping character consumes 1 Nightsoul point while on the field, CRIT Rate is increased by 40% for 6s. This effect can trigger once every 1s.'
  }
];

// Seed Characters
newCharacters.forEach(c => {
  insertChar.run(c);
  insertSearch.run(c.id, 'character', c.name, `${c.vision} ${c.weapon_type} ${c.nation} ${c.title || ''}`);
});

// Seed Weapons
newWeapons.forEach(w => {
  insertWeapon.run(w);
  insertSearch.run(w.id, 'weapon', w.name, `${w.type} ${w.rarity} ${w.sub_stat}`);
});

// Seed Artifacts
newArtifacts.forEach(a => {
  insertArtifact.run(a);
  insertSearch.run(a.id, 'artifact', a.name, `${a.two_piece_bonus} ${a.four_piece_bonus}`);
});

// Seed Builds for New Characters
const newBuilds = [
  {
    character_id: 'mualani',
    preset_name: 'Vaporize Main DPS',
    preset_type: 'general',
    weapon_ids: JSON.stringify(["surf-s-up", "ring-of-yaxche", "sacrificial-jade", "the-widsith"]),
    artifact_set_ids: JSON.stringify(["obsidian-codex", "heart-of-depth", "nymphs-dream"]),
    artifact_sets_config: JSON.stringify([
      { name: "Obsidian Codex (4pc)", count: 4, notes: "Best in Slot: +15% DMG and massive +40% CRIT Rate." },
      { name: "Heart of Depth (4pc)", count: 4, notes: "Reliable +15% Hydro DMG and +30% Normal Attack DMG." }
    ]),
    main_stats: JSON.stringify({ sands: "HP% / Elemental Mastery", goblet: "Hydro DMG Bonus", circlet: "CRIT DMG / CRIT Rate" }),
    sub_stats: JSON.stringify(["CRIT DMG", "CRIT Rate", "HP%", "Elemental Mastery", "Energy Recharge"]),
    stat_targets: JSON.stringify([
      { stat: "Max HP", min: "32,000", good: "36,000", excellent: "42,000+" },
      { stat: "CRIT Rate", min: "50%", good: "60%", excellent: "70%" },
      { stat: "CRIT DMG", min: "160%", good: "200%", excellent: "230%+" },
      { stat: "Elemental Mastery", min: "100", good: "160", excellent: "220+" }
    ]),
    talent_priority: JSON.stringify([
      { name: "Surfshark Wavebreaker (Skill)", priority: 1, reason: "Primary damage source through Sharky Bite" },
      { name: "Boomsharka-laka (Burst)", priority: 2, reason: "Massive nuke damage on Vaporize" },
      { name: "Cooling Treatment (Normal)", priority: 3, reason: "Not used for damage" }
    ]),
    constellation_notes: JSON.stringify([
      { level: 1, impact: "High Impact", notes: "Increases Sharky\'s Surfing Bite DMG by 66% Max HP" },
      { level: 2, impact: "Quality of Life", notes: "Instantly gains 2 Wavechaser stacks upon entering skill" }
    ]),
    role: "Main DPS",
    notes: "Mualani deals staggering single-target burst damage via Vaporize with Xiangling, Emilie, or Dehya providing Pyro aura."
  },
  {
    character_id: 'xilonen',
    preset_name: 'Universal Elemental Shred Support',
    preset_type: 'general',
    weapon_ids: JSON.stringify(["peak-patrol-song", "favonius-sword", "flute-of-ezpitzal"]),
    artifact_set_ids: JSON.stringify(["scroll-of-the-hero-of-cinder-city", "husk-of-opulent-dreams"]),
    artifact_sets_config: JSON.stringify([
      { name: "Scroll of the Hero of Cinder City (4pc)", count: 4, notes: "Best in Slot: grants 40% Elemental DMG to team." }
    ]),
    main_stats: JSON.stringify({ sands: "DEF%", goblet: "DEF%", circlet: "Healing Bonus / DEF%" }),
    sub_stats: JSON.stringify(["DEF%", "Energy Recharge", "CRIT Rate", "Flat DEF"]),
    stat_targets: JSON.stringify([
      { stat: "DEF", min: "2,600", good: "3,000", excellent: "3,400+" },
      { stat: "Energy Recharge", min: "160%", good: "180%", excellent: "200%" }
    ]),
    talent_priority: JSON.stringify([
      { name: "Yohual\'s Scratch (Skill)", priority: 1, reason: "Max shred value for Pyro/Hydro/Cryo/Electro elements" },
      { name: "Ocelotlicue Point! (Burst)", priority: 2, reason: "Provides team healing" },
      { name: "Normal Attack", priority: 3, reason: "Low priority" }
    ]),
    constellation_notes: JSON.stringify([
      { level: 2, impact: "Game Changing", notes: "Team-wide massive buffs tailored to each element in party" }
    ]),
    role: "Support / Healer",
    notes: "Top-tier universal shred support comparable to Kazuha with party-wide healing capabilities."
  },
  {
    character_id: 'chasca',
    preset_name: 'Multi-Element Roving Carry',
    preset_type: 'general',
    weapon_ids: JSON.stringify(["astral-vulture-s-crimson-plumage", "the-first-great-magic", "aqua-simulacra", "chain-breaker"]),
    artifact_set_ids: JSON.stringify(["obsidian-codex", "desert-pavilion-chronicle"]),
    artifact_sets_config: JSON.stringify([
      { name: "Obsidian Codex (4pc)", count: 4, notes: "Best in Slot: +40% CRIT Rate during Nightsoul" }
    ]),
    main_stats: JSON.stringify({ sands: "ATK%", goblet: "Anemo DMG / ATK%", circlet: "CRIT DMG" }),
    sub_stats: JSON.stringify(["CRIT DMG", "CRIT Rate", "ATK%", "Energy Recharge"]),
    stat_targets: JSON.stringify([
      { stat: "ATK", min: "1,900", good: "2,200", excellent: "2,500+" },
      { stat: "CRIT Rate", min: "50%", good: "60%", excellent: "70%" },
      { stat: "CRIT DMG", min: "170%", good: "210%", excellent: "240%+" }
    ]),
    talent_priority: JSON.stringify([
      { name: "Spirit Bridle (Skill)", priority: 1, reason: "Drives her aerial shadowhunt multi-element bullets" },
      { name: "Soul Reaper (Burst)", priority: 2, reason: "Strong area bombardment" },
      { name: "Phantom Bow (Normal)", priority: 3, reason: "Skill scales separately" }
    ]),
    constellation_notes: JSON.stringify([
      { level: 1, impact: "High Impact", notes: "Increases elemental bullet conversion chance" }
    ]),
    role: "Main DPS",
    notes: "Transforms team elements (Pyro/Hydro/Cryo/Electro) into devastating multi-target rainbow artillery."
  },
  {
    character_id: 'mavuika',
    preset_name: 'Pyro Archon Hypercarry & Buffer',
    preset_type: 'general',
    weapon_ids: JSON.stringify(["a-thousand-blazing-suns", "beacon-of-the-reed-sea", "wolfs-gravestone", "earth-shaker"]),
    artifact_set_ids: JSON.stringify(["obsidian-codex", "scroll-of-the-hero-of-cinder-city", "crimson-witch-of-flames"]),
    artifact_sets_config: JSON.stringify([
      { name: "Obsidian Codex (4pc)", count: 4, notes: "+15% DMG and +40% CRIT Rate during Nightsoul's Blessing" }
    ]),
    main_stats: JSON.stringify({ sands: "ATK%", goblet: "Pyro DMG Bonus", circlet: "CRIT DMG / CRIT Rate" }),
    sub_stats: JSON.stringify(["CRIT DMG", "CRIT Rate", "ATK%", "Elemental Mastery", "Energy Recharge"]),
    stat_targets: JSON.stringify([
      { stat: "ATK", min: "2,100", good: "2,400", excellent: "2,700+" },
      { stat: "CRIT Rate", min: "65%", good: "75%", excellent: "85%" },
      { stat: "CRIT DMG", min: "170%", good: "210%", excellent: "250%+" }
    ]),
    talent_priority: JSON.stringify([
      { name: "Sacred Fire (Skill)", priority: 1, reason: "Primary offensive motorcycle and burst stance" },
      { name: "Eternal Blaze (Burst)", priority: 2, reason: "Massive nuke and team damage amplification" },
      { name: "Greatsword Martial Arts", priority: 3, reason: "Passive damage" }
    ]),
    constellation_notes: JSON.stringify([
      { level: 2, impact: "Game Changing", notes: "Increases team ATK and provides DEF shred" }
    ]),
    role: "Main DPS / Sub-DPS",
    notes: "The premier Pyro Archon delivering unprecedented continuous off-field Pyro application and immense on-field burst."
  }
];

newBuilds.forEach(b => {
  insertBuild.run(b);
});

console.log(`✅ Dataset expansion complete!`);
const charCount = db.prepare('SELECT count(*) as c FROM characters').get().c;
const weapCount = db.prepare('SELECT count(*) as c FROM weapons').get().c;
const artCount = db.prepare('SELECT count(*) as c FROM artifact_sets').get().c;
console.log(`📊 Current DB Totals: ${charCount} Characters, ${weapCount} Weapons, ${artCount} Artifact Sets.`);
