import React from 'react';
import { Button } from 'antd';

const Step4 = ({ prevStep }) => {
  return (
    <div>
      <h1>Step 4</h1>
      {/* Contenido del Step 4 */}
      <Button onClick={prevStep}>Atrás</Button>
      <Button type="primary">Finalizar</Button>
    </div>
  );
};

export default Step4;