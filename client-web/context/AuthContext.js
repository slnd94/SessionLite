// import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
// import trackerApi from '../api/tracker';
// import { navigate } from '../navigationRef';
import api from '../utils/api';

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
      return { token: null, errorMessage: '', user: null };
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
    const response = await api({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/authentication`,
      params: {
        strategy: 'local', 
        email,
        password
      }
    });
    if (response.status >= 200 && response.status < 300) {
      // store the token
      const token = response.data.accessToken;

      localStorage.authToken = response.data.accessToken;
      dispatch({ type: 'signin', payload: response.data});
      return { success: true };
    } else {
      throw response;
    }
    // router.push('/');
    // navigate('TrackList');
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err?.response?.data?.message ? err.response.data.message :'Something went wrong with sign in'
    });
    return { success: false };
  }
};

const signout = dispatch => async () => {
  // delete the token
  delete localStorage.authToken;
  dispatch({ type: 'signout' });
  return { success: true };
  // navigate('loginFlow');
};

const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: '' }
);

export { Provider, Context };


