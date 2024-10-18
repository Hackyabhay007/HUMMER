// src/components/products/electronics/product-area.jsx
import React, { useEffect, useState } from "react";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import HomePrdLoader from "@/components/loader/home/home-prd-loader";
import { fetchProducts } from "../../../db/firestore";
import { ShapeLine } from "@/svg"; // Ensure ShapeLine is imported

const ProductArea = () => {
  const [localProducts, setLocalProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getProductsFromFirestore = async () => {
      try {
        const firestoreProducts = await fetchProducts();
        console.log("Products from Firestore:", firestoreProducts);
        if (firestoreProducts.length > 0) {
          // Sort firestoreProducts by updatedAt in descending order
          const sortedFirestoreProducts = firestoreProducts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setLocalProducts(sortedFirestoreProducts);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getProductsFromFirestore();
  }, []);

  let content = null;

  if (isLoading) {
    content = <HomePrdLoader loading={isLoading} />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error fetching products" />;
  } else if (localProducts.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  } else {
    content = localProducts.map((prd, i) => (
      <div key={i} className="col-6 col-sm-4 col-md-3 mb-4">
        <ProductItem product={prd} />
      </div>
    ));
  }

  return (
    <section className="tp-product-area pb-55">
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="tp-section-title-wrapper">
              <h3 className="tp-section-title">
                Trending Products
                <ShapeLine />
              </h3>
            </div>
          </div>
          <div className="col-12">
            <div className="row">
              {content}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductArea;