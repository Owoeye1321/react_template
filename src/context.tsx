import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { login, verifyToken, forgot_password, candidate_sign_up, get_designations } from "./utils/api";
import { isArray } from "lodash";

export enum Types {
  set_app_loaded = "SET_APP_LOADED",
  set_user = "SET_USER",
  set_is_auth = "SET_IS_AUTH",
  set_loading = "SET_LOADING",
  set_designations = "SET_DESIGNATIONS",
}

type InitialStateType = {
  user: object | any;
  isAuth: boolean;
  app_loaded: boolean;
  loading: boolean;
  designations: Array<any>;
};

const initialState = {
  user: {},
  isAuth: false,
  app_loaded: true,
  loading: false,
  designations: [],
};

const Context = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
  loginUser: any;
  logoutUser: any;
  set_loading: any;
  registerUser: any;
}>({
  state: initialState,
  dispatch: () => null,
  loginUser: () => null,
  logoutUser: () => null,
  set_loading: () => null,
  registerUser: () => null,
});

export function useContexts() {
  return useContext(Context);
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case Types.set_user:
      return { ...state, user: action.payload };
    case Types.set_app_loaded:
      return { ...state, app_loaded: action.payload };
    case Types.set_is_auth:
      return { ...state, isAuth: action.payload };
    case Types.set_designations:
      return { ...state, designations: action.payload };
    case Types.set_loading:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function ContextProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loaded, set_loaded] = useState(true);

  const getDesignations = async () => {
    try {
      const data = await get_designations();
      if (isArray(data)) {
        await dispatch({ type: Types.set_designations, payload: data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const check_login = async () => {
    if (!localStorage.getItem("zer")) {
      await set_loaded(false);
      await getDesignations();
      return;
    }
    const user = await verifyToken();
    if (user && user.response && user.response.status === 401) {
      await dispatch({ type: Types.set_is_auth, payload: false });
      await set_loaded(false);
    } else if (user && user.code !== "ERR_NETWORK" && user.name !== "AxiosError") {
      await dispatch({ type: Types.set_user, payload: user });
      await dispatch({ type: Types.set_is_auth, payload: true });
      await set_loaded(false);
    } else {
      await dispatch({ type: Types.set_is_auth, payload: false });
      await set_loaded(false);
    }
    await set_loaded(false);
    await getDesignations();
  };

  useEffect(() => {
    check_login();
  }, []);

  /* const handleResponse = (res, success_message, modal) => {
     if (res && res.code === "ERR_NETWORK") {
       //notify("error", "Network error");
       set_loading(false);
       return false;
     } else if (
       res &&
       res.response &&
       res.response.status &&
       res.response.status !== 200
     ) {
       if (
         res &&
         res.response &&
         res.response.data &&
         res.response.data.message
       ) {
      //   notify("error", res.response.data.message);
         set_loading(false);
         return false;
       }
     } else if (res && res.success) {
      // modal && notify("success", success_message);
       set_loading(false);
       return true;
     }
   }; */

  const logoutUser = async (e: any) => {
    if (e) {
      e.preventDefault();
    }
    await localStorage.removeItem("zer");
    await dispatch({ type: Types.set_is_auth, payload: false });
    /* await router.push({ pathname: "/login" }, undefined, {
       shallow: true,
     }); */
  };

  const loginUser = async ({ email, password }: any) => {
    await set_loading(true);
    const token_res = await login({ email, password });
    if (token_res && token_res.response && token_res.response.status === 401) {
      await set_loading(false);
      console.log("frjnr");
    } else {
      const user = await verifyToken();
      if (user && user.response && user.response.status === 401) {
        await dispatch({ type: Types.set_is_auth, payload: false });
      } else if (user && user.code !== "ERR_NETWORK" && user.name !== "AxiosError") {
        await dispatch({ type: Types.set_user, payload: user });
        await dispatch({ type: Types.set_is_auth, payload: true });
        return { login: true, role: user.role };
      } else {
        await dispatch({ type: Types.set_is_auth, payload: false });
      }
      await set_loading(false);
    }
  };

  const registerUser = async (data: any) => {
    await set_loading(true);
    const token_res = await candidate_sign_up(data);
    console.log(token_res.response);
    if (token_res && token_res.success) {
      await set_loading(false);
      return { success: true, message: "Account created" };
    } else if (token_res && token_res.response && token_res.response.status === 400) {
      await set_loading(false);
      return { success: false, message: "Email already exist, please verify" };
    } else {
      await set_loading(false);
      return { success: false, message: "Could not create account" };
    }
  };

  const forgotPassword = async (email: String) => {
    await set_loading(true);
    await forgot_password(email);
    await set_loading(true);
    // return handleResponse(res, "Reset password link sent", false);
  };

  const set_loading = (data: Boolean) => {
    dispatch({ type: Types.set_loading, payload: data });
  };

  const value = {
    state,
    dispatch,
    loginUser,
    registerUser,
    set_loading,
    logoutUser,
    forgotPassword,
  };

  return <Context.Provider value={value}>{!loaded && children}</Context.Provider>;
}
