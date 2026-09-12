'use client';

import { useState } from 'react';
import Link from 'next/link';
import ElementIcon from '@/components/ui/ElementIcon';
import { ELEMENTS } from '@/lib/constants';
import styles from './WorldGuide.module.css';

const NATIONS = [
  {
    id: 'mondstadt',
    name: 'Mondstadt',
    element: 'Anemo',
    ideal: 'Freedom',
    archon: 'Barbatos (Venti)',
    dragon: 'Dvalin (Stormterror)',
    capital: 'City of Mondstadt',
    specialty: 'Dandelion Seed, Cecilias, Valberries',
    description: 'The City of Winds and Dandelions. Founded by the Anemo Archon Barbatos, who believes true freedom means ruling without dominion.',
    color: '#5fc4a0',
  },
  {
    id: 'liyue',
    name: 'Liyue',
    element: 'Geo',
    ideal: 'Contracts',
    archon: 'Morax (Rex Lapis / Zhongli)',
    dragon: 'Azhdaha (Earth Dragon King)',
    capital: 'Liyue Harbor',
    specialty: 'Cor Lapis, Glaze Lily, Silk Flower',
    description: 'The land of gold, commerce, and ancient stone. Guided for 3,700 years by the Geo Archon before transitioning to rule by the mortal Qixing.',
    color: '#d4a832',
  },
  {
    id: 'inazuma',
    name: 'Inazuma',
    element: 'Electro',
    ideal: 'Eternity',
    archon: 'Raiden Ei (Beelzebul / Raiden Shogun)',
    dragon: 'Watatsumi Orobashi (Ancient Sea Serpent)',
    capital: 'Inazuma City',
    specialty: 'Naku Weed, Sakura Bloom, Sea Ganoderma',
    description: 'An archipelago enclosed by perpetual lightning storms, seeking an eternal stasis where nothing is lost and time stands motionless.',
    color: '#9b6ed6',
  },
  {
    id: 'sumeru',
    name: 'Sumeru',
    element: 'Dendro',
    ideal: 'Wisdom',
    archon: 'Lesser Lord Kusanali (Nahida)',
    dragon: 'Apep (Dendro Dragon of the Oasis)',
    capital: 'Sumeru City',
    specialty: 'Kalpalata Lotus, Rukkhashava Mushrooms',
    description: 'A cradle of rainforests and scorching desert sands, home to the prestigious Akademiya and governed by the heart of boundless wisdom.',
    color: '#7bb42d',
  },
  {
    id: 'fontaine',
    name: 'Fontaine',
    element: 'Hydro',
    ideal: 'Justice',
    archon: 'Focalors (Furina / Oratrice)',
    dragon: 'Neuvillette (Hydro Dragon Sovereign)',
    capital: 'Court of Fontaine',
    specialty: 'Lumidouce Bell, Romaritime Flower',
    description: 'The nation of grand opera, clockwork meka, and legal spectacle, where water currents and the tears of history wash away sins.',
    color: '#4f8fd4',
  },
  {
    id: 'natlan',
    name: 'Natlan',
    element: 'Pyro',
    ideal: 'War & Rebirth',
    archon: 'Mavuika (Habitator of the Sacred Flame)',
    dragon: 'Ancient Saurian Sovereigns',
    capital: 'Stadium of the Sacred Flame',
    specialty: 'Saurian Claw, Quenepa Berry',
    description: 'A land forged in tectonic volcanic fires, where humans coexist alongside companion Saurians and battle the encroaching Abyss through honor.',
    color: '#e8553a',
  },
  {
    id: 'snezhnaya',
    name: 'Snezhnaya',
    element: 'Cryo',
    ideal: 'Love & Rebellion',
    archon: 'The Tsaritsa',
    dragon: 'Great Frost Sovereign / Ancient Worm',
    capital: 'Zapolyarny Palace',
    specialty: 'Mist Flower Corolla, Starconch Glass',
    description: 'A frozen northern empire mobilizing the Eleven Fatui Harbingers and seizing the divine Gnoses to launch a final rebellion against Celestia.',
    color: '#72b8d4',
  },
  {
    id: 'nod-krai',
    name: 'Nod Krai (Nordkrai)',
    element: 'Cryo',
    ideal: 'Endurance & Permafrost',
    archon: 'Fatui Military Administration',
    dragon: 'Boreal Leviathans',
    capital: 'Fortress of the North',
    specialty: 'Frost crystals, Boreal wolf milk',
    description: 'The harsh northern borderlands and tundra connecting Snezhnaya, northern Mondstadt, and outer Teyvat. A land of blizzard fortresses and ancient ley line rifts.',
    color: '#93c5fd',
  },
  {
    id: 'celestia',
    name: 'Celestia',
    element: 'Anemo',
    ideal: 'Heavenly Principles',
    archon: 'The Sustainer of Heavenly Principles',
    dragon: 'The Primordial One',
    capital: 'Divine Floating Citadel',
    specialty: 'Celestial Shards, Divine Gold',
    description: 'The mysterious floating island realm hanging suspended in the sky above Teyvat. The throne of the Heavenly Principles and destination of ascended mortals.',
    color: '#facc15',
  },
];

