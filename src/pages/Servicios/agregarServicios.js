import React, { useContext } from 'react';
import { Space, Button, Drawer, Form, Row, Col, Input, message } from 'antd';
import { loginContext } from '../Context/loginContext';

const mapValuesToApi = (values) => {
  return {
    ser_descripcion: values.ser_descripcion,
    ser_total: values.ser_total,
  };
};

const AgregarServicio = ({ drawerAgregarServicio, cerrarDrawerAgregarServicio, datosServicios }) => {
  const { formValues, setFormValues } = useContext(loginContext);

  const agregarServicio = () => {
    const url = "https://apis-node.vercel.app/servicio";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(mapValuesToApi(formValues)),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(json => {
        if (json.message === 'servicio created succefully') {
          cerrarDrawerAgregarServicio();
          datosServicios();
          message.success("Servicio creado correctamente");
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al crear servicio:', error);
        message.error('Error al crear servicio: ' + error.message);
      });
  };

  return (
    <Drawer
      title="Agregar Servicio"
      placement="right"
      onClose={cerrarDrawerAgregarServicio}
      open={drawerAgregarServicio}
      extra={
        <Space>
          <Button onClick={cerrarDrawerAgregarServicio}>Cancelar</Button>
          <Button onClick={agregarServicio} type="primary">
            Aceptar
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" onValuesChange={(_, values) => setFormValues(values)}>
        <Row gutter={14}>
          <Col span={24}>
            <Form.Item name="ser_descripcion" label="Descripción" rules={[{ required: true, message: 'Por favor, ingrese descripción' }]}>
              <Input placeholder='Ingrese descripción del servicio' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="ser_total" label="Total" rules={[{ required: true, message: 'Por favor, ingrese el total' }]}>
              <Input placeholder='Ingrese el total del servicio' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AgregarServicio;