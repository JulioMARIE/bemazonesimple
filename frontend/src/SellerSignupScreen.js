import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from './Store';
import { getError } from './utils';
import LoadingBox from './LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

function SellerSignupScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [ifu, setIfu] = useState('');
  const [photoID, setPhotoID] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { dispatch: ctxDispatch } = useContext(Store);
  const [{ loadingUpload }, dispatch] = useReducer(reducer, {});
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/seller/signup', {
        email,
        ifu,
        photoID,
        sellerName,
        logo,
        description,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      console.log(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const uploadFileHandlerphotoID = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload/seller', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setPhotoID(data.secure_url);
      toast.success('Image uploaded successfully. Click update to apply');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL' });
    }
  };
  const uploadFileHandlerLogo = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload/seller', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setLogo(data.secure_url);
      toast.success('Image uploaded successfully. Click update to apply');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL' });
    }
  };

  return (
    <>
      <Container className="small-container">
        <Helmet>
          <title>Business Account Sign Up</title>
        </Helmet>
        {loadingUpload && <LoadingBox></LoadingBox>}
        <h1 className="my-3">Business Account Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="ifu">
            <Form.Label>IFU</Form.Label>
            <Form.Control required onChange={(e) => setIfu(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="photoID">
            <Form.Label>Photo ID</Form.Label>
            <Form.Control
              value={photoID}
              onChange={(e) => setPhotoID(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Photo ID</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandlerphotoID} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="sellerName">
            <Form.Label>Seller Name</Form.Label>
            <Form.Control
              required
              onChange={(e) => setSellerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="logo">
            <Form.Label>Logo</Form.Label>
            <Form.Control
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="logoFile">
            <Form.Label>Upload Logo</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandlerLogo} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Create a business account</Button>
          </div>
          <div className="mb-3">
            Already have an business account?{' '}
            <Link to={`/signin`}>Sign-In</Link>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default SellerSignupScreen;
