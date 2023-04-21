import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Item from 'antd/es/list/Item';
import { Link } from 'react-router-dom';

const { Header } = Layout;
let items = [
    { name: 'Inicio', link: '/' },
    { name: 'Nosotros', link: '/nosotros' },
    { name: 'Login', link: '/login' }
  ];

function header() {

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

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

export default header;
