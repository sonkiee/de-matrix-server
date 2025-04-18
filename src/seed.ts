import mongoose from "mongoose";
import dotenv from "dotenv";

// Import models
import { Product } from "./models/product.model";
import { Brand } from "./models/brand.model";
import Category from "./models/category.model";

// Load environment variables
dotenv.config();
const URI =
  "mongodb+srv://annagukennedy:Ow9LGah4GBy0ilTq@cluster0.j0ylkup.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Seed function
const seedData = async () => {
  try {
    // Clear existing collections (optional, for development)
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    // Seed Categories
    const categories = await Category.insertMany([
      { name: "smartphones", description: "Smartphones" },
      { name: "accessories", description: "Accessories for phones" },
      { name: "parts", description: "Parts for phones and devices" },
      { name: "tablets", description: "Tablets" },
    ]);
    console.log("Categories seeded:", categories);

    // Seed Brands
    const samsung = await Brand.create({
      name: "Samsung",
      description: "Samsung Electronics",
      isVisible: true,
    });
    const apple = await Brand.create({
      name: "Apple",
      description: "Apple Inc.",
      isVisible: true,
    });
    const xiaomi = await Brand.create({
      name: "Xiaomi",
      description: "Xiaomi Corporation",
      isVisible: true,
    });
    console.log("Brands seeded:", [samsung, apple, xiaomi]);

    // Seed Products
    const smartphones = await Product.insertMany([
      {
        name: "Samsung Galaxy S22",
        sku: "SAMS22-128-BLK",
        description: "Samsung Galaxy S22 128GB Black.",
        price: 900,
        stock: 10,
        images: ["/images/s22.jpg"],
        category: categories[0]._id,
        brand: samsung._id,
        isActive: true,
        type: "smartphones",
        colors: ["Black", "Silver"],
        sizes: ["128GB"],
        tags: ["5G", "Flagship", "Android"],
      },
      {
        name: "Apple iPhone 13",
        sku: "IP13-128-SIL",
        description: "Apple iPhone 13 128GB Silver.",
        price: 950,
        stock: 15,
        images: ["/images/iphone13.jpg"],
        category: categories[0]._id,
        brand: apple._id,
        isActive: true,
        type: "smartphones",
        colors: ["Silver", "Blue"],
        sizes: ["128GB"],
        tags: ["iOS", "5G", "Flagship"],
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Google Pixel 7",
        sku: "PIXEL7-128-BLK",
        description: "Google Pixel 7 128GB Black.",
        price: 799,
        stock: 8,
        images: ["/images/pixel7.jpg"],
        category: categories[0]._id,
        brand: samsung._id,
        isActive: true,
        type: "smartphones",
        colors: ["Black", "White"],
        sizes: ["128GB"],
        tags: ["Android", "5G"],
      },
      {
        name: "OnePlus 10 Pro",
        sku: "ONEP10-256-GRN",
        description: "OnePlus 10 Pro 256GB Green.",
        price: 850,
        stock: 12,
        images: ["/images/oneplus10.jpg"],
        category: categories[0]._id,
        brand: samsung._id,
        isActive: true,
        type: "smartphones",
        colors: ["Green"],
        sizes: ["256GB"],
        tags: ["Flagship", "Android"],
      },
      {
        name: "Samsung Galaxy A53",
        sku: "SAM-A53-128-BLU",
        description: "Samsung Galaxy A53 128GB Blue.",
        price: 450,
        stock: 20,
        images: ["/images/a53.jpg"],
        category: categories[0]._id,
        brand: samsung._id,
        isActive: true,
        type: "smartphones",
        colors: ["Blue"],
        sizes: ["128GB"],
        tags: ["Midrange", "Android"],
      },
      {
        name: "iPhone 12 Mini",
        sku: "IP12MINI-64-RED",
        description: "Apple iPhone 12 Mini 64GB Red.",
        price: 650,
        stock: 5,
        images: ["/images/iphone12mini.jpg"],
        category: categories[0]._id,
        brand: apple._id,
        isActive: true,
        type: "smartphones",
        colors: ["Red"],
        sizes: ["64GB"],
        tags: ["Compact", "iOS"],
      },
      {
        name: "Xiaomi Redmi Note 11",
        sku: "XIAOMI-NOTE11-128-GRY",
        description: "Xiaomi Redmi Note 11 128GB Gray.",
        price: 250,
        stock: 25,
        images: ["/images/redmi11.jpg"],
        category: categories[0]._id,
        brand: xiaomi._id,
        isActive: true,
        type: "smartphones",
        colors: ["Gray"],
        sizes: ["128GB"],
        tags: ["Budget", "Android"],
      },
      {
        name: "Realme GT Neo 3",
        sku: "REALME-GT-256-BLK",
        description: "Realme GT Neo 3 256GB Black.",
        price: 480,
        stock: 10,
        images: ["/images/gtneo3.jpg"],
        category: categories[0]._id,
        brand: samsung._id,
        isActive: true,
        type: "smartphones",
        colors: ["Black"],
        sizes: ["256GB"],
        tags: ["Gaming", "Android"],
      },
      {
        name: "Motorola Edge 30",
        sku: "MOTO-EDGE30-128-WHT",
        description: "Motorola Edge 30 128GB White.",
        price: 500,
        stock: 8,
        images: ["/images/edge30.jpg"],
        category: categories[0]._id,
        brand: samsung._id,
        isActive: true,
        type: "smartphones",
        colors: ["White"],
        sizes: ["128GB"],
        tags: ["Android", "5G"],
      },
      {
        name: "Nokia X20",
        sku: "NOKIA-X20-128-BLU",
        description: "Nokia X20 128GB Blue.",
        price: 320,
        stock: 14,
        images: ["/images/x20.jpg"],
        category: categories[0]._id,
        brand: samsung._id,
        isActive: true,
        type: "smartphones",
        colors: ["Blue"],
        sizes: ["128GB"],
        tags: ["Stock Android", "Budget"],
      },
    ]);

    console.log("Smartphones seeded:", smartphones);

    // Seed Accessories
    const accessories = await Product.insertMany([
      {
        name: "Wireless Charging Pad",
        sku: "CHARGER-WIRELESS",
        description: "Wireless charging pad for smartphones.",
        price: 30,
        stock: 50,
        images: ["/images/wireless-charger.jpg"],
        category: categories[1]._id,
        brand: samsung._id,
        isActive: true,
        type: "accessories",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Wireless", "Charging", "Accessory"],
      },
      {
        name: "Screen Protector for iPhone",
        sku: "PROTECTOR-IP13",
        description: "Screen protector for Apple iPhone 13.",
        price: 15,
        stock: 100,
        images: ["/images/screen-protector.jpg"],
        category: categories[1]._id,
        brand: apple._id,
        isActive: true,
        type: "accessories",
        colors: ["Transparent"],
        sizes: ["Standard"],
        tags: ["Protection", "iPhone", "Accessory"],
      },
      {
        name: "USB-C to USB Adapter",
        sku: "USBC-ADAPTER",
        description: "USB-C to USB-A adapter for data transfer.",
        price: 10,
        stock: 60,
        images: ["/images/usb-c-adapter.jpg"],
        category: categories[1]._id,
        brand: samsung._id,
        isActive: true,
        type: "accessories",
        colors: ["Silver"],
        sizes: ["Standard"],
        tags: ["USB-C", "Adapter", "Accessory"],
      },
      {
        name: "iPhone Lightning Cable",
        sku: "LIGHTNING-CABLE",
        description: "Original Apple Lightning to USB cable.",
        price: 20,
        stock: 80,
        images: ["/images/lightning-cable.jpg"],
        category: categories[1]._id,
        brand: apple._id,
        isActive: true,
        type: "accessories",
        colors: ["White"],
        sizes: ["1m"],
        tags: ["Cable", "Charging", "iPhone"],
      },
      {
        name: "Bluetooth Earbuds",
        sku: "BT-EARBUDS",
        description: "True wireless Bluetooth earbuds with case.",
        price: 55,
        stock: 35,
        images: ["/images/bluetooth-earbuds.jpg"],
        category: categories[1]._id,
        brand: samsung._id,
        isActive: true,
        type: "accessories",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Bluetooth", "Earphones", "Wireless"],
      },
      {
        name: "PopSocket Phone Grip",
        sku: "POPSOCKET-GRIP",
        description: "PopSocket grip and stand for phones and tablets.",
        price: 12,
        stock: 70,
        images: ["/images/popsocket.jpg"],
        category: categories[1]._id,
        brand: samsung._id,
        isActive: true,
        type: "accessories",
        colors: ["Multicolor"],
        sizes: ["Standard"],
        tags: ["Grip", "Stand", "Accessory"],
      },
      {
        name: "Tablet Stand",
        sku: "TABLET-STAND",
        description: "Adjustable tablet stand for desk use.",
        price: 25,
        stock: 40,
        images: ["/images/tablet-stand.jpg"],
        category: categories[1]._id,
        brand: samsung._id,
        isActive: true,
        type: "accessories",
        colors: ["Silver"],
        sizes: ["Standard"],
        tags: ["Tablet", "Stand", "Accessory"],
      },
      {
        name: "Wireless Keyboard",
        sku: "WIRELESS-KEYBOARD",
        description: "Slim wireless keyboard with Bluetooth support.",
        price: 40,
        stock: 25,
        images: ["/images/wireless-keyboard.jpg"],
        category: categories[1]._id,
        brand: apple._id,
        isActive: true,
        type: "accessories",
        colors: ["White"],
        sizes: ["Standard"],
        tags: ["Keyboard", "Wireless", "Bluetooth"],
      },
      {
        name: "Phone Ring Light",
        sku: "PHONE-RING-LIGHT",
        description: "LED ring light clip for phones.",
        price: 18,
        stock: 65,
        images: ["/images/ring-light.jpg"],
        category: categories[1]._id,
        brand: samsung._id,
        isActive: true,
        type: "accessories",
        colors: ["White"],
        sizes: ["Standard"],
        tags: ["Light", "Photography", "Accessory"],
      },
      {
        name: "Smartwatch Charging Dock",
        sku: "SMARTWATCH-DOCK",
        description: "Magnetic charging dock for smartwatches.",
        price: 22,
        stock: 30,
        images: ["/images/watch-dock.jpg"],
        category: categories[1]._id,
        brand: samsung._id,
        isActive: true,
        type: "accessories",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Smartwatch", "Charging", "Dock"],
      },
    ]);
    console.log("Accessories seeded:", accessories);

    // Seed Parts
    const parts = await Product.insertMany([
      {
        name: "Samsung Galaxy S22 Screen",
        sku: "SAMS22-SCREEN",
        description: "Replacement screen for Samsung Galaxy S22.",
        price: 150,
        stock: 30,
        images: ["/images/s22-screen.jpg"],
        category: categories[2]._id,
        brand: samsung._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Screen", "Replacement", "Samsung"],
      },
      {
        name: "iPhone 13 Charging Port",
        sku: "IP13-CHARGER-PORT",
        description: "Replacement charging port for iPhone 13.",
        price: 50,
        stock: 40,
        images: ["/images/iphone13-charging-port.jpg"],
        category: categories[2]._id,
        brand: apple._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Charging", "Replacement", "iPhone"],
      },
      {
        name: "Galaxy S22 Battery",
        sku: "SAMS22-BATTERY",
        description: "Original replacement battery for Galaxy S22.",
        price: 80,
        stock: 25,
        images: ["/images/s22-battery.jpg"],
        category: categories[2]._id,
        brand: samsung._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Battery", "Replacement", "Samsung"],
      },
      {
        name: "iPhone 13 Screen",
        sku: "IP13-SCREEN",
        description: "OEM replacement screen for iPhone 13.",
        price: 160,
        stock: 20,
        images: ["/images/iphone13-screen.jpg"],
        category: categories[2]._id,
        brand: apple._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Screen", "Replacement", "iPhone"],
      },
      {
        name: "Galaxy Tab S8 Charging Port",
        sku: "TABS8-CHARGER-PORT",
        description: "Charging port replacement for Galaxy Tab S8.",
        price: 60,
        stock: 35,
        images: ["/images/tab-s8-charger-port.jpg"],
        category: categories[2]._id,
        brand: samsung._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Tablet", "Charging", "Part"],
      },
      {
        name: "iPad Air 5 Battery",
        sku: "IPAD5-BATTERY",
        description: "High capacity replacement battery for iPad Air 5.",
        price: 100,
        stock: 15,
        images: ["/images/ipad-air5-battery.jpg"],
        category: categories[2]._id,
        brand: apple._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["iPad", "Battery", "Replacement"],
      },
      {
        name: "Samsung Camera Lens Cover",
        sku: "SAMS-CAM-LENS",
        description: "Replacement camera lens cover for Samsung phones.",
        price: 25,
        stock: 50,
        images: ["/images/samsung-camera-lens.jpg"],
        category: categories[2]._id,
        brand: samsung._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Camera", "Lens", "Part"],
      },
      {
        name: "iPhone Volume Button Flex Cable",
        sku: "IP13-VOL-FLEX",
        description: "Volume button flex cable for iPhone 13.",
        price: 18,
        stock: 45,
        images: ["/images/iphone13-volume-flex.jpg"],
        category: categories[2]._id,
        brand: apple._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Flex", "Volume", "iPhone"],
      },
      {
        name: "Samsung SIM Tray",
        sku: "SAMS-SIM-TRAY",
        description: "SIM card tray for Samsung Galaxy models.",
        price: 12,
        stock: 70,
        images: ["/images/sim-tray.jpg"],
        category: categories[2]._id,
        brand: samsung._id,
        isActive: true,
        type: "parts",
        colors: ["Black", "Silver"],
        sizes: ["Standard"],
        tags: ["SIM", "Tray", "Samsung"],
      },
      {
        name: "iPhone Front Camera Module",
        sku: "IP13-FRONT-CAM",
        description: "Front camera module replacement for iPhone 13.",
        price: 90,
        stock: 18,
        images: ["/images/iphone13-front-camera.jpg"],
        category: categories[2]._id,
        brand: apple._id,
        isActive: true,
        type: "parts",
        colors: ["Black"],
        sizes: ["Standard"],
        tags: ["Camera", "Front", "iPhone"],
      },
    ]);
    console.log("Parts seeded:", parts);

    // Seed Tablets
    const tablets = await Product.insertMany([
      {
        name: "Samsung Galaxy Tab S8",
        sku: "SAMSUNG-TAB-S8",
        description: "Samsung Galaxy Tab S8 128GB Wi-Fi.",
        price: 600,
        stock: 20,
        images: ["/images/tab-s8.jpg"],
        category: categories[3]._id, // Tablets category
        brand: samsung._id, // Samsung brand
        isActive: true,
        type: "tablets",
        colors: ["Silver", "Black"],
        sizes: ["128GB"],
        tags: ["Android", "Tablet"],
      },
      {
        name: "iPad Air 5",
        sku: "IPAD-AIR-5",
        description: "Apple iPad Air 5 256GB Wi-Fi.",
        price: 700,
        stock: 25,
        images: ["/images/ipad-air5.jpg"],
        category: categories[3]._id, // Tablets category
        brand: apple._id, // Apple brand
        isActive: true,
        type: "tablets",
        colors: ["Space Gray", "Pink"],
        sizes: ["256GB"],
        tags: ["iOS", "Tablet"],
      },
    ]);
    console.log("Tablets seeded:", tablets);

    console.log("Seeding completed!");
    process.exit(0); // Exit the process when done
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1); // Exit with error code if something fails
  }
};

// Run seeder
seedData();
