import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Button, Drawer, Form, Row, Col, Input, message, Space, Select } from 'antd';
import { loginContext } from '../Context/loginContext';
import AgregarArticulo from './agregarArticulos';

const { Option } = Select;

const CArticulos = () => {
  const [dataArticulo, setDataArticulo] = useState([]);
  const [drawerAgregarArticulo, setDrawerAgregarArticulo] = useState(false);
  const [drawerEditarArticulo, setDrawerEditarArticulo] = useState(false);
  const [artCodigo, setArtCodigo] = useState(0);
  const [articuloModi, setArticuloModi] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const searchInput = useRef(null);

  const abrirDrawerAgregarArticulo = () => {
    setDrawerAgregarArticulo(true);
  };

  const cerrarDrawerAgregarArticulo = () => {
    setDrawerAgregarArticulo(false);
  };

  const abrirDrawerEditarArticulo = () => {
    setDrawerEditarArticulo(true);
  };

  const cerrarDrawerEditarArticulo = () => {
    setDrawerEditarArticulo(false);
  };

  const datosArticulos = () => {
    fetch(`${process.env.REACT_APP_API_URL}articulo`)
      .then(response => response.json())
      .then(data => {
        setDataArticulo(data.data || []);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const datosMarcas = () => {
    fetch(`${process.env.REACT_APP_API_URL}marca`)
      .then(response => response.json())
      .then(data => setMarcas(data.data || []))
      .catch(error => console.error('Error fetching marcas:', error));
  };

  const datosCategorias = () => {
    fetch(`${process.env.REACT_APP_API_URL}categoria`)
      .then(response => response.json())
      .then(data => setCategorias(data.data || []))
      .catch(error => console.error('Error fetching categorias:', error));
  };

  useEffect(() => {
    datosArticulos();
    datosMarcas();
    datosCategorias();
  }, []);

  const onEdit = (record) => {
    setArtCodigo(record.art_codigo);
    setArticuloModi(record);
    abrirDrawerEditarArticulo();
  };

  const onDelete = (record) => {
    const url = `${process.env.REACT_APP_API_URL}articulo/` + record.art_codigo;
    fetch(url, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'articulo deleted successfully') {
          datosArticulos();
          message.success("Artículo eliminado correctamente");
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al eliminar artículo:', error);
      });
  };

  const mapValuesToApi = (values) => {
    return {
      art_nombre: values.art_nombre,
      art_marca: values.art_marca,
      art_categoria: values.art_categoria
    };
  };

  const modificarArticulo = () => {
    const url = `${process.env.REACT_APP_API_URL}articulo/` + artCodigo;
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(mapValuesToApi(articuloModi)),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'articulo updated successfully') {
          cerrarDrawerEditarArticulo();
          datosArticulos();
          message.success("Artículo modificado correctamente");
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al modificar artículo:', error);
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'art_codigo',
      key: 'art_codigo',
      width: 30,
    },
    {
      title: 'Nombre',
      dataIndex: 'art_nombre',
      key: 'art_nombre',
      width: '30%',
    },
    {
      title: 'Marca',
      dataIndex: 'mar_descripcion',
      key: 'mar_descripcion',
      width: '20%',
    },
    {
      title: 'Categoría',
      dataIndex: 'cat_descripcion',
      key: 'cat_descripcion',
      width: '20%',
    },
    {
      title: 'Acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Editar</Button>
          <Button danger onClick={() => onDelete(record)}>Eliminar</Button>
        </Space>
      ),
      width: 60,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type='primary' onClick={abrirDrawerAgregarArticulo} style={{ marginBottom: '20px' }}>Agregar Artículo</Button>
      <AgregarArticulo
        drawerAgregarArticulo={drawerAgregarArticulo}
        cerrarDrawerAgregarArticulo={cerrarDrawerAgregarArticulo}
        datosArticulos={datosArticulos}
      />
      <Drawer
        open={drawerEditarArticulo}
        onClose={cerrarDrawerEditarArticulo}
        destroyOnClose={true}
        title="Editar Artículo"
        extra={
          <Space>
            <Button type="primary" onClick={modificarArticulo}>
              Aceptar
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" initialValues={articuloModi} onValuesChange={(_, values) => setArticuloModi(values)}>
          <Row gutter={14}>
            <Col span={24}>
              <Form.Item name="art_nombre" label="Nombre" rules={[{ required: true, message: 'Por favor, ingrese nombre' }]}>
                <Input defaultValue={articuloModi.art_nombre} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="art_marca" label="Marca" rules={[{ required: true, message: 'Por favor, seleccione una marca' }]}>
                <Select defaultValue={articuloModi.art_marca} placeholder="Seleccione una marca"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => 
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }>
                  {marcas.map(marca => (
                    <Option key={marca.mar_codigo} value={marca.mar_codigo}>{marca.mar_descripcion}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="art_categoria" label="Categoría" rules={[{ required: true, message: 'Por favor, seleccione una categoría' }]}>
                <Select defaultValue={articuloModi.art_categoria} placeholder="Seleccione una categoría"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => 
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }>
                  {categorias.map(categoria => (
                    <Option key={categoria.cat_codigo} value={categoria.cat_codigo}>{categoria.cat_descripcion}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Table columns={columns} dataSource={dataArticulo} rowKey="art_codigo" />
    </div>
  );
};

export default CArticulos;