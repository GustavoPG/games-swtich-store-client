// EditGame.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Image, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const EditGame = () => {
    const { id_juego } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [categories, setCategories] = useState([]);
    const [updatedGame, setUpdatedGame] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        stock: '',
        url_imagen_juego: '',
        id_categoria: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`https://games-swtich-store-api.onrender.com/publicaciones/${id_juego}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setGame(data);
                setUpdatedGame(data);
            })
            .catch(error => console.error("Error al cargar los datos del juego:", error));

        fetch('https://games-swtich-store-api.onrender.com/categorias')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Error al cargar las categorías:", error));
    }, [id_juego]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedGame({ ...updatedGame, [name]: value });
    };

    const handleCategoryChange = (e) => {
        setUpdatedGame({ ...updatedGame, id_categoria: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        fetch(`https://games-swtich-store-api.onrender.com/publicaciones/${id_juego}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedGame)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Juego actualizado exitosamente!',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/administrar-juegos');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema al actualizar el juego.',
                    text: 'Por favor, inténtalo nuevamente.',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => console.error("Error al actualizar el juego:", error));
    };

    if (!game) {
        return <div>Cargando...</div>;
    }

    return (
        <Container style={{ marginTop: '80px' }}>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Editar Juego</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Título:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="titulo"
                                        value={updatedGame.titulo}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="descripcion"
                                        value={updatedGame.descripcion}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="precio"
                                        value={updatedGame.precio}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={updatedGame.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>URL de la Imagen:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="url_imagen_juego"
                                        value={updatedGame.url_imagen_juego}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="id_categoria"
                                        value={updatedGame.id_categoria}
                                        onChange={handleCategoryChange}
                                        required
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id_categoria} value={category.id_categoria}>
                                                {category.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Guardar Cambios
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title>Vista Previa de la Imagen</Card.Title>
                            <Image
                                src={updatedGame.url_imagen_juego}
                                alt="Vista previa de la imagen del juego"
                                thumbnail
                                style={{ width: '100%', maxWidth: '300px', objectFit: 'cover' }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditGame;

