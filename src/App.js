import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  adminRouter,
  publicRouter,
  userRouter,
} from "./routers/route";
import { createContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isSuccess } from "./redux/slice/auth";
import jwt_decode from "jwt-decode";
export const UserContext = createContext();
function App() {
  const [store, setStore] = useState({ rule: "[ROLE_SALE]" });
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.user?.token) {
      const decoded = jwt_decode(auth.user?.token);
      setStore({ rule: decoded.sub });
    } else {
      setStore({ rule: "user" });
    }
    if(window.localStorage.token){
      const decoded = jwt_decode(window.localStorage.token);
      setStore({ rule: decoded.role });
    }
  }, [auth.user?.token]);
  useEffect(() => {
    dispatch(isSuccess());
  }, []);
  const cacheRef = useRef({});
  return (
    <UserContext.Provider
      value={{
        store,
        setStore,
        cache: cacheRef
      }}
    >
      <Router>
        <div className="App">
          <Routes>
            {publicRouter.map((item, index) => {
              const Page = item.element;
              return item.layout ? (
                <Route
                  key={index + "routerpriva"}
                  path={item.path}
                  element={
                    <item.layout>
                      <Page />
                    </item.layout>
                  }
                />
              ) : (
                <Route
                  key={item?.path + index}
                  path={item?.path}
                  element={<Page />}
                />
              );
            })}
            {store.rule === "admin" &&
              adminRouter.map((item, index) => {
                const Page = item.element;
                return item.layout ? (
                  <Route
                    key={index + "adminrouter"}
                    path={item.path}
                    element={
                      <item.layout>
                        <Page />
                      </item.layout>
                    }
                  />
                ) : (
                  <Route
                    key={item?.path + index}
                    path={item?.path}
                    element={<Page />}
                  />
                );
              })}
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
