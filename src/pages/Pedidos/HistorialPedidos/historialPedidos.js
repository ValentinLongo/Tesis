import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const HistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}pedidos`)
            .then(response => response.json())
            .then(data => setPedidos(data.data))
            .catch(error => console.error('Error fetching pedidos:', error));
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

    const getDetallePedido = (id) =>{
        fetch(`${process.env.REACT_APP_API_URL}pedidos/${id}`)
            .then(response => response.json())
            .then(data => console.log('detallepedido', data.data))
            .catch(error => console.error('Error fetching pedidos:', error));
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
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
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
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
            dataIndex: 'est_descri',
            key: 'est_descri',
            ...getColumnSearchProps('est_descri'),
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