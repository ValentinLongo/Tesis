import { Button, Checkbox, Form, Input, Alert } from 'antd';
import './login.css'
import React,{ useContext } from 'react';
import { loginContext } from '../Context/loginContext';
import CApp from '../../App.js'


const Login = () => {
    const {hasError,isLogin,hacerLogin} = useContext(loginContext);

    const onFinish = (values) => {
        hacerLogin(values.usuario,values.contrasenia);
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