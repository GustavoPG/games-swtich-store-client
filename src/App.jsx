// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import DetalleJuego from "./views/DetalleJuego";
import Carrito from "./views/Carrito";
import AddGame from './views/AddGame';
import Register from './views/Register';
import Login from './views/Login';
import Profile from './views/Profile';
import ManageUsers from './views/ManageUsers';
import ManageGames from './views/ManageGames';
import { CartProvider } from './context/CartContext';
import EditGame from './views/EditGame';
import Gracias from './views/Gracias';
import Swal from 'sweetalert2';

export default function App() {
    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Configurar el interceptor de Axios
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Si el token ha expirado o es inválido, redirige al login
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        // Verificar si hay un usuario logueado en localStorage
        const storedUser = JSON.parse(localStorage.getItem('loggedUser'));
        if (storedUser) {
            setUser(storedUser);
            setWishlist(storedUser.wishlist || []);
        }

        // Limpiar el interceptor al desmontar el componente
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    const handleLogin = (userData) => {
        setUser(userData);
        setWishlist(userData.wishlist || []);
        localStorage.setItem('loggedUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        // Eliminar el token y los datos del usuario del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('loggedUser');

        // Limpiar el estado del usuario y la lista de deseos
        setUser(null);
        setWishlist([]);

        // Redirigir al usuario a la página de inicio de sesión
        navigate('/login');
    };

    const handleAddToWishlist = (game) => {
        if (!wishlist.find(item => item.id_juego === game.id_juego)) {
            const updatedWishlist = [...wishlist, game];
            setWishlist(updatedWishlist);

            // Actualizar el usuario en localStorage
            const updatedUser = { ...user, wishlist: updatedWishlist };
            setUser(updatedUser);
            localStorage.setItem('loggedUser', JSON.stringify(updatedUser));

            // Si estás usando una API real, quita esta parte o ajusta la URL
            fetch('/usuarios.json')
                .then(response => response.json())
                .then(data => {
                    const userIndex = data.findIndex(u => u.id_usuario === user.id_usuario);
                    if (userIndex !== -1) {
                        data[userIndex].wishlist = updatedWishlist;
                        return fetch('/usuarios.json', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                    }
                })
                .catch(error => console.error('Error al actualizar usuarios.json:', error));
        } else {
            // Mostrar alerta si el juego ya está en la lista de deseos
            Swal.fire({
                icon: 'warning',
                title: 'El juego ya está en tu lista de deseos.',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <CartProvider>
            <div className="App">
                <Navbar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Home user={user} onAddToWishlist={handleAddToWishlist} />} />
                    <Route path="/detallejuego/:id_juego" element={<DetalleJuego user={user} onAddToWishlist={handleAddToWishlist} />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/gracias" element={<Gracias />} />
                    <Route path="/agregar-juego" element={user && user.rol == "0" ? <AddGame /> : <Login onLogin={handleLogin} />} />
                    <Route path="/administrar-usuarios" element={user && user.rol == "0" ? <ManageUsers /> : <Login onLogin={handleLogin} />} />
                    <Route path="/administrar-juegos" element={user && user.rol == "0" ? <ManageGames /> : <Login onLogin={handleLogin} />} />
                    <Route path="/registrarse" element={<Register />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/perfil" element={user ? <Profile user={user} wishlist={wishlist} /> : <Login onLogin={handleLogin} />} />
                    <Route path="/editar-juego/:id_juego" element={user && user.rol == "0" ? <EditGame /> : <Login onLogin={handleLogin} />} />
                </Routes>
            </div>
        </CartProvider>
    );
}
