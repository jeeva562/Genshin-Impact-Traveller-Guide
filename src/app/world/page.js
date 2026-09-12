import WorldGuideClient from '@/components/world/WorldGuideClient';

export const metadata = {
  title: 'Teyvat World Guide, Map, Gods & Ancient Dragons | Genshin Impact',
  description: 'Interactive map of Teyvat: Explore the Seven Nations, the Seven Archons (Gods), Ancient Primordial Dragon Sovereigns, and Weekly Boss drop locations.',
};

export default function WorldPage() {
  return <WorldGuideClient />;
}
