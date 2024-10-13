import { Link } from "react-router-dom";
import AvatarButton from "../shared/AvatarButton.js";
import { useAuth } from "../hooks/useAuth.js";
import FriendsIcon from "./FriendsIcon.js";
import { useState } from "react";
const Header = () => {
  const {userDetails} = useAuth();
  const [isFocused, setisFocused] = useState(false)
  return (
    <div className="header  top-0 bg-white flex items-center justify-between px-8 py-2">
      <Link to={"/"} className="flex flex-row items-center">
        <img src={"/logo.png"} alt="Logo" width={80} />
      </Link>

      {/* friend request section */}
      {/* logout button */}
      <div className="w-3/12 flex justify-end items-center">
        <div className={`${isFocused ? "ring-[#c9bdbd] bg-[#8b5cf6]"  : 'ring-[#8b5cf6] bg-white'} relative right-24 ring-[2px]  w-15 h-15 rounded-full p-1 hover:cursor-pointer`}>
        <FriendsIcon isFocused={isFocused} onClick={()=>setisFocused((prev)=>!prev)}/>
        </div>
        <AvatarButton
          src={
           userDetails[0]?.profile_url
          }
        />
      </div>
    </div>
  );
};

export default Header;
