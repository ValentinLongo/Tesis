import React,{useState, useEffect} from 'react';
import { Space, Table, Button, Drawer, Form, Row, Col, Input, Select } from 'antd';
import { Option } from 'antd/es/mentions';


  const CClientes = () => {
    const[clientes,setClientes] = useState('');
    const [formValues, setFormValues] = useState({});

    //Columnas
    const columns = [
      {
        title: 'ID',
        dataIndex: 'usu_codigo',
        //key: 'usu_codigo',
        width: 30,
        //render: (text) => <a>{text}</a>,
      },
      {
        title: 'Nombre',
        dataIndex: 'usu_nombre',
        //key: 'usu_nombre',
        width: 150,
      },
      {
        title: 'Email',
        dataIndex: 'usu_email',
        //key: 'usu_email',
        width: 150,
      },
      {
        title: 'Telefono',
        dataIndex: 'usu_telefono',
        //key: 'usu_telefono',
        width: 150,
      },
      {
        title: 'Acciones',
        //key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button>Editar</Button>
            <Button danger onClick={() => eliminarUsuario(record)}>Eliminar</Button>
          </Space>
        ),
        width: 150,
      },
    ];
    //Ventana Lateral
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };

    //Traer Usuarios
    const datos = () =>{    
        fetch('https://apis-node.vercel.app/usuarios')
        .then(response => response.json())
        .then(data => setClientes(data.data))
        .catch(error => console.error(error)) 
    } 

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

    useEffect(() => {
        datos();
    }, []);

    return (
      <div>
      <Drawer title="Usuario" width={500} placement="right" onClose={onClose} open={open}
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
                <Input placeholder='Ingrese contraseña'/>
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
        <Button type='primary' onClick={showDrawer} style={{marginBottom: '20px'}}>Agregar Cliente</Button>
        <Table columns={columns} dataSource={clientes}/>
      </div>
  );
}

export default CClientes;