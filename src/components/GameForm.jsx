// GameForm.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GameForm = ({ onAddGame }) => {
    // Estado inicial para almacenar los datos del nuevo juego
    const [newGame, setNewGame] = useState({
        url_imagen_juego: '',
        titulo: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: ''
    });

    // Estado para almacenar las categorías cargadas desde la base de datos
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar las categorías desde la base de datos cuando el componente se monta
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://games-swtich-store-api.onrender.com/categorias');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        fetchCategories();
    }, []);

    // Función para manejar la navegación hacia atrás en el historial
    const handleBack = () => {
        navigate(-1); // Navega a la página anterior en el historial
    };

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewGame({ ...newGame, [name]: value });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        onAddGame(newGame); // Llama a la función onAddGame pasada como prop
        // Resetea el formulario después de agregar el juego
        setNewGame({
            url_imagen_juego: '',
            titulo: '',
            descripcion: '',
            precio: '',
            stock: '',
            id_categoria: ''
        });
    };

    return (
        // Estructura del formulario para agregar un nuevo juego
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', marginTop: '80px' }}>
            <Row className="justify-content-center w-100">
                <Col md={8} lg={6}>  {/* Ajusta el tamaño de la columna para pantallas grandes */}
                    <Card>
                        <Card.Body>
                            <Card.Title>Agregar Nuevo Juego</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                {/* Campo para la URL de la imagen del juego */}
                                <Form.Group className="mb-3">
                                    <Form.Label>URL de la Imagen:</Form.Label>
                                    <Form.Control type="text" name="url_imagen_juego" value={newGame.url_imagen_juego} onChange={handleChange} required />
                                </Form.Group>
                                {/* Campo para el título del juego */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Título:</Form.Label>
                                    <Form.Control type="text" name="titulo" value={newGame.titulo} onChange={handleChange} required />
                                </Form.Group>
                                {/* Campo para la descripción del juego */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control as="textarea" name="descripcion" value={newGame.descripcion} onChange={handleChange} required />
                                </Form.Group>
                                {/* Campo para el precio del juego */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio:</Form.Label>
                                    <Form.Control type="number" name="precio" value={newGame.precio} onChange={handleChange} required />
                                </Form.Group>
                                {/* Campo para el stock del juego */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock:</Form.Label>
                                    <Form.Control type="number" name="stock" value={newGame.stock} onChange={handleChange} required />
                                </Form.Group>
                                {/* Campo para seleccionar la categoría del juego */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría:</Form.Label>
                                    <Form.Control as="select" name="id_categoria" value={newGame.id_categoria} onChange={handleChange} required>
                                        <option value="">Seleccione una categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id_categoria} value={category.id_categoria}>
                                                {category.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                {/* Botones para agregar el juego y volver al perfil */}
                                <Form.Group className="mb-3">
                                    <Button variant="primary" type="submit" className='me-5'>Agregar Juego</Button>
                                    <Button variant="primary" type="button" className='btn btn-success' onClick={handleBack}>Volver a Perfil</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default GameForm;
