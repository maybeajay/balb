import { Link } from "react-router-dom";
import AvatarButton from "../shared/AvatarButton.js";
import { useAuth } from "../hooks/useAuth.js";
const Header = () => {
  const {userDetails} = useAuth();
  return (
    <div className="header  top-0 bg-white flex items-center justify-between px-8 py-2">
      <Link to={"/"} className="flex flex-row items-center">
        <img src={"/logo.png"} alt="Logo" width={80} />
      </Link>

      {/* logout button */}
      <div className="w-3/12 flex justify-end">
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
