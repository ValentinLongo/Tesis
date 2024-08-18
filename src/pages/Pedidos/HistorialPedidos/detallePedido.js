import React, { useState, useEffect } from 'react';
import { Button, Table, Typography, Row, Col, Input, Form, notification } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const DetallePedido = ({ detalle }) => {
    const [totalServicios, setTotalServicios] = useState(0);
    const [nuevosAdicionales, setNuevosAdicionales] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');

    useEffect(() => {
        const total = detalle.servicios.reduce((sum, servicio) => sum + servicio.ser_total, 0);
        const adicionalesTotal = detalle.adicionales.reduce((sum, adicional) => sum + adicional.precio, 0);
        setTotalServicios(total + adicionalesTotal);
    }, [detalle]);

    const handleAgregarAdicional = () => {
        if (descripcion && precio) {
            const nuevoAdicional = { descripcion, precio: parseFloat(precio) };
            setNuevosAdicionales([...nuevosAdicionales, nuevoAdicional]);
            setDescripcion('');
            setPrecio('');
            setTotalServicios(totalServicios + parseFloat(precio));
        } else {
            notification.error({
                message: 'Error',
                description: 'Por favor ingresa una descripción y un precio válidos.',
            });
        }
    };

    const handleConfirmarAdicionales = () => {
        if (nuevosAdicionales.length === 0) {
            notification.info({
                message: 'No hay adicionales nuevos',
                description: 'No se han agregado nuevos adicionales para confirmar.',
            });
            return;
        }
    
        axios.post(`${process.env.REACT_APP_API_URL}pedidos/${detalle.ped_codigo}/adicionales`, { adicionales: nuevosAdicionales })
            .then(() => {
                notification.success({
                    message: 'Éxito',
                    description: 'Adicionales agregados exitosamente.',
                });
                detalle.adicionales.push(...nuevosAdicionales);

                setNuevosAdicionales([]);
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: `Error al agregar los adicionales: ${err.message}`,
                });
            });
    };

    const clienteColumns = [
        {
            title: 'Código Cliente',
            dataIndex: 'usu_codigo',
            key: 'usu_codigo',
        },
        {
            title: 'Nombre Cliente',
            dataIndex: 'usu_nombre',
            key: 'usu_nombre',
        },
        {
            title: 'Email',
            dataIndex: 'usu_email',
            key: 'usu_email',
        },
        {
            title: 'Teléfono',
            dataIndex: 'usu_telefono',
            key: 'usu_telefono',
        },
        {
            title: 'DNI',
            dataIndex: 'usu_dni',
            key: 'usu_dni',
        },
    ];

    const articuloColumns = [
        {
            title: 'Código',
            dataIndex: 'art_codigo',
            key: 'art_codigo',
        },
        {
            title: 'Nombre',
            dataIndex: 'art_nombre',
            key: 'art_nombre',
        },
        {
            title: 'Marca',
            dataIndex: 'mar_descripcion',
            key: 'mar_descripcion',
        },
        {
            title: 'Categoría',
            dataIndex: 'cat_descripcion',
            key: 'cat_descripcion',
        },
    ];

    const servicioColumns = [
        {
            title: 'Código',
            dataIndex: 'ser_codigo',
            key: 'ser_codigo',
        },
        {
            title: 'Descripción',
            dataIndex: 'ser_descripcion',
            key: 'ser_descripcion',
        },
        {
            title: 'Total',
            dataIndex: 'ser_total',
            key: 'ser_total',
            render: (text) => `$${text.toFixed(2)}`,
        },
    ];

    const adicionalColumns = [
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
            render: (text) => `$${text.toFixed(2)}`,
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Title level={3}>Detalle del Pedido</Title>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={4}>Cliente</Title>
                    <Table
                        columns={clienteColumns}
                        dataSource={[detalle.cliente]}
                        pagination={false}
                        rowKey="usu_codigo"
                    />
                </Col>
                <Col span={24}>
                    <Title level={4}>Artículos</Title>
                    <Table
                        columns={articuloColumns}
                        dataSource={detalle.articulos}
                        pagination={false}
                        rowKey="art_codigo"
                    />
                </Col>
                <Col span={24}>
                    <Title level={4}>Servicios</Title>
                    <Table
                        columns={servicioColumns}
                        dataSource={detalle.servicios}
                        pagination={false}
                        rowKey="ser_codigo"
                    />
                </Col>
                <Col span={24}>
                    <Title level={4}>Adicionales</Title>
                    <Table
                        columns={adicionalColumns}
                        dataSource={[...detalle.adicionales, ...nuevosAdicionales]}
                        pagination={false}
                        rowKey={(record) => record.descripcion}
                    />
                    <Form layout="inline" style={{ marginTop: 16 }}>
                        <Form.Item>
                            <Input
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                placeholder="Precio"
                                type="number"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleAgregarAdicional}>
                                Agregar Adicional
                            </Button>
                        </Form.Item>
                    </Form>
                    <Button
                        type="primary"
                        style={{ marginTop: 16 }}
                        onClick={handleConfirmarAdicionales}
                    >
                        Confirmar Adicionales
                    </Button>
                </Col>
                <Col span={24}>
                    <Title level={4}>Observaciones</Title>
                    <Text>{detalle.observaciones}</Text>
                </Col>
                <Col span={24}>
                    <Title level={4}>Total</Title>
                    <Text>{`$${totalServicios.toFixed(2)}`}</Text>
                </Col>
            </Row>
        </div>
    );
};

export default DetallePedido;