import type { Recipe } from '../types/recipe';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'dal-curry-default',
    title: 'Dal Curry',
    emoji: '🌾',
    category: 'Curry',
    cookTimeMinutes: 25,
    servings: 3,
    tags: ['Lentils', 'Comfort Food', 'Pressure Cooker', 'Indian', 'Vegan'],
    isFavorite: true,
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
    ingredients: [
      { id: 'i1', name: 'Dal (lentils)', amount: '1/2 cup', notes: 'Soaked in water' },
      { id: 'i2', name: 'Onion', amount: '1', notes: 'Chopped' },
      { id: 'i3', name: 'Oil', amount: '1 large cooking spoon' },
      { id: 'i4', name: 'Mustard seeds', amount: '1 tsp' },
      { id: 'i5', name: 'Cumin seeds', amount: '1 tsp' },
      { id: 'i6', name: 'Garlic paste', amount: '1 tsp' },
      { id: 'i7', name: 'Salt', amount: '1/2 tsp' },
      { id: 'i8', name: 'Chili powder', amount: '1 tsp' },
      { id: 'i9', name: 'Turmeric powder', amount: '1/2 tsp' },
      { id: 'i10', name: 'Water', amount: 'Enough to cover the dal' }
    ],
    instructions: [
      { id: 's1', stepNumber: 1, text: 'Soak 1/2 cup dal in water. Chop 1 onion.' },
      { id: 's2', stepNumber: 2, text: 'Add 1 cooking large spoon of oil to the pressure cooker.' },
      { id: 's3', stepNumber: 3, text: 'Add 1 teaspoon of mustard seeds and 1 teaspoon of cumin seeds; let them splutter.' },
      { id: 's4', stepNumber: 4, text: 'Add the chopped onion and saute till golden brown.' },
      { id: 's5', stepNumber: 5, text: 'Add 1 teaspoon of garlic paste, 1/2 teaspoon salt, 1 teaspoon chili powder, and 1/2 teaspoon turmeric powder.' },
      { id: 's6', stepNumber: 6, text: 'Add the soaked dal and fill water enough to cover the dal.' },
      { id: 's7', stepNumber: 7, text: 'Close the cooker lid and cook until full pressure (approx. 5 minutes).' },
      { id: 's8', stepNumber: 8, text: 'Switch off the fire and let it rest for 15 minutes before opening.' }
    ],
    notes: 'Classic wholesome dal prepared in a pressure cooker. Pairs wonderfully with steaming rice or hot rotis.',
    citations: []
  },
  {
    id: 'mushroom-noodles-default',
    title: 'Noodles',
    emoji: '🍜',
    category: 'Noodles',
    cookTimeMinutes: 15,
    servings: 2,
    tags: ['Noodles', 'Asian', 'Quick & Easy', 'Mushrooms', 'Stir Fry'],
    isFavorite: true,
    createdAt: 1710001000000,
    updatedAt: 1710001000000,
    ingredients: [
      { id: 'ni1', name: 'Wok-ready noodles', amount: '200g' },
      { id: 'ni2', name: 'Sliced mushrooms', amount: '1 cup', notes: 'Any type' },
      { id: 'ni3', name: 'Garlic', amount: '2 cloves', notes: '1 teaspoon minced' },
      { id: 'ni4', name: 'Grated ginger', amount: '1 tsp', notes: 'Optional' },
      { id: 'ni5', name: 'Soy sauce', amount: '2 tbsp' },
      { id: 'ni6', name: 'Sesame oil (or vegetable oil)', amount: '1 tbsp' },
      { id: 'ni7', name: 'Chili flakes or chili sauce', amount: '1 tsp', notes: 'Adjust to taste' },
      { id: 'ni8', name: 'Salt and black pepper', amount: 'To taste' },
      { id: 'ni9', name: 'Green onions or sesame seeds', amount: 'To garnish', notes: 'Optional' }
    ],
    instructions: [
      { id: 'ns1', stepNumber: 1, text: 'Heat the Wok: Add sesame oil to a hot wok or skillet.' },
      { id: 'ns2', stepNumber: 2, text: 'Cook Aromatics: Sauté garlic (and ginger if using) for about 30 seconds until fragrant.' },
      { id: 'ns3', stepNumber: 3, text: 'Add Mushrooms: Toss in the mushrooms and stir-fry for 4–5 minutes until they release moisture and start to brown.' },
      { id: 'ns4', stepNumber: 4, text: 'Prepare Sauce: Mix soy sauce, chili flakes/sauce, and a pinch of black pepper in a small bowl.' },
      { id: 'ns5', stepNumber: 5, text: 'Combine Noodles: Add noodles to the wok, pour sauce over them, and toss together on high heat for 2–3 minutes.' },
      { id: 'ns6', stepNumber: 6, text: 'Serve: Garnish with sliced green onions or toasted sesame seeds if available.' }
    ],
    notes: 'This dish is quick, versatile, and delicious! You can adjust spices based on your preference.',
    variations: [
      {
        id: 'var1',
        title: 'Scrambled Eggs Method',
        description: 'Increase protein and add a richer, velvety texture by scrambling eggs first.',
        steps: [
          'Scramble the Eggs: Crack 1-2 eggs into a bowl, whisk lightly with a pinch of salt and pepper.',
          'Cook Eggs First: Before adding other ingredients, pour beaten eggs into the hot wok with sesame oil. Scramble until mostly cooked but soft, then set aside.',
          'Follow Original Recipe: Sauté garlic/ginger, add mushrooms and brown.',
          'Combine Everything: Return noodles, sauce, and cooked scrambled eggs back into the wok. Toss on high heat for 2–3 minutes.'
        ],
        tips: ["Don't overcook the eggs as they can become rubbery."]
      },
      {
        id: 'var2',
        title: 'Egg Drop Method',
        description: 'Cook eggs directly in the center of the wok for silky noodles.',
        steps: [
          'Follow Original Recipe until mushrooms are stir-fried.',
          'Create a Well: Push mushrooms to the side of the wok to create an open center.',
          'Pour in Eggs: Crack 1-2 eggs directly into the well. Let cook a few seconds until edges set.',
          'Stir and Combine: Break yolks and stir eggs into mushrooms and noodles for 2-3 minutes.'
        ],
        tips: ['Ensure enough oil in the wok to prevent sticking.']
      }
    ],
    citations: [
      'https://greenbowl2soul.com/easy-mushroom-noodles/',
      'https://www.budgetbytes.com/simple-mushroom-broccoli-stir-fry-noodles/',
      'https://alicezaslavsky.com/wet-fry-mushroom-noodles-from-the-joy-of-better-cooking/',
      'https://www.thekitchn.com/how-to-stir-fry-noodles-226766',
      'https://khinskitchen.com/mushroom-chow-mein/',
      'https://www.bowlofdelicious.com/udon-noodle-stir-fry/',
      'https://www.recipetineats.com/asian-mushroom-ramen-noodle-recipe/',
      'https://thewoksoflife.com/mushroom-noodles/'
    ]
  },
  {
    id: 'biryani-default',
    title: 'Biryani',
    emoji: '🍗',
    category: 'Rice',
    cookTimeMinutes: 30,
    servings: 4,
    tags: ['Rice', 'Chicken', 'Pressure Cooker', 'Aromatic', 'One Pot'],
    isFavorite: true,
    createdAt: 1710002000000,
    updatedAt: 1710002000000,
    ingredients: [
      { id: 'bi1', name: 'Rice', amount: '2 cups 🍚' },
      { id: 'bi2', name: 'Biryani Masala', amount: '2 tbsp 🌶️' },
      { id: 'bi3', name: 'Water', amount: '3 - 3.5 cups 💦' },
      { id: 'bi4', name: 'Ghee', amount: '2 tbsp' },
      { id: 'bi5', name: 'Salt', amount: '1/2 tbsp' },
      { id: 'bi6', name: 'Onions', amount: '3', notes: 'Sliced' },
      { id: 'bi7', name: 'Garlic', amount: '1 tsp', notes: 'Minced/paste' },
      { id: 'bi8', name: 'Carrots', amount: '1 cup (1 large carrot) 🥕' },
      { id: 'bi9', name: 'Beans', amount: '1/2 cup (5-6 beans) 🫛' },
      { id: 'bi10', name: 'Chicken', amount: '450-500g 🍗🐔' }
    ],
    instructions: [
      { id: 'bs1', stepNumber: 1, text: 'Heat 2 tablespoons of Ghee in the pressure cooker.' },
      { id: 'bs2', stepNumber: 2, text: 'Add sliced onions and minced garlic, sautéing until fragrant and golden.' },
      { id: 'bs3', stepNumber: 3, text: 'Add 2 tablespoons of Biryani Masala powder and mix well into the aromatics.' },
      { id: 'bs4', stepNumber: 4, text: 'Add 450-500g chicken pieces along with chopped carrots and beans; sear briefly.' },
      { id: 'bs5', stepNumber: 5, text: 'Add 2 cups rice, 3-3.5 cups water, and 1/2 tablespoon salt. Stir gently.' },
      { id: 'bs6', stepNumber: 6, text: 'Close cooker lid. Cook on maximum flame until first whistle.' },
      { id: 'bs7', stepNumber: 7, text: 'Reduce flame and simmer for 4–5 minutes, then switch off the flame.' },
      { id: 'bs8', stepNumber: 8, text: 'Wait until steam/pressure is completely released naturally, open lid, and let rest before fluffing.' }
    ],
    notes: 'One-pot pressure cooker aromatic chicken and vegetable biryani. Perfectly seasoned and quick for weeknights.',
    citations: []
  }
];