// Pure lore & combat mechanics for Dragons & Gods (NO image banners)
const DRAGONS_AND_GODS = [
  {
    id: 'dvalin',
    name: 'Dvalin (Stormterror)',
    title: 'Dragon of the East & Four Winds',
    element: 'Anemo',
    region: 'Mondstadt',
    role: 'Ancient Dragon Sovereign of Mondstadt',
    threat: '★★★★★ Calamity',
    tactics: 'Break Dvalin\'s shield during ground sweeps, then scale his neck or shoot from range to strike the infected blood clot on his back. Use ranged Bow/Catalyst DPS or rapid burst combos.',
    weakness: 'Vulnerable to Pyro/Cryo/Electro infused attacks on the blood clot.',
    drops: [
      { name: "Dvalin's Plume", users: ['Diluc', 'Jean', 'Bennett'] },
      { name: "Dvalin's Claw", users: ['Razor', 'Xiangling', 'Noelle', 'Lisa'] },
      { name: "Dvalin's Sigh", users: ['Traveler', 'Amber', 'Beidou', 'Chongyun'] },
    ],
    lore: 'One of the Four Winds of Mondstadt, corrupted by the Abyss Order and Durin\'s toxic blood until purified by the Traveller and Barbatos.',
    domain: 'Confront Stormterror (Mondstadt)',
    color: '#5fc4a0',
  },
  {
    id: 'azhdaha',
    name: 'Azhdaha (Lord of Geovishaps)',
    title: 'Sealed Dragon King of the Earth',
    element: 'Geo',
    region: 'Liyue',
    role: 'Primordial Earth Dragon Sovereign',
    threat: '★★★★★ Cataclysmic',
    tactics: 'BRING A DEDICATED SHIELDER (Zhongli, Layla, Diona). Azhdaha infuses 2 elements each fight (Pyro/Hydro/Cryo/Electro) and applies continuous dot marks if hit without a shield.',
    weakness: 'Vulnerable during elemental infusion transitions. High physical RES, use elemental reactions.',
    drops: [
      { name: "Dragon Lord's Crown", users: ['Eula', 'Yoimiya', 'Traveler (Electro)'] },
      { name: "Bloodjade Branch", users: ['Yanfei', 'Kamisato Ayaka', 'Dori'] },
      { name: "Gilded Scale", users: ['Kaedehara Kazuha', 'Sayu', 'Yelan'] },
    ],
    lore: 'An ancient dragon granted eyes by Morax to walk among mortals. When the ley lines eroded his memories, he turned against humanity and was sealed beneath the Dragon-Queller tree.',
    domain: 'Beneath the Dragon-Queller (Liyue)',
    color: '#d4a832',
  },
  {
    id: 'apep',
    name: "Guardian of Apep's Oasis",
    title: 'Ancient Dendro Dragon Sovereign',
    element: 'Dendro',
    region: 'Sumeru',
    role: 'Lord of the Desert and Green Oceans',
    threat: '★★★★★ Primordial Sovereign',
    tactics: 'Phase 1: Direct assault. Phase 2: Defend the Heart of the Oasis from attacking organism waves using crowd control. Phase 3: Hide inside green shields when the Apocalypse blast occurs!',
    weakness: 'Vulnerable to Quicken/Aggravate and Pyro Burgeon reactions.',
    drops: [
      { name: 'Worldspan Fern', users: ['Baizhu', 'Freminet'] },
      { name: 'Primordial Greenbloom', users: ['Kaveh', 'Alhaitham', 'Lyney'] },
      { name: 'Everamber', users: ['Kirara', 'Neuvillette', 'Wriothesley'] },
    ],
    lore: 'A primordial dragon sovereign who witnessed the arrival of the heavenly principles. Contaminated by forbidden knowledge swallowed from King Deshret until cleansed in her inner sanctuary.',
    domain: 'The Realm of Beginnings (Sumeru)',
    color: '#7bb42d',
  },
  {
    id: 'neuvillette-lore',
    name: 'Neuvillette (Iudex of Fontaine)',
    title: 'Fully Reborn Hydro Dragon Sovereign',
    element: 'Hydro',
    region: 'Fontaine',
    role: 'Supreme Sovereign of Primordial Water',
    threat: '★★★★★★ Supreme Sovereign',
    tactics: 'The living Hydro Sovereign who regained his original elemental authority upon Focalors\' divine sacrifice. Commands the entire Primordial Sea of Fontaine.',
    weakness: 'Commands absolute control over Hydro; completely bypasses the ancient curse of Fontaine.',
    drops: [
      { name: 'Fontaine Ascended Talents', users: ['Fontaine Sovereigns & Navia'] },
    ],
    lore: 'Reincarnated as a human and granted total authority over the Primordial Sea after Focalors returned the divine Hydro throne to him.',
    domain: 'Court of Fontaine',
    color: '#4f8fd4',
  },
  {
    id: 'shouki-no-kami',
    name: 'Shouki no Kami (The Prodigal)',
    title: 'Artificial False God of Sumeru',
    element: 'Electro',
    region: 'Sumeru',
    role: 'Divine Engine Engineered by the Akademiya',
    threat: '★★★★★ Mechanical False God',
    tactics: 'Collect elemental energy blocks to charge the Neo-Akademiya Terminal. In Phase 2, shoot down the hovering Nirvana Engines to paralyze the mechanical deity!',
    weakness: 'Paralyzed state grants massive -80% All RES shred window for rapid burst downs.',
    drops: [
      { name: 'Puppet Strings', users: ['Alhaitham', 'Dehya', 'Faruzan'] },
      { name: 'Mirror of Mushin', users: ['Layla', 'Mika', 'Alhaitham'] },
      { name: "Daka's Bell", users: ['Wanderer (Scaramouche)', 'Yaoyao', 'Lynette'] },
    ],
    lore: 'An artificial god engineered by Grand Sage Azar using the Gnosis and Scaramouche\'s mechanical divinity, toppled through the combined wisdom of Sumeru.',
    domain: 'Joururi Workshop (Sumeru)',
    color: '#9b6ed6',
  },
  {
    id: 'raiden-puppet',
    name: 'Magatsu Mitake Narukami no Mikoto',
    title: 'Guardian of Eternity',
    element: 'Electro',
    region: 'Inazuma',
    role: 'Indomitable Sword-Puppet of the Shogun',
    threat: '★★★★★ Demigod Weapon',
    tactics: 'Survive the Baleful Shadowlord armored phase using fast elemental attacks (Pyro/Cryo/Dendro) to deplete her armor. Break the Flower of Calamity with Electro attacks to deploy an invulnerability barrier against Musou no Hitotachi!',
    weakness: 'Once armor is broken, she loses 100% of her energy and is incapacitated with -50% RES.',
    drops: [
      { name: 'Mudra of the Malefic General', users: ['Raiden Shogun', 'Kamisato Ayato', 'Cyno'] },
      { name: 'Tears of the Calamitous God', users: ['Collei', 'Candace', 'Nilou', 'Kuki Shinobu'] },
      { name: 'The Meaning of Aeons', users: ['Yae Miko', 'Tighnari', 'Shikanoin Heizou'] },
    ],
    lore: 'The indestructible puppet vessel created by Ei to withstand the erosion of time. Fought Ei for five hundred years in the plane of consciousness before yielding.',
    domain: 'End of the Oneiric Euthymia (Inazuma)',
    color: '#9b6ed6',
  },
  {
    id: 'andrius',
    name: 'Lupus Boreas (Dominator of Wolves)',
    title: 'Noble Wolf King of the Four Winds',
    element: 'Cryo',
    region: 'Mondstadt',
    role: 'Ancient God of Blizzards & Spirit of Wolvendom',
    threat: '★★★★ Ancient God',
    tactics: 'Immune to both Anemo and Cryo damage! Bring Pyro and Electro DPS units for massive Melt and Superconduct burst damage.',
    weakness: 'High Pyro weakness. Easily melted with Xiangling, Hu Tao, Bennett, or Arlecchino.',
    drops: [
      { name: 'Ring of Boreas', users: ['Klee', 'Mona', 'Keqing'] },
      { name: 'Tail of Boreas', users: ['Venti', 'Xingqiu', 'Qiqi'] },
      { name: 'Spirit Locket of Boreas', users: ['Fischl', 'Kaeya', 'Sucrose', 'Ningguang'] },
    ],
    lore: 'The ancient God of the North Wind, Andrius refused the seat of the Anemo Archon believing his blizzards could only nurture warriors and chose to protect Wolvendom.',
    domain: 'Wolvendom (Mondstadt)',
    color: '#72b8d4',
  },
];

