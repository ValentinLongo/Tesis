import { Button, Menu } from 'antd';
import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusOutlined,
    FileSearchOutlined
  } from '@ant-design/icons';

function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem('Nuevo Pedido', '1',<PlusOutlined />),
    getItem('Option 2', '2',<FileSearchOutlined />),
    getItem('Option 3', '3',''),
    getItem('Navigation Two', 'sub2','', [
      getItem('Option 9', '9'),
      getItem('Option 10', '10'),
      getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
    ]),
  ];

const Pedidos = () =>{
const [collapsed, setCollapsed] = useState(false);
const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div
      style={{
        width: 256,
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
}

export default Pedidos;