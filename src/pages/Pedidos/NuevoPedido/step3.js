import React, { useState, useEffect, useContext } from 'react';
import { Table, Checkbox, Row, Col, Input, Button } from 'antd';
import { loginContext } from '../../Context/loginContext';

const Step3 = ({ nextStep, prevStep }) => {
  const [dataServicio, setDataServicio] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { pedido, actualizarPedido } = useContext(loginContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}servicio`)
      .then(response => response.json())
      .then(data => setDataServicio(data.data || []))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleNextStep = () => {
    actualizarPedido({ ...pedido, servicios: selectedServices });
    nextStep();
  };

  const handleSelect = (record) => {
    setSelectedServices([...selectedServices, record]);
  };

  const handleDeselect = (record) => {
    setSelectedServices(selectedServices.filter(item => item.ser_codigo !== record.ser_codigo));
  };

  const handleCheckboxChange = (e, record) => {
    if (e.target.checked) {
      handleSelect(record);
    } else {
      handleDeselect(record);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = dataServicio.filter(item =>
    item.ser_descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      width: '50%',
    },
    {
      title: 'Precio',
      dataIndex: 'ser_total',
      key: 'ser_total',
      width: '20%',
    },
    {
      title: 'Seleccionar',
      render: (_, record) => (
        <Checkbox
          checked={selectedServices.some(item => item.ser_codigo === record.ser_codigo)}
          onChange={(e) => handleCheckboxChange(e, record)}
        />
      ),
      width: 60,
    },
  ];

  return (
    <Row justify="center">
      <Col xs={30} sm={26} md={20} lg={18} xl={12}>
        <div>
          <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Seleccionar servicio</h1>
          <Input
            placeholder="Buscar por descripción"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: '20px' }}
          />
          <Table columns={columns} dataSource={filteredData} rowKey="ser_codigo" pagination={{ pageSize: 5 }} />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button onClick={prevStep} style={{ marginRight: '10px' }}>
              Atrás
            </Button>
            <Button type="primary" onClick={handleNextStep} disabled={selectedServices.length === 0}>
              Continuar
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Step3;