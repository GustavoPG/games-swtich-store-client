// AddGame.jsx
import React from 'react';
import GameForm from '../components/GameForm';
import Swal from 'sweetalert2';

const AddGame = () => {
    const addGameToDatabase = async (newGame) => {
        const token = localStorage.getItem('token'); // Asegúrate de que 'token' está en localStorage y es el correcto
        try {
            const response = await fetch('http://localhost:3000/publicaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // El token debe estar presente aquí
                },
                body: JSON.stringify(newGame)
            });
    
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Juego agregado exitosamente!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Hubo un problema al agregar el juego.',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            console.error('Error al agregar el juego a la base de datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error en el servidor',
                text: 'No se pudo agregar el juego. Por favor, inténtalo nuevamente.',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div>
            <GameForm onAddGame={addGameToDatabase} />
        </div>
    );
};

export default AddGame;
