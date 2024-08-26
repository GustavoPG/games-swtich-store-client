// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ email: '', contraseña: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('https://games-swtich-store-api.onrender.com/usuarios/login', credentials);
    
            if (response.status === 200) {
                console.log("User data:", response.data);
                localStorage.setItem('token', response.data.token);
                onLogin(response.data);
                navigate('/');
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Credenciales incorrectas.',
                    text: response.data.error || 'Por favor, inténtalo nuevamente.',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el servidor.',
                text: error.response?.data?.error || 'No se pudo completar la solicitud. Intenta de nuevo más tarde.',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
            });
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Iniciar Sesión</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        name="email" 
                                        value={credentials.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña:</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        name="contraseña" 
                                        value={credentials.contraseña} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">Iniciar Sesión</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
