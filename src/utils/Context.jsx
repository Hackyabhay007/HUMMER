import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { productList } from '../assets/products';
import { addProductsToFirestore  , fetchProducts} from '../db/firestore';

export const Context = createContext();

export const ShoppingCartProvider = ({ children }) => {
    
    // Items
    const [items, setItems] = useState([]);
    const [products , setProducts]=useState([])
    const [selectedProduct , setSelectedProduct]=useState(null)
    const [loading , setLoading]=useState(true)

    // Open/ Close detail
    const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
    const openProductDetail = () => setIsProductDetailOpen(true);
    const closeProductDetail = () => setIsProductDetailOpen(false);

    // Open/ Close checkout side menu
    const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false);
    const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true);
    const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false);

   
    
    const [showProductDetail, setShowProductDetail] = useState({});
  
    

 

   

    // Shopping cart: My order
    const itemsOrder = localStorage.getItem('checkout');
    const resultOrders = itemsOrder ? JSON.parse(itemsOrder) : [];

    const [order, setOrder] = useState(resultOrders);
    useEffect(() => {
        localStorage.setItem('checkout', JSON.stringify(order));
    }, [order]);

    

    


    useEffect(() => {
        const fetchAndSetProducts = async () => {
          try {
            const product = await fetchProducts();
            if (product.length>0) {
              setItems(product)
              setProducts(product)
              // You can update the state or do other operations with the products here
            }
            else {
                await addProductsToFirestore()
                setItems(productList)
                setProducts(product)
            }
            setLoading(false)
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
      
        fetchAndSetProducts();
      }, []);
      
    

   

    return (
        <Context.Provider value={{
            loading,
            items,
            setItems,
            openProductDetail,
            closeProductDetail,
            isProductDetailOpen,
            showProductDetail,
            setShowProductDetail,
            openCheckoutSideMenu,
            closeCheckoutSideMenu,
            order,
            setOrder,
            products,
            selectedProduct , 
            setSelectedProduct,   
        }}>
            {children}
        </Context.Provider>
    )
}

ShoppingCartProvider.propTypes = {
    children: PropTypes.object
}