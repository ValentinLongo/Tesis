import './inicio.css';
import { useCallback, useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ArcElement } from 'chart.js';

// Registra los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Inicio() {
  const [pendienteCount, setPendienteCount] = useState(0);
  const [preparacionCount, setPreparacionCount] = useState(0);
  const [finalizadoCount, setFinalizadoCount] = useState(0);
  const [articulosRepetidos, setArticulosRepetidos] = useState([]);
  const [pedidosPorDia, setPedidosPorDia] = useState({ labels: [], values: [] });

  const fetchPedidos = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}pedidos`)
      .then(response => response.json())
      .then(data => {
        const pedidos = data.data;

        // Contar los pedidos por estado
        const pendiente = pedidos.filter(pedido => Number(pedido.ped_estado) === 1).length;
        const preparacion = pedidos.filter(pedido => Number(pedido.ped_estado) === 2).length;
        const finalizado = pedidos.filter(pedido => Number(pedido.ped_estado) === 3).length;

        setPendienteCount(pendiente);
        setPreparacionCount(preparacion);
        setFinalizadoCount(finalizado);

        // Procesar los datos para el gráfico de repeticiones por marca
        fetch(`${process.env.REACT_APP_API_URL}chart/marca/repeticiones`)
          .then(response => response.json())
          .then(data => {
            setArticulosRepetidos(data.data);
          });

        // Procesar los datos para el gráfico de pedidos por día
        const pedidosPorDia = pedidos.reduce((acc, pedido) => {
          const fecha = new Date(pedido.ped_fecha).toISOString().split('T')[0]; // Formato YYYY-MM-DD
          if (!acc[fecha]) {
            acc[fecha] = 0;
          }
          acc[fecha]++;
          return acc;
        }, {});
        const labels = Object.keys(pedidosPorDia);
        const values = Object.values(pedidosPorDia);

        setPedidosPorDia({ labels, values });
      });
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]); // Usa fetchPedidos como dependencia

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

  const pedidosPorDiaData = {
    labels: pedidosPorDia.labels,
    datasets: [
      {
        label: 'Pedidos por Día',
        data: pedidosPorDia.values,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Pendiente', 'Preparación', 'Finalizado'],
    datasets: [
      {
        data: [pendienteCount, preparacionCount, finalizadoCount],
        backgroundColor: ['#dedede', '#db86d7', '#6da9db'],
        hoverBackgroundColor: ['#7a7a7a', '#7a7a7a', '#7a7a7a'],
      },
    ],
  };
  
  const pieOptions = {
    plugins: {
      legend: {
        display: false, // Oculta las leyendas
      },
    },
  };

  return (
    <div className='inicioContainer'>
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
        <div className="pieChartContainer">
        <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      <div className="chartContainer">
        <div>
          <div>
            <h2>Repeticiones por Marca</h2>
            <Bar data={chartData} />
          </div>
        </div>
        <div>
            <h2>Pedidos por Día</h2>
            <Bar data={pedidosPorDiaData} />
          </div>
      </div>
    </div>
  );
  
}

export default Inicio;
