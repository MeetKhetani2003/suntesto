export interface IngredientItem {
  label: string;
  percentage: string;
}

export interface NutritionRow {
  name: string;
  value: string;
  rda: string;
}

export interface ProductData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  weight: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviewsCount: number;
  imageSrc: string;
  images?: string[];
  archClass: string;
  bgClass: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  buttonBorder: string;
  description: string;
  ingredientsText: string;
  ingredientsList: IngredientItem[];
  ingredientImage: string; // Layered ingredients picture or similar
  nutritionServingSize: string;
  nutritionList: NutritionRow[];
  faqList: { question: string; answer: string }[];
}

export const PRODUCTS_MAP: Record<string, ProductData> = {
  "freeze-dried-strawberry": {
    id: "prod-strawberry",
    slug: "freeze-dried-strawberry",
    title: "FREEZE-DRIED STRAWBERRY",
    subtitle: "100% natural, crisp strawberry crunch",
    category: "FREEZE-DRIED FRUIT SNACK",
    weight: "30G",
    price: "₹149",
    originalPrice: "₹180",
    discount: "17% OFF",
    rating: 4.8,
    reviewsCount: 42,
    imageSrc: "/images/sustento-pouch-strawberry.jpg",
    archClass: "bg-[#FCE2EC]",
    bgClass: "bg-[#FCE2EC]/40",
    badge: "Best Seller",
    badgeBg: "bg-[#F9C5D8]",
    badgeText: "text-pink-800",
    buttonBorder: "border-pink-300",
    description: "Sustento's Freeze-Dried Strawberry slices are crafted using advanced moisture-extraction technology that preserves the fruit's cellular structure, vibrant color, and sweet-tart flavor profile. Ideal for school lunchboxes, post-workout energy, or dynamic snacking.",
    ingredientsText: "Just premium, ripe strawberries. No sugars, coloring agents, or preservatives added.",
    ingredientsList: [
      { label: "Whole Strawberries", percentage: "100%" },
      { label: "Added Sugar", percentage: "0%" },
      { label: "Preservatives", percentage: "0%" },
    ],
    ingredientImage: "/images/sustento-pouch-strawberry.jpg",
    nutritionServingSize: "Serving Size: 30g (one pouch)",
    nutritionList: [
      { name: "Energy (Kcal)", value: "104", rda: "5.2%" },
      { name: "Protein (g)", value: "2.1", rda: "4.2%" },
      { name: "Carbohydrates (g)", value: "23.4", rda: "7.8%" },
      { name: "Dietary Fibre (g)", value: "4.8", rda: "16.0%" },
      { name: "Total Sugar (g)", value: "15.6", rda: "NA" },
      { name: "Added Sugar (g)", value: "0", rda: "0%" },
      { name: "Total Fat (g)", value: "0.3", rda: "0.4%" },
      { name: "Saturated Fat (g)", value: "0", rda: "0%" },
      { name: "Trans Fat (g)", value: "0", rda: "0%" },
      { name: "Cholesterol (mg)", value: "0", rda: "0%" },
      { name: "Sodium (mg)", value: "3", rda: "0.1%" },
    ],
    faqList: [
      { question: "Is this safe for toddlers?", answer: "Yes, it is 100% real fruit with a crispy texture that melts easily in the mouth. Highly recommended for kids over 12 months." },
      { question: "How long does it stay crispy?", answer: "Once opened, consume within 24 hours or store in an airtight container to prevent moisture absorption." },
    ]
  },
  "chocolate-strawberry": {
    id: "prod-chocolate-strawberry",
    slug: "chocolate-strawberry",
    title: "CHOCOLATE STRAWBERRY",
    subtitle: "Freeze-dried strawberries dipped in dark chocolate",
    category: "FREEZE-DRIED FRUIT SNACK",
    weight: "50G",
    price: "₹199",
    originalPrice: "₹240",
    discount: "17% OFF",
    rating: 4.9,
    reviewsCount: 56,
    imageSrc: "/images/sustento-pouch-chocolate-strawberry.jpg",
    archClass: "bg-[#EDE8E4]",
    bgClass: "bg-[#EDE8E4]/40",
    badge: "Indulgent",
    badgeBg: "bg-[#DFCFC5]",
    badgeText: "text-amber-900",
    buttonBorder: "border-stone-300",
    description: "Decadence meets clean nutrition. Ripe, tangy freeze-dried strawberries are enrobed in custom-formulated premium dark chocolate sweetened with natural stevia. A guilt-free dessert that keeps your calorie count in check.",
    ingredientsText: "A balance of premium freeze-dried strawberries and stevia-sweetened dark chocolate.",
    ingredientsList: [
      { label: "Freeze-Dried Strawberry", percentage: "65%" },
      { label: "Stevia Dark Chocolate", percentage: "35%" },
      { label: "Palm Oil & Added Sugar", percentage: "0%" },
    ],
    ingredientImage: "/images/sustento-pouch-chocolate-strawberry.jpg",
    nutritionServingSize: "Serving Size: 50g (one pouch)",
    nutritionList: [
      { name: "Energy (Kcal)", value: "192", rda: "9.6%" },
      { name: "Protein (g)", value: "3.2", rda: "6.4%" },
      { name: "Carbohydrates (g)", value: "31.2", rda: "10.4%" },
      { name: "Dietary Fibre (g)", value: "5.6", rda: "18.6%" },
      { name: "Total Sugar (g)", value: "12.4", rda: "NA" },
      { name: "Added Sugar (g)", value: "0", rda: "0%" },
      { name: "Total Fat (g)", value: "6.8", rda: "9.7%" },
      { name: "Saturated Fat (g)", value: "2.4", rda: "12.0%" },
      { name: "Trans Fat (g)", value: "0", rda: "0%" },
      { name: "Cholesterol (mg)", value: "0", rda: "0%" },
      { name: "Sodium (mg)", value: "12", rda: "0.6%" },
    ],
    faqList: [
      { question: "What chocolate do you use?", answer: "We use high-quality 60% dark chocolate sweetened with premium Stevia extract, entirely free from hydrogenated vegetable oils or palm oils." },
      { question: "Does it melt during shipping?", answer: "We ship in temperature-insulated packages to ensure it reaches you in crisp, perfectly set condition." },
    ]
  },
  "freeze-dried-mango": {
    id: "prod-mango",
    slug: "freeze-dried-mango",
    title: "FREEZE-DRIED MANGO",
    subtitle: "Delicious Alphonso mango fruit crunchies",
    category: "FREEZE-DRIED FRUIT SNACK",
    weight: "30G",
    price: "₹149",
    originalPrice: "₹180",
    discount: "17% OFF",
    rating: 4.7,
    reviewsCount: 38,
    imageSrc: "/images/sustento-pouch-mango.jpg",
    archClass: "bg-[#F7EAD7]",
    bgClass: "bg-[#F7EAD7]/40",
    badge: "Fresh & Crispy",
    badgeBg: "bg-[#DFCFC5]",
    badgeText: "text-amber-900",
    buttonBorder: "border-stone-300",
    description: "Enjoy the king of fruits all year round. We select peak-season Alphonso mangoes and freeze-dry them to lock in their rich tropical aroma, golden color, and honeyed sweetness with absolutely no added sugar.",
    ingredientsText: "100% premium Alphonso mango slices. Nothing else.",
    ingredientsList: [
      { label: "Alphonso Mango", percentage: "100%" },
      { label: "Added Sugar", percentage: "0%" },
      { label: "Sulphur Dioxide", percentage: "0%" },
    ],
    ingredientImage: "/images/sustento-pouch-mango.jpg",
    nutritionServingSize: "Serving Size: 30g (one pouch)",
    nutritionList: [
      { name: "Energy (Kcal)", value: "112", rda: "5.6%" },
      { name: "Protein (g)", value: "1.4", rda: "2.8%" },
      { name: "Carbohydrates (g)", value: "26.1", rda: "8.7%" },
      { name: "Dietary Fibre (g)", value: "3.2", rda: "10.7%" },
      { name: "Total Sugar (g)", value: "21.6", rda: "NA" },
      { name: "Added Sugar (g)", value: "0", rda: "0%" },
      { name: "Total Fat (g)", value: "0.2", rda: "0.3%" },
      { name: "Saturated Fat (g)", value: "0", rda: "0%" },
      { name: "Trans Fat (g)", value: "0", rda: "0%" },
      { name: "Cholesterol (mg)", value: "0", rda: "0%" },
      { name: "Sodium (mg)", value: "2", rda: "0.1%" },
    ],
    faqList: [
      { question: "Is this sweet?", answer: "Yes, it has the natural honey-like sweetness of Alphonso mangoes, but contains zero added refined sugars." },
    ]
  },
  "freeze-dried-banana": {
    id: "prod-banana",
    slug: "freeze-dried-banana",
    title: "FREEZE-DRIED BANANA",
    subtitle: "Sweet and crispy natural banana crunchies",
    category: "FREEZE-DRIED FRUIT SNACK",
    weight: "35G",
    price: "₹129",
    originalPrice: "₹150",
    discount: "14% OFF",
    rating: 4.6,
    reviewsCount: 29,
    imageSrc: "/images/sustento-pouch-banana.jpg",
    archClass: "bg-[#E2F3E7]",
    bgClass: "bg-[#E2F3E7]/40",
    badge: "High Fiber",
    badgeBg: "bg-[#C4E9CE]",
    badgeText: "text-green-800",
    buttonBorder: "border-green-300",
    description: "A potassium powerhouse with a crunch! We source sweet Robusta bananas, slicing and freeze-drying them to create a crispy snack that pairs perfectly with oatmeal, yogurt, or directly from the bag.",
    ingredientsText: "100% natural, premium banana slices.",
    ingredientsList: [
      { label: "Banana Slices", percentage: "100%" },
      { label: "Frying Oil", percentage: "0%" },
      { label: "Added Sugar", percentage: "0%" },
    ],
    ingredientImage: "/images/sustento-pouch-banana.jpg",
    nutritionServingSize: "Serving Size: 35g (one pouch)",
    nutritionList: [
      { name: "Energy (Kcal)", value: "128", rda: "6.4%" },
      { name: "Protein (g)", value: "1.8", rda: "3.6%" },
      { name: "Carbohydrates (g)", value: "29.8", rda: "9.9%" },
      { name: "Dietary Fibre (g)", value: "3.9", rda: "13.0%" },
      { name: "Total Sugar (g)", value: "18.2", rda: "NA" },
      { name: "Added Sugar (g)", value: "0", rda: "0%" },
      { name: "Total Fat (g)", value: "0.1", rda: "0.1%" },
      { name: "Saturated Fat (g)", value: "0", rda: "0%" },
      { name: "Trans Fat (g)", value: "0", rda: "0%" },
      { name: "Cholesterol (mg)", value: "0", rda: "0%" },
      { name: "Sodium (mg)", value: "1.5", rda: "0.1%" },
    ],
    faqList: [
      { question: "Are these fried banana chips?", answer: "No, these are freeze-dried. They contain zero oil, fat, or preservatives, unlike traditional fried banana chips." },
    ]
  },
  "freeze-dried-pineapple": {
    id: "prod-pineapple",
    slug: "freeze-dried-pineapple",
    title: "FREEZE-DRIED PINEAPPLE",
    subtitle: "Tangy and tropical crispy pineapple chunks",
    category: "FREEZE-DRIED FRUIT SNACK",
    weight: "30G",
    price: "₹149",
    originalPrice: "₹180",
    discount: "17% OFF",
    rating: 4.8,
    reviewsCount: 31,
    imageSrc: "/images/sustento-pouch-pineapple.jpg",
    archClass: "bg-[#E2F0FD]",
    bgClass: "bg-[#E2F0FD]/40",
    badge: "Vitamin C Boost",
    badgeBg: "bg-[#BFE0FF]",
    badgeText: "text-blue-800",
    buttonBorder: "border-blue-300",
    description: "A burst of tropical sunshine in every bite. Sweet, tangy pineapple wedges are freeze-dried to deliver a concentrated Vitamin C booster snack with a satisfyingly crisp texture.",
    ingredientsText: "100% natural tropical pineapple. Free from chemical sulfites.",
    ingredientsList: [
      { label: "Pineapple Chunks", percentage: "100%" },
      { label: "Preservatives (Sulfites)", percentage: "0%" },
      { label: "Added Sugars", percentage: "0%" },
    ],
    ingredientImage: "/images/sustento-pouch-pineapple.jpg",
    nutritionServingSize: "Serving Size: 30g (one pouch)",
    nutritionList: [
      { name: "Energy (Kcal)", value: "102", rda: "5.1%" },
      { name: "Protein (g)", value: "1.1", rda: "2.2%" },
      { name: "Carbohydrates (g)", value: "24.6", rda: "8.2%" },
      { name: "Dietary Fibre (g)", value: "2.8", rda: "9.3%" },
      { name: "Total Sugar (g)", value: "16.8", rda: "NA" },
      { name: "Added Sugar (g)", value: "0", rda: "0%" },
      { name: "Total Fat (g)", value: "0.15", rda: "0.2%" },
      { name: "Saturated Fat (g)", value: "0", rda: "0%" },
      { name: "Trans Fat (g)", value: "0", rda: "0%" },
      { name: "Cholesterol (mg)", value: "0", rda: "0%" },
      { name: "Sodium (mg)", value: "3.5", rda: "0.2%" },
    ],
    faqList: [
      { question: "Is this sour?", answer: "It has a balanced sweet and tangy tropical taste, exactly like fresh ripe pineapple, just without the water!" },
    ]
  },
  "freeze-dried-lemon": {
    id: "prod-lemon",
    slug: "freeze-dried-lemon",
    title: "FREEZE-DRIED LEMON",
    subtitle: "Zingy, refreshing freeze-dried lemon wedges",
    category: "FREEZE-DRIED FRUIT SNACK",
    weight: "20G",
    price: "₹129",
    originalPrice: "₹150",
    discount: "14% OFF",
    rating: 4.5,
    reviewsCount: 17,
    imageSrc: "/images/sustento-pouch-lemon.jpg",
    archClass: "bg-[#EAE5DF]",
    bgClass: "bg-[#EAE5DF]/40",
    badge: "Zesty Crunch",
    badgeBg: "bg-[#DFCFC5]",
    badgeText: "text-amber-900",
    buttonBorder: "border-stone-300",
    description: "The ultimate refreshing snack or beverage garnish. Crisp, zesty lemon wedges freeze-dried to lock in citric acid, vitamin C, and fresh essential oils. Eat them straight for a sour kick, or drop into tea/water.",
    ingredientsText: "100% organic lemon wedges. No anti-caking or flow agents.",
    ingredientsList: [
      { label: "Organic Lemon Wedges", percentage: "100%" },
      { label: "Sulphite Preservatives", percentage: "0%" },
      { label: "Artificial Flavorings", percentage: "0%" },
    ],
    ingredientImage: "/images/sustento-pouch-lemon.jpg",
    nutritionServingSize: "Serving Size: 20g (one pouch)",
    nutritionList: [
      { name: "Energy (Kcal)", value: "54", rda: "2.7%" },
      { name: "Protein (g)", value: "0.8", rda: "1.6%" },
      { name: "Carbohydrates (g)", value: "14.2", rda: "4.7%" },
      { name: "Dietary Fibre (g)", value: "3.6", rda: "12.0%" },
      { name: "Total Sugar (g)", value: "3.2", rda: "NA" },
      { name: "Added Sugar (g)", value: "0", rda: "0%" },
      { name: "Total Fat (g)", value: "0.1", rda: "0.1%" },
      { name: "Saturated Fat (g)", value: "0", rda: "0%" },
      { name: "Trans Fat (g)", value: "0", rda: "0%" },
      { name: "Cholesterol (mg)", value: "0", rda: "0%" },
      { name: "Sodium (mg)", value: "2", rda: "0.1%" },
    ],
    faqList: [
      { question: "How do I use this?", answer: "You can munch them directly for an intense, crispy citrus kick, add them to water/soda for instant infused lemon water, or float them in tea." },
    ]
  }
};
