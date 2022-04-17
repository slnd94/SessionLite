import createDataContext from './createDataContext';
import api from '../utils/api';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'update_user_profile':
      return {
        ...state,
        errorMessage: ''
      };
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    default:
      return state;
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

const updateUserProfile = dispatch => async ({ firstName, lastName, id }) => {
  try {
    const response = await api({
      method: 'patch',
      url: `${process.env.NEXT_PUBLIC_API_URL}/user-profile/${id}`,
      params: {
        name: {
          given: firstName,
          family: lastName
        }
      }
    });
    if (response.status >= 200 && response.status < 300) {
      dispatch({ type: 'update_user_profile', payload: {}});
      return { success: true };
    } else {
      throw response;
    }
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err?.response?.data?.message ? err.response.data.message :'Something went wrong with updating your profile'
    });
    return { success: false };
  }
};

const { Provider, Context } = createDataContext(
  userReducer,
  { updateUserProfile, clearErrorMessage },
  { token: null, errorMessage: '' }
);

export { Provider, Context };


