import React from 'react';
// internal
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductQuery } from '@/redux/features/productApi';
import { additionalProduct } from '@/redux/features/additionalProduct';
import ProductDetailsBreadcrumb from '@/components/breadcrumb/product-details-breadcrumb';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import PrdDetailsLoader from '@/components/loader/prd-details-loader';

const ProductDetailsPage = ({ query }) => {
  // Log the query to ensure it contains the correct ID
  console.log('Product ID:', query.id);

  const { data: product, isLoading, isError, error } = useGetProductQuery(query.id);

  // If there's an error, fallback to the additionalProduct if it matches the query ID
  let finalProduct = product;
  if (isError) {
    console.error('Error fetching product:', error);
    if (additionalProduct._id === query.id) {
      console.log('Falling back to additionalProduct');
      finalProduct = additionalProduct;
    }
  }

  // Decide what to render
  let content = null;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading} />;
  } else if (finalProduct) {
    content = (
      <>
        <ProductDetailsBreadcrumb category={finalProduct.category.name} title={finalProduct.title} />
        <ProductDetailsArea productItem={finalProduct} />
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
