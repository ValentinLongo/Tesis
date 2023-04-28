import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import React,{useState, useEffect} from 'react';
import './header.css'

const { Header } = Layout;

  const CHeader = () => {

  let items = [
    { name: 'Inicio', link: '/' },
    { name: 'Clientes', link: '/clientes' }
  ];

  return (
      <Header style={{height: '30px', padding: '0px 0px 0px 20px'}}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{height: '30px'}}>
          {items.map((item, index) => (
          <Menu.Item key={index + 1} style={{ lineHeight: '30px' }}>
            <Link to={item.link} style={{ display: 'block', textAlign: 'center' }}>{item.name}</Link>
          </Menu.Item>
          ))}
        </Menu>
      </Header>
  );
}

export default CHeader;
