import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { login, verifyToken, forgot_password } from './utils/api';

export enum Types {
  set_app_loaded = 'SET_APP_LOADED',
  set_user = 'SET_USER',
  set_is_auth = 'SET_IS_AUTH',
  set_loading = 'SET_LOADING',
}

type InitialStateType = {
  user: object | any;
  isAuth: boolean;
  app_loaded: boolean;
  loading: boolean;
};

const initialState = {
  user: {},
  isAuth: false,
  app_loaded: true,
  loading: false,
};

const Context = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
  loginUser: any;
  logoutUser: any;
  set_loading: any;
  registerUser: any;
  notify: any;
}>({
  state: initialState,
  dispatch: () => null,
  loginUser: () => null,
  logoutUser: () => null,
  set_loading: () => null,
  registerUser: () => null,
  notify: () => null,
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
    case Types.set_loading:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function ContextProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loaded, set_loaded] = useState(true);

  const check_login = async () => {
    const user = await verifyToken();
    await set_loaded(false);
    if (user && user.response && user.response.status === 401) {
      await dispatch({ type: Types.set_is_auth, payload: false });
    } else if (user && user.code !== 'ERR_NETWORK' && user.name !== 'AxiosError') {
      await dispatch({ type: Types.set_user, payload: user });
      await dispatch({ type: Types.set_is_auth, payload: true });
    } else {
      await dispatch({ type: Types.set_is_auth, payload: false });
    }
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
    await localStorage.removeItem('zer');
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
      //  notify("error", "Incorrect Email/Password");
    } else {
      const user = await verifyToken();
      if (user && user.response && user.response.status === 401) {
        await dispatch({ type: Types.set_is_auth, payload: false });
        // notify("error", "Incorrect Email/Password");
      } else if (user && user.code !== 'ERR_NETWORK' && user.name !== 'AxiosError') {
        await dispatch({ type: Types.set_user, payload: user });
        await dispatch({ type: Types.set_is_auth, payload: true });
        return true;
      } else {
        await dispatch({ type: Types.set_is_auth, payload: false });
      }
      await set_loading(false);
    }
  };

  const registerUser = () => {
    console.log('done');
  };

  const notify = (data: string) => {
    alert(data);
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
    notify,
  };

  return <Context.Provider value={value}>{!loaded && children}</Context.Provider>;
}
