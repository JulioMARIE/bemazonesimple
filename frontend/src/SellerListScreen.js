import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import { Store } from './Store';
import { getError } from './utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, sellers: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETEE_REQUEST':
      return { ...state, loadinDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadinDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return {
        ...state,
        loadinDelete: false,
        successDelete: false,
      };
    case 'DELETE_RESET':
      return {
        ...state,
        loadinDelete: false,
        successDelete: false,
      };
    default:
      return state;
  }
};

const UserListScreen = () => {
  const navigate = useNavigate();
  const [
    { loading, error, sellers, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users/sellers`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Sure?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sellers</title>
        {loadingDelete && <LoadingBox></LoadingBox>}
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IFU</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.seller.ifu}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserListScreen;
