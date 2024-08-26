// ManagerUsers.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/usuarios', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error al cargar los usuarios:', error));
    }, []);

    const handleBack = () => {
        navigate(-1); // Navega a la página anterior en el historial
    };

    const handleDelete = (userId) => {
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
                fetch(`http://localhost:3000/usuarios/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        setUsers(users.filter(user => user.id_usuario !== userId));
                        Swal.fire(
                            'Eliminado',
                            'El usuario ha sido eliminado.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al eliminar el usuario.',
                            'error'
                        );
                    }
                })
                .catch(error => console.error('Error al eliminar el usuario:', error));
            }
        });
    };

    const handleEdit = (userId) => {
        navigate(`/editar-usuario/${userId}`);
    };

    return (
        <Container style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Administrar Usuarios</h2>
                <Button variant="primary" type="button" className='btn btn-success' onClick={handleBack}>
                    Volver a Perfil
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id_usuario}>
                            <td>{user.id_usuario}</td>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.email}</td>
                            <td>{user.rol == "0" ? "Administrador" : "Usuario"}</td>
                            <td>
                                {/* <Button variant="warning" className="me-2" onClick={() => handleEdit(user.id_usuario)}>
                                    Editar
                                </Button> */}
                                <Button variant="danger" onClick={() => handleDelete(user.id_usuario)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageUsers;

