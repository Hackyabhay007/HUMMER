import React, { useEffect, useState, useCallback } from "react";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import { ShapeLine } from "@/svg";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import HomePrdLoader from "@/components/loader/home/home-prd-loader";
import { fetchProducts } from "../../../db/firestore";

const tabs = ["new", "featured", "topSellers"];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [localProducts, setLocalProducts] = useState([]);
  const { data: products, isError, isLoading, refetch } = useGetProductTypeQuery({
    type: 'electronics',
    queryParam: activeTab
  });

  const handleActiveTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    console.log("Active Tab:", activeTab);
    refetch();
  }, [activeTab, refetch]);

  useEffect(() => {
    console.log("Products from API:", products);
    if (products?.data) {
      setLocalProducts(products.data);
    }
  }, [products]);

  useEffect(() => {
    const getProductsFromFirestore = async () => {
      try {
        const firestoreProducts = await fetchProducts();
        console.log("Products from Firestore:", firestoreProducts);
        if (firestoreProducts.length > 0 && localProducts.length === 0) {
          setLocalProducts(firestoreProducts);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore:", error);
      }
    };

    getProductsFromFirestore();
  }, [localProducts.length]);

  let content = null;

  if (isLoading) {
    content = <HomePrdLoader loading={isLoading} />;
  } else if (isError) {
    console.error("Error fetching products:", isError);
    content = <ErrorMsg msg="There was an error fetching products" />;
  } else if (localProducts.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  } else {
    content = localProducts.map((prd, i) => (
      <div key={i} className="col-xl-3 col-lg-3 col-sm-6">
        <ProductItem product={prd} />
      </div>
    ));
  }

  return (
    <section className="tp-product-area pb-55">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-xl-5 col-lg-6 col-md-5">
            <div className="tp-section-title-wrapper mb-40">
              <h3 className="tp-section-title">
                Trending Products
                <ShapeLine />
              </h3>
            </div>
          </div>
          <div className="col-xl-7 col-lg-6 col-md-7">
            <div className="tp-product-tab mb-40 text-sm-end">
              <nav>
                <div className="nav nav-tabs justify-content-sm-end" id="nav-tab" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleActiveTab(tab)}
                      className={`nav-link ${activeTab === tab ? "active" : ""}`}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="row">
          {content}
        </div>
      </div>
    </section>
  );
};

export default ProductArea;