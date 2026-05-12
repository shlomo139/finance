export type CategoryMeta = {
  color: string;
  icon: string;
};

// Explicit category mapping carefully chosen to avoid duplicate colors where possible.
// Colors used: 
// #E63946 (Red)
// #F4674C (Coral Red)
// #9AD911 (Lime Green)
// #2A9D8F (Green)
// #034AA6 (Deep Blue)
// #3C74A6 (Soft Blue)
// #F2AE2E (Orange)
// #F2B950 (Light Orange)
// #94a3b8 (Gray)
// #cbd5e1 (Light Gray-Blue)

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  "רכב": { color: "#F2AE2E", icon: "directions_car" }, // Orange
  "דלק": { color: "#F2B950", icon: "local_gas_station" }, // Light Orange
  "תחבורה": { color: "#94a3b8", icon: "directions_bus" }, // Gray
  "מזון": { color: "#2A9D8F", icon: "shopping_cart" }, // Green
  "סופר": { color: "#9AD911", icon: "shopping_basket" }, // Lime Green
  "מסעדות": { color: "#E63946", icon: "restaurant" }, // Red
  "בתי קפה": { color: "#F4674C", icon: "local_cafe" }, // Coral Red
  "פנאי": { color: "#cbd5e1", icon: "attractions" }, // Light Gray-Blue
  "תקשורת": { color: "#3C74A6", icon: "wifi" }, // Soft Blue
  "חשבונות": { color: "#034AA6", icon: "receipt_long" }, // Deep Blue
  "חשמל": { color: "#F2AE2E", icon: "electric_bolt" }, // Orange
  "מים": { color: "#3C74A6", icon: "water_drop" }, // Soft Blue
  "ארנונה": { color: "#034AA6", icon: "account_balance" }, // Deep Blue
  "בריאות": { color: "#2A9D8F", icon: "favorite" }, // Green
  "פארמה": { color: "#9AD911", icon: "medical_services" }, // Lime Green
  "קניות": { color: "#E63946", icon: "local_mall" }, // Red
  "ביגוד": { color: "#F4674C", icon: "checkroom" }, // Coral Red
  "משכורת": { color: "#9AD911", icon: "account_balance_wallet" }, // Lime Green
  "הכנסה": { color: "#2A9D8F", icon: "payments" }, // Green
  "כללי": { color: "#94a3b8", icon: "category" } // Gray
};

const DEFAULT_META: CategoryMeta = { color: "#94a3b8", icon: "label" };

export function getCategoryMeta(categoryName: string): CategoryMeta {
  if (!categoryName) return DEFAULT_META;
  
  // Find a partial match if exact match doesn't exist
  for (const [key, meta] of Object.entries(CATEGORY_MAP)) {
    if (categoryName.includes(key) || key.includes(categoryName)) {
      return meta;
    }
  }

  // Fallback hashing for unknown categories using analogous colors requested by user
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // A palette specifically curated as analogous or fitting to the brand
  const colors = [
    "#E63946", // Red
    "#2A9D8F", // Green
    "#034AA6", // Deep Blue
    "#3C74A6", // Soft Blue
    "#94a3b8", // Gray
    "#cbd5e1", // Light Gray-Blue
    "#8ca1d8", // Soft Purple-Blue
    "#6b8e23", // Olive Green
    "#cd5c5c", // Indian Red
  ];
  const icons = ["label", "sell", "bookmark", "star", "wallet", "payments", "receipt", "local_offer", "inventory_2"];
  
  return {
    color: colors[Math.abs(hash) % colors.length],
    icon: icons[Math.abs(hash) % icons.length]
  };
}

export function getCategoryColor(categoryName: string): string {
  return getCategoryMeta(categoryName).color;
}

export function getCategoryIcon(categoryName: string): string {
  return getCategoryMeta(categoryName).icon;
}

export const ALL_CHART_COLORS = ["#034AA6", "#3C74A6", "#F2AE2E", "#F2B950", "#E63946", "#F4674C", "#2A9D8F", "#9AD911", "#cbd5e1", "#94a3b8"];
