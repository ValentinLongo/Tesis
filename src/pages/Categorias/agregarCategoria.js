import { useContext } from "react";
import { loginContext } from '../Context/loginContext';
import { Space, Button, Drawer, Form, Row, Col, Input, message } from 'antd';

// Arma objeto de Categoria
const mapValuesToApi = (values) => {
  return {
    cat_descripcion: values.nombre,
  };
};

const AgregarCategoria = ({ drawerAgregarCategoria, cerrarDrawerAgregarCategoria, datosCategorias }) => {
  const { formValues, setFormValues } = useContext(loginContext);

  const agregarCategoria = () => {
    const url = `${process.env.REACT_APP_API_URL}categoria`;
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
        if (json.message === 'Categoria created succefully') {
          cerrarDrawerAgregarCategoria();
          datosCategorias();
          message.success("Categoría creada correctamente");
        } else {
          // En caso de que sea incorrecto
          console.log(json.message);
        }
      })
      .catch(error => {
        // Manejar errores de la solicitud
        console.error(error);
      });
  };

  return (
    <Drawer
      title="Agregar Categoría"
      placement="right"
      onClose={cerrarDrawerAgregarCategoria}
      open={drawerAgregarCategoria}
      extra={
        <Space>
          <Button onClick={cerrarDrawerAgregarCategoria}>Cancelar</Button>
          <Button onClick={agregarCategoria} type="primary">
            Aceptar
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" onValuesChange={(_, values) => setFormValues(values)}>
        <Row gutter={14}>
          <Col span={24}>
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor, ingrese nombre' }]}>
              <Input placeholder='Ingrese nombre de categoría' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AgregarCategoria;