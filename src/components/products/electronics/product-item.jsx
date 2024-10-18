// src/components/products/product-item.jsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { useDispatch, useSelector } from "react-redux";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";

const ProductItem = ({ product, offer_style = false }) => {
  const { _id, img, category, title, reviews, price, discount, status } = product || {};
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [ratingVal, setRatingVal] = useState(0);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  const handleAddProduct = () => {
    dispatch(add_cart_product(product));
  };

  const handleWishlistProduct = () => {
    dispatch(add_to_wishlist(product));
  };

  return (
    <div className={`${offer_style ? "tp-product-offer-item" : "mb-25"} tp-product-item transition-3`}>
      <div className="tp-product-thumb p-relative fix">
        <Link href={`/product-details/${_id}`}>
          <Image
            src={img}
            width="0"
            height="0"
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            alt={title}
          />
          <div className="tp-product-badge">
            {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
          </div>
        </Link>
      </div>
      <div className="tp-product-content">
        <div className="tp-product-category">
          <a href="#">{category?.name}</a>
        </div>
        <h3 className="tp-product-title">
          <Link href={`/product-details/${_id}`}>{title}</Link>
        </h3>
        <div className="tp-product-rating d-flex align-items-center">
          <div className="tp-product-rating-icon">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
        </div>
        <div className="tp-product-price-wrapper">
          {discount > 0 ? (
            <>
              <span className="tp-product-price old-price">${price}</span>
              <span className="tp-product-price new-price">
                ${(Number(price) - (Number(price) * Number(discount)) / 100).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="tp-product-price new-price">${parseFloat(price).toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;