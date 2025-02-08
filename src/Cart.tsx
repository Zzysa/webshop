import { useContext, useReducer, useEffect, useMemo } from "react";
import { CartContext, UserContext } from "./App";
import Card from "./Card";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QouQdQBXEQG3ZUcArFC4Rz5m0lHcdn8jsRlURR3v5ZttzY0C4Izvq6uTjE2MiUqSf3BTc651Rtknz5JJScBttsu00aBdKWyCt');

function Cart() {
  const { inCart, changeCartState, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext)
  const [cart, dispatch] = useReducer(cartReducer, {}, () => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  function cartReducer(state: Record<number, number>, action: { type: 'INCREMENT' | 'DECREMENT'; id_product: number }) {
    const { type, id_product } = action;

    if (type === 'INCREMENT') {
      return { ...state, [id_product]: (state[id_product] || 1) + 1 };
    }

    if (type === 'DECREMENT') {
      return { ...state, [id_product]: Math.max((state[id_product] || 1) - 1, 1) };
    }

    return state;
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const sumOfProducts = useMemo(() => {
    return inCart.reduce((sum, product) => {
      return sum + Number(product.price) * (cart[product.id] || 1);
    }, 0);
  }, [inCart, cart]);

  const navigate = useNavigate();

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:3000/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: sumOfProducts * 100,
      }),
    });

    const paymentIntentData = await response.json();

    const result = await stripe?.redirectToCheckout({
      sessionId: paymentIntentData.id,
    });

    if (result?.error) {
      console.error(result.error.message);
    } else {
        clearCart();
        await fetch("http://localhost:3000/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          message: `Your payment of ${sumOfProducts} $ was successful!`,
        }),
      });

      navigate("/cart");
    }
  };

  return (
    <>
      <h2>Cart</h2>
      <div className="cardsContainer">
        {inCart.length > 0 ? (
          inCart.map((product) => (
            <div key={product.id} className="cardContainer">
              <Link to={`/product/${product.id}`}>
                <Card 
                  title={product.title}
                  image={product.image}
                  price={product.price + " $"}
                  description={product.description}
                  category={product.category}
                />
              </Link>
              <div>
                <button onClick={() => changeCartState(product.id)}>Remove</button>
              </div>
              <div>
                <button className="oddProductInCartButton" onClick={() => dispatch({ type: 'DECREMENT', id_product: product.id })}>-</button>
                <span>{cart[product.id] || 1}</span>
                <button className="addProductInCartButton" onClick={() => dispatch({ type: 'INCREMENT', id_product: product.id })}>+</button>
              </div>
            </div>
          ))
        ) : (
          <p>Cart is empty</p>
        )}
      </div>
      <div id="buyProductsContainer">
        <p>Total cost of products: <span>{sumOfProducts} $</span></p>
        <button onClick={handleCheckout}>Buy</button>
      </div>
    </>
  );
}

export default Cart;