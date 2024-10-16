import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const AdminPanel = () => {
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    status: 'in-stock',
    discount: 0,
    additionalInformation: [],
    imageURLs: [],
    tags: [],
  });
  const [files, setFiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        imageURLs: doc.data().imageURLs || []
      }));
      setProducts(productsList);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length < 3 || selectedFiles.length > 5) {
      alert('Please select 3 to 5 images.');
      return;
    }
    setFiles(selectedFiles);
  };

  const uploadImages = async () => {
    const imageUrls = [];
    for (const file of files) {
      const storageRef = ref(storage, `product-images/${uuidv4()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      imageUrls.push({ img: url });
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageURLs = await uploadImages();
      const newProduct = {
        ...productData,
        imageURLs,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
        sellCount: 0,
        quantity: 0,
        sku: uuidv4().slice(0, 8).toUpperCase(),
        slug: productData.title.toLowerCase().replace(/ /g, '-'),
      };
      await addDoc(collection(db, 'products'), newProduct);
      setProductData({
        title: '',
        description: '',
        price: 0,
        category: '',
        brand: '',
        status: 'in-stock',
        discount: 0,
        additionalInformation: [],
        imageURLs: [],
        tags: [],
      });
      setFiles([]);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'products', productId));
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} className="mb-4">
  <div className="mb-3">
    <input
      type="text"
      name="title"
      value={productData.title}
      onChange={handleInputChange}
      placeholder="Product Title"
      className="form-control"
      required
    />
  </div>
  <div className="mb-3">
    <textarea
      name="description"
      value={productData.description}
      onChange={handleInputChange}
      placeholder="Product Description"
      className="form-control"
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="number"
      name="price"
      value={productData.price}
      onChange={handleInputChange}
      placeholder="Price"
      className="form-control"
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      name="category"
      value={productData.category}
      onChange={handleInputChange}
      placeholder="Category"
      className="form-control"
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      name="brand"
      value={productData.brand}
      onChange={handleInputChange}
      placeholder="Brand"
      className="form-control"
      required
    />
  </div>
  <div className="mb-3">
    <select
      name="status"
      value={productData.status}
      onChange={handleInputChange}
      className="form-control"
      required
    >
      <option value="in-stock">In Stock</option>
      <option value="out-of-stock">Out of Stock</option>
    </select>
  </div>
  <div className="mb-3">
    <input
      type="number"
      name="discount"
      value={productData.discount}
      onChange={handleInputChange}
      placeholder="Discount"
      className="form-control"
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      name="sku"
      value={productData.sku}
      onChange={handleInputChange}
      placeholder="SKU"
      className="form-control"
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      name="productType"
      value={productData.productType}
      onChange={handleInputChange}
      placeholder="Product Type"
      className="form-control"
    />
  </div>
  <div className="mb-3">
    <input
      type="number"
      name="quantity"
      value={productData.quantity}
      onChange={handleInputChange}
      placeholder="Quantity"
      className="form-control"
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      name="unit"
      value={productData.unit}
      onChange={handleInputChange}
      placeholder="Unit"
      className="form-control"
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      name="tags"
      value={productData.tags.join(', ')}
      onChange={(e) => setProductData({...productData, tags: e.target.value.split(', ')})}
      placeholder="Tags (comma-separated)"
      className="form-control"
    />
  </div>
  <div className="mb-3">
    <input
      type="file"
      onChange={handleFileChange}
      multiple
      accept="image/*"
      className="form-control"
      required
    />
    <small className="form-text text-muted">Select 3 to 5 images</small>
  </div>
  <button type="submit" className="btn btn-primary" disabled={loading}>
    {loading ? 'Adding...' : 'Add Product'}
  </button>
</form>

      <h3>Product List</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="list-group">
          {products.map((product) => (
            <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{product.title}</strong> - ${product.price}
                <br />
                <small>Category: {product.category?.name || 'N/A'}</small>
                <br />
                <small>Brand: {product.brand?.name || 'N/A'}</small>
                <br />
                <small>{product.imageURLs?.length || 0} images</small>
                <br />
                <small>Tags: {product.tags?.join(', ') || 'N/A'}</small>
              </div>
              <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm" disabled={loading}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPanel;