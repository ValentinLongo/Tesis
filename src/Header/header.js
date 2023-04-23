import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import ValentinL from '../assets/ValentinL icono.png'
import React,{useState} from 'react';

const { Header } = Layout;


  const CHeader = () => {
    let items = [
      { name: 'Inicio', link: '/' },
      { name: 'Nosotros', link: '/nosotros' }
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
