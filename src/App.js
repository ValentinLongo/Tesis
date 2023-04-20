import logo from './logo.svg';
import './App.css';
import CLogin from './Login/login.js'
import CHeader from './Header/header.js'
import CFooter from './Footer/footer.js'
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="layout todo">
      <CHeader/>
      <Content style={{padding: '0 50px',marginTop:'30px'}}>
        <div className="site-layout-content" style={{background: colorBgContainer}}>
          <CLogin/>
        </div>
      </Content>
      <CFooter/>
    </Layout>
  );
}

export default App;
