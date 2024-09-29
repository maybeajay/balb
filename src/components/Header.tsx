import { Link } from "react-router-dom";
import AvatarButton from "../shared/AvatarButton.js";
const Header = () => {
  
  return (
    <div className="header  top-0 bg-white flex items-center justify-between px-8 py-2">
      <Link to={"/"} className="flex flex-row items-center">
        <img src={'/logo.png'} alt="Logo" width={80}/>
      </Link>

      {/* logout button */}
      <div className="w-3/12 flex justify-end">
        <AvatarButton src={"https://images.unsplash.com/photo-1727272287872-d698f16adc24?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
      </div>
    </div>
  );
};

export default Header;
