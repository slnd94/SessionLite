import createDataContext from "./createDataContext";
import api from "../utils/api";
import { parseCookies, setCookie, destroyCookie } from "nookies";

const tenantReducer = (state, action) => {
  switch (action.type) {
    case "get_tenant":
      return { ...state, ...action.payload };
    case "set_tenant":
      return { ...state, ...action.payload };
    case "register_tenant":
      return {
        ...state,
        errorMessage: "",
        tenant: action.payload.tenant,
      };
    case "update_tenant_details":
      return {
        ...state,
        errorMessage: "",
      };
    case "clear_tenant":
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

const getTenant =
  (dispatch) =>
  async ({ id }) => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenants/${id}`,
    });

    if (response.status >= 200 && response.status < 300) {
      dispatch({
        type: "get_tenant",
        payload: { tenant: response.data },
      });
      return { success: true };
    } else {
      return { success: false };
    }
  };

const setTenant =
  (dispatch) =>
  async ({ tenant }) => {
    dispatch({
      type: "set_tenant",
      payload: {
        tenant: tenant
          ? {
              _id: tenant._id,
              name: tenant.name,
              logo: tenant.logo,
              plan: tenant.plan
            }
          : null,
      },
    });
  };

const registerTenant =
  (dispatch) =>
  async ({ businessName, firstName, lastName, email, password }) => {
    try {
      const response = await api({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-registration`,
        params: {
          businessName,
          account: {
            name: {
              given: firstName,
              family: lastName,
            },
            email,
            password,
          },
        },
      });
      if (response.status >= 200 && response.status < 300) {
        // store the token
        setCookie(null, "accessToken", response.data.accessToken, {
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });

        dispatch({
          type: "register_tenant",
          payload: {
            tenant: response.data.tenant,
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

const updateTenantDetails =
  (dispatch) =>
  async ({ name, id }) => {
    try {
      const response = await api({
        method: "patch",
        url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-details/${id}`,
        params: {
          name
        }
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: "update_tenant_details", payload: {} });
        return { success: true };
      } else {
        throw response;
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err?.response?.data?.message
          ? err.response.data.message
          : "Something went wrong with updating the details",
      });
      return { success: false };
    }
  };

const clearTenant = (dispatch) => async () => {
  dispatch({ type: "clear_tenant" });
  return { success: true };
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const { Provider, Context } = createDataContext(
  tenantReducer,
  {
    getTenant,
    setTenant,
    registerTenant,
    updateTenantDetails,
    clearTenant,
    clearErrorMessage,
  },
  { errorMessage: "" }
);

export { Provider, Context };
