import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const Step1 = ({ nextStep }) => {
  const [dni, setDni] = useState('');
  const [clientName, setClientName] = useState('');

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleSearchClient = () => {
    // Aquí iría la lógica para buscar el nombre del cliente basado en el DNI
    // Por ahora, simulamos con un nombre fijo
    setClientName('Nombre del Cliente');
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <div style={{ paddingTop: '20px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Seleccionar cliente</h1>
          <Form layout="vertical">
            <Form.Item label="DNI Cliente" name="dni" labelCol={{ span: 24 }}>
              <Input placeholder="DNI" value={dni} onChange={handleDniChange} />
              <Button type="primary" onClick={handleSearchClient} style={{ marginTop: '10px' }}>
                Buscar Cliente
              </Button>
            </Form.Item>

            <Form.Item label="Cliente" name="clientName" labelCol={{ span: 24 }}>
              <Input value={clientName} disabled />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={nextStep}>
                Continuar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Step1;
