import './inicio.css';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registra los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Inicio() {
  const [pendienteCount, setPendienteCount] = useState(0);
  const [preparacionCount, setPreparacionCount] = useState(0);
  const [finalizadoCount, setFinalizadoCount] = useState(0);
  const [articulosRepetidos, setArticulosRepetidos] = useState([]);

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

    fetch(`${process.env.REACT_APP_API_URL}chart/marca/repeticiones`)
      .then(response => response.json())
      .then(data => {
        setArticulosRepetidos(data.data);
        console.log(data.data);
      });
  }, []);

  // Configuración de los datos para el gráfico de barras
  const chartData = {
    labels: articulosRepetidos.map(item => item.mar_descripcion),
    datasets: [
      {
        label: 'Repeticiones por Marca',
        data: articulosRepetidos.map(item => item.repeticiones),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='todo'>
      <div className="statusContainer">
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
      <div className="chartContainer">
        <h2>Repeticiones por Marca</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default Inicio;