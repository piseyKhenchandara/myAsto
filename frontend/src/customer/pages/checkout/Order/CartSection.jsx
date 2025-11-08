import CartItems from "../CartItems";


const CartSection = ({ cart, getCartCount, removeFromCart, decreaseFromCart, increaseFromCart }) => (
  <div className="w-full md:top-20  md:sticky">
    <CartItems
      cart={cart}
      getCartCount={getCartCount}
      removeFromCart={removeFromCart}
      decreaseFromCart={decreaseFromCart}
      increaseFromCart={increaseFromCart}
    />
  </div>
);

export default CartSection;
