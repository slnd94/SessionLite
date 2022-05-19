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
  async ({ firstName, lastName, email, password }) => {
    try {
      const response = await api({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/user-account`,
        params: {
          name: {
            given: firstName,
            family: lastName,
          },
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

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const { Provider, Context } = createDataContext(
  authReducer,
  { getAuth, signin, signout, signup, clearErrorMessage },
  { errorMessage: "" }
);

export { Provider, Context };
