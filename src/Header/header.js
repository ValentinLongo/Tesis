import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Item from 'antd/es/list/Item';

const { Header } = Layout;
let items = [
    { name: 'Inicio', link: '/' },
    { name: 'Nosotros', link: '/nosotros' },
    { name: 'Login', link: '/login' }
  ];

function mostrarLink(descri){
    console.log(descri)
}

function header() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items.map((item, index) => {
            const key = index + 1;
            return {
              key,
              label: `${item.name}`,
              href: `${item.link}`
            };
          })}
        />
      </Header>
  );
}

export default header;
