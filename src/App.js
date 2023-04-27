import './App.css';
// import CLogin from './Login/login.js'
import CClientes from './Clientes/clientes';
import CHeader from './Header/header.js'
import CFooter from './Footer/footer.js'
import CInicio from './Inicio/inicio.js'
import { Layout, theme,Breadcrumb } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import React,{useState, useEffect} from 'react';
const { Content } = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const datosEnStorage = JSON.parse(localStorage.getItem("account"));
    if (datosEnStorage) {
      setDatos(datosEnStorage);
    }
  }, []);
  return (
    
    <Layout className="layout todo">
      <CHeader/>
      <Breadcrumb style={{ margin: '15px 50px' }}>
          <Breadcrumb.Item className='bienvenidoText'>Bienvenido, {datos.usu_nombre} !</Breadcrumb.Item>
        </Breadcrumb>
      <Content style={{padding: '0 50px',marginTop:'0px'}}>
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