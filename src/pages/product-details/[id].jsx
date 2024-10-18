// src/pages/product-details/[id].jsx
import React from 'react';
// internal
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductQuery } from '@/redux/features/productApi';
import ProductDetailsBreadcrumb from '@/components/breadcrumb/product-details-breadcrumb';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import PrdDetailsLoader from '@/components/loader/prd-details-loader';

const ProductDetailsPage = ({ query }) => {
  console.log('Product ID:', query.id);

  // Fetch product data using the query hook
  const { data: product, isLoading, isError, error } = useGetProductQuery(query.id);
  
  // Log the loading and error states
  console.log("Loading:", isLoading);
  console.log("Error:", isError);
  console.log("Received product:", product); // Log the received product

  // Decide what to render based on the loading and error states
  let content;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading} />;
  } else if (isError) {
    console.error('Error fetching product:', error);
    content = <ErrorMsg msg="Product not found." />;
  } else if (product) {
    content = (
      <>
        <ProductDetailsBreadcrumb category={product.productType} title={product.title} />
        <ProductDetailsArea productItem={product} />
      </>
    );
  } else {
    content = <ErrorMsg msg="Product not found." />;
  }

  return (
    <Wrapper>
      <SEO pageTitle="Product Details" />
      <HeaderTwo style_2={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductDetailsPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};