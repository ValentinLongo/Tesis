import React from 'react';
import { Form, Input, Select, Button, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
const { Option } = Select;

const today = new Date();
const day = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const formattedDate = moment([year, month, day]);

const NuevoPedido = () => {
  const onFinish = (values) => {
    console.log('Valores enviados:', values);
  };
  
  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <div style={{ paddingTop: '20px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Nuevo Pedido</h1>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="DNI Cliente" name="cliente" labelCol={{ span: 24 }}>
              <Input placeholder="DNI" />
            </Form.Item>

            <Form.Item label="Cliente" name="cliente" labelCol={{ span: 24 }}>
              <Input disabled/>
            </Form.Item>

            <Form.Item label="Articulo" name="articulo" labelCol={{ span: 24 }}>
              <Select>
                <Option value="option1">Opción 1</Option>
                <Option value="option2">Opción 2</Option>
                <Option value="option3">Opción 3</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Fecha" name="fecha" labelCol={{ span: 24 }}>
              <DatePicker defaultValue={formattedDate} />
            </Form.Item>

            <Form.Item label="Estado" name="estado" labelCol={{ span: 24 }}>
              <Select>
                <Option value="option1">Opción 1</Option>
                <Option value="option2">Opción 2</Option>
                <Option value="option3">Opción 3</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Observaciones" name="observaciones" labelCol={{ span: 24 }}>
              <Input.TextArea />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit">
                  Aceptar
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default NuevoPedido;
