// import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
// import trackerApi from '../api/tracker';
// import { navigate } from '../navigationRef';
import api from '../utils/api';
import { useRouter } from 'next/router';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'signin':
      return {
        ...state,
        errorMessage: '',
        token: action.payload.accessToken,
        user: {
          email: action.payload.user.email,
          name: action.payload.user.name
        }
      };
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    case 'signout':
      return { token: null, errorMessage: '' };
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () => {
  const token = localStorage.authToken;
  if (token) {
    dispatch({ type: 'signin', payload: token });
    // navigate('TrackList');
  } else {
    // navigate('Signup');
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

const signup = dispatch => async ({ email, password }) => {
  try {
    const response = await trackerApi.post('/signup', { email, password });
    localStorage.authToken = response.data.accessToken;
    // await AsyncStorage.setItem('token', response.data.token);
    dispatch({ type: 'signin', payload: response.data.token });
    router.push('/');
    // navigate('TrackList');
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: 'Something went wrong with sign up'
    });
  }
};

const signin = dispatch => async ({ email, password }) => {
  try {
    console.log('tohere1')
    // const response = await trackerApi.post('/signin', { email, password });
    // await AsyncStorage.setItem('token', response.data.token);
    const response = await api({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/authentication`,
      params: {
        strategy: 'local', 
        email,
        password
      }
    });

    console.log('datata', response.data)

    const token = response.data.accessToken;

    localStorage.authToken = response.data.accessToken;
    dispatch({ type: 'signin', payload: response.data});
    // router.push('/');
    // navigate('TrackList');
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: 'Something went wrong with sign in'
    });
  }
};

const signout = dispatch => async () => {
  await AsyncStorage.removeItem('token');
  dispatch({ type: 'signout' });
  navigate('loginFlow');
};

const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: '' }
);

export { Provider, Context };
