import './inicio.css';
import { useEffect, useState } from 'react';

function Inicio() {
  const [pendienteCount, setPendienteCount] = useState(0);
  const [preparacionCount, setPreparacionCount] = useState(0);
  const [finalizadoCount, setFinalizadoCount] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}pedidos`)
      .then(response => response.json())
      .then(data => {
        const pedidos = data.data;
        const pendiente = pedidos.filter(pedido => Number(pedido.ped_estado) === 1).length;
        const preparacion = pedidos.filter(pedido => Number(pedido.ped_estado) === 2).length;
        const finalizado = pedidos.filter(pedido => Number(pedido.ped_estado) === 3).length;

        setPendienteCount(pendiente);
        setPreparacionCount(preparacion);
        setFinalizadoCount(finalizado);
      });
  }, []);

  return (
    <div className='todo'>
      <div className="inicioContainer">
        <div className="statusBox pendiente">
          <h2>Pendientes</h2>
          <p className="numeroCount">{pendienteCount}</p>
        </div>
        <div className="statusBox preparacion">
          <h2>En Preparación</h2>
          <p className="numeroCount">{preparacionCount}</p>
        </div>
        <div className="statusBox finalizado">
          <h2>Finalizados</h2>
          <p className="numeroCount">{finalizadoCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Inicio;