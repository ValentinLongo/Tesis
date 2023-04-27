import './App.css';
// import CLogin from './Login/login.js'
import CClientes from './Clientes/clientes';
import CHeader from './Header/header.js'
import CFooter from './Footer/footer.js'
import CInicio from './Inicio/inicio.js'
import { Layout, theme } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
const { Content } = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="layout todo">
      <CHeader/>
      <Content style={{padding: '0 50px',marginTop:'30px'}}>
        <div className="site-layout-content" style={{background: colorBgContainer}}>
          <Routes>
            <Route path='/' element={<CInicio/>}/>
            <Route path='/clientes' element={<CClientes/>}/>   
          </Routes>
          <Outlet/>
        </div>
      </Content>
      <CFooter/>
    </Layout>
  );
}

export default App;