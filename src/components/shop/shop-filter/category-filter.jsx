import React from 'react';
import { useRouter } from 'next/router';

const CategoryFilter = ({ onFilterChange, setCurrPage }) => {
  const router = useRouter();

  // handle category route
  const handleCategoryRoute = (title) => {
    setCurrPage(1); // Reset to the first page when a category is selected
    router.push(
      `/${shop_right ? 'shop-right-sidebar' : 'shop'}?category=${title.toLowerCase()}`
    );
  };

  return (
    <div className="category-filter">
      {/* Render your category filter UI here */}
      <h3>Categories</h3>
      <ul>
        <li onClick={() => handleCategoryRoute('Category1')}>Category 1</li>
        <li onClick={() => handleCategoryRoute('Category2')}>Category 2</li>
        <li onClick={() => handleCategoryRoute('Category3')}>Category 3</li>
        {/* Add more categories as needed */}
      </ul>
    </div>
  );
};

export default CategoryFilter;