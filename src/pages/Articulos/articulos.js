import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Button, Drawer, Form, Row, Col, Input, message, Space, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
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
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

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
      ...getColumnSearchProps('art_codigo'),
    },
    {
      title: 'Nombre',
      dataIndex: 'art_nombre',
      key: 'art_nombre',
      width: '30%',
      ...getColumnSearchProps('art_nombre'),
    },
    {
      title: 'Marca',
      dataIndex: 'mar_descripcion',
      key: 'mar_descripcion',
      width: '20%',
      ...getColumnSearchProps('mar_descripcion'),
    },
    {
      title: 'Categoría',
      dataIndex: 'cat_descripcion',
      key: 'cat_descripcion',
      width: '20%',
      ...getColumnSearchProps('cat_descripcion'),
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
              <Form.Item name="art_marca" label="Marca" rules={[{ required: true, message: 'Por favor, seleccione marca' }]}>
                <Select defaultValue={articuloModi.mar_descripcion}>
                  {marcas.map((marca) => (
                    <Option key={marca.mar_codigo} value={marca.mar_codigo}>
                      {marca.mar_descripcion}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="art_categoria" label="Categoría" rules={[{ required: true, message: 'Por favor, seleccione categoría' }]}>
                <Select defaultValue={articuloModi.cat_descripcion}>
                  {categorias.map((categoria) => (
                    <Option key={categoria.cat_codigo} value={categoria.cat_codigo}>
                      {categoria.cat_descripcion}
                    </Option>
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
