import React from 'react';
import { Button } from 'antd';

const Step2 = ({ nextStep, prevStep }) => {
  return (
    <div>
      <h1>Step 2</h1>
      {/* Contenido del Step 2 */}
      <Button onClick={prevStep}>Atrás</Button>
      <Button type="primary" onClick={nextStep}>Continuar</Button>
    </div>
  );
};

export default Step2;