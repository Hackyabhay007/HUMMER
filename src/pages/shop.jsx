import React, { useState, useEffect } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ProductItem from "@/components/products/fashion/product-item"; // Adjust the import based on your structure
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopLoader from "@/components/loader/shop/shop-loader";
import Pagination from "@/ui/Pagination"; // Ensure you have a Pagination component
import CategoryFilter from "@/components/shop/shop-filter/category-filter"; // Adjust the import based on your structure

const ShopPage = ({ query }) => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("Default Sorting");
  const [currPage, setCurrPage] = useState(1);
  const [itemsPerPage] = useState(6); // Number of items per page


  console.log('products:', products);
  

  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPrice = products.data.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, products]);

  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // Filter and sort products
  let filteredProducts = products?.data || [];
  
  if (selectValue === "Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectValue === "High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Pagination logic
  const indexOfLastItem = currPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);


  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (filteredProducts.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  } else {
    content = (
      <div className="tp-shop-items-wrapper tp-shop-item-primary">
        <div className="row">
          {products.map((item) => (
            <div key={item._id} className="col-xl-4 col-md-6 col-sm-6">
              <ProductItem product={item} />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currPage}
          totalPages={totalPages}
          onPageChange={setCurrPage}
        />
      </div>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop" subtitle="Shop" />
      <div className="shop-filter">
        <CategoryFilter onFilterChange={selectHandleFilter} />
        {/* Add more filters as needed */}
      </div>
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;