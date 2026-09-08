export const CATEGORIES = [
  {
    id: "fresh-vegetables",
    name: "Fresh Vegetables",
    slug: "fresh-vegetables",
    icon: "Carrot",
    description: "Farm-fresh daily vegetables, greens, and gourds sourced every morning from regional mandis.",
    color: "from-emerald-500 to-green-600",
    bannerImg: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Daily Staples", "Leafy Greens", "Gourds & Cucumbers", "Specialty Veggies"]
  },
  {
    id: "fruits",
    name: "Fruits",
    slug: "fruits",
    icon: "Apple",
    description: "Naturally ripened sweet apples, bananas, seasonal mangoes, citrus, and fresh berries.",
    color: "from-amber-500 to-orange-600",
    bannerImg: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Apples & Pears", "Bananas", "Citrus", "Mangoes", "Melons", "Tropical", "Berries & Grapes", "Exotic Fruits"]
  },
  {
    id: "spices-masala",
    name: "Spices & Masala",
    slug: "spices-masala",
    icon: "Flame",
    description: "Aromatic whole spices, powdered pure masalas, garam masala, and regional spice blends.",
    color: "from-red-500 to-amber-600",
    bannerImg: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Powdered Spices", "Blended Masalas", "Whole Spices", "Salts"]
  },
  {
    id: "rice-grains",
    name: "Rice & Grains",
    slug: "rice-grains",
    icon: "Wheat",
    description: "Aged basmati rice, Sona Masoori, brown rice, poha, murmura, dalia, and oats.",
    color: "from-yellow-500 to-amber-600",
    bannerImg: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Basmati Rice", "Regular Rice", "Sella Rice", "Brown Rice", "Breakfast Grains", "Snack Grains", "Healthy Grains"]
  },
  {
    id: "atta-flour",
    name: "Atta & Flour",
    slug: "atta-flour",
    icon: "Layers",
    description: "100% stone-ground chakki wheat atta, multigrain, besan, suji, and gluten-free millet flours.",
    color: "from-amber-600 to-yellow-700",
    bannerImg: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Whole Wheat", "Specialty Atta", "Gram Flour", "Refined Flour", "Semolina", "Rice Flour", "Corn Flour", "Millet Flour"]
  },
  {
    id: "dal-pulses",
    name: "Dal & Pulses",
    slug: "dal-pulses",
    icon: "CircleDot",
    description: "Unpolished toor dal, moong, masoor, chana dal, urad, rajma, and chickpeas.",
    color: "from-orange-500 to-amber-700",
    bannerImg: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Toor Dal", "Moong Dal", "Masoor Dal", "Chana Dal", "Urad Dal", "Kidney Beans", "Chickpeas", "Specialty Pulses"]
  },
  {
    id: "cooking-oil-ghee",
    name: "Cooking Oil & Ghee",
    slug: "cooking-oil-ghee",
    icon: "Droplet",
    description: "Pure desi ghee, kachi ghani mustard oil, refined sunflower, soybean, and cold-pressed oils.",
    color: "from-yellow-400 to-amber-500",
    bannerImg: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Cooking Oil", "Mustard Oil", "Blended Oil", "Groundnut Oil", "Coconut Oil", "Specialty Oil", "Olive Oil", "Desi Ghee", "Cow Ghee"]
  },
  {
    id: "sauces-vinegar",
    name: "Sauces & Vinegar",
    slug: "sauces-vinegar",
    icon: "Wine",
    description: "Tomato ketchup, chilli sauces, Schezwan, soy sauce, mayonnaise, and apple cider vinegar.",
    color: "from-red-600 to-rose-700",
    bannerImg: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Tomato Ketchup", "Tomato Sauce", "Chilli Sauce", "Asian Sauces", "Schezwan", "Dips & Spreads", "Pasta Sauce", "Mayonnaise", "Mustard Sauce", "Vinegar"]
  },
  {
    id: "biscuits",
    name: "Biscuits",
    slug: "biscuits",
    icon: "Cookie",
    description: "Parle-G, Good Day, Marie Gold, Bourbon, Monaco, Hide & Seek, digestives, and cookies.",
    color: "from-amber-700 to-yellow-800",
    bannerImg: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Glucose Biscuits", "Salt Biscuits", "Tea Biscuits", "Butter Biscuits", "Cream Biscuits", "Chocolate Biscuits", "Milk Biscuits", "Coconut Biscuits", "Digestive Biscuits", "Cookies"]
  },
  {
    id: "chips-namkeen",
    name: "Chips & Namkeen",
    slug: "chips-namkeen",
    icon: "Sparkles",
    description: "Kurkure, Lay\'s potato chips, Haldiram\'s Aloo Bhujia, sev, mixtures, roasted chana, and popcorn.",
    color: "from-orange-600 to-red-600",
    bannerImg: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Kurkure & Puffs", "Potato Chips", "Namkeen", "Healthy Snacks", "Chips", "Popcorn"]
  },
  {
    id: "chocolates-candy",
    name: "Chocolates & Candy",
    slug: "chocolates-candy",
    icon: "Gift",
    description: "Cadbury Dairy Milk, 5 Star, KitKat, Dark Chocolate, Ferrero Rocher, toffees, and lollipops.",
    color: "from-purple-600 to-indigo-700",
    bannerImg: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Chocolates", "Kids' Treats", "Premium Chocolates", "Toffee", "Candy"]
  },
  {
    id: "tea-coffee",
    name: "Tea & Coffee",
    slug: "tea-coffee",
    icon: "Coffee",
    description: "Tata Tea Gold, Red Label, green tea, Nescafe Classic, Bru, and dairy whiteners.",
    color: "from-emerald-700 to-teal-800",
    bannerImg: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Tea", "Masala Tea", "Green Tea", "Instant Coffee", "Cold Coffee", "Milk Powder"]
  },
  {
    id: "soft-drinks-beverages",
    name: "Soft Drinks & Beverages",
    slug: "soft-drinks-beverages",
    icon: "CupSoda",
    description: "Coca-Cola, Sprite, Thums Up, Maaza, packaged water, club soda, and refreshing syrups.",
    color: "from-blue-500 to-cyan-600",
    bannerImg: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Carbonated Drinks", "Fruit Drinks", "Water & Soda"]
  },
  {
    id: "health-digestive-products",
    name: "Health & Digestive Products",
    slug: "health-digestive-products",
    icon: "HeartPulse",
    description: "Hajmola, Chyawanprash, pure honey, Glucon-D, and premium almonds, cashews, and walnuts.",
    color: "from-rose-500 to-pink-600",
    bannerImg: "https://images.unsplash.com/photo-1508061252224-417ff643d021?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Digestives", "Ayurvedic", "Honey", "Energy & Glucose", "Dry Fruits"]
  },
  {
    id: "sweets",
    name: "Sweets",
    slug: "sweets",
    icon: "Cake",
    description: "Haldiram\'s Rasgulla, Gulab Jamun, Soan Papdi, Kaju Katli, Besan Laddu, and traditional mithai.",
    color: "from-amber-400 to-orange-500",
    bannerImg: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Canned Sweets", "Boxed Sweets", "Specialty Sweets", "Laddus", "Traditional Sweets"]
  },
  {
    id: "noodles-instant-food",
    name: "Noodles & Instant Food",
    slug: "noodles-instant-food",
    icon: "Utensils",
    description: "Maggi 2-Minute Noodles, YiPPee, pasta, macaroni, vermicelli, soups, and ready-to-eat meals.",
    color: "from-red-500 to-orange-600",
    bannerImg: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Instant Noodles", "Vermicelli", "Pasta & Macaroni", "Soup", "Ready-to-eat"]
  },
  {
    id: "dairy",
    name: "Dairy",
    slug: "dairy",
    icon: "Milk",
    description: "Fresh toned milk, full cream, Mother Dairy curd, paneer, Amul butter, cheese, and lassi.",
    color: "from-blue-400 to-sky-500",
    bannerImg: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Milk", "Curd", "Paneer", "Butter", "Cheese", "Cream", "Lassi & Beverages", "Buttermilk"]
  },
  {
    id: "bread-bakery",
    name: "Bread & Bakery",
    slug: "bread-bakery",
    icon: "Croissant",
    description: "100% whole wheat bread, white sandwich bread, burger buns, pav, rusks, and tea cakes.",
    color: "from-amber-600 to-yellow-600",
    bannerImg: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Bread", "Specialty Breads", "Buns & Pav", "Rusk & Toasts", "Cakes & Muffins", "Bakery Biscuits"]
  },
  {
    id: "personal-care",
    name: "Personal Care",
    slug: "personal-care",
    icon: "Smile",
    description: "Colgate toothpaste, Head & Shoulders shampoo, Dettol soaps, body wash, and face care.",
    color: "from-teal-500 to-emerald-600",
    bannerImg: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Oral Care", "Hair Care", "Bath & Body", "Skin Care", "Deodorants"]
  },
  {
    id: "cleaning-household",
    name: "Cleaning & Household",
    slug: "cleaning-household",
    icon: "Sparkle",
    description: "Surf Excel, Vim gel, Lizol floor cleaner, Harpic, Colin glass spray, and garbage bags.",
    color: "from-cyan-600 to-blue-700",
    bannerImg: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Laundry Care", "Dishwashing", "Floor & Toilet", "Glass & Multi-surface", "Disinfectant", "Scrubbers & Sponges", "Garbage Bags", "Paper & Tissues"]
  },
  {
    id: "kitchen-items",
    name: "Kitchen Items",
    slug: "kitchen-items",
    icon: "Package",
    description: "Milton bottles, lunch boxes, storage containers, stainless steel dinnerware, foil, and bags.",
    color: "from-slate-600 to-zinc-700",
    bannerImg: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Plasticware", "Bottles & Flasks", "Containers", "Lunch Boxes", "Tableware", "Cutlery", "Kitchen Linen", "Tools & Gadgets", "Cleaning Tools", "Food Wraps"]
  },
  {
    id: "stationery",
    name: "Stationery",
    slug: "stationery",
    icon: "PenTool",
    description: "Reynolds pens, Classmate notebooks, pencils, markers, Fevicol, staplers, and calculators.",
    color: "from-indigo-500 to-purple-600",
    bannerImg: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Pens & Pencils", "Geometrical Tools", "Notebooks & Registers", "Markers & Highlighters", "Art & Craft", "Glues & Tapes", "Office Tools"]
  },
  {
    id: "baby-products",
    name: "Baby Products",
    slug: "baby-products",
    icon: "Baby",
    description: "Pampers diapers, Himalaya baby wipes, Johnson\'s shampoo, baby lotion, and Cerelac.",
    color: "from-pink-400 to-rose-500",
    bannerImg: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Baby Bath", "Baby Skincare", "Diapers & Wipes", "Baby Food", "Feeding & Nursing"]
  },
  {
    id: "pet-products",
    name: "Pet Products",
    slug: "pet-products",
    icon: "Bone",
    description: "Pedigree dog food, Whiskas cat food, calcium treats, pet shampoo, and feeding bowls.",
    color: "from-amber-600 to-orange-700",
    bannerImg: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Dog Food", "Cat Food", "Pet Treats", "Pet Grooming", "Pet Accessories"]
  },
  {
    id: "puja-essentials",
    name: "Puja Essentials",
    slug: "puja-essentials",
    icon: "Sun",
    description: "Cycle agarbatti, pure bhimseni kapur, cotton wicks, clay diyas, matchboxes, and brass accessories.",
    color: "from-yellow-600 to-amber-700",
    bannerImg: "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Incense", "Camphor & Wicks", "Diyas & Lamps", "Matchbox", "Pooja Oil", "Pooja Accessories"]
  },
  {
    id: "other-daily-needs",
    name: "Other Daily-Needs",
    slug: "other-daily-needs",
    icon: "Compass",
    description: "Duracell batteries, Good Knight mosquito repellents, room fresheners, umbrellas, and shoe polish.",
    color: "from-slate-700 to-gray-800",
    bannerImg: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=1000&auto=format&fit=crop&q=80",
    subcategories: ["Electrical & Hardware", "Pest Control", "Fresheners", "Shoe Care", "Home Utility", "Rain & Weather"]
  }
];
