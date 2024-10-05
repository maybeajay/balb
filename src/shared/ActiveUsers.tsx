import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { useAppSelector } from "../types.js";
import { Dot } from "lucide-react";
function ActiveUsers() {
  const [activeUsers, setactiveUser] = useState([]);
  const {userData} = useAppSelector(state=>state.user)
  useEffect(() => {
    (async function getActiveUsers() {
      let { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_active", true)
        .neq("id", userData?.user?.id);
        if(!error)
        setactiveUser(users);
    })();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-2">Active Users</h2>
      <div className="flex space-x-2">
        {(activeUsers &&
          activeUsers.length > 0) ?
          activeUsers.map((user: any) => (
            <div className="flex flex-row items-center" key={user?.id}>
              <div className="flex flex-col justify-center">
                <img
                  src={user?.profile_url}
                  alt={user?.user_name}
                  className="w-9 h-9 rounded-full ring-[4px] ring-[#8b5cf6]"
                />
                <Dot color="#3dcf8d" size={60} className="active-dot"/>
                <p>{user?.user_name}</p>
              </div>
            </div>
          )) : <p>No active users</p>}
      </div>
    </div>
  );
}

export default ActiveUsers;
function neq(arg0: string, id: any) {
    throw new Error("Function not implemented.");
}

