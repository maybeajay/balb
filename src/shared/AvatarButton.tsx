import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import SharedModal from "../Modals/SharedModal";
import { useAppDispatch } from "../types";
import { setLoading, signOut } from "../slices/userSlice.js";
import { supabase } from "../../supabase.js";
interface AvatarProps{
  src: string,
}

export default function AvatarButton({src}:AvatarProps){
  const [isMenuVisible, setisMenuVisible] = useState<boolean>(false);
  const [isDialogVisible, setisDialogVisible] = useState(false);
  const navigation = useNavigate();
  const dispatch = useAppDispatch();

  const handleMenuOpen = ()=>{
    setisMenuVisible((prev)=>!prev);
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error == null) {
        dispatch(setLoading(true));
        dispatch(signOut());
        dispatch(setLoading(false));
        navigation("/");
      }
    } catch (error) {
      console.log("actual error ", error);
    }
  };
    return(
        <>
        <div className="relative" onClick={handleMenuOpen}>
  {/* Avatar Button */}
  <button
    id="avatarButton"
    className="flex items-center space-x-2 p- text-white rounded-full focus:outline-none p-2 gap-5"
  >
    <img
      className="w-10 h-10 rounded-full"
      src={src}
      alt="User Avatar"
    />
  </button>
  {/* Dropdown Menu */}
  {
    isMenuVisible && <div
    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg gap-3"
  >
   <Link to={'/profile/me'} className="flex flex-row items-center hover:text-[#8b5cf6] m-4 gap-3">
    <User />
      Profile
    </Link>

    <Link to={'/settings'} className="flex flex-row items-center hover:text-[#8b5cf6] m-4 gap-3">
    <Settings />
      Settings
    </Link>

    <div className="flex flex-row hover:text-[#8b5cf6] m-4 hover:cursor-pointer gap-3" onClick={()=>setisDialogVisible(true)}>
    <LogOut />
    Logout
    </div>
  </div>
  }
  {
    isDialogVisible && <SharedModal isVisible={isDialogVisible} setisVisible={setisDialogVisible} title="Logout" description="Are you sure you want to Log out?" onClick={handleLogout}/>

  }
</div>

</>
    )
}