// Official open-source game assets for Weekly Bosses
const WEEKLY_BOSSES = [
  {
    id: 'stormterror',
    name: 'Stormterror (Dvalin)',
    title: 'Dragon of the East & Corrupted Wind Sovereign',
    domain: 'Confront Stormterror',
    region: 'Mondstadt',
    element: 'Anemo',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/stormterror.png',
    tactics: 'Break Dvalin\'s shield during sweep phases, then climb his neck or attack from range to burst the infected blood clot on his spine. Ride updrafts between platforms when the floor ignites with Anemo Anima.',
    weakness: 'Exposed blood clot is vulnerable to Pyro/Cryo/Electro burst combos.',
    drops: [
      { name: "Dvalin's Plume", users: ['Diluc', 'Jean', 'Bennett'] },
      { name: "Dvalin's Claw", users: ['Razor', 'Xiangling', 'Noelle', 'Lisa'] },
      { name: "Dvalin's Sigh", users: ['Traveler', 'Amber', 'Beidou', 'Chongyun'] },
    ],
    color: '#5fc4a0',
  },
  {
    id: 'lupus-boreas',
    name: 'Lupus Boreas (Andrius)',
    title: 'Dominator of Wolves & Ancient King of the North Wind',
    domain: 'Wolf of the North Challenge (Wolvendom)',
    region: 'Mondstadt',
    element: 'Cryo',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/lupus-boreas.png',
    tactics: 'Immune to Anemo and Cryo! In Phase 2, avoid sweeping frost fields and falling icicles. Bring Pyro DPS units to trigger continuous Melt reactions.',
    weakness: 'Pyro Melt reactions shred his health pool rapidly.',
    drops: [
      { name: 'Tail of Boreas', users: ['Venti', 'Xingqiu', 'Qiqi'] },
      { name: 'Ring of Boreas', users: ['Klee', 'Mona', 'Keqing'] },
      { name: 'Spirit Locket of Boreas', users: ['Fischl', 'Kaeya', 'Sucrose', 'Ningguang'] },
    ],
    color: '#72b8d4',
  },
  {
    id: 'childe',
    name: 'Tartaglia (Childe)',
    title: 'Eleventh of the Fatui Harbingers & Foul Legacy',
    domain: 'Enter the Golden House',
    region: 'Liyue',
    element: 'Hydro',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/childe.png',
    tactics: 'Three combat phases: Hydro Bow, Electro Dual Daggers, and Foul Legacy Transformation. Cleanse Riptide marks by brushing against the arena boundary to remove the elemental debuff.',
    weakness: 'Low effective HP across all forms; can be staggered quickly with high burst damage.',
    drops: [
      { name: 'Tusk of Monoceros Caeli', users: ['Zhongli', 'Xinyan', 'Albedo'] },
      { name: 'Shadow of the Warrior', users: ['Ganyu', 'Xiao', 'Rosaria'] },
      { name: 'Shard of a Foul Legacy', users: ['Tartaglia', 'Diona', 'Hu Tao'] },
    ],
    color: '#3b82f6',
  },
  {
    id: 'azhdaha',
    name: 'Azhdaha',
    title: 'Sealed Lord of Geovishaps & Primordial Earth Sovereign',
    domain: 'Beneath the Dragon-Queller',
    region: 'Liyue',
    element: 'Geo',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/azhdaha.png',
    tactics: 'Shielders are mandatory. Azhdaha absorbs two elements each week. Players struck by elemental attacks without an active shield suffer continuous mark damage.',
    weakness: 'Vulnerable during phase transitions when stomping the ground. High Physical RES.',
    drops: [
      { name: "Dragon Lord's Crown", users: ['Eula', 'Yoimiya', 'Traveler (Electro)'] },
      { name: 'Bloodjade Branch', users: ['Yanfei', 'Kamisato Ayaka', 'Dori'] },
      { name: 'Gilded Scale', users: ['Kaedehara Kazuha', 'Sayu', 'Yelan'] },
    ],
    color: '#d4a832',
  },
  {
    id: 'la-signora',
    name: 'La Signora',
    title: 'Eighth of the Fatui Harbingers & Crimson Witch of Flames',
    domain: 'Narukami Island: Tenshukaku',
    region: 'Inazuma',
    element: 'Cryo',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/la-signora.png',
    tactics: 'Phase 1: Cryo cocoon (collect Crimson Lotus moths to break her ice shield while managing Sheer Cold). Phase 2: Crimson Witch (manage Blazing Heat near Eyes of Frost).',
    weakness: 'Phase 1 weak to Pyro; Phase 2 weak to Hydro and Cryo.',
    drops: [
      { name: 'Molten Moment', users: ['Raiden Shogun', 'Aloy', 'Gorou'] },
      { name: 'Hellfire Butterfly', users: ['Sangonomiya Kokomi', 'Thoma', 'Shenhe'] },
      { name: 'Ashen Heart', users: ['Kujou Sara', 'Arataki Itto', 'Yun Jin'] },
    ],
    color: '#ef4444',
  },
  {
    id: 'magatsu-mitake-narukami-no-mikoto',
    name: 'Magatsu Mitake Narukami no Mikoto',
    title: 'Indomitable Blade-Puppet of the Raiden Shogun',
    domain: 'End of the Oneiric Euthymia',
    region: 'Inazuma',
    element: 'Electro',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/magatsu-mitake-narukami-no-mikoto.png',
    tactics: 'Survive the Baleful Shadowlord armored state using rapid Pyro/Cryo/Dendro attacks. When Musou no Hitotachi channels, hit Flowers of Calamity with Electro to deploy an invulnerability barrier!',
    weakness: 'Depleting her armor bar stuns her for 20 seconds with -50% All Elemental and Physical RES.',
    drops: [
      { name: 'Mudra of the Malefic General', users: ['Raiden Shogun', 'Kamisato Ayato', 'Cyno'] },
      { name: 'Tears of the Calamitous God', users: ['Collei', 'Candace', 'Nilou', 'Kuki Shinobu'] },
      { name: 'The Meaning of Aeons', users: ['Yae Miko', 'Tighnari', 'Shikanoin Heizou'] },
    ],
    color: '#9b6ed6',
  },
  {
    id: 'everlasting-lord-of-arcane-wisdom',
    name: 'Shouki no Kami (Scaramouche)',
    title: 'The Prodigal & Artificial False God of Wisdom',
    domain: 'Joururi Workshop',
    region: 'Sumeru',
    element: 'Electro',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/everlasting-lord-of-arcane-wisdom.png',
    tactics: 'Collect blue Energy Blocks to power the Neo-Akademiya Terminal. In Phase 2, shoot down the hovering Nirvana Engines to paralyze the mechanical deity before Setsuna Goyei triggers.',
    weakness: 'Paralyzed state grants a massive -80% All RES shred window for huge burst downs.',
    drops: [
      { name: 'Puppet Strings', users: ['Alhaitham', 'Dehya', 'Faruzan'] },
      { name: 'Mirror of Mushin', users: ['Layla', 'Mika', 'Alhaitham'] },
      { name: "Daka's Bell", users: ['Wanderer', 'Yaoyao', 'Lynette'] },
    ],
    color: '#a855f7',
  },
  {
    id: 'guardian-of-apep-s-oasis',
    name: "Guardian of Apep's Oasis",
    title: 'Ancient Dendro Dragon Sovereign of the Great Red Sand',
    domain: 'The Realm of Beginnings',
    region: 'Sumeru',
    element: 'Dendro',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/guardian-of-apep-s-oasis.png',
    tactics: 'Phase 1: Direct assault. Phase 2: Protect the Heart of the Oasis from attacking organisms. Phase 3: When Waves of the Apocalypse appears, step into the glowing green shield dome immediately.',
    weakness: 'Vulnerable to Quicken/Aggravate and Pyro Burgeon reactions.',
    drops: [
      { name: 'Worldspan Fern', users: ['Baizhu', 'Freminet'] },
      { name: 'Primordial Greenbloom', users: ['Kaveh', 'Alhaitham', 'Lyney'] },
      { name: 'Everamber', users: ['Kirara', 'Neuvillette', 'Wriothesley'] },
    ],
    color: '#7bb42d',
  },
  {
    id: 'all-devouring-narwhal',
    name: 'All-Devouring Narwhal',
    title: 'Cosmic Beast from the Dark Cosmos & Pet of Surtalogi',
    domain: 'Shadow of Another World',
    region: 'Fontaine',
    element: 'Hydro',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/all-devouring-narwhal.png',
    tactics: 'Fill its Hostility gauge to be swallowed into its belly. Inside the cosmic belly, defeat the Shadow Knight using Arkhe (Pneuma/Ousia) attacks to quickly shatter its white shield.',
    weakness: 'Exiting the belly stuns the Narwhal for extended periods with massive -70% All Elemental RES.',
    drops: [
      { name: 'Lightless Silk String', users: ['Navia', 'Gaming', 'Xianyun'] },
      { name: 'Lightless Eye of the Maelstrom', users: ['Chevreuse', 'Chiori'] },
      { name: 'Lightless Mass', users: ['Furina', 'Sigewinne', 'Emilie'] },
    ],
    color: '#0ea5e9',
  },
  {
    id: 'the-knave',
    name: 'The Knave (Arlecchino)',
    title: 'Fourth of the Fatui Harbingers & Father of the House of the Hearth',
    domain: 'Scattered Ruins (Petrichor / Fontaine)',
    region: 'Fontaine',
    element: 'Pyro',
    resin: '30 / 60 Resin',
    icon: '/images/bosses/the-knave.png',
    tactics: 'Arlecchino inflicts Bond of Life with her scythe slashes. Heal through the Bond of Life with dedicated healers or perform a counterattack during her Bloodtide assault to stagger her.',
    weakness: 'Cleansing Bond of Life grants Blood-Debt Feast, empowering counters that stagger Arlecchino.',
    drops: [
      { name: 'Fading Candle', users: ['Arlecchino', 'Clorinde', 'Sethos'] },
      { name: 'Silken Feather', users: ['Sigewinne', 'Emilie'] },
      { name: 'Denial and Judgment', users: ['Mualani', 'Kinich', 'Xilonen', 'Chasca'] },
    ],
    color: '#e11d48',
  },
];

