# Genshin Impact Traveller Guide  Celestial Edition

An interactive, high-performance web application designed for Genshin Impact players. Explore complete character rosters, weapon databases, artifact set recommendations, team synergy calculators, and dynamic daily farming schedules.

---

## 🌟 Key Features

### 🗡️ Comprehensive Character Roster & Guides
- **Complete Roster**: Access builds, stat scaling, and elemental roles for 100+ characters (including Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, and custom characters like Mizuki, Lan Yan, and Lohen).
- **Optimal Build Recommendations**: Best-in-slot weapon choices, 4-piece and 2-piece artifact configurations, target stat priorities (CRIT Rate, CRIT DMG, Energy Recharge, Elemental Mastery), and talent level-up order.
- **Visual Asset Resilience**: Multi-tier image resolution engine with automatic CDN fallbacks to guarantee 100% reliable character portraits and element badges.

### ⚔️ Weapons & Artifacts Armory
- **Weapons Directory**: Search and filter by weapon type (Sword, Claymore, Polearm, Bow, Catalyst), rarity (3★ to 5★), base ATK, and secondary stats.
- **Artifact Sets Catalog**: View set bonus perks for 2-piece and 4-piece sets, domain drop locations, and top character pairings.

### 👥 Team Composition & Synergy Analyzer
- **Interactive Squad Builder**: Construct custom 4-character teams and instantly preview active Elemental Resonances (e.g., Pyro Resonance *Fervent Flames*, Hydro Resonance *Soothing Water*).
- **Role Balancing**: Evaluate team structure with dedicated tags for Main DPS, Sub-DPS, Support, Healer, and Shielder.

### 🌾 Dynamic Daily Farming Schedule
- **Day-of-the-Week Tracker**: Plan domain runs for Talent Books and Weapon Ascension Materials for Monday through Sunday.
- **Resource Calculator**: Easily check required Boss Drops, Local Specialties, and Common Enemy Drops for ascending your favorite characters.

### 🔍 Instant Global Search Engine
- High-speed search interface powered by **FlexSearch**, offering instant query matching across characters, weapons, artifacts, and material domains.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Logic**: [React 19](https://react.dev/) & JavaScript (ES6+)
- **Styling**: Vanilla CSS3 with Custom CSS Variables, Glassmorphism, and responsive layouts
- **Database**: SQLite with [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- **Search Engine**: [`flexsearch`](https://github.com/nextapps-de/flexsearch)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn` / `bun`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jeeva562/Genshin-Impact-Traveller-Guide.git
   cd Genshin-Impact-Traveller-Guide/genshin-guide
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to explore the application.

---

## 📁 Project Structure

```text
genshin-guide/
├── data/                  # SQLite database storage (genshin-guide.db)
├── public/                # Static assets (character images, element icons, weapon art)
├── scripts/               # Database seeders and maintenance scripts
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   │   ├── admin/         # Admin management interface
│   │   ├── api/           # SQLite REST API endpoints
│   │   ├── artifacts/     # Artifact sets catalog page
│   │   ├── characters/    # Character directory and detail pages
│   │   ├── compare/       # Character comparison tool
│   │   ├── farming/       # Daily domain farming schedule
│   │   ├── guides/        # Written gameplay and domain guides
│   │   ├── materials/     # Material index & ascension items
│   │   ├── planner/       # Ascension planner
│   │   ├── teams/         # Team builder & team comp database
│   │   ├── weapons/       # Weapons database page
│   │   └── world/         # World & regional material index
│   ├── components/        # Reusable React components (UI, filters, search, layout)
│   ├── database/          # Database connections and query helpers
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions and search indices
├── package.json
└── README.md
```

---

## 📜 Build & Deployment

To build the application for production:

```bash
npm run build
npm run start
```

---

## ⚖️ Disclaimer

**Genshin Impact Traveller Guide** is a fan-made fan site and is not affiliated with or endorsed by **miHoYo** / **Cognosphere / HoYoverse**. All Genshin Impact content, logos, character designs, and game assets belong to their respective copyright holders.
