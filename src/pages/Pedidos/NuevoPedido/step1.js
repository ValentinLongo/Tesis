import React, { useState, useContext } from 'react';
import { Form, Input, Button, Row, Col, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../../Context/loginContext';

const Step1 = ({ nextStep }) => {
  const { pedido, actualizarPedido } = useContext(loginContext);
  const [dni, setDni] = useState('');
  const [cliente, setCliente] = useState(null);
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
          setCliente(client);
          actualizarPedido({ cliente: client });
          console.log('cliente', client);
          form.setFieldsValue({ clientName: client.usu_nombre });
        } else {
          message.error('Cliente no encontrado');
          setCliente(null);
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

  const columns = [
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

  return (
    <Row justify="center">
      <Col xs={30} sm={26} md={20} lg={16} xl={12}>
        <div style={{ paddingTop: '20px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Seleccionar cliente</h1>
          <Form form={form} layout="vertical">
            <Form.Item label="DNI Cliente" name="dni" labelCol={{ span: 24 }}>
              <Input placeholder="DNI" value={dni} onChange={handleDniChange} />
              <Button type="primary" onClick={handleSearchClient} style={{ marginTop: '10px' }}>
                Buscar Cliente
              </Button>
            </Form.Item>

            <div labelCol={{ span: 24 }}  style={{justifyContent:'start'}}>
              {cliente && (
                  <Table
                    columns={columns}
                    dataSource={[cliente]}
                    pagination={false}
                    rowKey="usu_codigo"
                    style={{ marginTop: '20px', width: '100%' }}
                  />
              )}
            </div>

            <Form.Item>
              <Button type="primary" onClick={nextStep} disabled={!cliente}>
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
