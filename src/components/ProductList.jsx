import React from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <div className="list-group">
      {products.map((product) => (
        <div key={product.id} className="list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{product.title}</h5>
            <small>${product.price}</small>
          </div>
          <p className="mb-1">{product.description.substring(0, 100)}...</p>
          <small>{product.category.name}</small>
          <div className="mt-2">
            <button onClick={() => onEdit(product)} className="btn btn-sm btn-primary mr-2">Edit</button>
            <button onClick={() => onDelete(product.id)} className="btn btn-sm btn-danger">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;