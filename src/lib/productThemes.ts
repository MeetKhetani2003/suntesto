export interface ProductTheme {
  archClass: string;
  bgClass: string;
  badgeBg: string;
  badgeText: string;
  buttonBorder: string;
}

export const PRODUCT_THEMES: ProductTheme[] = [
  {
    archClass: "bg-[#FCE2EC]", // Pink (Strawberry)
    bgClass: "bg-[#FCE2EC]/40",
    badgeBg: "bg-[#F9C5D8]",
    badgeText: "text-pink-800",
    buttonBorder: "border-pink-300",
  },
  {
    archClass: "bg-[#F7EAD7]", // Orange/Beige (Mango)
    bgClass: "bg-[#F7EAD7]/40",
    badgeBg: "bg-[#DFCFC5]",
    badgeText: "text-amber-900",
    buttonBorder: "border-stone-300",
  },
  {
    archClass: "bg-[#E2F3E7]", // Green (Banana)
    bgClass: "bg-[#E2F3E7]/40",
    badgeBg: "bg-[#C4E9CE]",
    badgeText: "text-green-800",
    buttonBorder: "border-green-300",
  },
  {
    archClass: "bg-[#E2F0FD]", // Blue (Pineapple)
    bgClass: "bg-[#E2F0FD]/40",
    badgeBg: "bg-[#BFE0FF]",
    badgeText: "text-blue-800",
    buttonBorder: "border-blue-300",
  },
  {
    archClass: "bg-[#EAE5DF]", // Gray/Stone (Lemon)
    bgClass: "bg-[#EAE5DF]/40",
    badgeBg: "bg-[#DFCFC5]",
    badgeText: "text-amber-900",
    buttonBorder: "border-stone-300",
  },
  {
    archClass: "bg-[#EDE8E4]", // Brown/Cream (Chocolate Strawberry)
    bgClass: "bg-[#EDE8E4]/40",
    badgeBg: "bg-[#DFCFC5]",
    badgeText: "text-amber-900",
    buttonBorder: "border-stone-300",
  }
];

export function getProductTheme(slug: string = "", archClass: string = "", index: number = 0): ProductTheme {
  // 1. If a custom archClass is provided and is NOT the default pink, check if it matches a theme or use it dynamically
  if (archClass && archClass.toLowerCase() !== "bg-[#fce2ec]") {
    const matched = PRODUCT_THEMES.find(
      t => t.archClass.toLowerCase() === archClass.toLowerCase()
    );
    if (matched) return matched;

    // Custom hex color support (e.g. bg-[#ABCDEF])
    if (archClass.startsWith("bg-[#")) {
      const hexMatch = archClass.match(/bg-\[#([A-Fa-f0-9]{6})\]/i);
      const hex = hexMatch ? `#${hexMatch[1]}` : "#9EAB75";
      return {
        archClass: archClass,
        bgClass: `bg-[${hex}]/40`,
        badgeBg: "bg-charcoal/10",
        badgeText: "text-charcoal",
        buttonBorder: "border-charcoal/20",
      };
    }
  }

  // 2. Check matching keywords in slug next
  const normalizedSlug = slug.toLowerCase();
  if (normalizedSlug.includes("strawberry")) {
    if (normalizedSlug.includes("chocolate")) {
      return PRODUCT_THEMES[5]; // Chocolate Strawberry
    }
    return PRODUCT_THEMES[0]; // Strawberry
  }
  if (normalizedSlug.includes("mango")) {
    return PRODUCT_THEMES[1];
  }
  if (normalizedSlug.includes("banana")) {
    return PRODUCT_THEMES[2];
  }
  if (normalizedSlug.includes("pineapple")) {
    return PRODUCT_THEMES[3];
  }
  if (normalizedSlug.includes("lemon")) {
    return PRODUCT_THEMES[4];
  }

  // 3. Fallback: cycle through themes based on index
  return PRODUCT_THEMES[index % PRODUCT_THEMES.length];
}
