import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Button, Drawer, Form, Row, Col, Input, message, Space } from 'antd';
import { loginContext } from '../Context/loginContext';
import AgregarServicio from './agregarServicios';

const CServicios = () => {
  const [dataServicio, setDataServicio] = useState([]);
  const [drawerAgregarServicio, setDrawerAgregarServicio] = useState(false);
  const [drawerEditarServicio, setDrawerEditarServicio] = useState(false);
  const [serCodigo, setSerCodigo] = useState(0);
  const [servicioModi, setServicioModi] = useState({});
  const searchInput = useRef(null);

  const abrirDrawerAgregarServicio = () => {
    setDrawerAgregarServicio(true);
  };

  const cerrarDrawerAgregarServicio = () => {
    setDrawerAgregarServicio(false);
  };

  const abrirDrawerEditarServicio = () => {
    setDrawerEditarServicio(true);
  };

  const cerrarDrawerEditarServicio = () => {
    setDrawerEditarServicio(false);
  };

  const datosServicios = () => {
    fetch(`${process.env.REACT_APP_API_URL}servicio`)
      .then(response => response.json())
      .then(data => {
        setDataServicio(data.data || []);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    datosServicios();
  }, []);

  useEffect(() => {
  }, [dataServicio]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ser_codigo',
      key: 'ser_codigo',
      width: 30,
    },
    {
      title: 'Descripción',
      dataIndex: 'ser_descripcion',
      key: 'ser_descripcion',
      width: '55%',
    },
    {
      title: 'Precio',
      dataIndex: 'ser_total',
      key: 'ser_total',
      width: '15%',
    },
    {
      title: 'Acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Editar</Button>
          <Button danger onClick={() => eliminarServicio(record)}>Eliminar</Button>
        </Space>
      ),
      width: 60,
    },
  ];

  const onEdit = (record) => {
    setSerCodigo(record.ser_codigo);
    setServicioModi(record);
    abrirDrawerEditarServicio();
  };

  const mapValuesToApi = (values) => {
    return {
      ser_descripcion: values.ser_descripcion,
      ser_total: values.ser_total,
    };
  };

  const modificarServicio = () => {
    const url = `${process.env.REACT_APP_API_URL}servicio/` + serCodigo;
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(mapValuesToApi(servicioModi)),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'servicio update succefully') {
          cerrarDrawerEditarServicio();
          datosServicios();
          message.success("Servicio modificado correctamente");
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al modificar servicio:', error);
      });
  };

  const eliminarServicio = (record) => {
    fetch( `${process.env.REACT_APP_API_URL}servicio/${record.ser_codigo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.message === 'servicio deleted succefully') {
          message.success("Servicio eliminado");
          datosServicios();
        } else {
          console.log(json.message);
        }
      })
      .catch(error => {
        console.error('Error al eliminar servicio:', error);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type='primary' onClick={abrirDrawerAgregarServicio} style={{ marginBottom: '20px' }}>Agregar Servicio</Button>
      <AgregarServicio 
        drawerAgregarServicio={drawerAgregarServicio} 
        cerrarDrawerAgregarServicio={cerrarDrawerAgregarServicio} 
        datosServicios={datosServicios}
      />
      <Drawer
        open={drawerEditarServicio}
        onClose={cerrarDrawerEditarServicio}
        destroyOnClose={true}
        title="Editar Servicio"
        extra={
          <Space>
            <Button type="primary" onClick={modificarServicio}>
              Aceptar
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" initialValues={servicioModi} onValuesChange={(_, values) => setServicioModi(values)}>
          <Row gutter={14}>
            <Col span={24}>
              <Form.Item name="ser_descripcion" label="Descripción" rules={[{ required: true, message: 'Por favor, ingrese descripción' }]}>
                <Input defaultValue={servicioModi.ser_descripcion} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="ser_total" label="Total" rules={[{ required: true, message: 'Por favor, ingrese el total' }]}>
                <Input defaultValue={servicioModi.ser_total} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Table columns={columns} dataSource={dataServicio} rowKey="ser_codigo" />
    </div>
  );
};

export default CServicios;
