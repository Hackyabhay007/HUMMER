import { db } from '../db/firebaseConfig'; // Your Firebase configuration file
import { collection, addDoc } from 'firebase/firestore';
import axios from 'axios';

const API_URL = 'https://shofy-backend.vercel.app/api/product/all';

const fetchAndUploadProducts = async () => {
  try {
    // Fetch products from the API
    const response = await axios.get(API_URL);
    const products = response.data;

    // Get a reference to the Firestore 'products' collection
    const productsRef = collection(db, 'products');

    // Upload each product to Firestore
    for (const product of products) {
      await addDoc(productsRef, {
        name: product.name,
        type: product.type,
        price: product.price,
        offer: product.offer,
        popular: product.popular,
        rating: product.rating,
        description: product.description,
        imageUrl: product.imageUrl,
      });
      console.log(`Product ${product.name} added successfully!`);
    }
    console.log('All products have been added to Firestore.');
  } catch (error) {
    console.error('Error fetching or uploading products:', error);
  }
};

// Execute the function
fetchAndUploadProducts();
