import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Plan from '../models/Plan.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const users = [
  {
    name: 'Super Admin',
    email: 'admin@boxflow.com',
    password: 'password123',
    role: 'superadmin',
    isActive: true
  },
  {
    name: 'Test Customer',
    email: 'customer@test.com',
    password: 'password123',
    role: 'customer',
    isActive: true
  }
];

const plans = [
  {
    name: 'Basic Box',
    description: 'A great starter box with 3 premium items',
    price: 29.99,
    billingCycle: 'monthly',
    category: 'lifestyle',
    features: ['3 items', 'Free shipping'],
    includedProducts: 3
  },
  {
    name: 'Premium Box',
    description: 'The ultimate experience with 5 premium items',
    price: 49.99,
    billingCycle: 'monthly',
    category: 'lifestyle',
    features: ['5 items', 'Priority shipping', 'Customization'],
    includedProducts: 5
  }
];

const products = [
  // --- Category: phones ---
  {
    name: 'Apple iPhone 15 Pro Max',
    sku: 'PRD-PHN-IPH15',
    description: 'The ultimate Apple iPhone with an aerospace-grade titanium design, revolutionary A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
    category: 'phones',
    price: 1199.99,
    cost: 650.00,
    stock: 140,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'iphone', 'ios', 'phone', 'mobile', 'wireless', 'camera', 'titanium', 'premium'],
    specs: {
      'Brand': 'Apple',
      'Processor': 'Apple A17 Pro (3nm)',
      'Display': '6.7-inch Super Retina XDR OLED (120Hz)',
      'Rear Camera': '48MP Main + 12MP UltraWide + 12MP 5x Telephoto',
      'Material': 'Aerospace-Grade Titanium',
      'Battery': 'Up to 29 hours video playback',
      'Interface': 'USB-C (USB 3 support)'
    }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    sku: 'PRD-PHN-GS24U',
    description: 'Unleash new levels of creativity, productivity and possibility with the Galaxy S24 Ultra. Powered by Galaxy AI, featuring a titanium frame, and an integrated S Pen stylus.',
    category: 'phones',
    price: 1299.99,
    cost: 700.00,
    stock: 115,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600'],
    tags: ['samsung', 'galaxy', 'android', 'phone', 'mobile', 'stylus', 'ai', 'camera', 'titanium'],
    specs: {
      'Brand': 'Samsung',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Display': '6.8-inch Dynamic AMOLED 2X (120Hz, 2600 nits)',
      'Rear Camera': '200MP Main + 50MP Telephoto + 12MP UltraWide + 10MP Telephoto',
      'Stylus': 'Built-in S Pen with air gestures',
      'AI Features': 'Circle to Search, Live Translate, Note Assist',
      'Battery': '5000 mAh with 45W Fast Charging'
    }
  },
  {
    name: 'Google Pixel 8 Pro',
    sku: 'PRD-PHN-PIX8P',
    description: 'The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and a polished aluminum frame with a matte glass back.',
    category: 'phones',
    price: 999.00,
    cost: 520.00,
    stock: 85,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600'],
    tags: ['google', 'pixel', 'android', 'phone', 'mobile', 'ai', 'camera', 'clean'],
    specs: {
      'Brand': 'Google',
      'Processor': 'Google Tensor G3 (Titan M2 security)',
      'Display': '6.7-inch Super Actua Display (120Hz LTPO)',
      'Rear Camera': '50MP Main + 48MP UltraWide + 48MP 5x Zoom',
      'AI Features': 'Magic Eraser, Best Take, Audio Magic Eraser',
      'Battery': '5050 mAh with 30W Fast Charging',
      'OS Support': '7 Years of OS and Security updates'
    }
  },
  {
    name: 'OnePlus 12 Dual-SIM',
    sku: 'PRD-PHN-OP12',
    description: 'Redefined flagship smartphone featuring the Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System for Mobile, and absolute power with 100W SUPERVOOC charging.',
    category: 'phones',
    price: 799.99,
    cost: 420.00,
    stock: 95,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'],
    tags: ['oneplus', 'android', 'phone', 'mobile', 'hasselblad', 'fast charging'],
    specs: {
      'Brand': 'OnePlus',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3',
      'Display': '6.82-inch 2K Oriental AMOLED (120Hz, 4500 nits peak)',
      'Rear Camera': '50MP Sony LYT-808 + 64MP Periscope + 48MP UltraWide',
      'Charging': '100W Wired SUPERVOOC + 50W AIRVOOC Wireless',
      'Battery': '5400 mAh Dual-cell',
      'Cooling': 'Dual Cryo-velocity VC cooling'
    }
  },
  {
    name: 'Apple iPhone 15',
    sku: 'PRD-PHN-IPH15B',
    description: 'Features Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design.',
    category: 'phones',
    price: 799.00,
    cost: 430.00,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'iphone', 'ios', 'phone', 'mobile', 'color', 'camera', 'base'],
    specs: {
      'Brand': 'Apple',
      'Processor': 'Apple A16 Bionic',
      'Display': '6.1-inch Super Retina XDR OLED',
      'Rear Camera': '48MP Main + 12MP UltraWide',
      'Interface': 'USB-C connector',
      'Security': 'Face ID via TrueDepth camera',
      'Safety': 'Crash Detection & Emergency SOS via Satellite'
    }
  },
  {
    name: 'Samsung Galaxy Z Fold 5',
    sku: 'PRD-PHN-ZFOLD5',
    description: 'A massive 7.6-inch main screen that folds into your pocket. Experience a powerful PC-like device in your hands, perfect for intensive multi-tasking.',
    category: 'phones',
    price: 1799.99,
    cost: 980.00,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=600'],
    tags: ['samsung', 'galaxy', 'foldable', 'phone', 'mobile', 'folding', 'large screen'],
    specs: {
      'Brand': 'Samsung',
      'Processor': 'Snapdragon 8 Gen 2 for Galaxy',
      'Main Display': '7.6-inch Foldable Dynamic AMOLED 2X (120Hz)',
      'Cover Display': '6.2-inch Dynamic AMOLED 2X (120Hz)',
      'Rear Camera': '50MP Main + 10MP Telephoto + 12MP UltraWide',
      'Hinge': 'Flex Hinge (zero-gap folding)',
      'Multi-tasking': 'Taskbar support, split screen up to 3 apps'
    }
  },

  // --- Category: computers ---
  {
    name: 'Apple Mac Studio M2 Ultra',
    sku: 'PRD-CPU-MSTD2',
    description: 'Supercharged by the groundbreaking M2 Ultra chip, Mac Studio packs outrageous performance and extensive connectivity into a stunningly compact footprint.',
    category: 'computers',
    price: 3999.00,
    cost: 2200.00,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1655180639433-85fbf8026135?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'mac', 'studio', 'desktop', 'computer', 'm2 ultra', 'creative', 'professional'],
    specs: {
      'Brand': 'Apple',
      'Processor': 'Apple M2 Ultra (24-core CPU, 60-core GPU)',
      'Unified Memory': '64GB Fast LPDDR5',
      'Storage': '1TB NVMe Superfast SSD',
      'Ports': '6x Thunderbolt 4, 2x USB-A, 1x HDMI, 10Gb Ethernet',
      'Wireless': 'Wi-Fi 6E + Bluetooth 5.3',
      'Form Factor': 'Ultra-compact aluminum desktop block'
    }
  },
  {
    name: 'AeroPro Creator PC Desktop',
    sku: 'PRD-CPU-AEROC',
    description: 'High-end professional workstation featuring Intel Core i9-14900K, NVIDIA RTX 4090, 64GB DDR5 RAM, and liquid cooling. Built for real-time 3D rendering and VR.',
    category: 'computers',
    price: 3499.99,
    cost: 2000.00,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=600'],
    tags: ['workstation', 'creator', 'desktop', 'computer', 'rtx 4090', 'intel i9', 'liquid cooled'],
    specs: {
      'Brand': 'AeroPro',
      'CPU': 'Intel Core i9-14900K (24 Cores, up to 6.0 GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4090 (24GB GDDR6X)',
      'RAM': '64GB Corsair Vengeance DDR5 6000MHz',
      'Storage': '2TB Samsung 990 Pro PCIe 4.0 NVMe SSD',
      'Cooling': '360mm AIO Liquid Cooler',
      'Power Supply': '1200W PCIe 5.0 80+ Gold modular'
    }
  },
  {
    name: 'Apple Mac mini M3 Pro',
    sku: 'PRD-CPU-MMINI',
    description: 'Compact desktop computer with M3 Pro chip. Incredible speed, versatile ports, and unified memory that lets you work, play, and create with blazing fast power.',
    category: 'computers',
    price: 1299.00,
    cost: 750.00,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1600541519463-ebec87003ee4?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'mac', 'mini', 'desktop', 'computer', 'm3 pro', 'compact'],
    specs: {
      'Brand': 'Apple',
      'Processor': 'Apple M3 Pro (12-core CPU, 18-core GPU)',
      'Memory': '18GB Unified Memory',
      'Storage': '512GB SSD',
      'Ports': '3x Thunderbolt 4, 2x USB-A, HDMI, Gigabit Ethernet',
      'OS': 'macOS Sequoia ready',
      'Audio': 'Built-in speaker + 3.5 mm headphone jack with advanced support'
    }
  },
  {
    name: 'Dell OptiPlex 7010 Micro',
    sku: 'PRD-CPU-OP701',
    description: 'Ultra-compact enterprise desktop computer. Powered by Intel Core i7, offering high security, easy manageability, and versatile mounting options for clean desks.',
    category: 'computers',
    price: 849.99,
    cost: 480.00,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600'],
    tags: ['dell', 'optiplex', 'desktop', 'computer', 'micro', 'office', 'business'],
    specs: {
      'Brand': 'Dell',
      'CPU': 'Intel Core i7-13700T (16 Cores, up to 4.9 GHz)',
      'Graphics': 'Intel UHD Graphics 770',
      'RAM': '16GB DDR5 4800MHz (expandable to 64GB)',
      'Storage': '512GB M.2 PCIe NVMe SSD',
      'Form Factor': 'Micro PC (Less than 1.3 liters)',
      'OS': 'Windows 11 Pro'
    }
  },
  {
    name: 'HP Envy Move All-in-One',
    sku: 'PRD-CPU-HPMOV',
    description: 'A portable All-in-One PC with a built-in handle and battery. Set up workspace anywhere on a beautiful 23.8-inch QHD touchscreen display with rich sound.',
    category: 'computers',
    price: 999.99,
    cost: 550.00,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600'],
    tags: ['hp', 'envy', 'all in one', 'desktop', 'computer', 'touchscreen', 'portable'],
    specs: {
      'Brand': 'HP',
      'Processor': 'Intel Core i5-1335U (10 Cores, up to 4.6 GHz)',
      'Display': '23.8-inch QHD (2560 x 1440) Touchscreen IPS',
      'Battery': 'Built-in rechargeable battery (up to 4 hours)',
      'RAM': '16GB LPDDR5',
      'Storage': '512GB NVMe SSD',
      'Audio': 'Sound by B&O, integrated front-firing speakers'
    }
  },
  {
    name: 'CORSAIR ONE i500 Workstation',
    sku: 'PRD-CPU-CSONE',
    description: 'Liquid-cooled compact PC with genuine wood paneling. Features Intel Core i9, NVIDIA RTX 4080 Super, and Whisper-quiet operations for high-end professional performance.',
    category: 'computers',
    price: 3599.99,
    cost: 2100.00,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?auto=format&fit=crop&q=80&w=600'],
    tags: ['corsair', 'gaming', 'desktop', 'computer', 'rtx 4080', 'liquid cooled', 'compact'],
    specs: {
      'Brand': 'CORSAIR',
      'Processor': 'Intel Core i9-14900F',
      'Graphics': 'NVIDIA GeForce RTX 4080 Super (16GB)',
      'Cooling': 'Dual-loop Liquid Cooling for CPU and GPU',
      'RAM': '32GB DDR5 5600MHz',
      'Storage': '2TB NVMe PCIe 4.0 SSD',
      'Panels': 'FSC-Certified Genuine Wood Front Plate'
    }
  },

  // --- Category: accessories ---
  {
    name: 'Roco Wireless Headphone',
    sku: 'PRD-ACC-01',
    description: 'High-fidelity wireless audio with advanced active noise cancellation, custom spatial audio, and up to 40 hours of battery life with ultra-plush earcups.',
    category: 'accessories',
    price: 49.00,
    cost: 15.00,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'],
    tags: ['roco', 'wireless', 'headphones', 'noise cancellation', 'bluetooth', 'audio'],
    specs: {
      'Brand': 'Roco',
      'Drivers': '40mm Custom Dynamic Drivers',
      'Connectivity': 'Bluetooth 5.2 + 3.5mm Aux wired option',
      'Battery Life': 'Up to 40 Hours (ANC off) / 30 Hours (ANC on)',
      'Noise Cancellation': 'Hybrid Active Noise Cancelling (4 mics)',
      'Charging': 'USB-C Fast Charging (10 min = 5 hours)',
      'Weight': '250g'
    }
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    sku: 'PRD-ACC-XM5',
    description: 'Industry-leading noise canceling headphones with dual processors, 8 microphones, and exceptional hands-free calling quality in a sleek matte finish.',
    category: 'accessories',
    price: 398.00,
    cost: 200.00,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600'],
    tags: ['sony', 'wireless', 'headphones', 'noise cancellation', 'bluetooth', 'audio', 'premium'],
    specs: {
      'Brand': 'Sony',
      'Processor': 'Integrated Processor V1 + HD Noise Cancelling Processor QN1',
      'Microphones': '8 Mics for outstanding ANC and voice call clarity',
      'Battery Life': 'Up to 30 Hours with ANC on',
      'Bluetooth Codecs': 'LDAC, AAC, SBC (Hi-Res Audio Wireless support)',
      'Smart Features': 'Speak-to-Chat, Quick Attention mode',
      'Weight': '250g'
    }
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    sku: 'PRD-ACC-MXM3',
    description: 'An iconic ergonomic mouse remastered. Feel every moment of your workflow with tactile quiet clicks, MagSpeed electromagnetic scroll wheel, and 8K DPI tracking.',
    category: 'accessories',
    price: 99.99,
    cost: 45.00,
    stock: 220,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600'],
    tags: ['logitech', 'mx master', 'wireless', 'mouse', 'ergonomic', 'office', 'productivity'],
    specs: {
      'Brand': 'Logitech',
      'Sensor': 'Darkfield High Precision (tracks on glass!)',
      'DPI Range': '200 to 8000 DPI (set in 50 DPI increments)',
      'Buttons': '7 programmable buttons + gesture button',
      'Scroll Wheel': 'MagSpeed electromagnetic scrolling (1000 lines/sec)',
      'Battery': 'Rechargeable Li-Po (500 mAh) - up to 70 days',
      'Connectivity': 'Bluetooth Low Energy + Logi Bolt USB Receiver'
    }
  },
  {
    name: 'Logitech Streamcam 1080p',
    sku: 'PRD-ACC-02',
    description: 'Premium USB-C webcam designed for content creators, featuring smart auto-focus, exposure tracking, and vertical video mode for portrait-oriented social platforms.',
    category: 'accessories',
    price: 29.99,
    cost: 10.00,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=600'],
    tags: ['logitech', 'streamcam', 'webcam', 'camera', 'streaming', 'usb-c'],
    specs: {
      'Brand': 'Logitech',
      'Resolution': '1080p Full HD at 60 fps',
      'Lens': 'Premium Full HD Glass Lens (f/2.0, 3.7mm focal length)',
      'Field of View': '78 degrees diagonal',
      'Cable Length': '1.5m USB-C 3.1 cable',
      'Smart Exposure': 'Face-tracking auto-exposure and auto-focus',
      'Microphone': 'Dual omnidirectional mic with noise reduction'
    }
  },
  {
    name: 'Yantech Leather & Canvas Tech Bag',
    sku: 'PRD-ACC-03',
    description: 'Exquisitely crafted, water-resistant canvas messenger bag with padded tech compartments, organizing sleeves, and high-grain leather strap detailing.',
    category: 'accessories',
    price: 29.99,
    cost: 9.00,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=600'],
    tags: ['yantech', 'bag', 'leather', 'canvas', 'backpack', 'travel', 'carrying case'],
    specs: {
      'Brand': 'Yantech',
      'Material': 'Water-resistant waxed cotton canvas + full-grain leather straps',
      'Capacity': '15 Liters (fits up to 16-inch laptop)',
      'Dimensions': '16.5" x 11.5" x 4.5"',
      'Pockets': 'Padded laptop sleeve + tablet sleeve + 4 organizing pockets',
      'Buckles': 'Quick-release magnetic press snaps under leather straps'
    }
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    sku: 'PRD-ACC-APP2',
    description: 'Wireless earbuds with custom-engineered Active Noise Cancellation, Adaptive Audio, Spatial Audio, and up to 6 hours of listening time on a single charge.',
    category: 'accessories',
    price: 249.00,
    cost: 130.00,
    stock: 180,
    images: ['https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'airpods', 'wireless', 'earbuds', 'noise cancellation', 'bluetooth', 'audio'],
    specs: {
      'Brand': 'Apple',
      'Processor': 'Apple H2 Headphone chip (U1 chip in case)',
      'Audio Quality': 'Custom high-excursion Apple driver + spatial audio',
      'ANC': 'Up to 2x more Active Noise Cancellation than Gen 1',
      'Charging Case': 'MagSafe case with speaker and lanyard loop (USB-C)',
      'Battery': 'Up to 6 hours (ANC on) / 30 hours with case',
      'Waterproof': 'IP54 sweat and water resistant (earbuds and case)'
    }
  },

  // --- Category: laptops ---
  {
    name: 'Apple MacBook Air M3',
    sku: 'PRD-LAP-01',
    description: 'Superlight, strikingly thin, and equipped with the powerful M3 chip. Built for active lifestyles with up to 18 hours of battery life and beautiful Liquid Retina display.',
    category: 'laptops',
    price: 999.00,
    cost: 550.00,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'macbook', 'air', 'm3', 'laptop', 'thin', 'portable', 'silver'],
    specs: {
      'Brand': 'Apple',
      'Processor': 'Apple M3 (8-core CPU, 10-core GPU)',
      'Display': '13.6-inch Liquid Retina with True Tone (500 nits)',
      'RAM': '8GB Unified Memory (expandable to 24GB)',
      'Storage': '256GB SSD storage',
      'Battery Life': 'Up to 18 hours',
      'Keyboard': 'Backlit Magic Keyboard with Touch ID'
    }
  },
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    sku: 'PRD-LAP-MBP16',
    description: 'The ultimate developer and creator laptop. Featuring the monstrous M3 Max chip with 16-core CPU, 40-core GPU, beautiful Liquid Retina XDR display, and 128GB Unified Memory.',
    category: 'laptops',
    price: 3499.00,
    cost: 1950.00,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'macbook', 'pro', 'm3 max', 'laptop', 'developer', 'premium', 'workstation'],
    specs: {
      'Brand': 'Apple',
      'Processor': 'Apple M3 Max (16-core CPU, 40-core GPU)',
      'Display': '16.2-inch Liquid Retina XDR (120Hz ProMotion, 1600 nits HDR)',
      'RAM': '128GB Unified Memory',
      'Storage': '2TB Superfast SSD',
      'Speakers': 'Six-speaker sound system with force-cancelling woofers',
      'Ports': '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3, headphone jack'
    }
  },
  {
    name: 'Dell XPS 13 InfinityEdge',
    sku: 'PRD-LAP-02',
    description: 'Beautifully designed premium laptop. Crafted with machined aluminum and woven carbon fiber, featuring a borderless InfinityEdge FHD+ display and 13th Gen Intel Core i7.',
    category: 'laptops',
    price: 899.99,
    cost: 500.00,
    stock: 75,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600'],
    tags: ['dell', 'xps', 'laptop', 'thin', 'intel i7', 'windows', 'infinityedge'],
    specs: {
      'Brand': 'Dell',
      'Processor': 'Intel Core i7-1355U (10 Cores, up to 5.0 GHz)',
      'Display': '13.4-inch FHD+ (1920x1200) InfinityEdge anti-glare',
      'RAM': '16GB LPDDR5 Dual-Channel',
      'Storage': '512GB PCIe NVMe SSD',
      'Material': 'CNC Machined Aluminum chassis',
      'OS': 'Windows 11 Home'
    }
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    sku: 'PRD-LAP-ROG14',
    description: 'A compact but incredibly powerful gaming laptop. Packs AMD Ryzen 9, NVIDIA RTX 4070, and a stunning 120Hz ROG Nebula OLED display into a light 14-inch chassis.',
    category: 'laptops',
    price: 1599.99,
    cost: 920.00,
    stock: 55,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600'],
    tags: ['asus', 'rog', 'zephyrus', 'laptop', 'gaming', 'rtx 4070', 'ryzen 9', 'oled'],
    specs: {
      'Brand': 'ASUS',
      'Processor': 'AMD Ryzen 9 8945HS (8 Cores, up to 5.2 GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4070 (8GB GDDR6, MUX Switch)',
      'Display': '14-inch 3K (2880 x 1800) ROG Nebula OLED (120Hz, 0.2ms)',
      'RAM': '32GB LPDDR5X 6400MHz',
      'Storage': '1TB M.2 PCIe 4.0 NVMe SSD',
      'Weight': '1.5 kg (3.30 lbs)'
    }
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    sku: 'PRD-LAP-TPX1C',
    description: 'The pinnacle of business laptops. Built with carbon fiber and magnesium alloy, offering legendary durability, premium keyboard, and top-tier security features.',
    category: 'laptops',
    price: 1699.00,
    cost: 950.00,
    stock: 65,
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600'],
    tags: ['lenovo', 'thinkpad', 'laptop', 'business', 'carbon fiber', 'office', 'secure'],
    specs: {
      'Brand': 'Lenovo',
      'Processor': 'Intel Core Ultra 7 155U (Intel Evo Edition)',
      'Display': '14-inch WUXGA (1920 x 1200) IPS Low Blue Light',
      'Keyboard': 'Spill-resistant backlit, Red TrackPoint dome',
      'RAM': '32GB LPDDR5X (soldered)',
      'Storage': '1TB NVMe PCIe 4.0 SSD',
      'Security': 'Match-on-Chip Fingerprint reader + IR Camera with shutter'
    }
  },
  {
    name: 'HP Spectre x360 2-in-1',
    sku: 'PRD-LAP-SPEC',
    description: 'Convertible touchscreen laptop with flexible 360-degree hinge, beautiful OLED display, bundled active stylus, and premium Bang & Olufsen quad speaker audio system.',
    category: 'laptops',
    price: 1399.99,
    cost: 780.00,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600'],
    tags: ['hp', 'spectre', 'laptop', '2-in-1', 'convertible', 'touchscreen', 'stylus'],
    specs: {
      'Brand': 'HP',
      'Processor': 'Intel Core Ultra 7 155H (16 Cores, up to 4.8 GHz)',
      'Display': '14-inch 2.8K (2880 x 1800) OLED Touchscreen (120Hz, variable)',
      'Hinge': '360-degree folding hinge (Laptop, Tent, Tablet modes)',
      'Stylus': 'HP Rechargeable MPP 2.0 Tilt Pen included',
      'RAM': '16GB LPDDR5X',
      'Storage': '1TB PCIe Gen 4 SSD'
    }
  },

  // --- Category: monitors ---
  {
    name: 'LG UltraWide 34" Curved Monitor',
    sku: 'PRD-MON-01',
    description: 'Curved 21:9 UltraWide QHD display for an immersive panoramic view. Perfect for heavy multi-tasking, audio editing, spreadsheets, and seamless gameplay.',
    category: 'monitors',
    price: 349.99,
    cost: 180.00,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600'],
    tags: ['lg', 'monitor', 'ultrawide', 'curved', 'qhd', 'screen', 'productivity'],
    specs: {
      'Brand': 'LG',
      'Screen Size': '34-inch Diagonal',
      'Panel Type': 'IPS Panel curved (3800R radius)',
      'Resolution': 'QHD UltraWide (3440 x 1440)',
      'Aspect Ratio': '21:9',
      'Refresh Rate': '75 Hz',
      'Inputs': '2x HDMI, 1x DisplayPort, Headphone Out'
    }
  },
  {
    name: 'ASUS ProArt Display 27" 4K',
    sku: 'PRD-MON-02',
    description: 'Color-accurate professional monitor designed for photo/video editing. Features 100% sRGB/Rec. 709 color gamut, Calman Verified factory calibration, and USB-C connectivity.',
    category: 'monitors',
    price: 299.99,
    cost: 160.00,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600'],
    tags: ['asus', 'proart', 'monitor', '4k', 'color-accurate', 'creator', 'usb-c', 'screen'],
    specs: {
      'Brand': 'ASUS',
      'Screen Size': '27-inch',
      'Resolution': '4K UHD (3840 x 2160)',
      'Panel Type': 'IPS with wide viewing angle',
      'Color Accuracy': 'Delta E < 2 (Calman Verified factory calibrated)',
      'USB-C Power': '65W Power Delivery over single cable',
      'Ergonomics': 'Fully adjustable height, tilt, swivel, pivot'
    }
  },
  {
    name: 'Samsung Odyssey OLED G9 49"',
    sku: 'PRD-MON-ODYG9',
    description: 'Monstrous 49-inch dual QHD curved OLED gaming monitor. Blazing fast 240Hz refresh rate, 0.03ms response time, and stunning Neo Quantum Processor for infinite contrast.',
    category: 'monitors',
    price: 1299.99,
    cost: 750.00,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600'],
    tags: ['samsung', 'odyssey', 'monitor', 'gaming', 'oled', 'curved', 'ultrawide', '240hz'],
    specs: {
      'Brand': 'Samsung',
      'Screen Size': '49-inch Super UltraWide (equal to two 27" screens)',
      'Resolution': 'Dual QHD (5120 x 1440)',
      'Panel': 'QD-OLED curved (1800R)',
      'Refresh Rate': '240 Hz',
      'Response Time': '0.03ms (GtG)',
      'Contrast Ratio': '1,000,000:1 (Vesa DisplayHDR True Black 400)'
    }
  },
  {
    name: 'Dell UltraSharp 27" USB-C Hub Monitor',
    sku: 'PRD-MON-US27',
    description: 'Experience superb screen clarity and outstanding connectivity with this 2K hub monitor. Charges your laptop up to 90W and acts as an RJ45 Ethernet receiver.',
    category: 'monitors',
    price: 429.99,
    cost: 220.00,
    stock: 70,
    images: ['https://images.unsplash.com/photo-1586210579191-e3b2c6752406?auto=format&fit=crop&q=80&w=600'],
    tags: ['dell', 'ultrasharp', 'monitor', '2k', 'usb-c hub', 'ethernet', 'office', 'screen'],
    specs: {
      'Brand': 'Dell',
      'Resolution': 'QHD (2560 x 1440)',
      'Screen Size': '27-inch',
      'Hub Ports': 'USB-C (90W PD), RJ45 Ethernet, DisplayPort Out (MST Daisy Chain)',
      'Panel Type': 'IPS Black (2000:1 contrast ratio)',
      'Color Gamut': '100% sRGB, 98% DCI-P3',
      'Flicker-Free': 'ComfortView Plus hardware low blue light'
    }
  },
  {
    name: 'Apple Studio Display',
    sku: 'PRD-MON-APSD',
    description: 'Immersive 27-inch 5K Retina display with a 12MP Ultra Wide camera with Center Stage, studio-quality mics, and a six-speaker sound system with Spatial Audio.',
    category: 'monitors',
    price: 1599.00,
    cost: 900.00,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&q=80&w=600'],
    tags: ['apple', 'studio display', 'monitor', '5k', 'camera', 'speaker', 'premium', 'screen'],
    specs: {
      'Brand': 'Apple',
      'Resolution': '5K Retina (5120 x 2880, 218 PPI)',
      'Brightness': '600 nits',
      'Camera': '12MP Ultra Wide with Center Stage tracking',
      'Audio': 'Six-speaker system with Spatial Audio + 3-mic array',
      'Ports': '1x Thunderbolt 3 (96W host charge), 3x USB-C',
      'Processor': 'Built-in Apple A13 Bionic chip'
    }
  },
  {
    name: 'Gigabyte M27Q 27" KVM Monitor',
    sku: 'PRD-MON-GIG',
    description: 'Award-winning gaming monitor featuring QHD resolution, 170Hz refresh rate, 0.5ms response time, and built-in KVM switch to control two computers with one mouse/keyboard.',
    category: 'monitors',
    price: 269.99,
    cost: 140.00,
    stock: 90,
    images: ['https://images.unsplash.com/photo-1551645121-d1034da75057?auto=format&fit=crop&q=80&w=600'],
    tags: ['gigabyte', 'monitor', 'gaming', 'qhd', '170hz', 'kvm', 'screen'],
    specs: {
      'Brand': 'Gigabyte',
      'Screen Size': '27-inch',
      'Resolution': 'QHD (2560 x 1440) SS IPS',
      'Refresh Rate': '170 Hz',
      'Response Time': '0.5ms (MPRT)',
      'KVM': 'Integrated KVM switch (one button keyboard-mouse swap)',
      'Color Gamut': '92% DCI-P3 / 140% sRGB'
    }
  },

  // --- Category: networking ---
  {
    name: 'Eero Max 7 Mesh Router',
    sku: 'PRD-NET-01',
    description: 'Amazon eero Max 7 is a blazing fast tri-band Wi-Fi 7 mesh system for smart homes, offering up to 2,500 sq ft coverage, support for 10GbE speeds, and intelligent channel selection.',
    category: 'networking',
    price: 199.99,
    cost: 85.00,
    stock: 110,
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600'],
    tags: ['eero', 'mesh', 'router', 'wifi 7', 'wireless', 'internet', 'smart home'],
    specs: {
      'Brand': 'eero',
      'WiFi Standard': 'Wi-Fi 7 (802.11be) Tri-Band',
      'Wired Ports': '2x 10 GbE Ports, 2x 2.5 GbE Ports',
      'Coverage': 'Up to 2,500 square feet per node',
      'Device Support': 'Up to 200+ connected devices',
      'Speed Cap': 'Supports wireless speeds up to 4.3 Gbps',
      'Smart Home': 'Thread Border Router, Zigbee smart hub built-in'
    }
  },
  {
    name: 'ASUS ROG Rapture GT6 Mesh',
    sku: 'PRD-NET-ROG6',
    description: 'High-performance tri-band Wi-Fi 6 gaming mesh system covering up to 5,800 sq ft. Features gaming port, dynamic Aura RGB lighting, and custom network protection.',
    category: 'networking',
    price: 299.99,
    cost: 140.00,
    stock: 65,
    images: ['https://images.unsplash.com/photo-1631553127989-5369c0d16f86?auto=format&fit=crop&q=80&w=600'],
    tags: ['asus', 'rog', 'rapture', 'mesh', 'router', 'wifi 6', 'gaming', 'wireless'],
    specs: {
      'Brand': 'ASUS ROG',
      'WiFi Standard': 'Wi-Fi 6 (802.11ax) AX10000 Tri-band',
      'Coverage': 'Up to 5,800 sq ft (2-pack)',
      'Gaming Port': 'Dedicated 2.5G gaming LAN port',
      'Antennas': '9 Internal high-gain antennas',
      'RGB Control': 'ASUS Aura RGB custom lighting',
      'Security': 'AiProtection Pro lifetime commercial security'
    }
  },
  {
    name: 'Netgear Nighthawk M6 Pro',
    sku: 'PRD-NET-NGM6',
    description: 'Premium unlocked 5G mobile hotspot router. Supports Wi-Fi 6E, up to 8Gbps speeds, secure private connection on up to 32 devices, perfect for travelers and remote jobs.',
    category: 'networking',
    price: 449.99,
    cost: 220.00,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600'],
    tags: ['netgear', 'nighthawk', 'hotspot', '5g', 'travel', 'router', 'wireless', 'mobile'],
    specs: {
      'Brand': 'Netgear',
      'Cellular': '5G Sub-6 & mmWave Unlocked (Nano SIM slot)',
      'WiFi': 'Wi-Fi 6E (802.11ax) up to 3.6 Gbps',
      'Device Limit': 'Up to 32 devices connected concurrently',
      'Wired Ports': '1x 2.5 Gb Ethernet Port, 1x USB-C (Tethering/Charge)',
      'Display': '2.8-inch intuitive LCD touch screen',
      'Battery': '5040 mAh removable Li-ion (up to 13 hours)'
    }
  },
  {
    name: 'TP-Link Archer BE800 Router',
    sku: 'PRD-NET-TPLBE',
    description: 'BE19000 Tri-Band Wi-Fi 7 Router with multi-gig speed, customizable LED screen showing weather/emojis, 10G WAN/LAN ports, and advanced HomeShield security suite.',
    category: 'networking',
    price: 399.99,
    cost: 180.00,
    stock: 55,
    images: ['https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=600'],
    tags: ['tp-link', 'archer', 'router', 'wifi 7', 'tri-band', 'multi-gig', 'wireless'],
    specs: {
      'Brand': 'TP-Link',
      'WiFi Speed': 'Wi-Fi 7 BE19000 (19 Gbps combined)',
      'LED Screen': 'Customizable LED grid (displays emoji, time, weather)',
      'Multi-Gig Ports': '1x 10G SFP+ Fiber/Ethernet combo, 1x 10G WAN/LAN, 4x 2.5G LAN',
      'Antennas': '8 Optimally positioned internal antennas',
      'Protocol support': 'Multi-Link Operation (MLO), 320 MHz channels',
      'Mesh Support': 'EasyMesh compatible'
    }
  },
  {
    name: 'Ubiquiti UniFi Dream Router',
    sku: 'PRD-NET-UBUDQ',
    description: 'Next-generation UniFi console and Wi-Fi 6 router. Features integrated PoE ports, microSD slot for network security camera storage, and intuitive touchscreen control.',
    category: 'networking',
    price: 199.00,
    cost: 95.00,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600'],
    tags: ['ubiquiti', 'unifi', 'router', 'wifi 6', 'poe', 'security', 'enterprise'],
    specs: {
      'Brand': 'Ubiquiti',
      'WiFi Standard': 'Wi-Fi 6 (4x4 MIMO)',
      'Console Functions': 'Runs UniFi Network and UniFi Protect controller systems',
      'PoE Ports': '2x PoE (Power over Ethernet) LAN ports',
      'Storage': '128GB internal SSD + MicroSD slot for expansion',
      'LCM Display': '0.96-inch status tracking screen',
      'Management': 'UniFi mobile app / UniFi Cloud portal'
    }
  },
  {
    name: 'Netgear MS305 5-Port Switch',
    sku: 'PRD-NET-NGSW5',
    description: '5-Port Gigabit Ethernet Unmanaged Network Switch. Simple plug-and-play setup, quiet fanless design, sturdy metal housing, and energy-efficient operations.',
    category: 'networking',
    price: 19.99,
    cost: 7.00,
    stock: 250,
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600'],
    tags: ['netgear', 'switch', 'gigabit', 'ethernet', 'wired', 'hub'],
    specs: {
      'Brand': 'Netgear',
      'Interface': '5x 10/100/1000 Mbps RJ45 Ports',
      'Management': 'Unmanaged Plug-and-play (no setup)',
      'Design': 'Fanless quiet operations, wall-mountable option',
      'Material': 'Durable metal casing',
      'Standards': 'IEEE 802.3az Energy Efficient Ethernet support'
    }
  },

  // --- Category: pc gaming ---
  {
    name: 'Level 20 RGB Cherry Keyboard',
    sku: 'PRD-GAME-01',
    description: 'Premium mechanical gaming keyboard featuring durable Cherry MX Speed Silver switches, customizable per-key RGB backlighting, and a solid aluminum top plate.',
    category: 'pc gaming',
    price: 29.99,
    cost: 12.00,
    stock: 180,
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600'],
    tags: ['keyboard', 'mechanical', 'cherry mx', 'rgb', 'gaming', 'wired'],
    specs: {
      'Brand': 'Thermaltake',
      'Switch Type': 'Cherry MX Speed Silver (linear, superfast 1.2mm travel)',
      'RGB Sync': '16.8 Million Colors per-key backlighting (Alexa compatible)',
      'Construction': '2mm thick curved Aerospace-grade Aluminum top plate',
      'Media Control': 'Dedicated volume roller and playback controls',
      'Pass-through': 'Built-in USB and Audio pass-through ports',
      'Anti-ghosting': '100% Anti-ghosting with Full N-Key Rollover'
    }
  },
  {
    name: 'Logitech G Pro X Superlight',
    sku: 'PRD-GAME-02',
    description: 'Ultralight wireless gaming mouse weighing under 63g. Engineered with HERO 25K sensor and carbon-neutral design for professional-grade esports accuracy.',
    category: 'pc gaming',
    price: 129.99,
    cost: 60.00,
    stock: 140,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600'],
    tags: ['logitech', 'g pro', 'wireless', 'mouse', 'gaming', 'esports', 'lightweight'],
    specs: {
      'Brand': 'Logitech G',
      'Weight': 'Under 63 grams (ultralight gaming champion)',
      'Sensor': 'HERO 25K (100 to 25600 DPI tracking)',
      'Battery Life': 'Up to 70 Hours of constant movement',
      'Wireless Tech': 'LIGHTSPEED 1ms wireless response',
      'Feet': 'Zero-additive PTFE glide feet',
      'Charging': 'Powerplay wireless charging compatible'
    }
  },
  {
    name: 'Razer BlackShark V2 Pro',
    sku: 'PRD-GAME-03',
    description: 'Wireless esports gaming headset featuring Triforce Titanium 50mm drivers, HyperClear Super Wideband Mic, and advanced passive noise isolation foam cushioning.',
    category: 'pc gaming',
    price: 99.99,
    cost: 45.00,
    stock: 160,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600'],
    tags: ['razer', 'blackshark', 'wireless', 'headset', 'headphones', 'gaming', 'audio'],
    specs: {
      'Brand': 'Razer',
      'Audio Drivers': 'Razer TriForce Titanium 50mm Drivers',
      'Microphone': 'HyperClear Super Wideband Removable Mic (9.9kHz)',
      'Wireless Tech': 'Razer HyperSpeed Wireless (2.4GHz) + Bluetooth 5.2',
      'Cushions': 'Ultra-soft FlowKnit memory foam ear cushions',
      'Battery Life': 'Up to 70 hours (USB-C charging)',
      'Spatial Sound': 'THX Spatial Audio custom pro-tuned profiles'
    }
  },
  {
    name: 'ASUS ROG Ally Handheld Console',
    sku: 'PRD-GAME-ALLY',
    description: 'A powerful Windows 11 handheld gaming console powered by AMD Ryzen Z1 Extreme processor and a gorgeous 120Hz 1080p VRR touch screen for triple-A games.',
    category: 'pc gaming',
    price: 699.99,
    cost: 400.00,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&q=80&w=600'],
    tags: ['asus', 'rog ally', 'handheld', 'console', 'gaming', 'portable', 'windows'],
    specs: {
      'Brand': 'ASUS ROG',
      'Processor': 'AMD Ryzen Z1 Extreme (8 Cores, 16 Threads, RDNA 3 graphics)',
      'Display': '7-inch 1080p Touchscreen IPS (120Hz, FreeSync Premium, 500 nits)',
      'RAM': '16GB LPDDR5 Dual-channel',
      'Storage': '512GB PCIe 4.0 NVMe M.2 SSD',
      'Operating System': 'Windows 11 Home with ROG Armoury Crate SE',
      'Weight': '608 grams'
    }
  },
  {
    name: 'Razer BlackWidow V4 Pro',
    sku: 'PRD-GAME-BW4',
    description: 'Full-blown mechanical keyboard featuring Razer Green Clicky tactile switches, dedicated macro keys, multi-function dial, and double-sided underglow RGB.',
    category: 'pc gaming',
    price: 229.99,
    cost: 100.00,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600'],
    tags: ['razer', 'keyboard', 'mechanical', 'rgb', 'gaming', 'macro', 'wired'],
    specs: {
      'Brand': 'Razer',
      'Switches': 'Razer Green Mechanical Switches (Clicky & Tactile)',
      'Macro Keys': '5 Dedicated macro keys + 3 side macro buttons',
      'Dial': 'Razer Command Dial (fully customizable functions)',
      'Lighting': 'Per-key Chroma RGB + 3-sided double underglow',
      'Wrist Rest': 'Plush leatherette magnetic wrist rest with underglow',
      'Polling Rate': 'Up to 8000 Hz polling rate'
    }
  },
  {
    name: 'SteelSeries Arctis Nova Pro Wireless',
    sku: 'PRD-GAME-ANPW',
    description: 'Almighty wireless audio system featuring Nova Pro Acoustic System, Premium Active Noise Cancellation, and Infinity Power System dual battery hot-swapping.',
    category: 'pc gaming',
    price: 349.99,
    cost: 170.00,
    stock: 70,
    images: ['https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600'],
    tags: ['steelseries', 'arctis', 'wireless', 'headset', 'headphones', 'gaming', 'audio', 'premium'],
    specs: {
      'Brand': 'SteelSeries',
      'Audio Drivers': 'Nova Pro Premium Acoustic System (High-Fidelity)',
      'ANC': '4-mic Hybrid Active Noise Cancellation with transparency',
      'Battery System': 'Infinity Power (Dual batteries with base station hot-swap)',
      'Base Station': 'Wireless transmitter + multi-system connection (PC/Console swap)',
      'Mic': 'ClearCast Gen 2 bidirectional retractable AI noise cancelling mic',
      'Bluetooth Support': 'Simultaneous 2.4GHz wireless + Bluetooth audio'
    }
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Plan.deleteMany();
    await Product.deleteMany();

    // Use create() to trigger pre-save hooks (like password hashing and slug generation)
    for (const user of users) {
      await User.create(user);
    }
    for (const plan of plans) {
      await Plan.create(plan);
    }
    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Plan.deleteMany();
    await Product.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
