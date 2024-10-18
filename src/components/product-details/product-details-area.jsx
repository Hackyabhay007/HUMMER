import React, { useState, useEffect } from "react";
import DetailsThumbWrapper from "./details-thumb-wrapper";
import DetailsWrapper from "./details-wrapper";
import { useDispatch } from "react-redux";
import DetailsTabNav from "./details-tab-nav";
import RelatedProducts from "./related-products";

const ProductDetailsArea = ({ productItem }) => {
  const [activeImg, setActiveImg] = useState(productItem?.img);
  const dispatch = useDispatch();

  useEffect(() => {
    setActiveImg(productItem?.img);
  }, [productItem]);

  // handle image active
  const handleImageActive = (image) => { // Renamed parameter to 'image'
    const newImg = new Image(); // Renamed variable to 'newImg'
    newImg.src = image; // Use the renamed parameter
  
    newImg.onload = () => {
      setActiveImg(newImg.src); // Set the active image to the source of the loaded image
    };
  
    newImg.onerror = () => {
      // Set a default image or handle the error
      setActiveImg("path/to/default/image.jpg"); // Replace with your default image path
    };
  };
  return (
    <>
      <section className="tp-product-details-area">
        <div className="tp-product-details-top pb-115">
          <div className="container">
            <div className="row">
              <div className="col-xl-7 col-lg-6">
                {/* product-details-thumb-wrapper start */}
                <DetailsThumbWrapper
                  activeImg={activeImg}
                  handleImageActive={handleImageActive}
                  imageURLs={productItem?.imageURLs}
                />
                {/* product-details-thumb-wrapper end */}
              </div>
              <div className="col-xl-5 col-lg-6">
                {/* product-details-wrapper start */}
                <DetailsWrapper
                  productItem={productItem}
                  handleImageActive={handleImageActive}
                  activeImg={activeImg}
                />
                {/* product-details-wrapper end */}
              </div>
            </div>
          </div>
        </div>

        {/* product details description */}
        <DetailsTabNav product={productItem} />

        {/* related products start */}
        {/* <RelatedProducts /> */}
        {/* related products end */}
      </section>
    </>
  );
};

export default ProductDetailsArea;