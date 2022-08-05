import createDataContext from "./createDataContext";
import api from "../utils/api";
import { parseCookies, setCookie, destroyCookie } from "nookies";

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
  const cookies = parseCookies();
  if (cookies?.accessToken) {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/auth-user`,
      accessToken: cookies?.accessToken,
    });

    if (response.status >= 200 && response.status < 300) {
      dispatch({
        type: "get_auth",
        payload: { status: "SIGNED_IN", user: response.data },
      });
      return { success: true };
    } else {
      // delete the token and ensure user signed out
      destroyCookie(null, "accessToken", { path: "/" });
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
        url: `${process.env.NEXT_PUBLIC_API_URL}/user-accounts`,
        params: {
          name: {
            given: firstName,
            family: lastName,
          },
          email,
          password,
          tenant: tenantId,
          ...( inviteId ? { invite: inviteId } : {})
          
        },
      });
      if (response.status >= 200 && response.status < 300) {
        // store the token
        setCookie(null, "accessToken", response.data.accessToken, {
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });

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
        url: `${process.env.NEXT_PUBLIC_API_URL}/authentication`,
        params: {
          strategy: "local",
          email,
          password,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // store the token
        setCookie(null, "accessToken", response.data.accessToken, {
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });

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
  destroyCookie(null, "accessToken", { path: "/" });
  dispatch({ type: "signout" });
  return { success: true };
};

const setPasswordReset =
  (dispatch) =>
  async ({ email }) => {
    try {
      const response = await api({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/user-account-password-reset`,
        params: {
          email
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
          url: `${process.env.NEXT_PUBLIC_API_URL}/user-account-password-reset/${key}`,
          params: {
            password
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
        return { success: false, message: err?.response?.data?.message
          ? err.response.data.message
          : "Something went wrong with resetting your password" };
      }
    };

const getFileAuth = (dispatch) => async () => {
  const response = await api({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/file-auth`,
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
  { getAuth, signin, signout, signup, setPasswordReset, passwordReset, getFileAuth, clearErrorMessage },
  { errorMessage: "" }
);

export { Provider, Context };
