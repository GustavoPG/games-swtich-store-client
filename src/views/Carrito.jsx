// Carrito.jsx
import React from 'react';
import { useCart } from "../context/CartContext";
import { Card, ListGroup, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Carrito = () => {
    const { cartItems, addToCart, removeFromCart, formatNumber, clearCart } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);

    const handlePagar = () => {
        if (cartItems.length > 0) {
            clearCart(); // Vaciar el carrito
            navigate('/gracias'); // Redirigir a la vista de agradecimiento
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Tu carrito está vacío.',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
            });
        }
    };

    return (
        <Container className='containerCarrito' style={{ marginTop: '80px' }}>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h3">Detalle del Pedido</Card.Header>
                        <Card.Body>
                            <ListGroup as="ul">
                                {cartItems.map((item) => (
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                        key={item.id_publicacion}
                                    >
                                        <Image 
                                            src={item.url_imagen_juego} 
                                            alt={item.titulo} 
                                            rounded 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                                        />
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{item.titulo}</div>
                                            ${formatNumber(item.precio)} x {item.quantity}
                                        </div>
                                        <div>
                                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id_publicacion)}>-</Button>
                                            <span className="badge bg-dark mx-3">
                                                <h6>${formatNumber(item.precio * item.quantity)}</h6>
                                            </span>
                                            <Button variant="primary" size="sm" onClick={() => addToCart(item)}>+</Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item className="fw-bold">
                                    <div className='carritoPagar'>
                                        <p>Total: ${formatNumber(totalPrice)}</p>
                                        <Button variant="success" size="sm" onClick={handlePagar}>Ir a Pagar</Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Carrito;
