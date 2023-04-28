import React,{useState, useEffect} from 'react';
import { Space, Table, Button, Drawer, Form, Row, Col, Input, Select} from 'antd';

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
          <Button onClick={() => handleDelete(record)}>Editar</Button>
          <Button danger>Eliminar</Button>
        </Space>
      ),
      width: 150,
    },
  ];

  const handleDelete = (record) => {
    console.log(`Eliminando usuario con código ${record.usu_codigo}`);
    // Aquí debes escribir el código que elimine el usuario del servidor
  };

  const CClientes = () => {
    const[clientes,setClientes] = useState('');

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

    useEffect(() => {
        datos();
    }, []);

    return (
      
      <div>
      <Drawer title="Usuario" width={500} placement="right" onClose={onClose} open={open}
      extra={ 
      <Space>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose} type="primary">
          Aceptar
        </Button>
      </Space>}
      >
        <Form layout="vertical">
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
                  <Option value="Cliente">Cliente</Option>
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