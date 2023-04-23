import { Button, Checkbox, Form, Input, Alert } from 'antd';
import './login.css'
import React,{ useState } from 'react';
import CApp from '../App.js'

const Login = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [hasError, setHasError] = useState(false);

    const onFinish = (values) => {
        setUser(values.usuario);
        setPassword(values.contrasenia);
        if(user === 'Vale'){ //En caso de que sea correcto
            let datosUsuario = JSON.stringify(values);
            localStorage.setItem('account',datosUsuario);
            setIsLogin(true); 
            setHasError(false);
        }
        else{ //En caso de que sea incorrecto
            setIsLogin(false);
            setHasError(true);
        }
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return(
    <div>
        {isLogin ? <CApp/> :
        <div className='loginContainer'>
            
            <div className='Container'>
                <h1>Ingreso</h1>
                <div className='Formulario'>
                    <Form
                        name="basic"
                        labelCol={{
                        span: 8,
                        }}
                        wrapperCol={{
                        span: 16,
                        }}
                        style={{
                        maxWidth: 600,
                        }}
                        initialValues={{
                        remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                        label="Usuario"
                        name="usuario"
                        rules={[
                            {
                            required: true,
                            message: 'Porfavor, ingrese su usuario',
                            },
                        ]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item
                        label="Contraseña"
                        name="contrasenia"
                        rules={[
                            {
                            required: true,
                            message: 'Porfavor, ingrese su contraseña',
                            },
                        ]}
                        >
                        <Input.Password />
                        </Form.Item>

                        <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                        >
                        <Button type="primary" htmlType="submit">
                            Aceptar
                        </Button>
                        {hasError &&
                            <h4 className='Error'>Datos Incorrectos</h4>                    
                        }
                        </Form.Item>
                    </Form>        
                </div>        
            </div>        
        </div>          
        }
    </div>
      
    )
 };
export default Login;