// Official open-source game assets for Regional Monsters
const REGIONAL_MONSTERS = [
  {
    id: 'ruin-guard',
    name: 'Ruin Guard (Field Tiller)',
    category: 'Automaton',
    region: 'Mondstadt, Liyue, All Regions',
    element: 'Physical',
    icon: '/images/monsters/ruin-guard.png',
    drops: ['Chaos Device', 'Chaos Circuit', 'Chaos Core'],
    tactics: 'Shoot its glowing optical core twice with charged bow shots to paralyze it. Back off during its spinning whirlwind attack.',
    weakness: 'High 70% Physical RES; highly susceptible to elemental reaction damage.',
  },
  {
    id: 'ruin-hunter',
    name: 'Ruin Hunter',
    category: 'Automaton',
    region: 'Mondstadt, Liyue, Sumeru',
    element: 'Physical',
    icon: '/images/monsters/ruin-hunter.png',
    drops: ['Chaos Device', 'Chaos Circuit', 'Chaos Core'],
    tactics: 'Gaining elevation triggers its aerial bombardment stance. Shoot its exposed optic eye while airborne to ground and paralyze it instantly.',
    weakness: 'Completely immobilized while grounded in paralyzed state.',
  },
  {
    id: 'ruin-grader',
    name: 'Ruin Grader',
    category: 'Automaton',
    region: 'Dragonspine, Khaenri\'ah Ruins',
    element: 'Physical',
    icon: '/images/monsters/ruin-grader.png',
    drops: ['Chaos Device', 'Chaos Circuit', 'Chaos Core'],
    tactics: 'Target both of its glowing knee joints to stagger it, then strike its central laser optic when charging beams to trigger total shutdown.',
    weakness: 'Breaking both knee joints leaves it temporarily immobilized.',
  },
  {
    id: 'geovishap',
    name: 'Geovishap',
    category: 'Vishap',
    region: 'Liyue',
    element: 'Geo / Infused Elements',
    icon: '/images/monsters/geovishap.png',
    drops: ['Fragile Bone Shard', 'Sturdy Bone Shard', 'Fossilized Bone Shard'],
    tactics: 'BRING A SHIELD! When the Geovishap unleashes its rolling charge, striking a shielded player reflects massive damage back and knocks it down.',
    weakness: 'Shield counters deflect equal damage and cause guaranteed stuns.',
  },
  {
    id: 'eye-of-the-storm',
    name: 'Eye of the Storm',
    category: 'Elemental',
    region: 'Mondstadt, Liyue',
    element: 'Anemo',
    icon: '/images/monsters/eye-of-the-storm.png',
    drops: ['Enhancement Ores', 'Character EXP Materials'],
    tactics: 'Completely immune to Anemo damage. When it hovers and channels a vacuum vortex, hit its exposed core with ranged bow or catalyst attacks.',
    weakness: 'Vulnerable to Pyro, Cryo, and Electro ranged burst reactions.',
  },
  {
    id: 'fatui-agent',
    name: 'Fatui Pyro Agent',
    category: 'Fatui',
    region: 'Mondstadt, Liyue, Inazuma',
    element: 'Pyro',
    icon: '/images/monsters/fatui-agent.png',
    drops: ["Hunter's Sacrificial Knife", "Agent's Sacrificial Knife", "Inspector's Sacrificial Knife"],
    tactics: 'Uses stealth camouflage to turn invisible and leave shadow clones. Apply elemental statuses (Hydro, Cryo, Electro) to reveal his silhouette.',
    weakness: 'Freezing, petrification, and heavy crowd control knockbacks interrupt his stealth stance.',
  },
  {
    id: 'fatui-cicin-mage',
    name: 'Fatui Cicin Mage (Electro / Cryo)',
    category: 'Fatui',
    region: 'All Regions',
    element: 'Electro / Cryo',
    icon: '/images/monsters/fatui-cicin-mage.png',
    drops: ['Mist Grass Pollen', 'Mist Grass', 'Mist Grass Wick'],
    tactics: 'Summons flying Cicins and raises an elemental shield when casting her lightning supercharge. Break the shield with Pyro or Cryo to abort her burst.',
    weakness: 'Lightweight humanoid; easily lifted and juggled in Anemo vortexes.',
  },
  {
    id: 'fatui-skirmisher',
    name: 'Fatui Skirmishers',
    category: 'Fatui',
    region: 'All Regions',
    element: 'Pyro, Hydro, Cryo, Electro, Geo, Anemo',
    icon: '/images/monsters/fatui-skirmisher.png',
    drops: ["Recruit's Insignia", "Sergeant's Insignia", "Lieutenant's Insignia"],
    tactics: 'Always target the Hydrogunner healer first! Break elemental armor with hard counter elements: Pyro on Cryo, Hydro on Pyro, Cryo on Electro, Claymore/Geo on Geo.',
    weakness: 'Depleting their elemental armor bar causes an immediate, prolonged stun.',
  },
  {
    id: 'hilichurl',
    name: 'Hilichurl (Melee / Fighter)',
    category: 'Hilichurl',
    region: 'All Regions',
    element: 'Physical',
    icon: '/images/monsters/hilichurl.png',
    drops: ['Damaged Mask', 'Stained Mask', 'Ominous Mask'],
    tactics: 'Standard tribal inhabitants across Teyvat. Easily grouped and wiped with AoE abilities and elemental bursts.',
    weakness: 'Vulnerable to all elemental reactions and physical attacks.',
  },
  {
    id: 'hilichurl-shooter',
    name: 'Hilichurl Shooter',
    category: 'Hilichurl',
    region: 'All Regions',
    element: 'Pyro, Cryo, Electro, Dendro',
    icon: '/images/monsters/hilichurl-shooter.png',
    drops: ['Firm Arrowhead', 'Sharp Arrowhead', 'Weathered Arrowhead'],
    tactics: 'Snipes with infused arrows from towers and high vantage points. Detonate nearby explosive barrels for fast clear.',
    weakness: 'Extremely low HP pool; knocked down by any heavy attack or charged shot.',
  },
  {
    id: 'mitachurl',
    name: 'Mitachurl (Shield / Blazing Axe)',
    category: 'Hilichurl',
    region: 'All Regions',
    element: 'Physical / Pyro / Geo',
    icon: '/images/monsters/mitachurl.png',
    drops: ['Heavy Horn', 'Black Bronze Horn', 'Black Crystal Horn'],
    tactics: 'Wooden shields block all frontal damage — ignite them with Pyro to burn away the shield! Rock shields require Geo/Claymore. Freeze allows attacking through shields.',
    weakness: 'Flanking from behind or freezing bypasses their defensive block completely.',
  },
  {
    id: 'lawachurl',
    name: 'Lawachurl (Stonehide / Frostarm)',
    category: 'Hilichurl',
    region: 'Liyue, Dragonspine, Inazuma, Sumeru',
    element: 'Geo / Cryo / Electro',
    icon: '/images/monsters/lawachurl.png',
    drops: ['Heavy Horn', 'Black Bronze Horn', 'Black Crystal Horn'],
    tactics: 'Massive mutated chieftains with heavy elemental armor giving immense damage reduction and hyperarmor. Break armor with corresponding counter elements.',
    weakness: 'Breaking elemental armor disables their leaping shockwave slams.',
  },
  {
    id: 'abyss-mage',
    name: 'Abyss Mage (Pyro, Cryo, Hydro, Electro)',
    category: 'Abyss Order',
    region: 'All Regions',
    element: 'Pyro, Cryo, Hydro, Electro',
    icon: '/images/monsters/abyss-mage.png',
    drops: ['Dead Ley Line Branch', 'Dead Ley Line Leaves', 'Ley Line Sprout'],
    tactics: 'Protected by dense elemental shields. Hydro breaks Pyro shield; Pyro breaks Cryo shield; Cryo breaks Hydro shield. Defeat quickly once shield is broken before regeneration.',
    weakness: 'Swirling multiple Abyss Mages together creates chain reaction shield breaks.',
  },
  {
    id: 'whopperflower',
    name: 'Whopperflower (Pyro / Cryo)',
    category: 'Elemental',
    region: 'All Regions',
    element: 'Pyro / Cryo',
    icon: '/images/monsters/whopperflower.png',
    drops: ['Whopperflower Nectar', 'Shimmering Nectar', 'Energy Nectar'],
    tactics: 'Disguises itself as wild mint or sweet flowers. When gathering energy in its closed petals, use reaction attacks to break the charge and stun it.',
    weakness: 'Stunned for 10 seconds with zero elemental resistance when petal charge is broken.',
  },
];

