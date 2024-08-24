import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Drawer, Form, Row, Col, Input, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import AgregarCategoria from './agregarCategoria';

const CCategorias = () => {
  const [dataCategoria, setDataCategoria] = useState([]);
  const [drawerAgregarCategoria, setDrawerAgregarCategoria] = useState(false);
  const [drawerEditarCategoria, setDrawerEditarCategoria] = useState(false);
  const [catCodigo, setCatCodigo] = useState(0);
  const [categoriaModi, setCategoriaModi] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
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
        setDataCategoria(data.data || []);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    datosCategorias();
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'cat_codigo',
      key: 'cat_codigo',
      width: 30,
      ...getColumnSearchProps('cat_codigo'),
    },
    {
      title: 'Nombre',
      dataIndex: 'cat_descripcion',
      key: 'cat_descripcion',
      width: '75%',
      ...getColumnSearchProps('cat_descripcion'),
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
    const url = `${process.env.REACT_APP_API_URL}categoria/` + catCodigo;
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