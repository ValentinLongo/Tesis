import React from 'react';
import { Button } from 'antd';

const Step3 = ({ nextStep, prevStep }) => {
  return (
    <div>
      <h1>Step 3</h1>
      {/* Contenido del Step 3 */}
      <Button onClick={prevStep}>Atrás</Button>
      <Button type="primary" onClick={nextStep}>Continuar</Button>
    </div>
  );
};

export default Step3;