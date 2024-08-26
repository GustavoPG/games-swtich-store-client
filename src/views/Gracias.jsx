// Gracias.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Gracias = () => {
    return (
        <Container className='containerGracias' style={{ marginTop: '80px' }}>
            <Row className="justify-content-md-center">
                <Col md={8} className="text-center">
                    <h2>¡Gracias por tu compra!</h2>
                    <p>Tu pedido ha sido procesado con éxito. Te enviaremos un correo con los detalles de tu compra.</p>
                </Col>
            </Row>
        </Container>
    );
}

export default Gracias;