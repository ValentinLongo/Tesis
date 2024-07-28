import React, { useState, useEffect, useContext } from 'react';
import { Space, Button, Drawer, Form, Row, Col, Input, Select, message } from 'antd';
import { loginContext } from '../Context/loginContext';

const { Option } = Select;

const mapValuesToApi = (values) => {
    console.log('valores', values)
  return {
    art_nombre: values.nombre,
    art_marca: values.marca,
    art_categoria: values.categoria,
    art_precio: values.precio,
  };
};

const AgregarArticulo = ({ drawerAgregarArticulo, cerrarDrawerAgregarArticulo, datosArticulos }) => {
  const { formValues, setFormValues } = useContext(loginContext);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch('https://apis-node.vercel.app/marca')
      .then(response => response.json())
      .then(data => setMarcas(data.data || []))
      .catch(error => console.error('Error fetching marcas:', error));

    fetch('https://apis-node.vercel.app/categoria')
      .then(response => response.json())
      .then(data => setCategorias(data.data || []))
      .catch(error => console.error('Error fetching categorias:', error));
  }, []);

  const agregarArticulo = () => {
    const url = "https://apis-node.vercel.app/articulo";
    console.log(JSON.stringify(mapValuesToApi(formValues)))
    fetch(url, {
      method: "POST",
      body: JSON.stringify(mapValuesToApi(formValues)),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'articulo created successfully') {
          cerrarDrawerAgregarArticulo();
          datosArticulos();
          message.success("Artículo creado correctamente");
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al crear artículo:', error);
      });
  };

  return (
    <Drawer
      title="Agregar Artículo"
      placement="right"
      onClose={cerrarDrawerAgregarArticulo}
      open={drawerAgregarArticulo}
      extra={
        <Space>
          <Button onClick={cerrarDrawerAgregarArticulo}>Cancelar</Button>
          <Button onClick={agregarArticulo} type="primary">Aceptar</Button>
        </Space>
      }
    >
      <Form layout="vertical" onValuesChange={(_, values) => setFormValues(values)}>
        <Row gutter={14}>
          <Col span={24}>
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor, ingrese nombre' }]}>
              <Input placeholder='Ingrese nombre del artículo' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="marca" label="Marca" rules={[{ required: true, message: 'Por favor, seleccione una marca' }]}>
              <Select placeholder="Seleccione una marca">
                {marcas.map(marca => (
                  <Option key={marca.mar_codigo} value={marca.mar_codigo}>{marca.mar_descripcion}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="categoria" label="Categoria" rules={[{ required: true, message: 'Por favor, seleccione una categoría' }]}>
              <Select placeholder="Seleccione una categoría">
                {categorias.map(categoria => (
                  <Option key={categoria.cat_codigo} value={categoria.cat_codigo}>{categoria.cat_descripcion}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="precio" label="Precio" rules={[{ required: true, message: 'Por favor, ingrese el precio' }]}>
              <Input type="number" placeholder='Ingrese el precio del artículo' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AgregarArticulo;