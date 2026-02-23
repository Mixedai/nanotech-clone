import { supabase } from './supabase.js';
import { TOOLS as FALLBACK_TOOLS, CATEGORIES as FALLBACK_CATEGORIES } from '../data/tools.js';

// Tailwind gradient class → hex color mapping
const GRADIENT_COLOR_MAP = {
  'red': '#ef4444',
  'orange': '#f97316',
  'amber': '#f59e0b',
  'yellow': '#eab308',
  'lime': '#84cc16',
  'green': '#22c55e',
  'emerald': '#10b981',
  'teal': '#14b8a6',
  'cyan': '#06b6d4',
  'sky': '#0ea5e9',
  'blue': '#3b82f6',
  'indigo': '#6366f1',
  'violet': '#8b5cf6',
  'purple': '#a855f7',
  'fuchsia': '#d946ef',
  'pink': '#ec4899',
  'rose': '#f43f5e',
  'slate': '#64748b',
  'gray': '#6b7280',
  'zinc': '#71717a',
  'neutral': '#737373',
  'stone': '#78716c',
};

// Category slug → display info mapping
const CATEGORY_META = {
  chat:         { label: 'Chatbot',          icon: '💬' },
  image:        { label: 'Image Generation', icon: '🎨' },
  code:         { label: 'Code Assistant',   icon: '💻' },
  writing:      { label: 'Writing',          icon: '✍️' },
  audio:        { label: 'Audio & Music',    icon: '🎵' },
  music:        { label: 'Music',            icon: '🎶' },
  video:        { label: 'Video',            icon: '🎬' },
  research:     { label: 'Research',         icon: '🔍' },
  productivity: { label: 'Productivity',     icon: '📋' },
  design:       { label: 'Design',           icon: '🖌️' },
  automation:   { label: 'Automation',       icon: '⚙️' },
  marketing:    { label: 'Marketing',        icon: '📢' },
};

/**
 * Extract a hex color from a Tailwind gradient class string.
 * e.g. "from-indigo-500 to-purple-600" → "#6366f1"
 */
function _gradientToHex(gradient) {
  if (!gradient) return '#6366f1';
  const fromMatch = gradient.match(/from-(\w+)-/);
  if (fromMatch) {
    const colorName = fromMatch[1];
    return GRADIENT_COLOR_MAP[colorName] || '#6366f1';
  }
  return '#6366f1';
}

/**
 * Format price from Supabase "freemium"/"paid"/"free" to display string.
 */
function _formatPrice(price, pricing) {
  if (!price) return 'Free';
  const lower = price.toLowerCase();
  if (lower === 'free') return 'Free';
  if (lower === 'freemium') return 'Free';
  if (lower === 'paid' && Array.isArray(pricing) && pricing.length > 0) {
    const firstPlan = pricing[0];
    if (firstPlan.price && firstPlan.price !== 'Custom') return firstPlan.price;
    return 'Paid';
  }
  return price;
}

/**
 * Format pricePlan from Supabase pricing JSON.
 * e.g. [{ name: "Free", price: "$0" }, { name: "Pro", price: "$20" }] → "Free / $20 Pro"
 */
function _formatPricePlan(pricing) {
  if (!Array.isArray(pricing) || pricing.length === 0) return 'Free';
  return pricing
    .map(p => `${p.price} ${p.name}`)
    .join(' / ');
}

/**
 * Extract feature names from detailed_features (object) or features (array).
 * Returns an array of human-readable feature strings for modal display.
 */
function _extractFeatures(detailedFeatures, features) {
  if (detailedFeatures && typeof detailedFeatures === 'object' && !Array.isArray(detailedFeatures)) {
    return Object.keys(detailedFeatures);
  }
  if (Array.isArray(detailedFeatures) && detailedFeatures.length > 0) {
    return detailedFeatures;
  }
  if (Array.isArray(features)) {
    return features.map(f => f.charAt(0).toUpperCase() + f.slice(1));
  }
  return [];
}

/**
 * Format tags from Supabase features array.
 * Capitalizes each tag.
 */
function _formatTags(features) {
  if (!Array.isArray(features)) return [];
  return features.map(f => f.charAt(0).toUpperCase() + f.slice(1));
}

/**
 * Transform a Supabase tool row into the format tools-page.js expects.
 */
function _mapTool(row) {
  return {
    id: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    rating: row.rating,
    users: row.users || '0',
    price: _formatPrice(row.price, row.pricing),
    pricePlan: _formatPricePlan(row.pricing),
    tags: _formatTags(row.features),
    color: _gradientToHex(row.gradient),
    icon: row.icon || row.name.substring(0, 2).toUpperCase(),
    url: row.website,
    features: _extractFeatures(row.detailed_features, row.features),
    featured: row.is_featured === true,
    logoUrl: row.logo_url || null,
  };
}

/**
 * Fetch all tools from Supabase, mapped to frontend format.
 * Falls back to hardcoded data on error.
 */
export async function fetchTools() {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('slug, name, category, description, rating, users, price, features, icon, gradient, is_featured, website, pricing, detailed_features, logo_url')
      .order('rating', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No tools returned');

    return data.map(_mapTool);
  } catch (err) {
    console.error('Supabase fetchTools failed, using fallback:', err);
    return FALLBACK_TOOLS;
  }
}

/**
 * Build categories list from tools data.
 * Returns [{ id, label, icon }, ...] with "All Tools" prepended.
 */
export function buildCategories(tools) {
  const seen = new Set();
  const cats = [{ id: 'all', label: 'All Tools', icon: '⚡' }];

  for (const tool of tools) {
    if (!seen.has(tool.category)) {
      seen.add(tool.category);
      const meta = CATEGORY_META[tool.category] || {
        label: tool.category.charAt(0).toUpperCase() + tool.category.slice(1),
        icon: '🔧',
      };
      cats.push({ id: tool.category, label: meta.label, icon: meta.icon });
    }
  }

  return cats;
}

/**
 * Fetch a single tool by slug.
 * Falls back to hardcoded data on error.
 */
export async function fetchToolById(slug) {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('slug, name, category, description, rating, users, price, features, icon, gradient, is_featured, website, pricing, detailed_features, logo_url')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return _mapTool(data);
  } catch (err) {
    console.error('Supabase fetchToolById failed, using fallback:', err);
    return FALLBACK_TOOLS.find(t => t.id === slug) || null;
  }
}

/**
 * Fetch tools by category.
 * Falls back to hardcoded data on error.
 */
export async function fetchToolsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('slug, name, category, description, rating, users, price, features, icon, gradient, is_featured, website, pricing, detailed_features, logo_url')
      .eq('category', category)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data.map(_mapTool);
  } catch (err) {
    console.error('Supabase fetchToolsByCategory failed, using fallback:', err);
    return FALLBACK_TOOLS.filter(t => t.category === category);
  }
}
