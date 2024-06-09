import { IoPowerSharp } from "react-icons/io5";
import {supabase} from '../../supabase.js'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading, signOut } from "../slices/userSlice.js";
const Header = () => {
  const navigation = useNavigate();
  const dispatch =useDispatch();
  const handleLogout = async()=>{
    try {
      const { error } = await supabase.auth.signOut()
      if(error==null){
        dispatch(setLoading(true));
        dispatch(signOut());
        dispatch(setLoading(false));
        navigation("/");
      } 
    } catch (error) {
      console.log("actual error ", error);
    }
  }
  return (
    <header className="header sticky top-0 bg-white shadow-md flex items-center justify-between px-8 py-02">
      <div>
        <h1>Balb</h1>
      </div>
  {/* logout button */}
  <div className="w-3/12 flex justify-end">
  <button className="flex flex-col justify-center items-center" onClick={()=>handleLogout()}>
    <IoPowerSharp size={25} className="hover:text-red-500"/>
    <p className="text-sm">Sign Out</p>
  </button>
  </div>
</header>


  )
}

export default Header;