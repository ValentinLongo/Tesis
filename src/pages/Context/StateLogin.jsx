import React,{ useState,useEffect } from 'react';
import { loginContext } from './loginContext';

//-----------LOGIN-----------
const StateLogin = ({children}) =>{
const [user, setUser] = useState('');
const [idUsuario, setIdUsuario] = useState(0);
const [isLogin, setIsLogin] = useState(false);
const [hasError, setHasError] = useState(false);
const [formValues, setFormValues] = useState({});

const hacerLogin = (usuario, contra) => {
  const url = `${process.env.REACT_APP_API_URL}usuarios/login`;
  const data = { usu_nombre: usuario, usu_contra: contra };
  console.log(data);
  
  fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
  })
  .then(response => {
      if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
      }
      return response.json();
  })
  .then(json => {
      if (json.message === 'Usuario Correcto') {
          setUser(usuario);
          setIdUsuario(json.data[0].usu_codigo);
          setIsLogin(true);
          setHasError(false);
      } else {
          setIsLogin(false);
          setHasError(true);
      }
  })
  .catch(error => {
      console.error('Error:', error);
      setIsLogin(false);
      setHasError(true);
  });
};
const hacerLogOut = () => {
  setUser('');
  setIdUsuario(0);
  setIsLogin(false); 
}

//-----------USUARIOS-----------
const [data,setData] = useState('');
const [open, setOpen] = useState(false);
const [open2, setOpen2] = useState(false);
const [modificarUsuario, setModificarUsuario] = useState({});

const datos = () =>{    
  fetch(`${process.env.REACT_APP_API_URL}usuarios`)
  .then(response => response.json())
  .then(data => setData(data.data))
  .catch(error => console.error(error)) 
}
useEffect(() => {
  datos();
}, []);

//Drawer agregar usuario
const showDrawer = () => {
  setOpen(true);
};
const onClose = () => {
      setOpen(false);
};
//Drawer modificar usuario
const showDrawer2 = () => {
      setOpen2(true);
};
const onClose2 = () => {
      setOpen2(false);
};

//-----------PEDIDOS-----------
const [pedido, setPedido] = useState({
  cliente: null,
  articulos: [],
  servicios: [],
  adicionales:[],
  observaciones:null
});

const actualizarPedido = (nuevoPedido) => {
  setPedido(prevState => ({
      ...prevState,
      ...nuevoPedido
  }));
};

//-----------CATEGORIAS-----------
const [dataCategoria,setDataCategoria] = useState('');
const [drawerAgCategoria, setDrawerAgCategoria] = useState(false);

const abrirDrawerCategoria = () =>{
  setDrawerAgCategoria(true);
}

const cerrarDrawerCategoria = () =>{
  setDrawerAgCategoria(false);
}

const datosCategorias = () => {
  fetch(`${process.env.REACT_APP_API_URL}categoria`)
    .then(response => response.json())
    .then(data => setDataCategoria(data.data))
    .catch(error => console.error(error));
    console.log(dataCategoria);
};

useEffect(() => {
  datosCategorias();
}, []);

//-----------MARCAS-----------
const [dataMarca,setDataMarca] = useState('');
const [drawerAgMarca, setDrawerAgMarca] = useState(false);

const datosMarcas = () => {
  fetch(`${process.env.REACT_APP_API_URL}marca`)
    .then(response => response.json())
    .then(data => setDataMarca(data.data))
    .catch(error => console.error(error));
};
  
useEffect(() => {
  datosMarcas();
}, []);

const abrirDrawerMarca = () =>{
  setDrawerAgMarca(true);
}

const cerrarDrawerMarca = () =>{
  setDrawerAgMarca(false);
}

//-----------CATEGORIAS-----------
const [dataArticulo,setDataArticulo] = useState('');
const [drawerAgArticulo, setDrawerAgArticulo] = useState(false);

const abrirDrawerArticulo = () =>{
  setDrawerAgArticulo(true);
}

const cerrarDrawerArticulo = () =>{
  setDrawerAgArticulo(false);
}

const datosArticulos = () => {
  fetch(`${process.env.REACT_APP_API_URL}articulo`)
    .then(response => response.json())
    .then(data => setDataArticulo(data.data))
    .catch(error => console.error(error));
    console.log(dataArticulo);
};

useEffect(() => {
  datosArticulos();
}, []);

return(
    <loginContext.Provider
    value= {{
        user,
        idUsuario,
        isLogin,
        hasError,
        hacerLogin,
        hacerLogOut,
        data,
        datos,
        open,
        open2,
        showDrawer,
        showDrawer2,
        onClose,
        onClose2,
        formValues,
        setFormValues,
        modificarUsuario,
        setModificarUsuario,
        dataMarca,
        datosMarcas,
        drawerAgMarca,
        abrirDrawerMarca,
        cerrarDrawerMarca,
        drawerAgCategoria,
        abrirDrawerCategoria,
        cerrarDrawerCategoria,
        datosCategorias,
        drawerAgArticulo,
        abrirDrawerArticulo,
        cerrarDrawerArticulo,
        datosArticulos,
        pedido,
        actualizarPedido
    }}
    >
        {children}
    </loginContext.Provider>
)



}

export default StateLogin;