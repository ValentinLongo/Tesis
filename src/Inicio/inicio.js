import './inicio.css';
import ValentinL from '../assets/ValentinL.png'

function inicio() {
  return (
    <div className='todo'>
      <div className="inicioContainer">
        <div>
          <img src={ValentinL} className='posicionImg'></img>
        </div>
      </div>      
    </div>

  );
}

export default inicio ;
