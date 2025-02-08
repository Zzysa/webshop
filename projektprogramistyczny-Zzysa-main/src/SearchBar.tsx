import { useCallback, useContext, useState, useEffect, useRef } from "react";
import { ProductsContext } from "./App";
import { Product } from "./App";
import { Link } from "react-router-dom";

function SearchBar() {
    const products = useContext(ProductsContext)

    const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    function handleBlur() {
        setTimeout(() => {
            setIsFocused(false);
        }, 200);
    }

    function handleFocus() {
        setIsFocused(true)
    }

    const findProduct = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value; 

        if (products) {
            const filtered = products.filter((product) => 
                product.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered); 
        } else {
            setFilteredProducts(null);  
        }
    }, [products])

    return (
        <div>
            <input 
                ref={searchInputRef}
                className="searchBar" 
                type="text" placeholder="Search.." 
                onChange={findProduct}
                onFocus={handleFocus} 
                onBlur={handleBlur}
            />

        
            {filteredProducts && filteredProducts.length > 0 && isFocused ? 
                <div id="searchBarResults">
                    {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                        <div className="searchBarProductContainer">
                            <p  className="searchBarProductTitle">{product.title}</p>
                        </div>
                    </Link>
                    ))}
                </div>
                : null
            }
        </div>
    );
}

export default SearchBar