// CartContext.jsx
import React, { createContext, useContext, useState } from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const formatNumber = (number) => {
        return number.toLocaleString('es-CL');
    };

    const rawTotalPrice = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
    const totalPrice = formatNumber(rawTotalPrice);

    const addToCart = (item) => {
        const exists = cartItems.find(cartItem => cartItem.id_publicacion === item.id_publicacion);
        if (exists) {
            const updatedCartItems = cartItems.map(cartItem =>
                cartItem.id_publicacion === item.id_publicacion ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
            setCartItems(updatedCartItems);
            Swal.fire({
                icon: 'success',
                title: '¡Juego Añadido al carrito!',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
            Swal.fire({
                icon: 'success',
                title: '¡Juego Añadido al carrito!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const removeFromCart = (itemId) => {
        const exists = cartItems.find(cartItem => cartItem.id_publicacion === itemId);
        if (exists && exists.quantity > 1) {
            const updatedCartItems = cartItems.map(cartItem =>
                cartItem.id_publicacion === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
            );
            setCartItems(updatedCartItems);
        } else {
            setCartItems(cartItems.filter(item => item.id_publicacion !== itemId));
        }
        Swal.fire({
            icon: 'success',
            title: '¡Juego eliminado del carrito!',
            showConfirmButton: false,
            timer: 1500
        });
    };

    // función para vaciar el carrito
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice, formatNumber }}>
            {children}
        </CartContext.Provider>
    );
};
