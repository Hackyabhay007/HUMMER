import React from "react";
import { useDispatch, useSelector } from "react-redux";



import CategoryFilter from "../shop/shop-filter/category-filter";
import ColorFilter from "../shop/shop-filter/color-filter";
import PriceFilter from "../shop/shop-filter/price-filter";
import ProductBrand from "../shop/shop-filter/product-brand";
import TopRatedProducts from "../shop/shop-filter/top-rated-products";
import ResetButton from "../shop/shop-filter/reset-button";
import StatusFilter from "../shop/shop-filter/status-filter";

const ShopFilterOffCanvas = ({ all_products, otherProps }) => {
  const { priceFilterValues, setCurrPage, maxPrice, categories, colors } = otherProps;
  const { filterSidebar } = useSelector((state) => state.shopFilter);
  const dispatch = useDispatch();

  return (
    <>
      <div
        className={`tp-filter-offcanvas-area ${
          filterSidebar ? "offcanvas-opened" : ""
        }`}
      >
        <div className="tp-filter-offcanvas-wrapper">
          <div className="tp-filter-offcanvas-close">
            <button
              type="button"
              onClick={() => dispatch(handleFilterSidebarClose())}
              className="tp-filter-offcanvas-close-btn filter-close-btn"
            >
              <i className="fa-solid fa-xmark"></i>
              {" "}Close
            </button>
          </div>
          <div className="tp-shop-sidebar">
            <PriceFilter
              priceFilterValues={priceFilterValues}
              maxPrice={maxPrice}
            />
            <StatusFilter setCurrPage={setCurrPage} />
            <CategoryFilter setCurrPage={setCurrPage} categories={categories} />
            <ColorFilter setCurrPage={setCurrPage} colors={colors} />
            <TopRatedProducts />
            <ProductBrand setCurrPage={setCurrPage} />
            <ResetButton />
          </div>
        </div>
      </div>
      
      {/* overlay */}
      <div
        onClick={() => dispatch(handleFilterSidebarClose())}
        className={`body-overlay ${filterSidebar ? "opened" : ""}`}
      ></div>
    </>
  );
};

export default ShopFilterOffCanvas;