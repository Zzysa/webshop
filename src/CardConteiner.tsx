import { useContext } from "react";
import { ProductsContext, UserContext, CartContext } from "./App";
import { Link, useParams, useNavigate } from "react-router-dom";
import Card from "./Card";

function CardContainer() {
    const products = useContext(ProductsContext);
    const { user } = useContext(UserContext);
    const { inCart, changeCartState } = useContext(CartContext);
    const { categoryName } = useParams();
    const navigate = useNavigate();

    if (!products?.length) {
        return <p>Data is loading or Error</p>;
    }

    const categories = [...new Set(products.map(product => product.category))];

    const filteredProducts = categoryName 
        ? products.filter(product => product.category === categoryName) 
        : products;

    return (
        <div>
            <div className="categoryFilter">
                <button onClick={() => navigate("/")}>All</button>
                {categories.map(category => (
                    <button key={category} onClick={() => navigate(`/category/${category}`)}>
                        {category}
                    </button>
                ))}
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
