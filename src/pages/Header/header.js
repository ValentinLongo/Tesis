import { Layout, Menu, Modal } from 'antd';
import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { loginContext } from '../Context/loginContext';

const { Header } = Layout;

const CHeader = () => {
  const { hacerLogOut } = useContext(loginContext);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const showConfirm = () => {
    setConfirmVisible(true);
  };

  const handleConfirmOk = () => {
    hacerLogOut();
    setConfirmVisible(false);
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
  };

  let items = [
    { name: 'Inicio', link: '/' },
    { name: 'Usuarios', link: '/usuarios' },
    {
      name: 'Pedidos',
      children: [
        { name: 'Nuevo Pedido', link: '/nuevopedido' },
        { name: 'Historial de Pedidos', link: '/historialpedidos' },
      ],
    },
    {
      name: 'Articulos',
      children: [
        { name: 'Articulos', link: '/articulos' },
        { name: 'Marcas', link: '/marcas' },
        { name: 'Categorias', link: '/categorias' },
      ]
    },
    { name: 'Servicios', link: '/servicios' }
  ];

  return (
    <Header style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '30px' }}>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1, lineHeight: '30px' }}>
        {items.map((item, index) =>
          item.children ? (
            <Menu.SubMenu key={index + 1} title={item.name} style={{ lineHeight: '30px' }}>
              {item.children.map((child, childIndex) => (
                <Menu.Item key={`${index + 1}-${childIndex + 1}`} style={{ lineHeight: '30px' }}>
                  <Link to={child.link} style={{ display: 'block', textAlign: 'center', color: 'white', marginTop: '5px' }}>
                    {child.name}
                  </Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={index + 1} style={{ lineHeight: '30px' }}>
              <Link to={item.link} style={{ display: 'block', textAlign: 'center' }}>
                {item.name}
              </Link>
            </Menu.Item>
          )
        )}
      </Menu>
      <Menu theme="dark" mode="horizontal" style={{ lineHeight: '30px', borderBottom: 'none' }}>
        <Menu.Item style={{ lineHeight: '30px' }}>
          <a onClick={showConfirm}>Cerrar Sesión</a>
        </Menu.Item>
      </Menu>
      <Modal
        title="Cerrar Sesión"
        visible={confirmVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText="Salir"
        cancelText="Cancelar"
      >
        <p>¿Está seguro de que desea cerrar la sesión?</p>
      </Modal>
    </Header>
  );
};

export default CHeader;