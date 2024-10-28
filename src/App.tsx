import "./App.css";
import { useRoutes, Navigate, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import VerifyEmail from "./components/VerifyEmail";
import { store } from "./store";
import { Provider } from "react-redux";
import {  setLoading, getDataAsync } from "./slices/userSlice";
import { useEffect } from "react";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import HomeScreen from "./components/HomeScreen";
import ProfilePage from "./components/ProfilePage";
import MyPrfofile from "./components/Profile";
import Settings from "./components/Settings";
import { useAppSelector, useAppDispatch } from "./types";
function UnAuthRoutes() {
  return(
  useRoutes([
    {path: '/', element: <HomeScreen />},
    {path: "/auth/login", element: <Login />},
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
    {path: "/profile/:user_name", element: <ProfilePage />},
    {path: "/profile/me", element: <MyPrfofile />},
    {path: "/settings", element: <Settings />},
    {path: "*", element: <Navigate to={'/'} />},
  ])
  )
}

function FinalRoutes(){
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      await dispatch(getDataAsync());
      dispatch(setLoading(false));
    };
    fetchData();
  }, [dispatch]);
  const { userData, loading } = useAppSelector((state: any) => state.user);

  
  const isUserDataEmpty = !loading && Array.isArray(userData) && userData.length === 0;
  if (loading) {
    return <div>Loading...</div>;
    
  }
  else{
    return isUserDataEmpty ? <UnAuthRoutes /> : <>
    <Header />
    <AfterAuthRoutes />
    {/* <SideNav /> */}
      </>
}
}

function App() {
  
  return (
    <Provider store={store}>
      <Toaster />
      <BrowserRouter>
      <FinalRoutes />
      </BrowserRouter>
    </Provider>
  );
}
export default App;
