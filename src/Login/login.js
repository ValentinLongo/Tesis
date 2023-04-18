import { Button, Checkbox, Form, Input } from 'antd';
import './login.css'

const onFinish = (values) => {
  console.log('Success:', values);
  console.log(values.usuario)
};


const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const login = () => (
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
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                <Checkbox>Recordarme</Checkbox>
                </Form.Item>

                <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                <Button type="default" htmlType="submit">
                    Aceptar
                </Button>
                </Form.Item>
            </Form>        
        </div>        
    </div>


);
export default login;