import { getCharacters } from '@/database/repositories/character-repository';
import { getWeapons } from '@/database/repositories/index';

export default async function sitemap() {
    const baseUrl = 'https://genshin-impact-traveller-guide.vercel.app';

    const staticPages = [
        '',
        '/characters',
        '/weapons',
        '/artifacts',
        '/teams',
        '/world',
        '/farming',
        '/tools',
        '/planner',
        '/guides',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.8,
    }));

    const characters = getCharacters();
    const characterPages = characters.map((c) => ({
        url: `${baseUrl}/characters/${c.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const weapons = getWeapons();
    const weaponPages = weapons.map((w) => ({
        url: `${baseUrl}/weapons/${w.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [...staticPages, ...characterPages, ...weaponPages];
}
