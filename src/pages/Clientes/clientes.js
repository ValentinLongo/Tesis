import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React,{useState, useEffect,useRef} from 'react';
import { Space, Table, Button, Drawer, Form, Row, Col, Input, Select } from 'antd';
import { Option } from 'antd/es/mentions';

  const CClientes = () => {
    const[data,setData] = useState('');
    const [formValues, setFormValues] = useState({});
    const [modificarUsuario, setModificarUsuario] = useState({});
    const [open2, setOpen2] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        datos();
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
      //key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Editar</Button>
          <Button danger onClick={() => eliminarUsuario(record)}>Eliminar</Button>
        </Space>
      ),
      width: 150,
    },
  ];

    //Traer Usuarios
    const datos = () =>{    
        fetch('https://apis-node.vercel.app/usuarios')
        .then(response => response.json())
        .then(data => setData(data.data))
        .catch(error => console.error(error)) 
    }     
    //Le paso el id de permiso y me devuelve el nombre
    const definirTipoUsuario = (values) => {
      let usu_permiso = "";
      if(values === "1"){
          usu_permiso = "Cliente";
      }
      else if (values === "2"){
        usu_permiso = "Administrador";
      }
      return usu_permiso
    };    

    //Drawer agregar usuario
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };

    //Drawer modificar usuario
    const showDrawer2 = () => {
      setOpen2(true);
    };
    const onClose2 = () => {
      setOpen2(false);
      setModificarUsuario({});
    };
    const onEdit = (record) => {
      setModificarUsuario(record);
      showDrawer2();
    };

    //Arma objeto de Usuario
    const mapValuesToApi = (values) => {
      let usu_permiso = "";
      if(values.tipoUsuario === "Cliente"){
          usu_permiso = "1";
      }
      else{
        usu_permiso = "2";
      }
      return {
        usu_nombre: values.nombre,
        usu_contra: values.contra,
        usu_email: values.email,
        usu_telefono: values.telefono,
        usu_permiso: usu_permiso
      };
    };

    //Eliminar Usuario
    const eliminarUsuario = (record) => {
      fetch(`https://apis-node.vercel.app/usuarios/${record.usu_codigo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      if(json.message === 'usuario deleted succefully'){ 
        datos();
      }
      else{ //En caso de que sea incorrecto
        console.log(json.message)
      }
    })
      .catch(error => {
        console.error('Error al eliminar usuario:', error);
      });
    };

    //Agregar nuevo Usuario
    const agregarUsuario = () => {
      const url = "https://apis-node.vercel.app/usuarios"; 
      // Realizar la solicitud POST y obtener la respuesta
      console.log(JSON.stringify(mapValuesToApi(formValues)));
      fetch(url, {
        method: "POST",
        body: JSON.stringify(mapValuesToApi(formValues)),
        headers: { "Content-Type": "application/json" },
      })
        .then(response => response.json())
        .then(json => {
          // Leer la respuesta de la API
          if(json.message === 'usuario created succefully'){ // Si el valor de message es "Usuario Correcto"
            onClose();
            datos();
            alert("Usuario creado correctamente")
          }
          else{ //En caso de que sea incorrecto
            console.log(json.message)
          }
        })
        .catch(error => {
          // Manejar errores de la solicitud
          console.error(error);
        });
    };

    //Modificar usuario
    const modificarUsu = () => {
      const idUsuario = modificarUsuario.usu_codigo;
      const url = "https://apis-node.vercel.app/usuarios/" + idUsuario; 
      // Realizar la solicitud POST y obtener la respuesta
      console.log(JSON.stringify(mapValuesToApi(formValues)));
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(mapValuesToApi(formValues)),
        headers: { "Content-Type": "application/json" },
      })
        .then(response => response.json())
        .then(json => {
          // Leer la respuesta de la API
          if(json.message === 'Usuario update succefully'){ // Si el valor de message es "Usuario Correcto"
            onClose();
            datos();
            alert("Usuario modificado correctamente")
          }
          else{ //En caso de que sea incorrecto
            console.log(json.message)
          }
        })
        .catch(error => {
          // Manejar errores de la solicitud
          console.error(error);
        });
    };
    
    return (
      <div>   
        <Drawer title="Agregar Usuario" width={500} placement="right" onClose={() => {onClose()}} open={open}
        extra={ 
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={() => {agregarUsuario()}} type="primary">
            Aceptar
          </Button>
        </Space>}>
         <Form layout="vertical" onValuesChange={(_, values) => setFormValues(values)}>
            <Row gutter={14}>
              <Col span={12}>
                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Porfavor, ingrese nombre' }]}>
                  <Input placeholder='Ingrese nombre de usuario'/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contra" label="Contraseña" type="password" rules={[{ required: true, message: 'Porfavor, ingrese contraseña'}]}>
                <Input.Password placeholder='Ingrese contraseña '/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={14}>
              <Col span={12}>
                <Form.Item name="tipoUsuario" label="Tipo de usuario" rules={[{ required: true, message: 'Porfavor, ingrese tipo de usuario' }]}>
                <Select placeholder="Selecciona tipo de usuario">
                    <Option value='Cliente'>Cliente</Option>
                    <Option value="Administrador">Administrador</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="telefono" label="Telefono" rules={[{ required: true, message: 'Porfavor, ingrese telefono'}]}>
                  <Input placeholder='Ingrese telefono'/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Porfavor, ingrese email'}]}>
                  <Input placeholder='Ingrese email'/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>

        <Drawer title="Modificar Usuario" width={500} placement="right" onClose={() => {onClose2()}} open={open2}
        destroyOnClose = "true"
        extra={ 
        <Space>
          <Button onClick={onClose2}>Cancelar</Button>
          <Button onClick={() => { modificarUsu()}} type="primary">
            Aceptar
          </Button>
        </Space>}>
         <Form layout="vertical" onValuesChange={(_, values) => setFormValues(values)}>
            <Row gutter={14}>
              <Col span={12}>
                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Porfavor, ingrese nombre' }]}>
                  <Input defaultValue={modificarUsuario.usu_nombre}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contra" label="Contraseña" type="password" rules={[{ required: true, message: 'Porfavor, ingrese contraseña'}]}>
                  <Input.Password defaultValue={modificarUsuario.usu_contra} placeholder='Ingrese contraseña '/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={14}>
              <Col span={12}>
                <Form.Item name="tipoUsuario" label="Tipo de usuario" rules={[{ required: true, message: 'Porfavor, seleccione tipo de usuario' }]}>
                <Select placeholder="Selecciona tipo de usuario" defaultValue={modificarUsuario.usu_permiso === "1" ? "Cliente" : "Administrador"}>
                    <Option value='Cliente'>Cliente</Option>
                    <Option value="Administrador">Administrador</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="telefono" label="Telefono" rules={[{ required: true, message: 'Porfavor, ingrese telefono'}]}>
                  <Input placeholder='Ingrese telefono' defaultValue={modificarUsuario.usu_telefono}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Porfavor, ingrese email'}]}>
                  <Input placeholder='Ingrese email' defaultValue={modificarUsuario.usu_email}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        
        <Button type='primary' onClick={showDrawer} style={{marginBottom: '20px'}}>Agregar Usuario</Button>
        <Table columns={columns} dataSource={data}/>
      </div>
  );
}

export default CClientes;