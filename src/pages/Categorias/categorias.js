import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Button, Drawer, Form, Row, Col, Input, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { loginContext } from '../Context/loginContext';
import AgregarCategoria from './agregarCategoria';

const CCategorias = () => {
  const [dataCategoria, setDataCategoria] = useState([]);
  const [drawerAgregarCategoria, setDrawerAgregarCategoria] = useState(false);
  const [drawerEditarCategoria, setDrawerEditarCategoria] = useState(false);
  const [catCodigo, setCatCodigo] = useState(0);
  const [categoriaModi, setCategoriaModi] = useState({});
  const searchInput = useRef(null);

  const abrirDrawerAgregarCategoria = () => {
    setDrawerAgregarCategoria(true);
  };

  const cerrarDrawerAgregarCategoria = () => {
    setDrawerAgregarCategoria(false);
  };

  const abrirDrawerEditarCategoria = () => {
    setDrawerEditarCategoria(true);
  };

  const cerrarDrawerEditarCategoria = () => {
    setDrawerEditarCategoria(false);
  };

  const datosCategorias = () => {
    fetch(`${process.env.REACT_APP_API_URL}categoria`)
      .then(response => response.json())
      .then(data => {
        setDataCategoria(data.data || []); // Asegúrate de manejar data.data correctamente
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    datosCategorias();
  }, []);

  useEffect(() => {
    console.log('dataCategoria updated:', dataCategoria); // Verifica el contenido de dataCategoria después de la actualización
  }, [dataCategoria]);

  const columns = [
    {
      title: 'id',
      dataIndex: 'cat_codigo',
      key: 'cat_codigo',
      width: 30,
    },
    {
      title: 'Nombre',
      dataIndex: 'cat_descripcion',
      key: 'cat_descripcion',
      width: '75%',
    },
    {
      title: 'Acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Editar</Button>
          <Button danger onClick={() => eliminarCategoria(record)}>Eliminar</Button>
        </Space>
      ),
      width: 60,
    },
  ];

  const onEdit = (record) => {
    setCatCodigo(record.cat_codigo);
    setCategoriaModi(record);
    abrirDrawerEditarCategoria();
  };

  const mapValuesToApi = (values) => {
    return {
      cat_descripcion: values.cat_descripcion
    };
  };

  const modificarCategoria = () => {
    const url =  `${process.env.REACT_APP_API_URL}categoria/` + catCodigo;
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(mapValuesToApi(categoriaModi)),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'Categoria update succefully') {
          cerrarDrawerEditarCategoria();
          datosCategorias();
          message.success("Categoría modificada correctamente");
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al modificar categoría:', error);
      });
  };

  const eliminarCategoria = (record) => {
    fetch(`${process.env.REACT_APP_API_URL}categoria/${record.cat_codigo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'Categoria deleted succefully') {
          message.success("Categoría eliminada");
          datosCategorias();
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al eliminar categoría:', error);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type='primary' onClick={abrirDrawerAgregarCategoria} style={{ marginBottom: '20px' }}>Agregar Categoría</Button>
      <AgregarCategoria 
        drawerAgregarCategoria={drawerAgregarCategoria} 
        cerrarDrawerAgregarCategoria={cerrarDrawerAgregarCategoria} 
        datosCategorias={datosCategorias}
      />
      <Drawer
        open={drawerEditarCategoria}
        onClose={cerrarDrawerEditarCategoria}
        destroyOnClose={true}
        title="Editar Categoría"
        extra={
          <Space>
            <Button type="primary" onClick={modificarCategoria}>
              Aceptar
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" initialValues={categoriaModi} onValuesChange={(_, values) => setCategoriaModi(values)}>
          <Row gutter={14}>
            <Col span={24}>
              <Form.Item name="cat_descripcion" label="Nombre" rules={[{ required: true, message: 'Por favor, ingrese nombre' }]}>
                <Input defaultValue={categoriaModi.cat_descripcion} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Table columns={columns} dataSource={dataCategoria} rowKey="cat_codigo" />
    </div>
  );
};

export default CCategorias;