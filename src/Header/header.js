import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import ValentinL from '../assets/ValentinL icono.png'
import React,{useState, useEffect} from 'react';

const { Header } = Layout;

  const CHeader = () => {
    const [datos, setDatos] = useState([]);

  useEffect(() => {
    const datosEnStorage = JSON.parse(localStorage.getItem("account"));
    if (datosEnStorage) {
      setDatos(datosEnStorage);
    }
  }, []);

  let items = [
    { name: 'Inicio', link: '/' },
    { name: 'Clientes', link: '/clientes' },
    {name: datos.usu_nombre}
  ];

  return (
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          {items.map((item, index) => (
          <Menu.Item key={index + 1}>
          <Link to={item.link}>{item.name}</Link>
          </Menu.Item>
          ))}
        </Menu>
      </Header>
  );
}

export default CHeader;
