import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Space, Table, Button, Drawer, Form, Row, Col, Input, Select, message } from 'antd';
import { Option } from 'antd/es/mentions';
import { loginContext } from '../Context/loginContext';
import AgregarUsuario from './agregarUsuario';

const CUsuarios = () => {
  const { data, datos, open, open2, showDrawer, showDrawer2, onClose, onClose2 } = useContext(loginContext);
  const [modificarUsuario, setModificarUsuario] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [usuCodigo, setUsuCodigo] = useState(0);
  const searchInput = useRef(null);

  //BUSCADOR DE LA TABLA 
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
          placeholder={`Search ${dataIndex}`}
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
            Search
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
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'usu_nombre',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('usu_nombre')
    },
    {
      title: 'DNI',
      dataIndex: 'usu_dni',
      key: 'usu_dni',
      width: 150,
      ...getColumnSearchProps('usu_dni'),
    },
    {
      title: 'Email',
      dataIndex: 'usu_email',
      key: 'usu_email',
      width: 150,
      ...getColumnSearchProps('usu_email'),
    },
    {
      title: 'Telefono',
      dataIndex: 'usu_telefono',
      key: 'usu_telefono',
      width: 150,
      ...getColumnSearchProps('usu_telefono')
    },
    {
      title: 'Tipo',
      dataIndex: 'usu_permiso',
      width: 150,
      render: (text, record) => {
        const usu_permiso = definirTipoUsuario(text);
        return usu_permiso;
      },
    },
    {
      title: 'Acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Editar</Button>
          <Button danger onClick={() => eliminarUsuario(record)}>Eliminar</Button>
        </Space>
      ),
      width: 150,
    },
  ];

  const definirTipoUsuario = (values) => {
    let usu_permiso = "";
    if (values === 1) {
      usu_permiso = "Cliente";
    }
    else if (values === 2) {
      usu_permiso = "Administrador";
    }
    return usu_permiso;
  };

  const onEdit = (record) => {
    setUsuCodigo(record.usu_codigo);
    setModificarUsuario({
      ...record,
      usu_permiso: definirTipoUsuario(record.usu_permiso),
    });
    showDrawer2();
  };

  const mapValuesToApi = (values) => {
    let usu_permiso = values.usu_permiso === "Cliente" ? 1 : 2;
    return {
      usu_nombre: values.usu_nombre,
      usu_contra: values.usu_contra,
      usu_email: values.usu_email,
      usu_dni: values.usu_dni,
      usu_telefono: values.usu_telefono,
      usu_permiso: usu_permiso,
    };
  };

  const eliminarUsuario = (record) => {
    fetch(`${process.env.REACT_APP_API_URL}usuarios/${record.usu_codigo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'usuario deleted succefully') {
          message.success("Usuario eliminado");
          datos();
        }
        else {
          console.log(json.message)
        }
      })
      .catch(error => {
        console.error('Error al eliminar usuario:', error);
      });
  };

  const modificarUsu = () => {
    const idUsuario = usuCodigo;
    const url = `${process.env.REACT_APP_API_URL}usuarios/` + idUsuario;
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(mapValuesToApi(modificarUsuario)),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'Usuario update succefully') {
          onClose2();
          datos();
          message.success("Usuario modificado correctamente")
        }
        else {
          console.log(json.message)
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showDrawer}>
          Agregar Usuario
        </Button>
      </Space>
      <AgregarUsuario />

      <Drawer title="Modificar Usuario" width={500} placement="right" onClose={onClose2} open={open2}
        destroyOnClose="true"
        extra={
          <Space>
            <Button onClick={onClose2}>Cancelar</Button>
            <Button onClick={modificarUsu} type="primary">
              Aceptar
            </Button>
          </Space>}>
        <Form layout="vertical" initialValues={modificarUsuario} onValuesChange={(_, values) => setModificarUsuario(values)}>
          <Row gutter={14}>
            <Col span={12}>
              <Form.Item name="usu_nombre" label="Nombre" rules={[{ required: true, message: 'Por favor, ingrese nombre' }]}>
                <Input defaultValue={modificarUsuario.usu_nombre} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usu_email" label="Email" rules={[{ required: true, message: 'Por favor, ingrese email' }]}>
                <Input defaultValue={modificarUsuario.usu_email} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={14}>
            <Col span={12}>
              <Form.Item name="usu_dni" label="DNI" rules={[{ required: true, message: 'Por favor, ingrese DNI' }]}>
                <Input defaultValue={modificarUsuario.usu_dni} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usu_telefono" label="Telefono" rules={[{ required: true, message: 'Por favor, ingrese telefono' }]}>
                <Input defaultValue={modificarUsuario.usu_telefono} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={14}>
            <Col span={12}>
              <Form.Item name="usu_contra" label="Contraseña" rules={[{ required: true, message: 'Por favor, ingrese contraseña' }]}>
                <Input.Password defaultValue={modificarUsuario.usu_contra} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usu_permiso" label="Tipo de Usuario" rules={[{ required: true, message: 'Por favor, seleccione un tipo de usuario' }]}>
                <Select defaultValue={definirTipoUsuario(modificarUsuario.usu_permiso)}>
                  <Option value="1">Cliente</Option>
                  <Option value="2">Administrador</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default CUsuarios;
