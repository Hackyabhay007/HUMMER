import React from 'react';
import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';

const ReviewItem = ({ review }) => {
  const { userId, rating, review: userReview, createdAt } = review || {};

  return (
    <div className="tp-product-details-review-item d-flex mb-30">
      <div className="tp-product-details-review-avater d-flex align-items-start">
        <div className="tp-product-details-review-avater-thumb">
          {!userId?.imageURL && userId?.name && (
            <h5 className="review-name">{userId.name[0]}</h5>
          )}
          <a href="#">
            {userId?.imageURL && (
              <Image src={userId.imageURL} alt="user img" width={60} height={60} />
            )}
          </a>
        </div>
        <div className="tp-product-details-review-avater-info">
          <h4 className="tp-product-details-review-avater-title">{userId?.name || 'Anonymous'}</h4>
          <span className="tp-product-details-review-avater-meta">{createdAt}</span>

          <div className="tp-product-details-review-rating">
            <Rating initialValue={rating} readonly size={16} />
          </div>
        </div>
      </div>
      <div className="tp-product-details-review-content">
        <p>{userReview}</p>
      </div>
    </div>
  );
};

export default ReviewItem;