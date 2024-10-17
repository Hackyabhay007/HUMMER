import React, { useState, useEffect } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";

const ShopPage = ({ query }) => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("New Added");
  const [currPage, setCurrPage] = useState(1);
  const [categories, setCategories] = useState([]);

  // Load the maximum price and categories once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && products?.length > 0) {
      const maxPrice = products.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);

      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(p => p.parent).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [isLoading, isError, products]);

  // Handle price changes
  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  // Handle filter selection
  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // Other props for child components
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
    categories,
  };

  // Helper function to normalize strings for comparison
  const normalizeString = (str) => {
    return (str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  };

  // Decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  } else if (isError) {
    content = <div className="pb-80 text-center"><ErrorMsg msg="There was an error" /></div>;
  } else if (!products?.length) {
    content = <ErrorMsg msg="No Products found!" />;
  } else {
    // Filter and sort products
    let product_items = products;

    // Sorting logic (default to New Added)
    if (selectValue === "Low to High") {
      product_items = product_items.slice().sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectValue === "High to Low") {
      product_items = product_items.slice().sort((a, b) => Number(b.price) - Number(a.price));
    } else if (selectValue === "New Added" || selectValue === "Default Sorting") {
      product_items = product_items.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (selectValue === "On Sale") {
      product_items = product_items.filter((p) => p.discount > 0);
    }

    // Price filter
    product_items = product_items.filter(
      (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
    );

    // Additional filters based on query parameters
    if (query.status) {
      if (query.status === "on-sale") {
        product_items = product_items.filter((p) => p.discount > 0);
      } else if (query.status === "in-stock") {
        product_items = product_items.filter((p) => p.status === "in-stock");
      }
    }

    if (query.category) {
      const normalizedQueryCategory = normalizeString(query.category);
      product_items = product_items.filter(
        (p) => normalizeString(p.parent) === normalizedQueryCategory
      );
    }

    if (query.subCategory) {
      const normalizedQuerySubCategory = normalizeString(query.subCategory);
      product_items = product_items.filter(
        (p) => normalizeString(p.children) === normalizedQuerySubCategory
      );
    }

    if (query.color) {
      const normalizedQueryColor = normalizeString(query.color);
      product_items = product_items.filter((product) => {
        return product.imageURLs.some(image => 
          normalizeString(image.color?.name) === normalizedQueryColor
        );
      });
    }

    if (query.brand) {
      const normalizedQueryBrand = normalizeString(query.brand);
      product_items = product_items.filter(
        (p) => normalizeString(p.brand.name) === normalizedQueryBrand
      );
    }

    // Render the products and filters
    content = (
      <>
        <ShopArea
          all_products={products}
          products={product_items}
          otherProps={otherProps}
        />
        {/* <ShopFilterOffCanvas
          all_products={products}
          otherProps={otherProps}
        /> */}
      </>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};