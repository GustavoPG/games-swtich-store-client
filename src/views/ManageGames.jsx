// ManageGames.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ManageGames = () => {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar la lista de juegos desde el backend
        const token = localStorage.getItem('token');

        fetch('https://games-swtich-store-api.onrender.com/publicaciones', {  // Ajusta la URL según tu backend
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setGames(data))
            .catch(error => console.error('Error al cargar los juegos:', error));
    }, []);

    const handleBack = () => {
        navigate(-1); // Navega a la página anterior 
    };

    const handleDelete = (gameId) => {
        const token = localStorage.getItem('token');
    
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminarlo'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://games-swtich-store-api.onrender.com/publicaciones/${gameId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Actualizar el estado para eliminar el juego de la lista
                        setGames(prevGames => prevGames.filter(game => game.id_publicacion !== gameId));
                        Swal.fire(
                            'Eliminado',
                            'El juego ha sido eliminado.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al eliminar el juego.',
                            'error'
                        );
                    }
                })
                .catch(error => console.error('Error al eliminar el juego:', error));
            }
        });
    };
    
    const handleEdit = (gameId) => {
        // Redirigir a la página de edición del juego
        navigate(`/editar-juego/${gameId}`);
    };

    return (
        <Container style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Administrar Juegos</h2>
                <Button variant="primary" type="button" className='btn btn-success' onClick={handleBack}>
                    Volver a Perfil
                </Button>
            </div>
            <Row>
                {games.map((game) => (
                    <Col md={4} key={game.id_publicacion} className="mb-4">  
                        <Card>
                            <Card.Img variant="top" src={game.url_imagen_juego} alt={game.titulo} style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title>{game.titulo}</Card.Title>
                                <Card.Text>
                                    <strong>Descripción:</strong> {game.descripcion}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Precio:</strong> ${game.precio}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Stock:</strong> {game.stock}
                                </Card.Text>
                                <Button variant="danger" className="me-2" onClick={() => handleDelete(game.id_publicacion)}>
                                    X Eliminar
                                </Button>
                                <Button variant="primary" onClick={() => handleEdit(game.id_publicacion)}>
                                    Editar
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};


export default ManageGames;
