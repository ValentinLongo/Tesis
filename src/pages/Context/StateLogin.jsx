import React,{ useState } from 'react';
import { loginContext } from './loginContext';

const StateLogin = ({children}) =>{
const [user, setUser] = useState('');
const [idUsuario, setIdUsuario] = useState(0);
const [isLogin, setIsLogin] = useState(false);
const [hasError, setHasError] = useState(false);

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

return(
    <loginContext.Provider
    value= {{
        user,
        idUsuario,
        isLogin,
        hasError,
        hacerLogin
    }}
    >
        {children}
    </loginContext.Provider>
)

}

export default StateLogin;