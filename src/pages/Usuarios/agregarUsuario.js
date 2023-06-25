import { useContext } from "react";
import { loginContext } from '../Context/loginContext';
import { Option } from 'antd/es/mentions';
import { Space, Button, Drawer, Form, Row, Col, Input, Select, message } from 'antd';

//Arma objeto de Usuario
const mapValuesToApi = (values) => {
  let usu_permiso = "";
  if(values.tipoUsuario === "Cliente"){
      usu_permiso = "1";
  }
  else{
    usu_permiso = "2";
  }
  return {
    usu_nombre: values.nombre,
    usu_contra: values.contra,
    usu_email: values.email,
    usu_telefono: values.telefono,
    usu_permiso: usu_permiso
  };
};

const AgregarUsuario = () =>{
    const { datos, open,onClose, formValues,setFormValues} = useContext(loginContext);

    const agregarUsuario = () => {
    const url = "https://apis-node.vercel.app/usuarios"; 
    // Realizar la solicitud POST y obtener la respuesta
    console.log(JSON.stringify(mapValuesToApi(formValues)));
    fetch(url, {
      method: "POST",
      body: JSON.stringify(mapValuesToApi(formValues)),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(json => {
        // Leer la respuesta de la API
        if(json.message === 'usuario created succefully'){ // Si el valor de message es "Usuario Correcto"
          onClose();
          datos();
          message.success("Usuario creado correctamente")
        }
        else{ //En caso de que sea incorrecto
          console.log(json.message)
        }
      })
      .catch(error => {
        // Manejar errores de la solicitud
        console.error(error);
      });
    }; 

    return(
        <Drawer title="Agregar Usuario" width={500} placement="right" onClose={() => {onClose()}} open={open}
        extra={ 
        <Space>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => {agregarUsuario()}} type="primary">
            Aceptar
        </Button>
        </Space>}>
        <Form layout="vertical" onValuesChange={(_, values) => setFormValues(values)}>
            <Row gutter={14}>
            <Col span={12}>
                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Porfavor, ingrese nombre' }]}>
                <Input placeholder='Ingrese nombre de usuario'/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="contra" label="Contraseña" type="password" rules={[{ required: true, message: 'Porfavor, ingrese contraseña'}]}>
                <Input.Password placeholder='Ingrese contraseña '/>
                </Form.Item>
            </Col>
            </Row>
            <Row gutter={14}>
            <Col span={12}>
                <Form.Item name="tipoUsuario" label="Tipo de usuario" rules={[{ required: true, message: 'Porfavor, ingrese tipo de usuario' }]}>
                <Select placeholder="Selecciona tipo de usuario">
                    <Option value='Cliente'>Cliente</Option>
                    <Option value="Administrador">Administrador</Option>
                </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="telefono" label="Telefono" rules={[{ required: true, message: 'Porfavor, ingrese telefono'}]}>
                <Input placeholder='Ingrese telefono'/>
                </Form.Item>
            </Col>
            </Row>
            <Row gutter={16}>
            <Col span={24}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Porfavor, ingrese email'}]}>
                <Input placeholder='Ingrese email'/>
                </Form.Item>
            </Col>
            </Row>
        </Form>
        </Drawer>   
    )
}
export default AgregarUsuario;