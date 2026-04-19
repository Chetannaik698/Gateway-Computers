// =====================
// GATEWAY COMPUTERS DATA
// =====================

export const PHONE = '+919591064356';
export const PHONE_DISPLAY = '+91 9591064356';
export const WHATSAPP_BASE = `https://wa.me/919591064356`;

export const getWhatsAppLink = (message = 'Hello! I am interested in your products/services.') =>
  `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;

export const services = [
  {
    id: 1,
    icon: 'fa-camera',
    title: 'CCTV Camera Installation',
    short: 'Professional installation of CCTV cameras for homes & businesses with full setup.',
    description:
      'We provide end-to-end CCTV installation services including site survey, cable routing, DVR/NVR setup, and remote-view configuration. Protect your home or business with our reliable surveillance solutions.',
    price: 'From ₹2,500',
    features: ['Site Survey', 'Cable Routing', 'DVR/NVR Setup', 'Remote View Config', '1-Year Support'],
  },
  {
    id: 2,
    icon: 'fa-video',
    title: 'IP / PTZ / Full HD Camera',
    short: 'Advanced IP, PTZ and Full HD cameras for superior coverage and clarity.',
    description:
      'Upgrade to IP-based surveillance with pan-tilt-zoom (PTZ) cameras and Full HD resolution. Ideal for large premises, warehouses, and corporate setups requiring wide-area monitoring.',
    price: 'From ₹4,000',
    features: ['IP Camera Setup', 'PTZ Configuration', 'Full HD Clarity', 'PoE Support', 'Cloud Storage'],
  },
  {
    id: 3,
    icon: 'fa-desktop',
    title: 'Computer Service & Gaming PC Build',
    short: 'Expert computer repairs, upgrades and custom gaming PC builds to your spec.',
    description:
      'From hardware repair and OS reinstallation to building a beast gaming rig from scratch — we do it all. Custom PC builds tailored to your budget and performance needs.',
    price: 'From ₹300',
    features: ['Hardware Repair', 'OS Installation', 'Custom PC Build', 'Performance Tuning', 'Data Recovery'],
  },
  {
    id: 4,
    icon: 'fa-print',
    title: 'Printer Service & Cartridge Refilling',
    short: 'All-brand printer repair, maintenance and cartridge refilling at affordable rates.',
    description:
      'We service all major printer brands including HP, Canon, Epson, and Brother. Cartridge refilling, head cleaning, and full printer maintenance to keep your office running smoothly.',
    price: 'From ₹150',
    features: ['All Brand Support', 'Cartridge Refilling', 'Head Cleaning', 'Paper Jam Fix', 'Driver Install'],
  },
  {
    id: 5,
    icon: 'fa-laptop',
    title: 'Laptop Service & Sales',
    short: 'Complete laptop repair, screen replacement, battery service and new/used laptop sales.',
    description:
      'Get your laptop back in peak condition — screen replacement, battery swap, keyboard repair, and motherboard-level fixes. We also stock new and certified second-hand laptops.',
    price: 'From ₹500',
    features: ['Screen Replacement', 'Battery Service', 'Keyboard Repair', 'Motherboard Fix', 'Sales'],
  },
];

export const productCategories = [
  { id: 'accessories', label: 'Computer Accessories', icon: 'fa-keyboard' },
  { id: 'laptops',     label: 'Laptops',              icon: 'fa-laptop'   },
  { id: 'cctv',        label: 'CCTV Equipment',        icon: 'fa-camera'   },
  { id: 'printers',    label: 'Printers',              icon: 'fa-print'    },
];

export const products = [
  // Accessories
  {
    id: 1, category: 'accessories',
    name: 'Logitech MX Keys Wireless Keyboard',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    badge: 'Bestseller',
    specs: ['Wireless Bluetooth', 'Backlit Keys', 'Multi-device', 'USB-C Charging'],
    description: 'Premium wireless keyboard with tactile keys, smart backlight, and multi-device pairing. Perfect for professionals who demand precision.',
  },
  {
    id: 2, category: 'accessories',
    name: 'Gaming Mouse RGB – Redragon M711',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
    badge: null,
    specs: ['16000 DPI', 'RGB Lighting', '7 Buttons', 'Braided Cable'],
    description: 'High-precision gaming mouse with adjustable DPI, RGB chroma lighting, and ergonomic design for extended gaming sessions.',
  },
  {
    id: 3, category: 'accessories',
    name: 'Dell 24" FHD IPS Monitor',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5b3c1?w=600&q=80',
    badge: 'Popular',
    specs: ['1920×1080 FHD', 'IPS Panel', '75Hz', 'HDMI + VGA'],
    description: 'Crystal-clear 24-inch FHD IPS display with thin bezels, anti-glare coating, and multiple connectivity options.',
  },
  {
    id: 4, category: 'accessories',
    name: 'Samsung 1TB SSD (Internal)',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    badge: null,
    specs: ['1TB Capacity', '560MB/s Read', 'SATA III', '5-Year Warranty'],
    description: 'Upgrade your PC or laptop with this fast and reliable 1TB SATA SSD. Boot in seconds and handle demanding workloads effortlessly.',
  },
  // Laptops
  {
    id: 5, category: 'laptops',
    name: 'HP Pavilion 15 – Core i5 12th Gen',
    price: 52999,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    badge: 'New',
    specs: ['Intel Core i5-1235U', '16GB RAM', '512GB SSD', 'Win 11 Home'],
    description: 'A powerful everyday laptop with Intel 12th Gen processor, FHD display, and long battery life. Ideal for students and professionals.',
  },
  {
    id: 6, category: 'laptops',
    name: 'Dell Inspiron 14 – Used (Refurb)',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    badge: 'Second-hand',
    specs: ['Core i5 10th Gen', '8GB RAM', '256GB SSD', 'Good Condition'],
    description: 'Certified refurbished Dell Inspiron with fresh OS installation, cleaned internals and 3-month shop warranty.',
  },
  {
    id: 7, category: 'laptops',
    name: 'Lenovo IdeaPad Slim 3 – Core i3',
    price: 32999,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    badge: 'New',
    specs: ['Core i3-1215U', '8GB RAM', '512GB SSD', 'FHD Display'],
    description: 'Slim, lightweight, and budget-friendly. The Lenovo IdeaPad Slim 3 is perfect for everyday tasks, browsing, and studies.',
  },
  // CCTV
  {
    id: 8, category: 'cctv',
    name: 'CP Plus 2MP HD CCTV Camera',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    badge: 'Popular',
    specs: ['2MP Full HD', 'Night Vision 20m', 'Weatherproof', 'HDCVI'],
    description: 'Reliable HD surveillance camera with excellent night vision. Perfect for home and small office installations.',
  },
  {
    id: 9, category: 'cctv',
    name: 'Hikvision 4-Channel DVR Kit',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    badge: null,
    specs: ['4-Channel DVR', '4×2MP Cameras', '1TB HDD Included', 'Remote View'],
    description: 'Complete CCTV kit for small homes and offices. Includes 4 cameras, DVR, 1TB HDD, and all required accessories.',
  },
  {
    id: 10, category: 'cctv',
    name: 'Hikvision PTZ Speed Dome Camera',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=600&q=80',
    badge: 'Pro',
    specs: ['4MP Resolution', '25× Optical Zoom', 'IP66', 'Auto-tracking'],
    description: 'Professional PTZ camera with 25× optical zoom and auto-tracking for comprehensive coverage of large areas.',
  },
  // Printers
  {
    id: 11, category: 'printers',
    name: 'HP DeskJet 2331 All-in-One',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80',
    badge: null,
    specs: ['Print/Scan/Copy', 'USB Connectivity', '1200 DPI', 'Compact Design'],
    description: 'Affordable home printer with print, scan, and copy functions. Simple setup and low running costs.',
  },
  {
    id: 12, category: 'printers',
    name: 'Epson L3250 EcoTank WiFi',
    price: 13999,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    badge: 'Bestseller',
    specs: ['WiFi + USB', 'EcoTank Refillable', '5760 DPI Photo', 'Print/Scan/Copy'],
    description: 'Best-value EcoTank printer with ultra-low cost per page. Wireless printing from phone/PC and stunning photo quality.',
  },
];

export const whyChooseUs = [
  { icon: 'fa-shield-halved',  title: 'Trusted & Certified',       desc: 'Years of experience with certified technicians you can rely on.' },
  { icon: 'fa-bolt',           title: 'Fast Turnaround',            desc: 'Most repairs done same day or within 24 hours.' },
  { icon: 'fa-indian-rupee-sign', title: 'Transparent Pricing',    desc: 'No hidden charges. Get a quote before any work begins.' },
  { icon: 'fa-headset',        title: '24/7 Support',               desc: 'Reach us anytime via WhatsApp or phone call.' },
  { icon: 'fa-medal',          title: 'Quality Guarantee',          desc: '90-day warranty on all repair services.' },
  { icon: 'fa-location-dot',   title: 'Local & Accessible',         desc: 'Conveniently located — walk in or book a home visit.' },
];

export const stats = [
  { value: '2000+', label: 'Happy Customers' },
  { value: '10+',   label: 'Years Experience' },
  { value: '5000+', label: 'Devices Repaired' },
  { value: '100%',  label: 'Satisfaction Rate' },
];

export const adminProducts = [
  { id: 1, name: 'Logitech MX Keys Keyboard', category: 'accessories', price: 7999,  stock: 5,  status: 'active' },
  { id: 2, name: 'Dell 24" FHD Monitor',      category: 'accessories', price: 14999, stock: 3,  status: 'active' },
  { id: 3, name: 'HP Pavilion 15 Laptop',     category: 'laptops',     price: 52999, stock: 2,  status: 'active' },
  { id: 4, name: 'CP Plus 2MP Camera',        category: 'cctv',        price: 1299,  stock: 12, status: 'active' },
  { id: 5, name: 'Epson L3250 EcoTank',       category: 'printers',    price: 13999, stock: 4,  status: 'active' },
];

export const adminBookings = [
  { id: '#B001', name: 'Ravi Kumar',    service: 'Laptop Service',          date: '2024-01-15', phone: '9876543210', status: 'confirmed' },
  { id: '#B002', name: 'Priya Sharma',  service: 'CCTV Installation',       date: '2024-01-16', phone: '9123456780', status: 'pending'   },
  { id: '#B003', name: 'Arun Patel',    service: 'Gaming PC Build',          date: '2024-01-17', phone: '9456781230', status: 'done'      },
  { id: '#B004', name: 'Meena Rao',     service: 'Printer Cartridge Refill', date: '2024-01-18', phone: '9654321870', status: 'pending'   },
  { id: '#B005', name: 'Suresh Gowda',  service: 'Computer Service',         date: '2024-01-19', phone: '9871234560', status: 'confirmed' },
];
