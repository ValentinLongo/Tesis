import React, { useState, useContext } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../../Context/loginContext';

const Step1 = ({ nextStep }) => {
  const { pedido, actualizarPedido } = useContext(loginContext);
  const [dni, setDni] = useState('');
  const [clientName, setClientName] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleSearchClient = () => {
    fetch(`${process.env.REACT_APP_API_URL}usuarios/${dni}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al buscar el cliente');
        }
        return response.json();
      })
      .then(data => {
        if (data.message === 'usuario retrieved succefully' && data.data.length > 0) {
          const client = data.data[0];
          setClientName(client.usu_nombre);
          actualizarPedido({ cliente:client });
          form.setFieldsValue({ clientName: client.usu_nombre });
        } else {
          message.error('Cliente no encontrado');
          setClientName('');
          form.resetFields(['clientName']);
        }
      })
      .catch(error => {
        console.error(error);
        message.error('Error al buscar el cliente');
      });
  };

  const handleManageUsers = () => {
    navigate('/usuarios');
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <div style={{ paddingTop: '20px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Seleccionar cliente</h1>
          <Form form={form} layout="vertical">
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
              <Button type="primary" onClick={nextStep} disabled={!clientName}>
                Continuar
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
              <Button type="default" onClick={handleManageUsers}>
                Administrar usuarios
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Step1;