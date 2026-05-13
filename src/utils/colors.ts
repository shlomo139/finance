export type CategoryMeta = {
  color: string;
  icon: string;
};

// Colors requested by user:
// #58F3F6 (Cyan)
// #F2CF11 (Yellow)
// #F211AF (Pink)
// #375657 (Dark Teal)
// #CFE8E8 (Light Teal)

// Additional shades for variety in charts
const ALL_CHART_COLORS = [
  "#F211AF", "#F2CF11", "#58F3F6", "#5F5DE2", "#372265",
  "#CDF22A", "#007176", "#DB3800"
];

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  "רכב": { color: "#F211AF", icon: "directions_car" },
  "דלק": { color: "#F2CF11", icon: "local_gas_station" },
  "תחבורה": { color: "#58F3F6", icon: "directions_bus" },
  "מזון": { color: "#5F5DE2", icon: "shopping_cart" },
  "סופר": { color: "#372265", icon: "shopping_basket" },
  "מסעדות": { color: "#CDF22A", icon: "restaurant" },
  "בתי קפה": { color: "#007176", icon: "local_cafe" },
  "פנאי": { color: "#DB3800", icon: "attractions" },
  "תקשורת": { color: "#F211AF", icon: "wifi" },
  "חשבונות": { color: "#F2CF11", icon: "receipt_long" },
  "חשמל": { color: "#58F3F6", icon: "electric_bolt" },
  "מים": { color: "#5F5DE2", icon: "water_drop" },
  "ארנונה": { color: "#372265", icon: "account_balance" },
  "בריאות": { color: "#CDF22A", icon: "favorite" },
  "פארמה": { color: "#007176", icon: "medical_services" },
  "קניות": { color: "#DB3800", icon: "local_mall" },
  "משכורת": { color: "#CDF22A", icon: "account_balance_wallet" },
  "הכנסה": { color: "#CDF22A", icon: "payments" },
  "עירייה וממשלה": { color: "#372265", icon: "account_balance" },
  "טיסות ותיירות": { color: "#007176", icon: "flight" },
  "שונות": { color: "#375657", icon: "category" },
  "כללי": { color: "#375657", icon: "category" }
};

const DEFAULT_META: CategoryMeta = { color: "#375657", icon: "label" };

export function getCategoryMeta(categoryName: string): CategoryMeta {
  if (!categoryName) return DEFAULT_META;
  
  // Find a partial match if exact match doesn't exist
  for (const [key, meta] of Object.entries(CATEGORY_MAP)) {
    if (categoryName.includes(key) || key.includes(categoryName)) {
      return meta;
    }
  }

  // Fallback hashing for unknown categories
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const icons = ["label", "sell", "bookmark", "star", "wallet", "payments", "receipt", "local_offer", "inventory_2"];
  
  return {
    color: ALL_CHART_COLORS[Math.abs(hash) % ALL_CHART_COLORS.length],
    icon: icons[Math.abs(hash) % icons.length]
  };
}

export function getCategoryColor(categoryName: string): string {
  return getCategoryMeta(categoryName).color;
}

export function getCategoryIcon(categoryName: string): string {
  return getCategoryMeta(categoryName).icon;
}

export { ALL_CHART_COLORS };
