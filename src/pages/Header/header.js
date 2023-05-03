import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import React,{useState, useEffect, useContext} from 'react';
import { loginContext } from '../Context/loginContext';
import './header.css'

const { Header } = Layout;

  const CHeader = () => {
  const{hacerLogOut} = useContext(loginContext);
  let items = [
    { name: 'Inicio', link: '/' },
    { name: 'Usuarios', link: '/clientes' },
    { name: 'Pedidos', link: '/pedidos' }
  ];

  return (
      <Header style={{height: '30px', padding: '0px 0px 0px 20px'}}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{height: '30px'}}>
          {items.map((item, index) => (
          <Menu.Item key={index + 1} style={{ lineHeight: '30px' }}>
            <Link to={item.link} style={{ display: 'block', textAlign: 'center' }}>{item.name}</Link>
          </Menu.Item>
          ))}
          <Menu.Item style={{ lineHeight: '30px' }}>
            <a onClick={hacerLogOut}>Cerrar Sesion</a>
          </Menu.Item>
        </Menu>
      </Header>
  );
}

export default CHeader;
