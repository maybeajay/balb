import { useState } from "react";
import { supabase } from "../../supabase.js";
import UserSeachResults from "../shared/UserSeachResults";
type userSearchResults = {
  user_name: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  profile_url: string | undefined;
};
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchVal(e.target.value);
    if (searchVal.length >= 2) {
      searchByUsername(e.target.value);
    }
  };
  return (
    <>
      <div className="w-80 bg-white shadow-lg rounded-md p-4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchVal}
            onChange={(e) => handleChange(e)}
          />
        </div>

        {/* Active Users */}
        {/* <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">
            Active Users
          </h2>
          <div className="flex space-x-2">
            <img
              src="https://via.placeholder.com/32"
              className="w-8 h-8 rounded-full"
              alt="User 1"
            />
            <img
              src="https://via.placeholder.com/32"
              className="w-8 h-8 rounded-full"
              alt="User 2"
            />
            <img
              src="https://via.placeholder.com/32"
              className="w-8 h-8 rounded-full"
              alt="User 3"
            />
            <img
              src="https://via.placeholder.com/32"
              className="w-8 h-8 rounded-full"
              alt="User 4"
            />
            <img
              src="https://via.placeholder.com/32"
              className="w-8 h-8 rounded-full"
              alt="User 5"
            />
          </div>
        </div> */}

        {/* show search results here */}
        {searchRes.length >= 1 && <UserSeachResults users={searchRes} />}

        {/* All Chats */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">
            All Chats
          </h2>
          <ul>
            <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                className="w-10 h-10 rounded-full mr-2"
                alt="User"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Hamed</h3>
                  <span className="text-xs text-gray-400">12:30 PM</span>
                </div>
                <p className="text-xs text-gray-500">
                  Thank you very much, I am...
                </p>
              </div>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                className="w-10 h-10 rounded-full mr-2"
                alt="User"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Daria</h3>
                  <span className="text-xs text-gray-400">12:15 PM</span>
                </div>
                <p className="text-xs text-gray-500">Call ended</p>
              </div>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                className="w-10 h-10 rounded-full mr-2"
                alt="User"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Lia Party</h3>
                  <span className="text-xs text-gray-400">12:00 PM</span>
                </div>
                <p className="text-xs text-gray-500">What time are we there?</p>
              </div>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                className="w-10 h-10 rounded-full mr-2"
                alt="User"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Jack</h3>
                  <span className="text-xs text-gray-400">11:45 AM</span>
                </div>
                <p className="text-xs text-gray-500">When will you send...</p>
              </div>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                className="w-10 h-10 rounded-full mr-2"
                alt="User"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Kate</h3>
                  <span className="text-xs text-gray-400">11:30 AM</span>
                </div>
                <p className="text-xs text-gray-500">
                  Will you send the work file?
                </p>
              </div>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                className="w-10 h-10 rounded-full mr-2"
                alt="User"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Lia</h3>
                  <span className="text-xs text-gray-400">11:15 AM</span>
                </div>
                <p className="text-xs text-gray-500">
                  Cool, I will send you the...
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
