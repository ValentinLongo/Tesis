import React, { useState, useEffect } from 'react';
import { Button, Table, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

const DetallePedido = ({ detalle }) => {
    const [totalServicios, setTotalServicios] = useState(0);

    useEffect(() => {
        const total = detalle.servicios.reduce((sum, servicio) => sum + servicio.ser_total, 0);
        const adicionalesTotal = detalle.adicionales.reduce((sum, adicional) => sum + adicional.precio, 0);
        setTotalServicios(total + adicionalesTotal);
    }, [detalle]);

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
                        dataSource={detalle.adicionales}
                        pagination={false}
                        rowKey={(record) => record.descripcion}
                    />
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
