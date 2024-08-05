import React, { useState, useContext } from 'react';
import { Row, Col } from 'antd';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import { loginContext } from '../../Context/loginContext';

const NuevoPedido = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { pedido, actualizarPedido } = useContext(loginContext);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 nextStep={nextStep} />;
      case 2:
        return <Step2 nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3 nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4 prevStep={prevStep} />;
      default:
        return <Step1 nextStep={nextStep} />;
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <div style={{ padding: '10px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', margin: '20px' }}>
          {renderStep()}
        </div>
      </Col>
    </Row>
  );
};

export default NuevoPedido;