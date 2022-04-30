import createDataContext from './createDataContext';
import api from '../utils/api';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'update_user_profile':
      return {
        ...state,
        errorMessage: ''
      };
    case 'update_user_account':
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

const updateUserAccount = dispatch => async ({ currentPassword, newPassword, id }) => {
  try {
    const response = await api({
      method: 'patch',
      url: `${process.env.NEXT_PUBLIC_API_URL}/user-account/${id}`,
      params: {
        currentPassword,
        newPassword
      }
    });
    if (response.status >= 200 && response.status < 300) {
      dispatch({ type: 'update_user_account', payload: {}});
      return { success: true };
    } else {
      throw response;
    }
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err?.response?.data?.message ? err.response.data.message :'Something went wrong with updating your account'
    });
    return { success: false };
  }
};

const verifyUserEmail = dispatch => async ({ id, key }) => {
  try {
    const response = await api({
      method: 'patch',
      url: `${process.env.NEXT_PUBLIC_API_URL}/user-account-verification/${id}?verificationAction=verify`,
      params: {
        key
      }
    });
    if (response.status >= 200 && response.status < 300) {
      dispatch({ type: 'verify_user_email', payload: {}});
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
  { updateUserProfile, updateUserAccount, verifyUserEmail, clearErrorMessage },
  { token: null, errorMessage: '' }
);

export { Provider, Context };


