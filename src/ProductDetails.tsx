import { useParams } from "react-router-dom";
import { ProductsContext } from "./App";
import { useContext } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";

function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const products = useContext(ProductsContext);

    if (!id) {
        return <div>Error: Product ID is missing</div>;
    }

    const product = products?.find((p) => p.id === parseInt(id));

    if (!product) {
        return <div>Error: Product not found</div>;
    }

    const recommendedProducts = products?.filter(
        (p) => p.category === product.category && p.id !== product.id
    );

    return (
        <>
            <div className="productDescriptionContainer">
                <Card 
                    key={product.id}
                    title={product.title}
                    image={product.image}
                    price={product.price + " $"}
                    description={product.description}
                    category={product.category}
                />
                 <div className="productInformation">
                    <p><strong>Title:</strong> {product.title}</p>
                    <p><strong>Price:</strong> {product.price} $</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                </div>
            </div>

            {recommendedProducts && recommendedProducts.length > 0 && (
                <div className="recommendedProducts">
                    <h3>Recommended Products</h3>
                    <div className="cardsContainer">
                        {recommendedProducts.map((recommendedProduct) => (
                            <div key={recommendedProduct.id} className="cardContainer">
                                <Link to={`/product/${recommendedProduct.id}`}>
                                    <Card 
                                    title={recommendedProduct.title}
                                    image={recommendedProduct.image}
                                    price={recommendedProduct.price + " $"}
                                    description={recommendedProduct.description}
                                    category={recommendedProduct.category}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetails;
