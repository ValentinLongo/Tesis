import { useContext } from "react";
import { loginContext } from '../Context/loginContext';
import { Space, Button, Drawer, Form, Row, Col, Input, message } from 'antd';

//Arma objeto de Usuario
const mapValuesToApi = (values) => {
  return {
    mar_descripcion: values.nombre,
  };
};

const AgregarMarca = () =>{
    const { datosMarcas, formValues,setFormValues, drawerAgMarca,cerrarDrawerMarca} = useContext(loginContext);

    const agregarMarca = () => {
    const url = "https://apis-node.vercel.app/marca"; 
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
        if(json.message === 'marca created succefully'){ // Si el valor de message es "Usuario Correcto"
          cerrarDrawerMarca();
          datosMarcas();
          message.success("Marca creada correctamente")
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
        <Drawer title="Agregar Marca" placement="right" onClose={() => {cerrarDrawerMarca()}} open={drawerAgMarca}
        extra={ 
        <Space>
        <Button onClick={cerrarDrawerMarca}>Cancelar</Button>
        <Button onClick={() => {agregarMarca()}} type="primary">
            Aceptar
        </Button>
        </Space>}>
        <Form layout="vertical" onValuesChange={(_, values) => setFormValues(values)}>
            <Row gutter={14}>
            <Col span={24}>
                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Porfavor, ingrese nombre' }]}>
                <Input placeholder='Ingrese nombre de marca'/>
                </Form.Item>
            </Col>
            </Row>
        </Form>
        </Drawer>   
    )
}
export default AgregarMarca;