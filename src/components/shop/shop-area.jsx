import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Pagination from "@/ui/Pagination";
import ProductItem from "../products/fashion/product-item";
import ShopListItem from "./shop-list-item";
import ShopTopLeft from "./shop-top-left";
import ShopTopRight from "./shop-top-right";

import { handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";
import ShopFilterOffCanvas from "../common/shop-filter-offcanvas";

const ShopArea = ({ all_products, products, otherProps }) => {
  const dispatch = useDispatch();
  const { priceFilterValues, selectHandleFilter, currPage, setCurrPage } = otherProps;
  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setFilteredRows(products);
  }, [products]);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  if (!all_products || !products) {
    return <div>Loading...</div>;
  }

  return (
    <section className="tp-shop-area pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-shop-main-wrapper">
              <div className="tp-shop-top mb-45">
                <div className="row">
                  <div className="col-xl-6">
                    <ShopTopLeft
                      showing={
                        products.length === 0
                          ? 0
                          : filteredRows.slice(
                              pageStart,
                              pageStart + countOfPage
                            ).length
                      }
                      total={all_products.length}
                    />
                  </div>
                  <div className="col-xl-6">
                    <ShopTopRight 
                      selectHandleFilter={selectHandleFilter}
                      setViewMode={setViewMode}
                      openFilterSidebar={() => dispatch(handleFilterSidebarOpen())}
                    />
                  </div>
                </div>
              </div>
              {products.length === 0 && <h2>No products found</h2>}
              {products.length > 0 && (
                <div className="tp-shop-items-wrapper tp-shop-item-primary">
                  <div className="tab-content" id="productTabContent">
                    <div
                      className={`tab-pane fade ${viewMode === 'grid' ? 'show active' : ''}`}
                      id="grid-tab-pane"
                      role="tabpanel"
                      aria-labelledby="grid-tab"
                      tabIndex="0"
                    >
                      <div className="row">
                        {filteredRows
                          .slice(pageStart, pageStart + countOfPage)
                          .map((item) => (
                            <div
                              key={item._id}
                              className="col-xl-4 col-md-6 col-sm-6"
                            >
                              <ProductItem product={item} />
                            </div>
                          ))}
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${viewMode === 'list' ? 'show active' : ''}`}
                      id="list-tab-pane"
                      role="tabpanel"
                      aria-labelledby="list-tab"
                      tabIndex="0"
                    >
                      <div className="tp-shop-list-wrapper tp-shop-item-primary mb-70">
                        <div className="row">
                          <div className="col-xl-12">
                            {filteredRows
                              .slice(pageStart, pageStart + countOfPage)
                              .map((item) => (
                                <ShopListItem key={item._id} product={item} />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {products.length > 0 && (
                <div className="tp-shop-pagination mt-20">
                  <div className="tp-pagination">
                    <Pagination
                      items={products}
                      countOfPage={12}
                      paginatedData={paginatedData}
                      currPage={currPage}
                      setCurrPage={setCurrPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ShopFilterOffCanvas
        all_products={all_products}
        otherProps={{ priceFilterValues, setCurrPage, maxPrice }}
      />
    </section>
  );
};

export default ShopArea;