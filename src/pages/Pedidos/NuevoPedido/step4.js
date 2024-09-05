import React, { useContext, useState, useEffect } from 'react';
import { Button, Table, Input, Row, Col, Typography, notification } from 'antd';
import { loginContext } from '../../Context/loginContext';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Step4 = ({ prevStep }) => {
  const { pedido, actualizarPedido } = useContext(loginContext);
  const [observaciones, setObservaciones] = useState('');
  const [totalServicios, setTotalServicios] = useState(0);
  const [adicionales, setAdicionales] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    if (pedido) {
      const totalServicios = pedido.servicios.reduce((sum, servicio) => sum + servicio.ser_total, 0);
      const totalAdicionales = adicionales.reduce((sum, adicional) => sum + parseFloat(adicional.precio || 0), 0);
      setTotalServicios(totalServicios + totalAdicionales);
    }
  }, [pedido, adicionales]);

  const handleFinish = async () => {
    const pedidoConObservaciones = {
      ...pedido,
      observaciones,
      adicionales,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoConObservaciones),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      notification.success({
        message: 'Pedido creado con éxito',
        description: 'El pedido ha sido creado correctamente.',
      });
      console.log('api', data.data);
      actualizarPedido(data.data);
      printTicket(data.data); 

      await enviarMensaje(data.data, totalServicios);
    } catch (error) {
      notification.error({
        message: 'Error al crear el pedido',
        description: error.message,
      });
    }
  };

  const handleAddAdicional = () => {
    if (descripcion && precio) {
      setAdicionales([...adicionales, { descripcion, precio: parseFloat(precio) }]);
      setDescripcion('');
      setPrecio('');
    }
  };

  const enviarMensaje = async (pedido, totalServicios) => {
    const mensaje = `Hola ${pedido.cliente.usu_nombre}, tu pedido es N° ${pedido.ped_codigo}, muchas gracias por confiar en nosotros!`;
    const numero = `549${pedido.cliente.usu_telefono}@c.us`;

    try {
      await fetch('http://localhost:3010/enviar-mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensaje, numero }),
      });
      notification.success({
        message: 'Mensaje enviado',
        description: 'El mensaje ha sido enviado correctamente.',
      });
    } catch (error) {
      notification.error({
        message: 'Error al enviar el mensaje',
        description: error.message,
      });
    }
  };

  const clienteColumns = [
    {
      title: 'Código Cliente',
      dataIndex: 'usu_codigo',
      key: 'usu_codigo',
    },
    {
      title: 'Nombre Cliente',
      dataIndex: 'usu_nombre',
      key: 'usu_nombre',
    },
    {
      title: 'Email',
      dataIndex: 'usu_email',
      key: 'usu_email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'usu_telefono',
      key: 'usu_telefono',
    },
    {
      title: 'DNI',
      dataIndex: 'usu_dni',
      key: 'usu_dni',
    },
  ];

  const articuloColumns = [
    {
      title: 'Código',
      dataIndex: 'art_codigo',
      key: 'art_codigo',
    },
    {
      title: 'Nombre',
      dataIndex: 'art_nombre',
      key: 'art_nombre',
    },
    {
      title: 'Marca',
      dataIndex: 'mar_descripcion',
      key: 'mar_descripcion',
    },
    {
      title: 'Categoría',
      dataIndex: 'cat_descripcion',
      key: 'cat_descripcion',
    },
  ];

  const servicioColumns = [
    {
      title: 'Código',
      dataIndex: 'ser_codigo',
      key: 'ser_codigo',
    },
    {
      title: 'Descripción',
      dataIndex: 'ser_descripcion',
      key: 'ser_descripcion',
    },
    {
      title: 'Precio',
      dataIndex: 'ser_total',
      key: 'ser_total',
    },
  ];

  const adicionalColumns = [
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
    },
  ];

  const printTicket = (pedido) => {
    const ticketWindow = window.open('', 'PRINT', 'height=600,width=800');
    ticketWindow.document.write('<html><head><title>Ticket de Pedido</title>');
    ticketWindow.document.write('</head><body>');
    ticketWindow.document.write('<h1>Ticket de Pedido</h1>');
    ticketWindow.document.write(`<p><strong>Código de Pedido:</strong> ${pedido.ped_codigo}</p>`);
    ticketWindow.document.write('<h2>Cliente</h2>');
    ticketWindow.document.write(`<p>${pedido.cliente.usu_nombre} (DNI: ${pedido.cliente.usu_dni})</p>`);
    ticketWindow.document.write('<h2>Artículos</h2>');
    pedido.articulos.forEach(articulo => {
      ticketWindow.document.write(`<p>${articulo.art_nombre} - ${articulo.mar_descripcion} (${articulo.cat_descripcion})</p>`);
    });
    ticketWindow.document.write('<h2>Servicios</h2>');
    pedido.servicios.forEach(servicio => {
      ticketWindow.document.write(`<p>${servicio.ser_descripcion} - $${servicio.ser_total}</p>`);
    });
    ticketWindow.document.write('</body></html>');
    ticketWindow.document.close();
    ticketWindow.focus();
    ticketWindow.print();
    ticketWindow.close();
  };

  // Chequeo para manejar caso cuando `pedido` aún no está disponible
  if (!pedido) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Title style={{ textAlign: 'center' }}>Resumen del Pedido</Title>

      <h2 style={{ marginBottom: '10px' }}>Cliente</h2>
      <Table
        columns={clienteColumns}
        dataSource={[pedido.cliente]}
        pagination={false}
        rowKey="usu_codigo"
        bordered
      />

      <h2 style={{ marginBottom: '10px', marginTop: '20px' }}>Artículos</h2>
      <Table
        columns={articuloColumns}
        dataSource={pedido.articulos}
        pagination={{ pageSize: 5 }}
        rowKey="art_codigo"
        bordered
      />

      <h2 style={{ marginBottom: '10px', marginTop: '20px' }}>Servicios</h2>
      <Table
        columns={servicioColumns}
        dataSource={pedido.servicios}
        pagination={{ pageSize: 5 }}
        rowKey="ser_codigo"
        bordered
      />

      <h2 style={{ marginBottom: '10px', marginTop: '20px' }}>Adicionales</h2>
      <Row style={{ marginBottom: '20px', textAlign: 'left', justifyContent: 'start' }}>
        <Col span={10}>
          <Input
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            type="number"
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={handleAddAdicional}>
            Añadir
          </Button>
        </Col>
      </Row>
      <Table
        columns={adicionalColumns}
        dataSource={adicionales}
        pagination={{ pageSize: 5 }}
        rowKey="descripcion"
        bordered
      />

      <Row justify="center" style={{ marginBottom: '20px', textAlign: 'left', justifyContent: 'start' }}>
        <Col span={16}>
          <TextArea
            placeholder="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={4}
          />
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: '20px', textAlign: 'left', justifyContent: 'start' }}>
        <Col span={16}>
          <Text strong style={{ fontSize: 30 }}>Total de Servicios: ${totalServicios}</Text>
        </Col>
      </Row>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={prevStep} style={{ marginRight: '10px' }}>
          Atrás
        </Button>
        <Button type="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
};

export default Step4;