import './App.css';
import CUsuarios from './pages/Usuarios/usuarios.js';
import CHeader from './pages/Header/header.js';
import CFooter from './pages/Footer/footer.js';
import CInicio from './pages/Inicio/inicio.js';
import CNuevoPedido from './pages/Pedidos/NuevoPedido/nuevoPedido.js';
import CHistorialPedidos from './pages/Pedidos/HistorialPedidos/historialPedidos.js';
import CArticulos from './pages/Articulos/articulos'; 
import CMarcas from './pages/Marcas/marcas';
import CCategorias from './pages/Categorias/categorias.js';
import CServicios from './pages/Servicios/servicios.js';
import { Layout, theme,Breadcrumb } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import React,{useContext} from 'react';
import { loginContext } from './pages/Context/loginContext';
const { Content } = Layout;

function App() {
  const{user} = useContext(loginContext);

  const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
    
    <Layout className="layout todo">
      <CHeader />
      <Breadcrumb style={{ margin: '5px 20px' }}>
          <Breadcrumb.Item className='bienvenidoText'>Bienvenido, {user} !</Breadcrumb.Item>
        </Breadcrumb>
      <Content style={{padding: '0 20px',marginTop:'0px'}}>
        <div className="site-layout-content" style={{background: colorBgContainer}}>
          <Routes>
            <Route path='/' element={<CInicio/>}/>
            <Route path='/usuarios' element={<CUsuarios/>}/>
            <Route path='/nuevopedido' element={<CNuevoPedido/>}/>
            <Route path='/historialpedidos' element={<CHistorialPedidos/>}/>
            <Route path='/articulos' element={<CArticulos/>}/>
            <Route path='/marcas' element={<CMarcas/>}/>
            <Route path='/categorias' element={<CCategorias/>}/>
            <Route path='/servicios' element={<CServicios/>}/>
          </Routes>
          <Outlet/>
        </div>
      </Content>
      <CFooter/>
    </Layout>
  );
}

export default App;