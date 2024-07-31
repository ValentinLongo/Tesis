import React, { useState, useEffect, useContext } from 'react';
import { Table, Checkbox, Row, Col, Input, Button } from 'antd';
import { loginContext } from '../../Context/loginContext';

const Step2 = ({ nextStep, prevStep }) => {
  const [dataArticulo, setDataArticulo] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { pedido, actualizarPedido } = useContext(loginContext);

  useEffect(() => {
    console.log(pedido);
    fetch(`${process.env.REACT_APP_API_URL}articulo`)
      .then(response => response.json())
      .then(data => setDataArticulo(data.data || []))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSelect = (record) => {
    setSelectedArticles([...selectedArticles, record]);
  };

  const handleDeselect = (record) => {
    setSelectedArticles(selectedArticles.filter(item => item.art_codigo !== record.art_codigo));
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

  const handleNextStep = () => {
    actualizarPedido({ ...pedido, articulos: selectedArticles });
    nextStep();
  };

  const filteredData = dataArticulo.filter(item =>
    item.art_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'art_codigo',
      key: 'art_codigo',
      width: 30,
    },
    {
      title: 'Nombre',
      dataIndex: 'art_nombre',
      key: 'art_nombre',
      width: '30%',
    },
    {
      title: 'Marca',
      dataIndex: 'mar_descripcion',
      key: 'mar_descripcion',
      width: '20%',
    },
    {
      title: 'Categoría',
      dataIndex: 'cat_descripcion',
      key: 'cat_descripcion',
      width: '20%',
    },
    {
      title: 'Seleccionar',
      render: (_, record) => (
        <Checkbox
          checked={selectedArticles.some(item => item.art_codigo === record.art_codigo)}
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
          <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Seleccionar artículo a reparar</h1>
          <Input
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: '20px' }}
          />
          <Table columns={columns} dataSource={filteredData} rowKey="art_codigo" pagination={{ pageSize: 5 }} />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button onClick={prevStep} style={{ marginRight: '10px' }}>
              Atrás
            </Button>
            <Button type="primary" onClick={handleNextStep} disabled={selectedArticles.length === 0}>
              Continuar
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Step2;