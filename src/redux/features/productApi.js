import { apiSlice } from "../api/apiSlice";
import { additionalProduct } from './additionalProduct'; // Adjust the path accordingly

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: (id) => `https://shofy-backend.vercel.app/api/product/single-product/${id}`,
      transformResponse: (response, meta, arg) => {
        // Check for a valid response or an invalid ID error
        if (response?.status === 400 && response.data?.message === 'Cast Error') {
          console.log(`Invalid ID provided, returning local product: ${arg}`);
          return additionalProduct;
        }
        return response;
      },
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
    }),
    getAllProducts: builder.query({
      query: () => `https://shofy-backend.vercel.app/api/product/all`,
      providesTags: ['Products'],
      transformResponse: (response) => {
        const productArray = response.data || [];
        if (Array.isArray(productArray)) {
          return {
            ...response,
            data: [additionalProduct, ...productArray]
          };
        }
        return response;
      },
    }),
    getProductType: builder.query({
      query: ({ type, query }) => `https://shofy-backend.vercel.app/api/product/${type}?${query}`,
      providesTags: ['ProductType'],
      transformResponse: (response) => {
        const productArray = response.data || [];
        if (Array.isArray(productArray)) {
          return {
            ...response,
            data: [additionalProduct, ...productArray]
          };
        }
        return response;
      },
    }),
    getOfferProducts: builder.query({
      query: (type) => `https://shofy-backend.vercel.app/api/product/offer?type=${type}`,
      providesTags: ['OfferProducts'],
      transformResponse: (response) => {
        const productArray = response.data || [];
        if (Array.isArray(productArray)) {
          return {
            ...response,
            data: [additionalProduct, ...productArray]
          };
        }
        return response;
      },
    }),
    getPopularProductByType: builder.query({
      query: (type) => `https://shofy-backend.vercel.app/api/product/popular/${type}`,
      providesTags: ['PopularProducts'],
      transformResponse: (response) => {
        const productArray = response.data || [];
        if (Array.isArray(productArray)) {
          return {
            ...response,
            data: [additionalProduct, ...productArray]
          };
        }
        return response;
      },
    }),
    getTopRatedProducts: builder.query({
      query: () => `https://shofy-backend.vercel.app/api/product/top-rated`,
      providesTags: ['TopRatedProducts'],
      transformResponse: (response) => {
        const productArray = response.data || [];
        if (Array.isArray(productArray)) {
          return {
            ...response,
            data: [additionalProduct, ...productArray]
          };
        }
        return response;
      },
    }),
    getRelatedProducts: builder.query({
      query: (id) => `https://shofy-backend.vercel.app/api/product/related-product/${id}`,
      providesTags: (result, error, arg) => [{ type: "RelatedProducts", id: arg }],
      transformResponse: (response) => {
        const productArray = response.data || [];
        if (Array.isArray(productArray)) {
          return {
            ...response,
            data: [additionalProduct, ...productArray]
          };
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductByTypeQuery,
  useGetTopRatedProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
} = productApi;