const TEYVAT_WAYPOINTS = [
  {
    id: 'snezhnaya-palace',
    name: 'Zapolyarny Palace (Snezhnaya)',
    region: 'Snezhnaya',
    element: 'Cryo',
    x: 26.5,
    y: 16.5,
    lore: 'The imperial frost citadel of the Cryo Archon, The Tsaritsa, where the Eleven Fatui Harbingers assemble to plot against the gods of Celestia.',
    bosses: ['Harbinger Assembly', 'Pre-Calamity Cryo Beasts'],
    specialties: 'Mist Flower Corolla, Starconch Glass, Snezhna Ice',
  },
  {
    id: 'nod-krai',
    name: 'Nod Krai (Nordkrai Tundra)',
    region: 'Nod Krai',
    element: 'Cryo',
    x: 40.5,
    y: 27.5,
    lore: 'The rugged northern permafrost frontier separating Snezhnaya, Fontaine, and northern Mondstadt. Dotted with ancient watchtowers and icy ley line rifts.',
    bosses: ['Boreal Frost King', 'Fatui Vanguard Fortress'],
    specialties: 'Frost Lichen, Boreal Iron',
  },
  {
    id: 'celestia',
    name: 'Celestia (Seat of the Divine)',
    region: 'Celestia',
    element: 'Anemo',
    x: 84.5,
    y: 15.0,
    lore: 'The floating divine citadel suspended above the clouds of Teyvat. The home of the Heavenly Principles and destiny of all ascended mortals.',
    bosses: ['Heavenly Sustainer (Uncharted)'],
    specialties: 'Celestial Shards, Divine Gold',
  },
  {
    id: 'court-of-fontaine',
    name: 'Court of Fontaine & Aqueducts',
    region: 'Fontaine',
    element: 'Hydro',
    x: 14.5,
    y: 47.0,
    lore: 'The grand capital of justice, clockwork wonders, and theater, situated upon high waterfalls above the Great Lake of Fontaine.',
    bosses: ['Shadow of Another World (All-Devouring Narwhal)', 'Experimental Field Generator'],
    specialties: 'Lumidouce Bell, Subdetection Unit',
  },
  {
    id: 'mondstadt-city',
    name: 'City of Mondstadt & Cider Lake',
    region: 'Mondstadt',
    element: 'Anemo',
    x: 74.5,
    y: 35.0,
    lore: 'The Crown of the North, perched on Cider Lake. Guarded by the Knights of Favonius and the legacy of the Anemo Archon Barbatos.',
    bosses: ['Lupus Boreas (Wolf of the North)', 'Dvalin (Stormterror)'],
    specialties: 'Dandelion Seed, Cecilia, Philanemo Mushroom',
  },
  {
    id: 'stormterror-lair',
    name: "Stormterror's Lair",
    region: 'Mondstadt',
    element: 'Anemo',
    x: 58.5,
    y: 31.0,
    lore: 'Ancient ruins of Old Mondstadt ruled by Decarabian, now the resting ground of the Dragon Sovereign of the East, Dvalin.',
    bosses: ['Confront Stormterror (Dvalin)'],
    specialties: 'Windwheel Aster',
  },
  {
    id: 'dragonspine',
    name: 'Dragonspine Snowy Peak',
    region: 'Mondstadt',
    element: 'Cryo',
    x: 64.0,
    y: 49.0,
    lore: 'A frozen mountain range entombed in permafrost, holding the remains of the shadow dragon Durin and the Skyfrost Nail.',
    bosses: ['Cryo Hypostasis', 'Great Snowboar King'],
    specialties: 'Starsilver Ore',
  },
  {
    id: 'liyue-harbor',
    name: 'Liyue Harbor & Guyun Stone Forest',
    region: 'Liyue',
    element: 'Geo',
    x: 53.0,
    y: 60.0,
    lore: 'The richest trading port in Teyvat, built upon contracts with Rex Lapis and guarded by the Millelith and Adepti.',
    bosses: ['Golden House (Childe / Tartaglia)', 'Primo Geovishap'],
    specialties: 'Glaze Lily, Silk Flower, Noctilucous Jade',
  },
  {
    id: 'jueyun-karst',
    name: 'Jueyun Karst & Adepti Peaks',
    region: 'Liyue',
    element: 'Geo',
    x: 42.5,
    y: 46.5,
    lore: 'The misty karst peaks where the mighty Adepti of Rex Lapis reside in seclusion, overlooking Qingce Village and Huaguang stone pillars.',
    bosses: ['Beneath the Dragon-Queller (Azhdaha)'],
    specialties: 'Qingxin Flower, Cor Lapis',
  },
  {
    id: 'the-chasm',
    name: 'The Chasm & Mines',
    region: 'Liyue',
    element: 'Geo',
    x: 48.0,
    y: 70.0,
    lore: 'A massive fissure in southwestern Liyue formed by a fallen celestial meteor, leading down into forgotten Khaenri\'ah ruins.',
    bosses: ['Ruin Serpent'],
    specialties: 'Lumenstone, Luminescent Spine',
  },
  {
    id: 'sumeru-city',
    name: 'Sumeru City & Avidya Forest',
    region: 'Sumeru',
    element: 'Dendro',
    x: 68.5,
    y: 57.0,
    lore: 'The scholastic jewel built into the massive Divine Tree, home to the Akademiya and Sanctuary of Surasthana.',
    bosses: ['Shouki no Kami (Scaramouche)', 'Jadeplume Terrorshroom'],
    specialties: 'Rukkhashava Mushrooms, Nilotpala Lotus',
  },
  {
    id: 'king-deshret-pyramids',
    name: "King Deshret's Pyramids & Desert",
    region: 'Sumeru',
    element: 'Dendro',
    x: 61.5,
    y: 75.0,
    lore: 'The golden pyramids rising over the Great Red Sand, monuments to the fallen god Al-Ahmar and guarded by ancient Primal Constructs.',
    bosses: ['Guardian of Apep\'s Oasis', 'Algorithm of Semi-Intransient Matrix'],
    specialties: 'Scarab, Redcrest',
  },
  {
    id: 'natlan-volcano',
    name: 'Natlan Volcanic Arena & Stadium',
    region: 'Natlan',
    element: 'Pyro',
    x: 86.5,
    y: 73.0,
    lore: 'The volcanic peaks and obsidian ravines of Natlan, where warriors ride Saurians and ignite the Sacred Flame of Rebirth.',
    bosses: ['Goldflame Qucusaur Tyrant', 'Kongamato'],
    specialties: 'Saurian Claw Succulent, Quenepa Berry',
  },
  {
    id: 'narukami-island',
    name: 'Inazuma City & Narukami Island',
    region: 'Inazuma',
    element: 'Electro',
    x: 33.5,
    y: 73.5,
    lore: 'The heart of the Shogunate and Tenshukaku, overseen by the Raiden Shogun under the sacred Grand Narukami Shrine.',
    bosses: ['Tenshukaku (Signora)', 'End of the Oneiric Euthymia (Raiden Puppet)'],
    specialties: 'Sakura Bloom, Naku Weed',
  },
  {
    id: 'watatsumi-island',
    name: 'Watatsumi & Seirai Island',
    region: 'Inazuma',
    element: 'Hydro',
    x: 26.5,
    y: 84.0,
    lore: 'The coral cascades of Sangonomiya and the perpetual thunder storm vortex of Amakumo Peak on Seirai.',
    bosses: ['Hydro Hypostasis', 'Thunder Manifestation'],
    specialties: 'Sango Pearl, Amakumo Fruit',
  },
];

