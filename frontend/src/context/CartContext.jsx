import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext();

export const CartProvider= ({children}) => {


  const [cart, setCart] = useState(() => {
    
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  })

  useEffect(() =>{
    localStorage.setItem('cart', JSON.stringify(cart));
  },[cart]);


  const addToCart = (product) => {
    setCart(pre => {

        const existing = pre.find((p,idx) => p.id === product.id );

        if(existing) {

            return pre.map((p,idx) => p.id === product.id ? {...p, quantity : p.quantity + 1} : p);
        }
        else{
            return [...pre , {...product, quantity : 1}]
        }
    })
  }

   const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseFromCart = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartCount = () => {
    return cart.reduce((total,item) => total + item.quantity, 0);
  }


  return (
    <CartContext.Provider value={{cart,addToCart,removeFromCart,increaseFromCart,decreaseFromCart,getCartCount}}>
      {children}
    </CartContext.Provider>
  )
}   

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

