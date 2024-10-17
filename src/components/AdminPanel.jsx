import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Update these imports
import ProductList from './ProductList';
import EditPopup from './EditPopup';
import Pagination from './Pagination';


const AdminPanel = () => {
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: 0,
    category: { name: '', id: '' },
    brand: { name: '', id: '' },
    status: 'in-stock',
    discount: 0,
    imageURLs: [],
    tags: [],
    sku: '',
    productType: '',
    quantity: 0,
    unit: '',
    featured: false,
    sellCount: 0,
    parent: '',
    children: '',
    sizes: [],
    additionalInformation: [],
    slug: '',
    reviews: [],
    createdAt: null,
    updatedAt: null,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
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
    const { name, value, type, checked } = e.target;
    setProductData(prevData => {
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        return {
          ...prevData,
          [parentKey]: {
            ...prevData[parentKey],
            [childKey]: type === 'number' ? Number(value) : value
          }
        };
      }
      if (type === 'checkbox') {
        return { ...prevData, [name]: checked };
      }
      if (type === 'number') {
        return { ...prevData, [name]: Number(value) };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleArrayInputChange = (e, index, field) => {
    const { value } = e.target;
    setProductData(prevData => {
      const newArray = [...prevData[field]];
      newArray[index] = value;
      return { ...prevData, [field]: newArray };
    });
  };

  const handleAddArrayItem = (field) => {
    setProductData(prevData => ({
      ...prevData,
      [field]: [...prevData[field], '']
    }));
  };

  const handleRemoveArrayItem = (index, field) => {
    setProductData(prevData => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index)
    }));
  };

  const handleAdditionalInfoChange = (index, key, value) => {
    setProductData(prevData => {
      const newAdditionalInfo = [...prevData.additionalInformation];
      newAdditionalInfo[index] = { ...newAdditionalInfo[index], [key]: value };
      return { ...prevData, additionalInformation: newAdditionalInfo };
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
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
      let imageURLs = productData.imageURLs;
      if (files.length > 0) {
        imageURLs = await uploadImages();
      }
      const newProduct = {
        ...productData,
        imageURLs,
        createdAt: productData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: productData.title.toLowerCase().replace(/ /g, '-'),
      };
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), newProduct);
      } else {
        await addDoc(collection(db, 'products'), newProduct);
      }
      resetForm();
      fetchProducts();
      setShowEditPopup(false);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductData(product);
    setShowEditPopup(true);
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

  const resetForm = () => {
    setProductData({
      title: '',
      description: '',
      price: 0,
      category: { name: '', id: '' },
      brand: { name: '', id: '' },
      status: 'in-stock',
      discount: 0,
      imageURLs: [],
      tags: [],
      sku: '',
      productType: '',
      quantity: 0,
      unit: '',
      featured: false,
      sellCount: 0,
      parent: '',
      children: '',
      sizes: [],
      additionalInformation: [],
      slug: '',
      reviews: [],
      createdAt: null,
      updatedAt: null,
    });
    setFiles([]);
    setEditingProduct(null);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Basic Information */}
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
        
        {/* Category and Brand */}
        <div className="mb-3">
          <input
            type="text"
            name="category.name"
            value={productData.category.name}
            onChange={handleInputChange}
            placeholder="Category Name"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="brand.name"
            value={productData.brand.name}
            onChange={handleInputChange}
            placeholder="Brand Name"
            className="form-control"
          />
        </div>
        
        {/* Status and Discount */}
        <div className="mb-3">
          <select
            name="status"
            value={productData.status}
            onChange={handleInputChange}
            className="form-control"
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
        
        {/* Tags */}
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
        
        {/* SKU and Product Type */}
        <div className="mb-3">
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleInputChange}
            placeholder="SKU"
            className="form-control"
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
        
        {/* Quantity and Unit */}
        <div className="mb-3">
          <input
            type="number"
            name="quantity"
            value={productData.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            className="form-control"
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
        
        {/* Featured and Sell Count */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="featured"
            checked={productData.featured}
            onChange={handleInputChange}
            className="form-check-input"
            id="featuredCheck"
          />
          <label className="form-check-label" htmlFor="featuredCheck">Featured Product</label>
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="sellCount"
            value={productData.sellCount}
            onChange={handleInputChange}
            placeholder="Sell Count"
            className="form-control"
          />
        </div>
        
        {/* Parent and Children */}
        <div className="mb-3">
          <input
            type="text"
            name="parent"
            value={productData.parent}
            onChange={handleInputChange}
            placeholder="Parent Category"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="children"
            value={productData.children}
            onChange={handleInputChange}
            placeholder="Child Category"
            className="form-control"
          />
        </div>
        
        {/* Sizes */}
        <div className="mb-3">
          <h5>Sizes</h5>
          {productData.sizes.map((size, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                value={size}
                onChange={(e) => handleArrayInputChange(e, index, 'sizes')}
                className="form-control"
              />
              <button type="button" onClick={() => handleRemoveArrayItem(index, 'sizes')} className="btn btn-danger">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddArrayItem('sizes')} className="btn btn-secondary">Add Size</button>
        </div>
        
        {/* Additional Information */}
        <div className="mb-3">
          <h5>Additional Information</h5>
          {productData.additionalInformation.map((info, index) => (
            <div key={index} className="row mb-2">
              <div className="col">
                <input
                  type="text"
                  value={info.key}
                  onChange={(e) => handleAdditionalInfoChange(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  value={info.value}
                  onChange={(e) => handleAdditionalInfoChange(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="form-control"
                />
              </div>
              <div className="col-auto">
                <button type="button" onClick={() => handleRemoveArrayItem(index, 'additionalInformation')} className="btn btn-danger">Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => handleAddArrayItem('additionalInformation')} className="btn btn-secondary">Add Info</button>
        </div>
        
        {/* Image Upload */}
        <div className="mb-3">
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="form-control"
          />
          <small className="form-text text-muted">Select up to 5 images</small>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
        </button>
      </form>
      {/* Product List */}
      <h3>Product List</h3>
      <ProductList
        products={currentProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* Edit Popup */}
      {showEditPopup && (
        <EditPopup
          product={editingProduct}
          onClose={() => setShowEditPopup(false)}
          onSave={handleSubmit}
          onChange={handleInputChange}
          onArrayInputChange={handleArrayInputChange}
          onAddArrayItem={handleAddArrayItem}
          onRemoveArrayItem={handleRemoveArrayItem}
          onAdditionalInfoChange={handleAdditionalInfoChange}
          onFileChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default AdminPanel;



