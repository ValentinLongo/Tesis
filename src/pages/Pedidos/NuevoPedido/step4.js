import React, { useContext, useState, useEffect } from 'react';
import { Button, Table, Input, Row, Col, Typography } from 'antd';
import { loginContext } from '../../Context/loginContext';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Step4 = ({ prevStep }) => {
  const { pedido } = useContext(loginContext);
  const [observaciones, setObservaciones] = useState('');
  const [totalServicios, setTotalServicios] = useState(0);

  useEffect(() => {
    const total = pedido.servicios.reduce((sum, servicio) => sum + servicio.ser_total, 0);
    setTotalServicios(total);
  }, [pedido.servicios]);

  const handleFinish = () => {
    const pedidoConObservaciones = {
      ...pedido,
      observaciones,
    };
    console.log('Pedido:', pedidoConObservaciones);
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
      title: 'Precio',
      dataIndex: 'ser_total',
      key: 'ser_total',
    },
  ];

  return (
    <div>
      <Title style={{ textAlign: 'center' }}>Resumen del Pedido</Title>
      
      <h2 style={{marginBottom:'10px'}}>Cliente</h2>
      <Table
        columns={clienteColumns}
        dataSource={[pedido.cliente]}
        pagination={false}
        rowKey="usu_codigo"
        bordered
      />

      <h2 style={{marginBottom:'10px', marginTop:'20px'}}>Artículos</h2>
      <Table
        columns={articuloColumns}
        dataSource={pedido.articulos}
        pagination={{ pageSize: 5 }}
        rowKey="art_codigo"
        bordered
      />

      <h2 style={{marginBottom:'10px', marginTop:'20px'}}>Servicios</h2>
      <Table
        columns={servicioColumns}
        dataSource={pedido.servicios}
        pagination={{ pageSize: 5 }}
        rowKey="ser_codigo"
        bordered
      />

      <Row justify="center" style={{ marginBottom: '20px', textAlign: 'left' }}>
        <Col span={16}>
          <TextArea 
            placeholder="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={4}
          />
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: '20px', textAlign: 'left' }}>
        <Col span={16}>
          <Text strong>Total de Servicios:</Text>
          <div style={{ padding: '8px 0', fontSize: '16px' }}>
            {totalServicios}
          </div>
        </Col>
      </Row>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={prevStep} style={{ marginRight: '10px' }}>
          Atrás
        </Button>
        <Button type="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
};

export default Step4;