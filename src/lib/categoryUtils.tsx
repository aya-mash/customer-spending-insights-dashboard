/**
 * Category Utilities
 * Centralized category color and icon management with API fallback
 */

import {
  ShoppingCart,
  Film,
  Car,
  Utensils,
  ShoppingBag,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { CHART_COLORS } from './chartConfig';

/**
 * Icon name mapping from API to Lucide icons
 */
const ICON_MAP: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'film': Film,
  'car': Car,
  'utensils': Utensils,
  'shopping-bag': ShoppingBag,
  'zap': Zap,
};

/**
 * Fallback color mapping for categories without API color
 */
const FALLBACK_COLORS: Record<string, string> = {
  groceries: CHART_COLORS.groceries,
  entertainment: CHART_COLORS.entertainment,
  transportation: CHART_COLORS.transport,
  dining: CHART_COLORS.dining,
  shopping: CHART_COLORS.shopping,
  utilities: CHART_COLORS.utilities,
};

/**
 * Get category color from API data or fallback
 * @param category - Category name
 * @param apiColor - Optional color from API
 */
export function getCategoryColor(category: string, apiColor?: string): string {
  // Use API color if provided
  if (apiColor) {
    return apiColor;
  }

  // Fallback to our color mapping
  const normalized = category.toLowerCase();
  
  if (normalized.includes('grocer') || normalized.includes('food')) {
    return FALLBACK_COLORS.groceries;
  }
  if (normalized.includes('entertainment') || normalized.includes('movie')) {
    return FALLBACK_COLORS.entertainment;
  }
  if (normalized.includes('transport') || normalized.includes('fuel')) {
    return FALLBACK_COLORS.transportation;
  }
  if (normalized.includes('dining') || normalized.includes('restaurant')) {
    return FALLBACK_COLORS.dining;
  }
  if (normalized.includes('shopping') || normalized.includes('retail')) {
    return FALLBACK_COLORS.shopping;
  }
  if (normalized.includes('utilities') || normalized.includes('bill')) {
    return FALLBACK_COLORS.utilities;
  }
  
  return CHART_COLORS.primary;
}

/**
 * Get category icon component from API icon name or category name
 * @param category - Category name
 * @param apiIcon - Optional icon name from API
 */
export function getCategoryIcon(category: string, apiIcon?: string): LucideIcon {
  // Try API icon first
  if (apiIcon && ICON_MAP[apiIcon]) {
    return ICON_MAP[apiIcon];
  }

  // Fallback based on category name
  const normalized = category.toLowerCase();
  
  if (normalized.includes('grocer') || normalized.includes('food')) {
    return ShoppingCart;
  }
  if (normalized.includes('entertainment') || normalized.includes('movie')) {
    return Film;
  }
  if (normalized.includes('transport') || normalized.includes('fuel')) {
    return Car;
  }
  if (normalized.includes('dining') || normalized.includes('restaurant')) {
    return Utensils;
  }
  if (normalized.includes('shopping') || normalized.includes('retail')) {
    return ShoppingBag;
  }
  if (normalized.includes('utilities') || normalized.includes('bill')) {
    return Zap;
  }
  
  return ShoppingBag; // Default fallback
}

/**
 * Category data with color and icon
 */
export interface CategoryData {
  name: string;
  color: string;
  icon: LucideIcon;
}

/**
 * Get enriched category data
 * @param category - Category name
 * @param apiColor - Optional color from API
 * @param apiIcon - Optional icon name from API
 */
export function getCategoryData(
  category: string,
  apiColor?: string,
  apiIcon?: string
): CategoryData {
  return {
    name: category,
    color: getCategoryColor(category, apiColor),
    icon: getCategoryIcon(category, apiIcon),
  };
}
