import createDataContext from "./createDataContext";
import api from "../utils/api";

const clientReducer = (state, action) => {
  switch (action.type) {
    case "get_client":
      return { ...state, ...action.payload };
    case "register_client":
      return {
        ...state,
        errorMessage: "",
        client: action.payload.client,
      };
    case "clear_client":
      return {
        errorMessage: "",
      };
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

const getClient =
  (dispatch) =>
  async ({ id }) => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`,
    });

    if (response.status >= 200 && response.status < 300) {
      dispatch({
        type: "get_client",
        payload: { client: response.data },
      });
      return { success: true };
    } else {
      return { success: false };
    }
  };

const registerClient =
  (dispatch) =>
  async ({ businessName, firstName, lastName, email, password }) => {
    try {
      const response = await api({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client-registration`,
        params: {
          businessName,
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
            client: response.data.client,
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
          : "Something went wrong with registration",
      });
      return { success: false };
    }
  };

const clearClient = (dispatch) => async () => {
  dispatch({ type: "clear_client" });
  return { success: true };
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const { Provider, Context } = createDataContext(
  clientReducer,
  {
    getClient,
    registerClient,
    clearClient,
    clearErrorMessage,
  },
  { errorMessage: "" }
);

export { Provider, Context };
