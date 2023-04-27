import React,{useState, useEffect} from 'react';
import { Space, Table, Button} from 'antd';

const columns = [
    {
      title: 'Nombre',
      dataIndex: 'usu_nombre',
      key: 'usu_nombre',
      width: 150,
      //render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'usu_email',
      key: 'usu_email',
      width: 150,
    },
    {
        title: 'Telefono',
        dataIndex: 'usu_telefono',
        key: 'usu_telefono',
        width: 150,
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button>Editar</Button>
          <Button danger>Eliminar</Button>
        </Space>
      ),
      width: 150,
    },
  ];


  const CClientes = () => {
    const[clientes,setClientes] = useState('');

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
        <Button type='primary' style={{marginBottom: '20px'}}>Agregar Cliente</Button>
        <Table columns={columns} dataSource={clientes}/>
      </div>
  );
}

export default CClientes;