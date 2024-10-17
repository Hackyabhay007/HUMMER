// EditPopup Component
const EditPopup = ({ product, onClose, onSave, onChange, onArrayInputChange, onAddArrayItem, onRemoveArrayItem, onAdditionalInfoChange, onFileChange }) => {
    return (
      <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Product: {product.title}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSave}>
                {/* Basic Information */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="title"
                    value={product.title}
                    onChange={onChange}
                    placeholder="Product Title"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={onChange}
                    placeholder="Product Description"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={onChange}
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
                    value={product.category.name}
                    onChange={onChange}
                    placeholder="Category Name"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="brand.name"
                    value={product.brand.name}
                    onChange={onChange}
                    placeholder="Brand Name"
                    className="form-control"
                  />
                </div>
                
                {/* Status and Discount */}
                <div className="mb-3">
                  <select
                    name="status"
                    value={product.status}
                    onChange={onChange}
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
                    value={product.discount}
                    onChange={onChange}
                    placeholder="Discount"
                    className="form-control"
                  />
                </div>
                
                {/* Tags */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="tags"
                    value={product.tags.join(', ')}
                    onChange={(e) => onChange({...product, tags: e.target.value.split(', ')})}
                    placeholder="Tags (comma-separated)"
                    className="form-control"
                  />
                </div>
                
                {/* SKU and Product Type */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="sku"
                    value={product.sku}
                    onChange={onChange}
                    placeholder="SKU"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="productType"
                    value={product.productType}
                    onChange={onChange}
                    placeholder="Product Type"
                    className="form-control"
                  />
                </div>
                
                {/* Quantity and Unit */}
                <div className="mb-3">
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={onChange}
                    placeholder="Quantity"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="unit"
                    value={product.unit}
                    onChange={onChange}
                    placeholder="Unit"
                    className="form-control"
                  />
                </div>
                
                {/* Featured and Sell Count */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={product.featured}
                    onChange={onChange}
                    className="form-check-input"
                    id="editFeaturedCheck"
                  />
                  <label className="form-check-label" htmlFor="editFeaturedCheck">Featured Product</label>
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    name="sellCount"
                    value={product.sellCount}
                    onChange={onChange}
                    placeholder="Sell Count"
                    className="form-control"
                  />
                </div>
                
                {/* Parent and Children */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="parent"
                    value={product.parent}
                    onChange={onChange}
                    placeholder="Parent Category"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="children"
                    value={product.children}
                    onChange={onChange}
                    placeholder="Child Category"
                    className="form-control"
                  />
                </div>
                
                {/* Sizes */}
                <div className="mb-3">
                  <h5>Sizes</h5>
                  {product.sizes.map((size, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => onArrayInputChange(e, index, 'sizes')}
                        className="form-control"
                      />
                      <button type="button" onClick={() => onRemoveArrayItem(index, 'sizes')} className="btn btn-danger">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => onAddArrayItem('sizes')} className="btn btn-secondary">Add Size</button>
                </div>
                
                {/* Additional Information */}
                <div className="mb-3">
                  <h5>Additional Information</h5>
                  {product.additionalInformation.map((info, index) => (
                    <div key={index} className="row mb-2">
                      <div className="col">
                        <input
                          type="text"
                          value={info.key}
                          onChange={(e) => onAdditionalInfoChange(index, 'key', e.target.value)}
                          placeholder="Key"
                          className="form-control"
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          value={info.value}
                          onChange={(e) => onAdditionalInfoChange(index, 'value', e.target.value)}
                          placeholder="Value"
                          className="form-control"
                        />
                      </div>
                      <div className="col-auto">
                        <button type="button" onClick={() => onRemoveArrayItem(index, 'additionalInformation')} className="btn btn-danger">Remove</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => onAddArrayItem('additionalInformation')} className="btn btn-secondary">Add Info</button>
                </div>
                
                {/* Image Upload */}
                <div className="mb-3">
                  <input
                    type="file"
                    onChange={onFileChange}
                    multiple
                    accept="image/*"
                    className="form-control"
                  />
                  <small className="form-text text-muted">Select up to 5 images</small>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };