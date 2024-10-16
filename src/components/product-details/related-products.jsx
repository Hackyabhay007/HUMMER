import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import { useGetRelatedProductsQuery } from "@/redux/features/productApi";
import ProductItem from "../products/beauty/product-item";
import ErrorMsg from "../common/error-msg";
import { HomeNewArrivalPrdLoader } from "../loader";

const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".tp-related-slider-button-next",
    prevEl: ".tp-related-slider-button-prev",
  },
  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    1200: { slidesPerView: 4 },
    992: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    576: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  },
};


const RelatedProducts = ({ id }) => {
  console.log('RelatedProducts id:', id); // Log the id prop

  const { data: products, isError, error, isLoading } = useGetRelatedProductsQuery(id);

  useEffect(() => {
    console.log("Related products query result:", { products, isError, error, isLoading });
  }, [products, isError, error, isLoading]);

  let content = null;

  if (isLoading) {
    content = <HomeNewArrivalPrdLoader loading={isLoading} />;
  } else if (isError) {
    console.error("Error fetching related products:", error);
    content = <ErrorMsg msg={`Error: ${error?.data || error?.error || 'Unknown error'}`} />;
  } else if (!products || products.length === 0) {
    content = <ErrorMsg msg="No related products found" />;
  } else {
    content = (
      <Swiper
        {...slider_setting}
        modules={[Autoplay, Navigation]}
        className="tp-product-related-slider-active swiper-container mb-10"
      >
        {products.map((item) => (
          <SwiperSlide key={item._id}>
            <ProductItem product={item} primary_style={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <div className="tp-product-related-slider">
      {content}
    </div>
  );
};

export default RelatedProducts;