import "./App.css";
import { useRoutes, Navigate, BrowserRouter } from "react-router-dom";
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
import { Toaster } from "react-hot-toast";
import HomeScreen from "./components/HomeScreen";
import ProfilePage from "./components/ProfilePage";
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
    {path: "/chat", element: <Chat />},
    {path: "/profile/:id", element: <ProfilePage />},
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
      <Toaster />
      <BrowserRouter>
      <FinalRoutes />
      </BrowserRouter>
    </Provider>
  );
}
export default App;
