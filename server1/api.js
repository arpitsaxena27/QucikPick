/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const e = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://arpitsaxena2703:walmart001@martdata.pr8fo.mongodb.net/?retryWrites=true&w=majority&appName=MartData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // // Clear the database when the server starts
  // try {
  //   await MyObject.deleteMany({});
  //   console.log('All existing data deleted from the database');
  // } catch (error) {
  //   console.error('Error deleting data:', error);
  // } 
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

const objectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nid: { type: String, required: true },
  products: [{
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  }]
});

const MyObject = mongoose.model('MyObject', objectSchema);

  // Step 3: Insert Data
  const dairy = new MyObject({
    name: "Dairy",
    nid: "n31",
    products: [
      {
        productName: "Milk",
        quantity: 200,
        price: 50,
        imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRsJUHFe09NweFAFXO45f1yeIVFqWb23fizfDXO8lsHvQmNljKaCSP7spRV01uwIJ3H2rws0EGWw4KeiLi-pRG2WXy4q20RfgI0bNIq7zMGk834H1ifnyAoiQ"
      },
      {
        productName: "Butter",
        quantity: 100,
        price: 200,
        imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQrMKj0h5ijIjsTzByQzXkmHFZrsh5xTk-rCDVN_nLow0g4FVntW6CSKd-P5e1fcoMWx8kFd_8BnRy3PPiXvLxggJnqSJt7O9PCcwgzK_eF"
      },
      {
        productName: "Cheese",
        quantity: 80,
        price: 250,
        imageUrl: "https://m.media-amazon.com/images/I/61zSZaAhVOL._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const frozen = new MyObject({
    name: "Frozen",
    nid: "n36",
    products: [
      {
        productName: "Frozen Pizza",
        quantity: 50,
        price: 300,
        imageUrl: "https://m.media-amazon.com/images/I/51fLHD2s+7L._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Frozen Vegetables",
        quantity: 70,
        price: 200,
        imageUrl: "https://m.media-amazon.com/images/I/61Q2uM5s5ML._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Ice Cream",
        quantity: 100,
        price: 150,
        imageUrl: "https://m.media-amazon.com/images/I/71KZQkANkFS._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const grocery = new MyObject({
    name: "Grocery",
    nid: "n34",
    products: [
      {
        productName: "Rice",
        quantity: 100,
        price: 500,
        imageUrl: "https://m.media-amazon.com/images/I/710C3-rwqyL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Wheat Flour",
        quantity: 100,
        price: 400,
        imageUrl: "https://m.media-amazon.com/images/I/61VrTYHNMSL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Sugar",
        quantity: 80,
        price: 50,
        imageUrl: "https://m.media-amazon.com/images/I/81M6T+PF-iL._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const ladiesClothes = new MyObject({
    name: "Ladies' Clothes",
    nid: "n23",
    products: [
      {
        productName: "Dress",
        quantity: 60,
        price: 1500,
        imageUrl: "https://m.media-amazon.com/images/I/71eiMwa2vAL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Skirt",
        quantity: 50,
        price: 800,
        imageUrl: "https://m.media-amazon.com/images/I/41-r90A-i7L._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Blouse",
        quantity: 70,
        price: 900,
        imageUrl: "https://m.media-amazon.com/images/I/71nWM1AUh0L._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const mensClothes = new MyObject({
    name: "Men's Clothes",
    nid: "n26",
    products: [
      {
        productName: "Shirt",
        quantity: 70,
        price: 1000,
        imageUrl: "https://m.media-amazon.com/images/I/61eMiLB1bEL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Trousers",
        quantity: 50,
        price: 1200,
        imageUrl: "https://m.media-amazon.com/images/I/51Zi8fZ37KL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Jacket",
        quantity: 20,
        price: 3000,
        imageUrl: "https://m.media-amazon.com/images/I/61zpsdH6PFL._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const childrensClothes = new MyObject({
    name: "Children's Clothes",
    nid: "n42",
    products: [
      {
        productName: "T-Shirt",
        quantity: 50,
        price: 300,
        imageUrl: "https://m.media-amazon.com/images/I/71x4rLhMkML._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Jeans",
        quantity: 40,
        price: 600,
        imageUrl: "https://m.media-amazon.com/images/I/71k5wTgEsjL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Sweater",
        quantity: 30,
        price: 800,
        imageUrl: "https://m.media-amazon.com/images/I/61UWMR+d-qL._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const seasonal = new MyObject({
    name: "Seasonal",
    nid: "n11",
    products: [
      {
        productName: "Christmas Tree",
        quantity: 20,
        price: 3000,
        imageUrl: "https://m.media-amazon.com/images/I/61W5uhR5-IL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Halloween Costume",
        quantity: 40,
        price: 1500,
        imageUrl: "https://m.media-amazon.com/images/I/41wA+Uh-lTL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Easter Eggs",
        quantity: 100,
        price: 50,
        imageUrl: "https://m.media-amazon.com/images/I/71H1BfzJLwL._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const crafts = new MyObject({
    name: "Crafts",
    nid: "n14",
    products: [
      {
        productName: "Acrylic Paints",
        quantity: 100,
        price: 400,
        imageUrl: "https://m.media-amazon.com/images/I/71PwFQgur4L._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Craft Scissors",
        quantity: 80,
        price: 150,
        imageUrl: "https://m.media-amazon.com/images/I/61HaSwsqltL._AC_UL480_FMwebp_QL65_.jpg"
      },
      {
        productName: "Glue Gun",
        quantity: 60,
        price: 500,
        imageUrl: "https://m.media-amazon.com/images/I/61OlyPbQcQS._AC_UL480_FMwebp_QL65_.jpg"
      }
    ]
  });
  
  const home = new MyObject({
    name: "Home",
    nid: "n10",
    products: [
      {
        productName: "Vacuum Cleaner",
        quantity: 30,
        price: 7000,
        imageUrl: "https://m.media-amazon.com/images/I/71gMxNHnIZL._AC_UY327_FMwebp_QL65_.jpg"
      },
      {
        productName: "Air Purifier",
        quantity: 20,
        price: 10000,
        imageUrl: "https://m.media-amazon.com/images/I/51oQCJUGOeL._AC_UY327_FMwebp_QL65_.jpg"
      },
      {
        productName: "Microwave Oven",
        quantity: 25,
        price: 12000,
        imageUrl: "https://m.media-amazon.com/images/I/71KszM+RWrL._AC_UY327_FMwebp_QL65_.jpg"
      }
    ]
  });
  const furniture = new MyObject({
    name: "Furniture",
    nid: "n13",
    products: [
      {
        productName: "Dining Table",
        quantity: 10,
        price: 15000,
        imageUrl: "https://m.media-amazon.com/images/I/81fTd0YGauL._SL1500_.jpg"
      },
      {
        productName: "Sofa Set",
        quantity: 5,
        price: 25000,
        imageUrl: "https://m.media-amazon.com/images/I/51RVWvOSUCL.jpg"
      },
      {
        productName: "Office Chair",
        quantity: 20,
        price: 5000,
        imageUrl: "https://m.media-amazon.com/images/I/71vG191BkqL._SL1500_.jpg"
      }
    ]
  });
  
  const toys = new MyObject({
    name: "Toys",
    nid: "n4",
    products: [
      {
        productName: "Lego Set",
        quantity: 100,
        price: 2000,
        imageUrl: "https://m.media-amazon.com/images/I/81V1MZDLRJL._SL1500_.jpg"
      },
      {
        productName: "Doll",
        quantity: 50,
        price: 500,
        imageUrl: "https://m.media-amazon.com/images/I/81x4ZbLCYqL._SL1500_.jpg"
      },
      {
        productName: "Toy Car",
        quantity: 70,
        price: 300,
        imageUrl: "https://m.media-amazon.com/images/I/51cCXZiIe8L.jpg"
      }
    ]
  });
  
  const sports = new MyObject({
    name: "Sports",
    nid: "n6",
    products: [
      {
        productName: "Football",
        quantity: 50,
        price: 800,
        imageUrl: "https://m.media-amazon.com/images/I/81RubIcmiaL._SL1500_.jpg"
      },
      {
        productName: "Tennis Racket",
        quantity: 30,
        price: 1500,
        imageUrl: "https://m.media-amazon.com/images/I/61qyqYTKIeL._SL1200_.jpg"
      },
      {
        productName: "Basketball",
        quantity: 40,
        price: 900,
        imageUrl: "https://m.media-amazon.com/images/I/81uuNbyBXlL._SL1500_.jpg"
      }
    ]
  });
  
  const electronics = new MyObject({
    name: "Electronics",
    nid: "n29",
    products: [
      {
        productName: "Smartphone",
        quantity: 40,
        price: 20000,
        imageUrl: "https://m.media-amazon.com/images/I/61Io5-ojWUL._SL1500_.jpg"
      },
      {
        productName: "Laptop",
        quantity: 15,
        price: 50000,
        imageUrl: "https://m.media-amazon.com/images/I/71FtdqEC1BL._SL1500_.jpg"
      },
      {
        productName: "Headphones",
        quantity: 100,
        price: 1500,
        imageUrl: "https://m.media-amazon.com/images/I/61b-NM5fHFL._SL1000_.jpg"
      }
    ]
  });
  
  const hardware = new MyObject({
    name: "Hardware",
    nid: "n19",
    products: [
      {
        productName: "Hammer",
        quantity: 60,
        price: 200,
        imageUrl: "https://m.media-amazon.com/images/I/61LuEzzSzcL._SL1500_.jpg"
      },
      {
        productName: "Screwdriver Set",
        quantity: 80,
        price: 300,
        imageUrl: "https://m.media-amazon.com/images/I/71eT9E4PAoL._SL1456_.jpg"
      },
      {
        productName: "Drill Machine",
        quantity: 25,
        price: 2500,
        imageUrl: "https://m.media-amazon.com/images/I/71B2VHod0pL._SL1500_.jpg"
      }
    ]
  });
  
  const paint = new MyObject({
    name: "Paint",
    nid: "n17",
    products: [
      {
        productName: "Dulux Promise Interior Emulsion Paint (10L, Peruvian Yellow/True Australia)",
        quantity: 5,
        price: 2000,
        imageUrl: "https://m.media-amazon.com/images/I/71ED87+dW3L._SX425_.jpg"
      },
      {
        productName: "Dulux Promise Interior Emulsion Paint (10L, Aerial View)",
        quantity: 5,
        price: 2100,
        imageUrl: "https://m.media-amazon.com/images/I/71NeXYNV+8L._SX466_.jpg"
      },
      {
        productName: "Dulux DIY Simply (1L, Mild Mocha)",
        quantity: 5,
        price: 1000,
        imageUrl: "https://m.media-amazon.com/images/I/61P6mxoO7UL._SX466_.jpg"
      },
      {
        productName: "Spray Paint",
        quantity: 40,
        price: 300,
        imageUrl: "https://m.media-amazon.com/images/I/61x+yoUIxyL._SL1500_.jpg"
      },
      {
        productName: "Paint Brushes",
        quantity: 100,
        price: 50,
        imageUrl: "https://m.media-amazon.com/images/I/71dNJnwk+vL._SL1500_.jpg"
      }
    ]
  });
  
  const auto = new MyObject({
    name: "Auto",
    nid: "n8",
    products: [
      {
        productName: "Car Oil",
        quantity: 15,
        price: 500,
        imageUrl: "https://m.media-amazon.com/images/I/81u07KntP1L._SL1500_.jpg"
      },
      {
        productName: "Brake Pads",
        quantity: 30,
        price: 1200,
        imageUrl: "https://m.media-amazon.com/images/I/61WP0bSnKvL._SL1500_.jpg"
      },
      {
        productName: "Windshield Wipers",
        quantity: 25,
        price: 350,
        imageUrl: "https://m.media-amazon.com/images/I/81i2juQ8rWL._SL1500_.jpg"
      }
    ]
  });
  dairy.save();
  frozen.save();
  grocery.save();
  mensClothes.save();
  ladiesClothes.save();
  childrensClothes.save();
  seasonal.save();
  crafts.save();
  home.save();
  furniture.save();
  toys.save();
  sports.save();
  electronics.save();
  hardware.save();
  paint.save();
  auto.save()
    .then((result) => {
      console.log("Data successfully inserted:", result);
    })
    .catch((error) => {
      console.error("Error inserting data:", error);
    });



    app.post('/api/objects', async (req, res) => {
      const newObject = new MyObject(req.body);
      try {
        await newObject.save();
        res.status(201).send(newObject);
      } catch (error) {
        res.status(500).send({ error: 'Error saving object' });
      }
    });
    
    app.get('/api/objects', async (req, res) => {
      try {
        const objects = await MyObject.find();
        res.send(objects);
      } catch (error) {
        console.error('Error fetching objects:', error);
        res.status(500).send({ error: 'Error fetching objects' });
      }
    });

    const PORT = 5000;
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running at http://0.0.0.0:${PORT}/`);
    });