export default function WorldGuideClient() {
  const [activeTab, setActiveTab] = useState('nations'); // 'nations' | 'dragons' | 'weekly-bosses' | 'monsters' | 'map'
  const [selectedWaypoint, setSelectedWaypoint] = useState(TEYVAT_WAYPOINTS[0]);
  const [mapRegionFilter, setMapRegionFilter] = useState('All');
  const [mapZoom, setMapZoom] = useState(1);
  const [bossFilterRegion, setBossFilterRegion] = useState('All');
  const [bossSearch, setBossSearch] = useState('');
  const [monsterCategoryFilter, setMonsterCategoryFilter] = useState('All');
  const [monsterSearch, setMonsterSearch] = useState('');

  const filteredWaypoints = mapRegionFilter === 'All'
    ? TEYVAT_WAYPOINTS
    : TEYVAT_WAYPOINTS.filter((wp) => wp.region.toLowerCase() === mapRegionFilter.toLowerCase());

  const filteredDragons = DRAGONS_AND_GODS.filter((boss) => {
    if (bossFilterRegion !== 'All' && boss.region.toLowerCase() !== bossFilterRegion.toLowerCase()) {
      return false;
    }
    if (bossSearch) {
      const q = bossSearch.toLowerCase();
      const matchName = boss.name.toLowerCase().includes(q);
      const matchDrops = boss.drops.some((d) => d.name.toLowerCase().includes(q) || d.users.some((u) => u.toLowerCase().includes(q)));
      return matchName || matchDrops;
    }
    return true;
  });

  const filteredWeeklyBosses = WEEKLY_BOSSES.filter((boss) => {
    if (bossFilterRegion !== 'All' && boss.region.toLowerCase() !== bossFilterRegion.toLowerCase()) {
      return false;
    }
    if (bossSearch) {
      const q = bossSearch.toLowerCase();
      const matchName = boss.name.toLowerCase().includes(q) || boss.title.toLowerCase().includes(q);
      const matchDrops = boss.drops.some((d) => d.name.toLowerCase().includes(q) || d.users.some((u) => u.toLowerCase().includes(q)));
      return matchName || matchDrops;
    }
    return true;
  });

  const filteredMonsters = REGIONAL_MONSTERS.filter((monster) => {
    if (monsterCategoryFilter !== 'All' && monster.category !== monsterCategoryFilter) {
      return false;
    }
    if (monsterSearch) {
      const q = monsterSearch.toLowerCase();
      const matchName = monster.name.toLowerCase().includes(q);
      const matchDrops = monster.drops.some((d) => d.toLowerCase().includes(q));
      const matchRegion = monster.region.toLowerCase().includes(q);
      return matchName || matchDrops || matchRegion;
    }
    return true;
  });

  return (
    <div className={styles.container}>
      {/* Header Introduction */}
      <div className={styles.header}>
        <div className={styles.elementRow}>
          {['Anemo', 'Geo', 'Electro', 'Dendro', 'Hydro', 'Pyro', 'Cryo'].map((el) => (
            <span key={el} className={styles.elementIconWrap}>
              <ElementIcon element={el} size={18} />
            </span>
          ))}
        </div>
        <h1 className={styles.title}>Teyvat World Guide, Archons, Gods &amp; Monsters</h1>
        <p className={styles.subtitle}>
          Explore the Seven Divine Realms, Ancient Dragon Sovereigns, official Weekly Boss domains,
          regional monster codex, and authentic continent map of Teyvat.
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabNav} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'nations'}
          className={`${styles.tabBtn} ${activeTab === 'nations' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('nations')}
        >
          🏛️ The Seven Realms ({NATIONS.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dragons'}
          className={`${styles.tabBtn} ${activeTab === 'dragons' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('dragons')}
        >
          🐉 Ancient Dragons &amp; Gods ({DRAGONS_AND_GODS.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'weekly-bosses'}
          className={`${styles.tabBtn} ${activeTab === 'weekly-bosses' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('weekly-bosses')}
        >
          👑 Weekly Bosses ({WEEKLY_BOSSES.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'monsters'}
          className={`${styles.tabBtn} ${activeTab === 'monsters' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('monsters')}
        >
          👾 Regional Monsters ({REGIONAL_MONSTERS.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'map'}
          className={`${styles.tabBtn} ${activeTab === 'map' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('map')}
        >
          🗺️ Authentic Teyvat Realm Map
        </button>
      </div>

      {/* Tab Content: Seven Nations */}
      {activeTab === 'nations' && (
        <div className={styles.nationsGrid}>
          {NATIONS.map((nation) => (
            <div
              key={nation.id}
              className={styles.nationCard}
              style={{
                '--nation-color': nation.color,
                '--nation-glow': `${nation.color}25`,
              }}
            >
              <div className={styles.nationHeader}>
                <div className={styles.nationTitleRow}>
                  <ElementIcon element={nation.element} size={24} />
                  <div>
                    <h2 className={styles.nationName}>{nation.name}</h2>
                    <span className={styles.nationIdeal}>Ideal: {nation.ideal}</span>
                  </div>
                </div>
                <span className={styles.elementPill} style={{ color: nation.color, borderColor: nation.color }}>
                  {nation.element}
                </span>
              </div>

              <p className={styles.nationDesc}>{nation.description}</p>

              <div className={styles.metaList}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Ruling Authority / Archon:</span>
                  <strong className={styles.metaValue}>{nation.archon}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Dragon Sovereign:</span>
                  <strong className={styles.metaValue}>{nation.dragon}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Capital Realm:</span>
                  <span className={styles.metaValue}>{nation.capital}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Regional Specialties:</span>
                  <span className={styles.metaValue} style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {nation.specialty}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)' }}>
                <Link
                  href={`/characters?nation=${nation.name}`}
                  className={styles.btnExplore}
                  style={{ background: nation.color }}
                >
                  View {nation.name} Characters &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Ancient Dragons & Gods (NO image banners - strictly lore, threat & combat mechanics) */}
      {activeTab === 'dragons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Boss Filter Bar */}
          <div className={styles.bossFilterBar}>
            <div className={styles.regionPills}>
              {['All', 'Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan', 'Snezhnaya'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setBossFilterRegion(r)}
                  className={`${styles.regionBtn} ${bossFilterRegion === r ? styles.regionActive : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div style={{ flex: '1', maxWidth: '340px', minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search god/dragon, drops, or lore..."
                value={bossSearch}
                onChange={(e) => setBossSearch(e.target.value)}
                className={styles.bossSearchInput}
              />
            </div>
          </div>

          {/* Dragon/God Lore Cards Grid (No Images) */}
          <div className={styles.dragonsGrid}>
            {filteredDragons.map((boss) => (
              <div
                key={boss.id}
                className={styles.dragonCard}
                style={{
                  '--dragon-color': boss.color,
                  '--dragon-glow': `${boss.color}30`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <ElementIcon element={boss.element} size={22} />
                      <h2 className={styles.dragonName}>{boss.name}</h2>
                    </div>
                    <span className={styles.dragonTitle}>{boss.title}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className={styles.threatBadge} style={{ color: boss.color, borderColor: boss.color }}>
                      {boss.threat}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{boss.region}</span>
                  </div>
                </div>

                <blockquote className={styles.dragonLore}>
                  {boss.lore}
                </blockquote>

                {/* Combat Strategy & Weaknesses */}
                <div className={styles.tacticsBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>
                    <span>⚔️ Combat Mechanics &amp; Strategy:</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {boss.tactics}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#10b981', lineHeight: 1.5 }}>
                    <strong>Key Weakness:</strong> {boss.weakness}
                  </p>
                </div>

                {/* Talent Drops with Characters Linkage */}
                <div className={styles.dropSection}>
                  <h3 className={styles.dropTitle}>Weekly Ascension Talent Drops &amp; Beneficiaries:</h3>
                  <div className={styles.dropListEnhanced}>
                    {boss.drops.map((drop, idx) => (
                      <div key={idx} className={styles.dropCardItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px' }}>💎</span>
                          <strong style={{ color: '#fff', fontSize: '12px' }}>{drop.name}</strong>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                          {drop.users.map((user, uIdx) => (
                            <span key={uIdx} className={styles.userTag}>
                              {user}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-2)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  <span>Domain: <strong style={{ color: '#fff' }}>{boss.domain}</strong></span>
                  <Link href={`/characters?nation=${boss.region}`} style={{ color: boss.color, fontWeight: 'bold', textDecoration: 'none' }}>
                    View {boss.region} Characters &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Weekly Bosses (With official game monster icons) */}
      {activeTab === 'weekly-bosses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Boss Filter Bar */}
          <div className={styles.bossFilterBar}>
            <div className={styles.regionPills}>
              {['All', 'Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan', 'Snezhnaya'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setBossFilterRegion(r)}
                  className={`${styles.regionBtn} ${bossFilterRegion === r ? styles.regionActive : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div style={{ flex: '1', maxWidth: '340px', minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search weekly boss or talent drop..."
                value={bossSearch}
                onChange={(e) => setBossSearch(e.target.value)}
                className={styles.bossSearchInput}
              />
            </div>
          </div>

          {/* Weekly Boss Grid */}
          <div className={styles.dragonsGrid}>
            {filteredWeeklyBosses.map((boss) => (
              <div
                key={boss.id}
                className={styles.dragonCard}
                style={{
                  '--dragon-color': boss.color,
                  '--dragon-glow': `${boss.color}30`,
                }}
              >
                <div className={styles.bossCardHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={boss.icon}
                    alt={boss.name}
                    className={styles.bossIconImg}
                  />
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ElementIcon element={boss.element} size={20} />
                      <h2 className={styles.dragonName}>{boss.name}</h2>
                    </div>
                    <span className={styles.dragonTitle}>{boss.title}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className={styles.threatBadge} style={{ color: boss.color, borderColor: boss.color }}>
                      {boss.region}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                      {boss.resin}
                    </span>
                  </div>
                </div>

                <div className={styles.tacticsBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>
                    <span>⚔️ Domain Tactics &amp; Mechanics:</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {boss.tactics}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#10b981', lineHeight: 1.5 }}>
                    <strong>Key Weakness:</strong> {boss.weakness}
                  </p>
                </div>

                <div className={styles.dropSection}>
                  <h3 className={styles.dropTitle}>Weekly Talent Material Drops:</h3>
                  <div className={styles.dropListEnhanced}>
                    {boss.drops.map((drop, idx) => (
                      <div key={idx} className={styles.dropCardItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px' }}>💎</span>
                          <strong style={{ color: '#fff', fontSize: '12px' }}>{drop.name}</strong>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                          {drop.users.map((user, uIdx) => (
                            <span key={uIdx} className={styles.userTag}>
                              {user}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-2)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  <span>Domain: <strong style={{ color: '#fff' }}>{boss.domain}</strong></span>
                  <Link href={`/characters?nation=${boss.region}`} style={{ color: boss.color, fontWeight: 'bold', textDecoration: 'none' }}>
                    View Characters &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Regional Monsters (With official open-source game monster icons) */}
      {activeTab === 'monsters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Monster Filter Bar */}
          <div className={styles.bossFilterBar}>
            <div className={styles.regionPills}>
              {['All', 'Automaton', 'Fatui', 'Hilichurl', 'Vishap', 'Elemental', 'Abyss Order'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMonsterCategoryFilter(cat)}
                  className={`${styles.regionBtn} ${monsterCategoryFilter === cat ? styles.regionActive : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ flex: '1', maxWidth: '340px', minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search monster, drops, or regions..."
                value={monsterSearch}
                onChange={(e) => setMonsterSearch(e.target.value)}
                className={styles.bossSearchInput}
              />
            </div>
          </div>

          {/* Monster Codex Grid */}
          <div className={styles.monsterGrid}>
            {filteredMonsters.map((monster) => (
              <div key={monster.id} className={styles.monsterCard}>
                <div className={styles.monsterHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={monster.icon}
                    alt={monster.name}
                    className={styles.monsterIconImg}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className={styles.monsterCategoryBadge}>{monster.category}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{monster.element}</span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '4px 0 0' }}>
                      {monster.name}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  <span>Habitats: </span>
                  <strong style={{ color: '#e2e8f0' }}>{monster.region}</strong>
                </div>

                <div className={styles.tacticsBox}>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {monster.tactics}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#10b981', lineHeight: 1.4 }}>
                    <strong>Weakness:</strong> {monster.weakness}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Material Drops:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {monster.drops.map((drop, dIdx) => (
                      <span key={dIdx} className={styles.monsterDropBadge}>
                        📦 {drop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Authentic Teyvat Realm Map — Official HoYoLAB Interactive Map */}
      {activeTab === 'map' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Map Header */}
          <div className={styles.mapControlsBar}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#fff', margin: 0 }}>
                🗺️ Official Teyvat Interactive Map
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>
                Powered by HoYoLAB — All 7 nations, Oculi, Chests, Waypoints, and resource tracking included.
              </p>
            </div>
            <div className={styles.zoomControls}>
              <a
                href="https://act.hoyolab.com/ys/app/interactive-map/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.hoyolabBtn}
                title="Open full-screen HoYoLAB Map in new tab"
              >
                Open Full Map ↗
              </a>
            </div>
          </div>

          {/* Embedded Official Interactive Map */}
          <div className={styles.realMapContainer} style={{ minHeight: '700px', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
            <iframe
              src="https://act.hoyolab.com/ys/app/interactive-map/index.html"
              title="Official Teyvat Interactive Map by HoYoLAB"
              style={{
                width: '100%',
                height: '700px',
                border: 'none',
                borderRadius: 'var(--radius-2xl)',
              }}
              loading="lazy"
              allow="fullscreen"
            />
          </div>

          {/* Region Quick Reference Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {NATIONS.map((nation) => (
              <div
                key={nation.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${nation.color}30`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <ElementIcon element={nation.element} size={20} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#fff' }}>{nation.name}</div>
                  <div style={{ fontSize: '10px', color: nation.color }}>{nation.element} • {nation.ideal}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
