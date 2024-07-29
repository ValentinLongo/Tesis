import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React,{useState,useRef, useContext} from 'react';
import { Space, Table, Button,  Input, Drawer, Form, Row, Col, message} from 'antd';
import { loginContext } from '../Context/loginContext';
import AgregarMarca from './agregarMarca';

const CMarcas = () => {
    const {abrirDrawerMarca} = useContext(loginContext);
    const { dataMarca, datosMarcas } = useContext(loginContext);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [open, setOpen] = useState(false);
    const [marCodigo, setMarCodigo] = useState(0);
    const [marcaModi, setMarcaModi] = useState({});
    const searchInput = useRef(null);



    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
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
          title: 'id',
          dataIndex: 'mar_codigo',
          key: 'name',
          width: 30,
          ...getColumnSearchProps('mar_codigo')
        },
        {
          title: 'Nombre',
          dataIndex: 'mar_descripcion',
          key: 'mar_descripcion',
          width: '75%',
          ...getColumnSearchProps('mar_descripcion'),
        },
        {
          title: 'Acciones',
          //key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button onClick={() => onEdit(record)}>Editar</Button>
              <Button danger onClick={() => eliminarMarca(record)}>Eliminar</Button>
            </Space>
          ),
          width: 60,
        },
      ];

    const onEdit = (record) => {
        setMarCodigo(record.mar_codigo);
        setMarcaModi(record);
        showDrawer();
      };

    const mapValuesToApi = (values) => {
        return {
          mar_descripcion:values.mar_descripcion
        };
    };

    const modificarMarca = () => {
        const url = `${process.env.REACT_APP_API_URL}marca/` + marCodigo; 
        // Realizar la solicitud POST y obtener la respuesta
        console.log(JSON.stringify(mapValuesToApi(marcaModi)));
        fetch(url, {
          method: "PUT",
          body: JSON.stringify(mapValuesToApi(marcaModi)),
          headers: { "Content-Type": "application/json" },
        })
          .then(response => response.json())
          .then(json => {
            // Leer la respuesta de la API
            if(json.message === 'marca update succefully'){ 
              onClose();
              datosMarcas();
              message.success("Marca modificada correctamente")
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

    const eliminarMarca = (record) => {
        fetch(`${process.env.REACT_APP_API_URL}marca/${record.mar_codigo}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(json => {
        if(json.message === 'marca deleted succefully'){ 
          message.success("Marca eliminada");
          datosMarcas();
        }
        else{ //En caso de que sea incorrecto
          console.log(json.message)
        }
      })
        .catch(error => {
          console.error('Error al eliminar usuario:', error);
        });
    };
    return (
      <div style={{padding: 20}}>
        <AgregarMarca/>
        <Drawer open={open} onClose={() =>{onClose()}} destroyOnClose = "true" title="Editar Marca"
        extra={
        <Space>
          <Button type="primary" onClick={() => { modificarMarca()}}>
            Aceptar
          </Button>
        </Space>
        }
        >
        <Form layout="vertical" initialValues={marcaModi} onValuesChange={(_, values) => setMarcaModi(values)}>
            <Row gutter={14}>
              <Col span={24}>
                <Form.Item name="mar_descripcion" label="Nombre" rules={[{ required: true, message: 'Porfavor, ingrese nombre' }]}>
                  <Input defaultValue={marcaModi.mar_descripcion}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <Button type='primary' onClick={() => {abrirDrawerMarca()}} style={{marginBottom: '20px'}}>Agregar Marca</Button>
        <Table columns={columns} dataSource={dataMarca}/>
      </div>
    );
  };
export default CMarcas;