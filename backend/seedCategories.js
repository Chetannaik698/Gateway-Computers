require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category.model');

const initialCategories = [
  { id: 'accessories', label: 'Computer Accessories', icon: 'fa-keyboard' },
  { id: 'laptops',     label: 'Laptops',              icon: 'fa-laptop'   },
  { id: 'cctv',        label: 'CCTV Equipment',       icon: 'fa-camera'   },
  { id: 'printers',    label: 'Printers',             icon: 'fa-print'    },
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gateway')
  .then(async () => {
    console.log('Connected to DB');
    for (const cat of initialCategories) {
      const exists = await Category.findOne({ id: cat.id });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created category: ${cat.id}`);
      }
    }
    console.log('Done seeding categories');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
