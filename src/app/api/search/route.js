import { NextResponse } from 'next/server';
import { getWeapons, getArtifactSets, searchEntities } from '@/database/repositories/index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search using FTS5
    const searchResults = searchEntities(query, 30);

    // Group by entity type
    const grouped = {};
    for (const result of searchResults) {
      const category = getCategoryName(result.entity_type);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({
        id: result.entity_id,
        name: result.name,
        href: getEntityHref(result.entity_type, result.entity_id),
        meta: result.entity_type,
        bgColor: getEntityBgColor(result.entity_type),
      });
    }

    const results = Object.entries(grouped).map(([category, items]) => ({
      category,
      items: items.slice(0, 8),
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [] });
  }
}

function getCategoryName(type) {
  const map = { character: 'Characters', weapon: 'Weapons', artifact: 'Artifacts', material: 'Materials' };
  return map[type] || 'Other';
}

function getEntityHref(type, id) {
  if (type === 'material') return '/materials';
  const map = { character: '/characters', weapon: '/weapons', artifact: '/artifacts' };
  return `${map[type] || ''}/${id}`;
}

function getEntityBgColor(type) {
  const map = {
    character: 'rgba(95, 196, 160, 0.12)',
    weapon: 'rgba(212, 168, 50, 0.12)',
    artifact: 'rgba(147, 112, 219, 0.12)',
    material: 'rgba(79, 143, 212, 0.12)',
  };
  return map[type] || 'var(--bg-surface)';
}
