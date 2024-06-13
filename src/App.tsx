import "./App.css";
import { useRoutes, Navigate, HashRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import VerifyEmail from "./components/VerifyEmail";
import Chat from "./components/Chat";
import { store } from "./store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { getData, setLoading } from "./slices/userSlice";
import { useEffect } from "react";
import Header from "./components/Header";
function UnAuthRoutes() {
  return(
  useRoutes([
    {path: '/', element: <Login />},
    {path:"/signup", element:<Signup />},
    {path: "/verify-email", element: <VerifyEmail />},
    {path: "*", element: <Navigate to={'/'} replace/>}
  ])
)
}

function AfterAuthRoutes() {
  return (
  useRoutes([
    {path: "/", element:<Home />},
    {path: "/chat", element: <Chat />},
    {path: "*", element: <Navigate to={'/'} replace/>},
  ])
  )
}

function FinalRoutes(){
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: any) => state.user);
  const isUserDataEmpty = Array.isArray(userData) && userData.length === 0;
  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;

  }
  else{
    return isUserDataEmpty ? <UnAuthRoutes /> : <>
    <Header />
    {/* <SideNav /> */}
      <AfterAuthRoutes />
      </>
}
}

function App() {
  
  return (
    <Provider store={store}>
      <HashRouter>
      <FinalRoutes />
      </HashRouter>
    </Provider>
  );
}
export default App;
