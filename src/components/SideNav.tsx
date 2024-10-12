import { useCallback, useState } from "react";
import { supabase } from "../../supabase.js";
import UserSeachResults from "../shared/UserSeachResults";
import Friends from "./Friends.js";
type userSearchResults = {
  user_name: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  profile_url: string | undefined;
};
import {debounce} from "../utils/constants"
import ActiveUsers from "../shared/ActiveUsers.js";
export default function SideNav() {
  const [searchVal, setsearchVal] = useState<string>("");
  const [searchRes, setsearchRes] = useState<userSearchResults[]>([]);
  const searchByUsername = async (username: string) => {
    try {
      let { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_name", username.trim());
      setsearchRes(users);
      if (error) {
        console.log("ERR", error);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };
  const debouncedSearch = useCallback(debounce((val: string) => {
    searchByUsername(val);
  }, 800), []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchVal(e.target.value);
    debouncedSearch(e.target.value);
    
  };
  return (
    <>
      <div className="w-80 bg-white shadow-lg rounded-md p-4  h-[90%]">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchVal}
            onChange={(e) => handleChange(e)}
            />
        </div>

            {/* show search results here */}
        {searchRes.length >= 1 && <UserSeachResults users={searchRes} />}
        {/* Active Users */}
        <ActiveUsers />

        {/* All Chats */}
        <Friends />
        {/* <ChatBox /> */}
      </div>
    </>
  );
}
