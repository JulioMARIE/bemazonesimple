import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

function CheckoutSteps(props) {
  const navigate = useNavigate();
  return (
    <div>
      <Row className="checkout-steps">
        <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
        <Col
          className={props.step2 ? 'active' : ''}
          onClick={() => navigate('/shipping')}
        >
          Shipping
        </Col>
        <Col className={props.step3 ? 'active' : ''}>Payment</Col>
        <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
      </Row>
    </div>
  );
}

export default CheckoutSteps;
