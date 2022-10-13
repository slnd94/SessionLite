import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";
import { REACT_APP_API_BASE_URL } from "@env";

const authReducer = (state, action) => {
  switch (action.type) {
    case "get_auth":
      return { ...state, auth: action.payload };
    case "signup":
      return {
        ...state,
        errorMessage: "",
        auth: action.payload.auth,
      };
    case "signin":
      return {
        ...state,
        errorMessage: "",
        auth: action.payload.auth,
      };
    case "signout":
      return {
        ...state,
        errorMessage: "",
        auth: { status: "SIGNED_OUT", user: null },
      };
    case "get_file_auth":
      return { ...state, fileAuth: action.payload };
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

const getAuth = (dispatch) => async () => {
  // await AsyncStorage.setItem("accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2NjU2NzczMjIsImV4cCI6MTY2NTc2MzcyMiwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiNjJkNWJjNjdmYjQyM2IxNzU3ZjJkN2RjIiwianRpIjoiNzI4NTc0YzUtODIzYi00MWY2LTg0YWUtNWUxZDQ1ZTI5NGUzIn0.CSIZb3pknvNjc83Y6NzocsizTCom5nOZynvetvDG0bE")
  // await AsyncStorage.removeItem("accessToken")
  const accessToken = await AsyncStorage.getItem("accessToken");
  if (accessToken) {
    const response = await api({
      method: "get",
      url: `${REACT_APP_API_BASE_URL}/auth-user`,
      accessToken: accessToken,
    });

    if (response.status >= 200 && response.status < 300) {
      dispatch({
        type: "get_auth",
        payload: { status: "SIGNED_IN", user: response.data },
      });
      return { success: true };
    } else {
      // delete the token and ensure user signed out
      await AsyncStorage.removeItem("accessToken");
      dispatch({ type: "signout" });
      return { success: false };
    }
  } else {
    // ensure user signed out
    dispatch({ type: "signout" });
    return { success: true };
  }
};

const signup =
  (dispatch) =>
  async ({ firstName, lastName, email, password, tenantId, inviteId }) => {
    try {
      const response = await api({
        method: "post",
        url: `${REACT_APP_API_BASE_URL}/user-accounts`,
        params: {
          name: {
            given: firstName,
            family: lastName,
          },
          email,
          password,
          tenant: tenantId,
          ...(inviteId ? { invite: inviteId } : {}),
        },
      });
      if (response.status >= 200 && response.status < 300) {
        // store the token
        await AsyncStorage.setItem("accessToken", response.data.accessToken);

        dispatch({
          type: "signup",
          payload: {
            auth: { status: "SIGNED_IN", user: response.data.user },
          },
        });
        return { success: true };
      } else {
        throw response;
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err?.response?.data?.message
          ? err.response.data.message
          : "Something went wrong with sign up",
      });
      return { success: false };
    }
  };

const signin =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      const response = await api({
        method: "post",
        url: `${REACT_APP_API_BASE_URL}/authentication`,
        params: {
          strategy: "local",
          email,
          password,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // store the token
        await AsyncStorage.setItem("accessToken", response.data.accessToken);

        dispatch({
          type: "signin",
          payload: {
            auth: { status: "SIGNED_IN", user: response.data.user },
          },
        });
        return { success: true };
      } else {
        throw response;
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err?.response?.data?.message
          ? err.response.data.message
          : "Something went wrong with sign in",
      });
      return { success: false };
    }
  };

const signout = (dispatch) => async () => {
  // delete the token
  await AsyncStorage.removeItem("accessToken");
  dispatch({ type: "signout" });
  return { success: true };
};

const setPasswordReset =
  (dispatch) =>
  async ({ email }) => {
    try {
      const response = await api({
        method: "post",
        url: `${REACT_APP_API_BASE_URL}/user-account-password-reset`,
        params: {
          email,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: "set_password_reset", payload: {} });
        return { success: true, ...response.data };
      } else {
        throw response;
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err?.response?.data?.message
          ? err.response.data.message
          : "Something went wrong with setting up your password reset",
      });
      return { success: false };
    }
  };

const passwordReset =
  (dispatch) =>
  async ({ password, key }) => {
    try {
      const response = await api({
        method: "patch",
        url: `${REACT_APP_API_BASE_URL}/user-account-password-reset/${key}`,
        params: {
          password,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: "password_reset", payload: {} });
        return { success: true, ...response.data };
      } else {
        throw response;
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err?.response?.data?.message
          ? err.response.data.message
          : "Something went wrong with resetting your password",
      });
      return {
        success: false,
        message: err?.response?.data?.message
          ? err.response.data.message
          : "Something went wrong with resetting your password",
      };
    }
  };

const getFileAuth = (dispatch) => async () => {
  const response = await api({
    method: "get",
    url: `${REACT_APP_API_BASE_URL}/file-auth`,
  });

  if (response.status >= 200 && response.status < 300) {
    dispatch({
      type: "get_file_auth",
      payload: response.data,
    });
    return { success: true };
  } else {
    return { success: false };
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const { Provider, Context } = createDataContext(
  authReducer,
  {
    getAuth,
    signin,
    signout,
    signup,
    setPasswordReset,
    passwordReset,
    getFileAuth,
    clearErrorMessage,
  },
  { errorMessage: "" }
);

export { Provider, Context };
