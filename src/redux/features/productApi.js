import { apiSlice } from "../api/apiSlice";
import { db, storage } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProduct: builder.query({
      async queryFn(id) {
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return { data: { ...docSnap.data(), _id: docSnap.id } };
          } else {
            return { error: "Product not found" };
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          return { error: error.message };
        }
      },
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
    }),
    getProductType: builder.query({
      async queryFn({ type, queryParam }) {
        try {
          const productsRef = collection(db, "products");
          let q = query(productsRef, where("productType", "==", type));
          
          if (queryParam) {
            q = query(q, where(queryParam, "==", true));
          }
          
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id
          }));
          return { data: products };
        } catch (error) {
          console.error("Error fetching products by type:", error);
          return { error: error.message };
        }
      },
      providesTags: ['ProductType'],
    }),
    getAllProducts: builder.query({
      async queryFn() {
        console.log('Fetching all products...');
        try {
          const querySnapshot = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"))); // Sort by createdAt
          const products = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id
          }));
          console.log('Fetched products:  jj', products);
          return { data: products };
        } catch (error) {
          console.error("Error fetching all products:", error);
          return { error: error.message };
        }
      },
      providesTags: ['Products'],
    }),
    addProduct: builder.mutation({
      async queryFn(productData) {
        try {
          const newProduct = {
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sku: uuidv4().slice(0, 8).toUpperCase(),
            sellCount: 0,
          };
          const docRef = await addDoc(collection(db, "products"), newProduct);
          return { data: { _id: docRef.id, ...newProduct } };
        } catch (error) {
          console.error("Error adding product:", error);
          return { error: error.message };
        }
      },
      invalidatesTags: ['Products'],
    }),
    editProduct: builder.mutation({
      async queryFn({ _id, productData, files }) {
        try {
          const updatedProduct = {
            ...productData,
            updatedAt: new Date().toISOString(),
          };

          // Handle image uploads if files are provided
          if (files && files.length > 0) {
            const imageUrls = await uploadImages(files);
            updatedProduct.imageURLs = imageUrls;
          }

          const docRef = doc(db, "products", _id);
          await updateDoc(docRef, updatedProduct);
          return { data: { _id, ...updatedProduct } };
        } catch (error) {
          console.error("Error updating product:", error);
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: "Product", id: arg._id }, 'Products'],
    }),
    deleteProduct: builder.mutation({
      async queryFn(_id) {
        try {
          await deleteDoc(doc(db, "products", _id));
          return { data: _id };
        } catch (error) {
          console.error("Error deleting product:", error);
          return { error: error.message };
        }
      },
      invalidatesTags: ['Products'],
    }),
    uploadImage: builder.mutation({
      async queryFn(file) {
        try {
          const storageRef = ref(storage, `product-images/${uuidv4()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          return { data: downloadURL };
        } catch (error) {
          console.error("Error uploading image:", error);
          return { error: error.message };
        }
      },
    }),
    getOfferProducts: builder.query({
      async queryFn() {
        try {
          const q = query(
            collection(db, "products"),
            where("discount", ">", 0),
            orderBy("discount", "desc"),
            limit(8)
          );
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id
          }));
          return { data: products };
        } catch (error) {
          console.error("Error fetching offer products:", error);
          return { error: error.message };
        }
      },
      providesTags: ['OfferProducts'],
    }),
    getPopularProductByType: builder.query({
      async queryFn(type) {
        try {
          const q = query(
            collection(db, "products"),
            where("productType", "==", type),
            orderBy("sellCount", "desc"),
            limit(8)
          );
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id
          }));
          return { data: products };
        } catch (error) {
          console.error("Error fetching popular products:", error);
          return { error: error.message };
        }
      },
      providesTags: ['PopularProducts'],
    }),
    getTopRatedProducts: builder.query({
      async queryFn() {
        try {
          const q = query(
            collection(db, "products"),
            orderBy("rating", "desc"),
            limit(8)
          );
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id
          }));
          return { data: products };
        } catch (error) {
          console.error("Error fetching top rated products:", error);
          return { error: error.message };
        }
      },
      providesTags: ['TopRatedProducts'],
    }),
    getRelatedProducts: builder.query({
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Fetch the product first to get its category
          const productResult = await fetchWithBQ(`/products/${id}`);
          if (productResult.error) {
            if (productResult.error.status === 404) {
              console.error(`Product with id ${id} not found`);
              return { data: [] }; // Return empty array instead of throwing error
            }
            console.error('Error fetching product:', productResult.error);
            throw new Error(`Failed to fetch product: ${productResult.error.status} ${JSON.stringify(productResult.error.data)}`);
          }
    
          const product = productResult.data;
          if (!product || !product.category) {
            console.error('Product or category not found:', product);
            return { data: [] }; // Return empty array instead of throwing error
          }
    
          // Now fetch related products using the category
          const relatedResult = await fetchWithBQ(`/products?category=${product.category.name}&_id_ne=${id}&_limit=4&sort=createdAt:desc`); // Sort by createdAt
          if (relatedResult.error) {
            console.error('Error fetching related products:', relatedResult.error);
            throw new Error(`Failed to fetch related products: ${relatedResult.error.status} ${JSON.stringify(relatedResult.error.data)}`);
          }
    
          return { data: relatedResult.data };
        } catch (error) {
          console.error('Caught error in getRelatedProducts:', error);
          return { error: { status: error.status || 500, data: error.message || 'Failed to fetch related products' } };
        }
      },
    }),
  }),
});

// Export hooks
export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useEditProductMutation, // Ensure this is included
  useDeleteProductMutation,
  useUploadImageMutation,
  useGetProductTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductByTypeQuery,
  useGetTopRatedProductsQuery,
  useGetRelatedProductsQuery,
} = productApi;