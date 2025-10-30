import CartItems from "../CartItems";


const CartSection = ({ cart, getCartCount, removeFromCart, decreaseFromCart, increaseFromCart }) => (
  <div className="lg:col-span-3">
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
