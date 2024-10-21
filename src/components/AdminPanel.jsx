import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, setDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const AdminPanel = () => {
  const [productData, setProductData] = useState({
    _id: '',
    title: '',
    description: '',
    price: '',
    category: { name: '', id: '' },
    brand: { name: '', id: '' },
    status: 'in-stock',
    discount: 0,
    img: '',
    imageURLs: [],
    tags: [],
    sku: '',
    productType: '',
    quantity: '',
    unit: '',
    featured: false,
    sellCount: 0,
    parent: '',
    children: '',
    sizes: [],
    additionalInformation: [],
    slug: '',
    reviews: { review: 0 },
    createdAt: null,
    updatedAt: null,
    __v: 0
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        ...doc.data(),
        _id: doc.id
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
            [childKey]: value
          }
        };
      }
      if (type === 'checkbox') {
        return { ...prevData, [name]: checked };
      }
      if (['price', 'quantity', 'discount', 'sellCount', '__v'].includes(name)) {
        return { ...prevData, [name]: value === '' ? '' : Number(value) };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newProduct = {
        ...productData,
        createdAt: productData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: productData.title.toLowerCase().replace(/ /g, '-'),
        sku: productData.sku || `SKU-${uuidv4().slice(0, 8)}`,
        sellCount: productData.sellCount || 0,
        __v: productData.__v || 0,
        _id: productData._id || uuidv4(),
        img: productData.img || (productData.imageURLs.length > 0 ? productData.imageURLs[0] : '')
      };

      await setDoc(doc(db, 'products', newProduct._id), newProduct, { merge: true });

      resetForm();
      fetchProducts();
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
      _id: '',
      title: '',
      description: '',
      price: '',
      category: { name: '', id: '' },
      brand: { name: '', id: '' },
      status: 'in-stock',
      discount: 0,
      img: '',
      imageURLs: [],
      tags: [],
      sku: '',
      productType: '',
      quantity: '',
      unit: '',
      featured: false,
      sellCount: 0,
      parent: '',
      children: '',
      sizes: [],
      additionalInformation: [],
      slug: '',
      reviews: { review: 0 },
      createdAt: null,
      updatedAt: null,
      __v: 0
    });
    setEditingProduct(null);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
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
            name="category.id"
            value={productData.category.id}
            onChange={handleInputChange}
            placeholder="Category ID"
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
        <div className="mb-3">
          <input
            type="text"
            name="brand.id"
            value={productData.brand.id}
            onChange={handleInputChange}
            placeholder="Brand ID"
            className="form-control"
          />
        </div>
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
        <div className="mb-3">
          <input
            type="text"
            name="img"
            value={productData.img}
            onChange={handleInputChange}
            placeholder="Primary Image URL"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="imageURLs"
            value={productData.imageURLs.join(', ')}
            onChange={(e) => setProductData({...productData, imageURLs: e.target.value.split(', ')})}
            placeholder="Additional Image URLs (comma-separated)"
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
        <div className="mb-3">
          <input
            type="number"
            name="reviews.review"
            value={productData.reviews.review}
            onChange={handleInputChange}
            placeholder="Review Score"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="__v"
            value={productData.__v}
            onChange={handleInputChange}
            placeholder="Version"
            className="form-control"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
        </button>
      </form>

      <h3>Product List</h3>
      <ProductList
        products={currentProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product._id} className="product-item mb-3 p-3 border">
          <h4>{product.title}</h4>
          <p>Price: ${product.price}</p>
          <p>SKU: {product.sku}</p>
          <p>Status: {product.status}</p>
          {product.img && <img src={product.img} alt={product.title} style={{maxWidth: '100px', maxHeight: '100px'}} />}
          <div className="mt-2">
            <button onClick={() => onEdit(product)} className="btn btn-secondary me-2">Edit</button>
            <button onClick={() => onDelete(product._id)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminPanel;