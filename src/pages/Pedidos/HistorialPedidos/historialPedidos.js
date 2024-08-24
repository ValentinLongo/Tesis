import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Space, Select, Modal, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import DetallePedido from './detallePedido';

const { Option } = Select;

const HistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [estados, setEstados] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [detallePedido, setDetallePedido] = useState(null);
    const [isDetalleVisible, setIsDetalleVisible] = useState(false);

    useEffect(() => {
        // Fetch pedidos
        fetch(`${process.env.REACT_APP_API_URL}pedidos`)
        .then(response => response.json())
        .then(data => {
            const formattedData = data.data.map(pedido => ({
                ...pedido,
                ped_fecha: formatDate(pedido.ped_fecha), // Formatear fecha aquí
            }));
            setPedidos(formattedData);
        })

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
            .then(data => {
                setDetallePedido(data.data);
                setIsDetalleVisible(true); // Muestra el detalle del pedido
            })
            .catch(error => console.error('Error fetching pedidos:', error));
    };

    const getDetallePedidoMensaje = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}pedidos/${id}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching pedidos:', error);
        }
    };

    const handleChangeEstado = (pedidoId, estadoId) => {
        fetch(`${process.env.REACT_APP_API_URL}estados/cambiarEstado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pedidoId, estadoId }),
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
                if (estadoId === 3) {
                    enviarMensaje(pedidoId);
                }
            })
            
            .catch(error => console.error('Error updating estado:', error));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Fecha no válida'; // Manejo de fechas inválidas
        }
        // Formatear la fecha en formato 'YYYY-MM-DD HH:mm:ss'
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const enviarMensaje = async (PedidoId) => {
        var pedido = await getDetallePedidoMensaje(PedidoId)
        console.log(pedido);
        const mensaje = `Hola ${pedido.cliente.usu_nombre}, tu pedido N° ${pedido.ped_codigo} ha sido finalizado!`;
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
            render: (text) => formatDate(text),
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

            {/* Modal para mostrar el DetallePedido */}
            <Modal
                title="Detalle del Pedido"
                visible={isDetalleVisible}
                onCancel={() => setIsDetalleVisible(false)}
                footer={null}
                width={800}
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
                {detallePedido && <DetallePedido detalle={detallePedido} />}
            </Modal>
        </div>
    );
};

export default HistorialPedidos;
