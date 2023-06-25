import { useContext } from "react";
import { loginContext } from '../../Context/loginContext.js';
import { Drawer } from "antd";

const BuscarArticulo = () =>{
    const { cerrarBuscarArticuloDrawer,drawerVisible } = useContext(loginContext);
    return(
        <Drawer title="Buscar Artículo" placement="right" closable={false} visible={drawerVisible} onClose={cerrarBuscarArticuloDrawer}>
        {/* Contenido del Drawer */}
      </Drawer>
    )
}

export default BuscarArticulo;