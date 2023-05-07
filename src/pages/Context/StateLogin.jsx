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
    const url = "https://apis-node.vercel.app/usuarios/login";  // Coloca la URL de la API aquí
    const data = { usu_nombre: usuario, usu_contra: contra };  // Coloca los datos que quieres enviar aquí

    // Realizar la solicitud POST y obtener la respuesta
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(json => {
        // Leer la respuesta de la API
        if(json.message === 'Usuario Correcto'){ // Si el valor de message es "Usuario Correcto"
            setUser(usuario);
            setIdUsuario(json.data[0].usu_codigo);
            setIsLogin(true); 
            setHasError(false);
        }
        else{ //En caso de que sea incorrecto
            setIsLogin(false);
            setHasError(true);
        }
      })
      .catch(error => {
        // Manejar errores de la solicitud
        console.error(error);
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
  fetch('https://apis-node.vercel.app/usuarios')
  .then(response => response.json())
  .then(data => setData(data.data))
  .catch(error => console.error(error)) 
}

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
        setModificarUsuario
    }}
    >
        {children}
    </loginContext.Provider>
)

}

export default StateLogin;