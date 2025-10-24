# React Native App Prompt for Roo Code

Create a complete React Native application using **Expo SDK 54** and **NativeWind** for a local Egyptian village marketplace app called "سوق القرية".

## Project Setup Requirements

```bash
# Initialize with Expo SDK 54
npx create-expo-app@latest village-marketplace --template blank
cd village-marketplace

# Install dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init

# Install additional required packages
npx expo install @expo/vector-icons
npx expo install expo-linking
npx expo install expo-font
npx expo install @react-native-async-storage/async-storage
```

## Configuration Files

### 1. `tailwind.config.js`
```js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. `babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"],
  };
};
```

### 3. `metro.config.js`
```js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
```

### 4. `app.json`
```json
{
  "expo": {
    "name": "سوق القرية",
    "slug": "village-marketplace",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#16a34a"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.villagemarket.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#16a34a"
      },
      "package": "com.villagemarket.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## Design Theme & Colors

### Color Palette
```js
// Use these exact colors in NativeWind classes
const theme = {
  primary: {
    light: '#f0fdf4',    // bg-green-50
    DEFAULT: '#16a34a',  // bg-green-600
    dark: '#15803d',     // bg-green-700
  },
  secondary: {
    light: '#eff6ff',    // bg-blue-50
    DEFAULT: '#2563eb',  // bg-blue-600
    dark: '#1d4ed8',     // bg-blue-700
  },
  background: {
    primary: 'from-green-50 to-blue-50',
    card: '#ffffff',
  },
  text: {
    primary: '#1f2937',   // text-gray-800
    secondary: '#4b5563', // text-gray-600
    light: '#9ca3af',     // text-gray-400
  },
  accent: {
    yellow: '#eab308',    // text-yellow-500
    red: '#ef4444',       // text-red-500
  }
}
```

## Mock Data (IMPORTANT: Use this exact data structure)

```js
// data/mockData.js
export const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: '🏪' },
  { id: 'vegetables', name: 'خضروات', icon: '🥬' },
  { id: 'fruits', name: 'فواكه', icon: '🍎' },
  { id: 'dairy', name: 'ألبان', icon: '🥛' },
  { id: 'poultry', name: 'دواجن', icon: '🐔' },
  { id: 'honey', name: 'عسل', icon: '🍯' },
  { id: 'grains', name: 'حبوب', icon: '🌾' }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', name: 'الكل', icon: '⚙️' },
  { id: 'delivery', name: 'توصيل', icon: '🚗' },
  { id: 'maintenance', name: 'صيانة', icon: '🔧' },
  { id: 'education', name: 'تعليم', icon: '📚' },
  { id: 'services', name: 'خدمات', icon: '✨' }
];

export const ITEMS = [
  {
    id: 1,
    name: 'طماطم طازجة',
    category: 'vegetables',
    price: 15,
    unit: 'كيلو',
    seller: 'محمد أحمد',
    village: 'كفر الشيخ',
    phone: '01012345678',
    rating: 4.8,
    image: '🍅',
    inStock: true,
    description: 'طماطم طازجة من المزرعة مباشرة'
  },
  {
    id: 2,
    name: 'بيض بلدي',
    category: 'poultry',
    price: 60,
    unit: '30 بيضة',
    seller: 'فاطمة حسن',
    village: 'المنيا',
    phone: '01098765432',
    rating: 4.9,
    image: '🥚',
    inStock: true,
    description: 'بيض طازج من دجاج بلدي'
  },
  {
    id: 3,
    name: 'جبنة قريش',
    category: 'dairy',
    price: 40,
    unit: 'كيلو',
    seller: 'حسن علي',
    village: 'سوهاج',
    phone: '01123456789',
    rating: 4.7,
    image: '🧀',
    inStock: true,
    description: 'جبنة قريش طبيعية 100%'
  },
  {
    id: 4,
    name: 'خيار بلدي',
    category: 'vegetables',
    price: 10,
    unit: 'كيلو',
    seller: 'سعيد محمود',
    village: 'أسيوط',
    phone: '01156789012',
    rating: 4.6,
    image: '🥒',
    inStock: true,
    description: 'خيار طازج من الحقل'
  },
  {
    id: 5,
    name: 'عسل نحل طبيعي',
    category: 'honey',
    price: 200,
    unit: 'كيلو',
    seller: 'أحمد سليم',
    village: 'الفيوم',
    phone: '01087654321',
    rating: 5.0,
    image: '🍯',
    inStock: true,
    description: 'عسل نحل طبيعي 100% من المنحل مباشرة'
  },
  {
    id: 6,
    name: 'دجاج بلدي',
    category: 'poultry',
    price: 80,
    unit: 'كيلو',
    seller: 'خديجة إبراهيم',
    village: 'بني سويف',
    phone: '01234567890',
    rating: 4.8,
    image: '🐔',
    inStock: true,
    description: 'دجاج بلدي طازج'
  },
  {
    id: 7,
    name: 'برتقال بلدي',
    category: 'fruits',
    price: 12,
    unit: 'كيلو',
    seller: 'عمر حسين',
    village: 'الإسماعيلية',
    phone: '01145678901',
    rating: 4.7,
    image: '🍊',
    inStock: true,
    description: 'برتقال حلو وطازج'
  },
  {
    id: 8,
    name: 'لبن جاموسي',
    category: 'dairy',
    price: 25,
    unit: 'لتر',
    seller: 'منى صلاح',
    village: 'الدقهلية',
    phone: '01223456789',
    rating: 4.9,
    image: '🥛',
    inStock: true,
    description: 'لبن جاموسي طازج يومياً'
  }
];

export const SERVICES = [
  {
    id: 1,
    name: 'توصيل طلبات',
    category: 'delivery',
    provider: 'كريم محمد',
    village: 'كفر الشيخ',
    phone: '01012345678',
    rating: 4.7,
    price: 10,
    icon: '🚗',
    available: true,
    description: 'توصيل سريع لجميع أنحاء القرية'
  },
  {
    id: 2,
    name: 'سباكة',
    category: 'maintenance',
    provider: 'عبد الله حسن',
    village: 'المنيا',
    phone: '01098765432',
    rating: 4.9,
    price: 50,
    icon: '🔧',
    available: true,
    description: 'صيانة وإصلاح جميع أعمال السباكة'
  },
  {
    id: 3,
    name: 'كهرباء',
    category: 'maintenance',
    provider: 'محمود علي',
    village: 'سوهاج',
    phone: '01123456789',
    rating: 4.8,
    price: 60,
    icon: '⚡',
    available: true,
    description: 'أعمال الكهرباء والصيانة'
  },
  {
    id: 4,
    name: 'نجارة',
    category: 'maintenance',
    provider: 'أحمد سعيد',
    village: 'أسيوط',
    phone: '01156789012',
    rating: 4.6,
    price: 70,
    icon: '🪚',
    available: true,
    description: 'صناعة وإصلاح الأثاث الخشبي'
  },
  {
    id: 5,
    name: 'دروس خصوصية',
    category: 'education',
    provider: 'نورا إبراهيم',
    village: 'الفيوم',
    phone: '01087654321',
    rating: 5.0,
    price: 100,
    icon: '📚',
    available: true,
    description: 'دروس خصوصية لجميع المراحل'
  },
  {
    id: 6,
    name: 'حلاقة منزلية',
    category: 'services',
    provider: 'يوسف أحمد',
    village: 'بني سويف',
    phone: '01234567890',
    rating: 4.7,
    price: 30,
    icon: '✂️',
    available: true,
    description: 'خدمة حلاقة في المنزل'
  },
  {
    id: 7,
    name: 'دهان',
    category: 'maintenance',
    provider: 'سامي رمضان',
    village: 'البحيرة',
    phone: '01198765432',
    rating: 4.8,
    price: 80,
    icon: '🎨',
    available: true,
    description: 'أعمال الدهانات والديكورات'
  },
  {
    id: 8,
    name: 'خياطة',
    category: 'services',
    provider: 'سعاد محمد',
    village: 'الغربية',
    phone: '01076543210',
    rating: 4.9,
    price: 50,
    icon: '🧵',
    available: true,
    description: 'خياطة وتفصيل ملابس'
  }
];
```

## App Structure & Screens

Create the following folder structure:

```
village-marketplace/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab Navigator
│   │   ├── index.tsx            # Market Screen (Home)
│   │   ├── services.tsx         # Services Screen
│   │   ├── cart.tsx             # Cart Screen
│   │   └── orders.tsx           # Orders Screen
│   ├── _layout.tsx              # Root Layout
│   └── product/[id].tsx         # Product Details (optional)
├── components/
│   ├── ProductCard.tsx
│   ├── ServiceCard.tsx
│   ├── CategoryFilter.tsx
│   ├── SearchBar.tsx
│   ├── CartItem.tsx
│   └── Header.tsx
├── data/
│   └── mockData.js
├── hooks/
│   ├── useCart.ts
│   └── useOrders.ts
├── utils/
│   ├── storage.ts
│   └── helpers.ts
└── types/
    └── index.ts
```

## Detailed Component Requirements

### 1. Header Component
```tsx
// components/Header.tsx
- Green gradient background (from-green-600 to-green-700)
- Title: "سوق القرية"
- Subtitle: "بيع وشراء وخدمات محلية"
- Home icon on the right
- "أضف منتج/خدمة" button (white bg, green text)
- Cart button with badge showing cart items count
- All text in Arabic (RTL support)
```

### 2. SearchBar Component
```tsx
// components/SearchBar.tsx
- White background with rounded corners
- Search icon on the right side
- Placeholder: "ابحث عن منتج أو خدمة..."
- Green focus ring (ring-green-400)
```

### 3. CategoryFilter Component
```tsx
// components/CategoryFilter.tsx
- Horizontal ScrollView
- Pill-shaped buttons
- Emoji + text for each category
- Active state: green-600 bg with white text
- Inactive: white bg with gray-700 text
- Smooth transitions
```

### 4. ProductCard Component
```tsx
// components/ProductCard.tsx
- White rounded card with shadow
- Large emoji at top (text-6xl)
- Product name (bold, text-xl)
- Price in green (text-2xl font-bold text-green-600)
- Rating with yellow star
- Seller name with user icon
- Village with map pin icon
- "أضف للسلة" button (green-600 bg)
- Phone call button (blue-600 bg)
- Hover effect: shadow-xl
```

### 5. ServiceCard Component
```tsx
// components/ServiceCard.tsx
- Similar to ProductCard but for services
- Service icon at top
- Provider name instead of seller
- Price for service
- "اتصل الآن" button with phone icon
```

### 6. CartItem Component
```tsx
// components/CartItem.tsx
- Gray-50 background
- Emoji/Icon on right
- Name and seller/provider
- Price in green
- Remove button (X icon in red)
```

## Screen Implementations

### 1. Market Screen (index.tsx)
```tsx
- Header with search
- CategoryFilter (horizontal scroll)
- Product grid (2 columns on mobile, 3 on tablet)
- Pull to refresh
- Smooth animations
- Empty state with icon and message
```

### 2. Services Screen (services.tsx)
```tsx
- Header with search
- Service category filter
- Service grid (2 columns)
- Direct call functionality
- Rating display
- Empty state
```

### 3. Cart Screen (cart.tsx)
```tsx
- List of cart items
- Remove item functionality
- Total calculation at bottom
- "إتمام الطلب" button (full width, green-600)
- Empty cart state with icon
- Smooth item removal animation
```

### 4. Orders Screen (orders.tsx)
```tsx
- List of orders with cards
- Order ID and date
- Status badge (yellow-100 bg for pending)
- Order items list
- Total in green
- Empty state for no orders
```

## Features to Implement

### 1. State Management
- Use React Context or Zustand for:
  - Cart management
  - Orders tracking
  - Search query
  - Selected category

### 2. AsyncStorage Integration
```typescript
// utils/storage.ts
- Save cart items
- Save orders
- Save user preferences
- Load data on app start
```

### 3. RTL Support
```tsx
// app/_layout.tsx
import { I18nManager } from 'react-native';
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);
```

### 4. Navigation
- Bottom tabs with icons:
  - 🏪 السوق (Market)
  - 👥 الخدمات (Services)
  - 🛒 السلة (Cart) - with badge
  - 📦 طلباتي (Orders)
- Active tab: green-600
- Inactive: gray-400

### 5. Phone Call Integration
```typescript
import { Linking } from 'react-native';

const makeCall = (phoneNumber: string) => {
  Linking.openURL(`tel:${phoneNumber}`);
};
```

## UI/UX Requirements

1. **Animations:**
   - Smooth transitions between screens
   - Card press animations
   - Cart item add/remove animations
   - Pull to refresh

2. **Loading States:**
   - Skeleton loaders for data
   - Loading indicators

3. **Empty States:**
   - Friendly messages
   - Large icons
   - Helpful text

4. **Responsive:**
   - Works on all screen sizes
   - Proper spacing and padding
   - SafeAreaView for notches

5. **Arabic Typography:**
   - Use system Arabic font
   - Proper text alignment (RTL)
   - Good contrast ratios

## NativeWind Classes to Use

```tsx
// Common classes
bg-gradient-to-br from-green-50 to-blue-50  // Main background
bg-green-600 text-white                      // Primary buttons
bg-blue-600 text-white                       // Secondary buttons
bg-white rounded-xl shadow-md                // Cards
text-gray-800 font-bold                      // Headings
text-gray-600                                // Body text
text-green-600 font-bold text-2xl            // Prices
px-4 py-3                                    // Padding
gap-2, gap-4                                 // Spacing
flex flex-row items-center justify-between  // Layouts
```

## Testing Checklist

- [ ] All screens render correctly
- [ ] RTL support works
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Add to cart works
- [ ] Remove from cart works
- [ ] Total calculation is accurate
- [ ] Phone call links work
- [ ] Orders are saved
- [ ] Data persists after app restart
- [ ] Smooth animations
- [ ] No console errors
- [ ] Works on iOS and Android

## Final Notes

- Use TypeScript for type safety
- Add proper error handling
- Implement loading states
- Use memoization where needed (useMemo, useCallback)
- Keep components small and reusable
- Follow React Native best practices
- Test on both iOS and Android simulators

Start with setting up the project, then implement screens one by one, and finally add state management and persistence.