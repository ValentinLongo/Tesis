import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Space, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const { Option } = Select;

const HistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [estados, setEstados] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        // Fetch pedidos
        fetch(`${process.env.REACT_APP_API_URL}pedidos`)
            .then(response => response.json())
            .then(data => setPedidos(data.data))
            .catch(error => console.error('Error fetching pedidos:', error));
        
        // Fetch estados
        fetch(`${process.env.REACT_APP_API_URL}estados`)
            .then(response => response.json())
            .then(data => setEstados(data.data))
            .catch(error => console.error('Error fetching estados:', error));
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getDetallePedido = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}pedidos/${id}`)
            .then(response => response.json())
            .then(data => console.log('detallepedido', data.data))
            .catch(error => console.error('Error fetching pedidos:', error));
    };

    const handleChangeEstado = (pedidoId, estadoId) => {
        console.log(pedidoId,estadoId);
        fetch(`${process.env.REACT_APP_API_URL}estados/cambiarEstado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pedidoId, // Cambiado a nombre en formato camelCase
                estadoId, // Cambiado a nombre en formato camelCase
            }),
        })
            .then(response => response.json())
            .then(() => {
                setPedidos(pedidos.map(pedido => {
                    if (pedido.ped_codigo === pedidoId) {
                        return { 
                            ...pedido, 
                            ped_estado: estadoId, 
                            est_descri: estados.find(e => e.est_codigo === estadoId)?.est_descri || pedido.est_descri 
                        };
                    }
                    return pedido;
                }));
            })
            .catch(error => console.error('Error updating estado:', error));
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Código',
            dataIndex: 'ped_codigo',
            key: 'ped_codigo',
            ...getColumnSearchProps('ped_codigo'),
        },
        {
            title: 'Fecha',
            dataIndex: 'ped_fecha',
            key: 'ped_fecha',
            render: (text) => text.split('T')[0],
            ...getColumnSearchProps('ped_fecha'),
        },
        {
            title: 'Nombre',
            dataIndex: 'usu_nombre',
            key: 'usu_nombre',
            ...getColumnSearchProps('usu_nombre'),
        },
        {
            title: 'DNI',
            dataIndex: 'usu_dni',
            key: 'usu_dni',
            ...getColumnSearchProps('usu_dni'),
        },
        {
            title: 'Estado',
            dataIndex: 'ped_estado',
            key: 'ped_estado',
            render: (text, record) => (
                <Select
                    value={text}
                    onChange={(value) => handleChangeEstado(record.ped_codigo, value)}
                >
                    {estados.map(estado => (
                        <Option key={estado.est_codigo} value={estado.est_codigo}>
                            {estado.est_descri}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Observación',
            dataIndex: 'ped_observacion',
            key: 'ped_observacion',
            ...getColumnSearchProps('ped_observacion'),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => getDetallePedido(record.ped_codigo)}>Ver Detalle</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Table columns={columns} dataSource={pedidos} rowKey="ped_codigo" />
        </div>
    );
};

export default HistorialPedidos;