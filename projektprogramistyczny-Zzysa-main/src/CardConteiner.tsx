import { useContext, useState } from "react";
import { ProductsContext, UserContext, CartContext } from "./App";
import { Link, useParams, useNavigate } from "react-router-dom";
import Card from "./Card";

function CardContainer() {
    const products = useContext(ProductsContext);
    const { user } = useContext(UserContext);
    const { inCart, changeCartState } = useContext(CartContext);
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!products?.length) {
        return <p>Data is loading or Error</p>;
    }

    const categories = [...new Set(products.map(product => product.category))];

    const filteredProducts = categoryName 
        ? products.filter(product => product.category === categoryName) 
        : products;

    const handleCategorySelect = (category: string) => {
        navigate(`/category/${category}`);
        setIsDropdownOpen(false); 
    };

    return (
        <div>
            <div className="categoryDropdown">
                <button 
                    className="dropdownButton"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {categoryName || "All Categories"} 
                </button>
                {isDropdownOpen && (
                    <div className="dropdownContent">
                        <button onClick={() => navigate("/")}>All</button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategorySelect(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {categoryName && <h2>Category: {categoryName}</h2>}

            <div className="cardsContainer">
                {filteredProducts.map(product => {
                    const isInCart = inCart.some(p => p.id === product.id);
                    return (
                        <div className="cardContainer" key={product.id}>
                            <Link to={`/product/${product.id}`}>
                                <Card 
                                    title={product.title}
                                    image={product.image}
                                    price={product.price + " $"}
                                    description={product.description}
                                    category={product.category}
                                />
                            </Link>
                            {user && (
                                isInCart ? 
                                    (<button className="buyButtonIsClicked" onClick={() => changeCartState(product.id)}>In cart</button>)
                                    : (<button className="buyButtonIsNotClicked" onClick={() => changeCartState(product.id)}>Buy</button>)
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CardContainer;