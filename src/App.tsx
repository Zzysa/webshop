import Header from './Header.tsx'
import Footer from './Footer.tsx'
import Profile from './Profile.tsx';
import Cart from './Cart.tsx';
import ProductDetails from './ProductDetails.tsx';
import CardContainer from './CardConteiner.tsx';
import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './LoginUser.tsx';
import SigninUser from './SigninUser.tsx';
import SuccessPage from './SuccessPage'; 
import CancelPage from './CancelPage.tsx';

export const CartContext = createContext<{
        inCart: Product[];
        changeCartState: (productId: number) => void;
        clearCart: () => void;  
    }>({
        inCart: [],
        changeCartState: () => { },
        clearCart: () => {},
    });

export interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
    description: string;
    category: string;
}

export const ProductsContext = createContext<Product[]|null>(null)

export interface User {
    id: number;
    role: string;
    name: string;
    surname: string;
    email: string;
    password: string;
}

export const UserContext = createContext<{
        user: User | null;
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
    }>({
        user: null,
        setUser: () => {}
    });

function App() {
    const [products, setProducts] = useState<Product[] | null>(null)
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.id || "guest";  
    const localStorageKey = `cart_${userId}`; 
    const [inCart, setInCart] = useState<Product[]>(() => {
        const savedCart = localStorage.getItem(localStorageKey);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    function clearCart() {
        setInCart([]); 
        localStorage.setItem(localStorageKey, JSON.stringify([]));
    };

    useEffect(() => {
        const savedCart = localStorage.getItem(localStorageKey);
        setInCart(savedCart ? JSON.parse(savedCart) : []);
    }, [userId]);  

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(inCart));
    }, [inCart, userId]);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(json => setProducts(json))
            .catch((err) => console.error('Error while loading products: ', err));
    }, [])

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); 
        }
    }, [user]);

     function changeCartState(productId: number) {
        setInCart((prevCart) => {
            const exists = prevCart.some((p) => p.id === productId);
            if (exists) {
                return prevCart.filter((p) => p.id !== productId);
            } else {
                const product = products?.find((p) => p.id === productId);
                return product ? [...prevCart, product] : prevCart;
            }
        });
    }

    return (
        <Router>
            <UserContext.Provider value={{ user, setUser }}>
                <ProductsContext.Provider value={products}>
                    <CartContext.Provider value={{ inCart, changeCartState, clearCart }}>
                        <Header />
                        <Routes>
                            <Route path="/" element={<CardContainer />}></Route>
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/signin" element={<SigninUser />} />
                            <Route path="/success" element={<SuccessPage />} />
                            <Route path="/cancel" element={<CancelPage />} />
                            <Route path="/category/:categoryName" element={<CardContainer />} />
                        </Routes>
                        <Footer />
                    </CartContext.Provider>
                </ProductsContext.Provider>
            </UserContext.Provider>
        </Router>
    );
    
}

export default App