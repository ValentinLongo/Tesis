import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React,{useState, useEffect,useRef, useContext} from 'react';
import { Space, Table, Button, Drawer, Form, Row, Col, Input, Select, message } from 'antd';
import { Option } from 'antd/es/mentions';
import { loginContext } from '../Context/loginContext';

const CMarcas = () => {
    const { dataMarca, datosMarcas } = useContext(loginContext);
  
    return (
      <div>
      </div>
    );
  };
export default CMarcas;