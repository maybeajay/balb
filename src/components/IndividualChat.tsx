import React, { useState } from 'react'
import SideNav from './SideNav'
import { supabase } from "../supabase.js";
import UserSeachResults from '../shared/UserSeachResults.js';
import FriendRequest from '../shared/FriendRequest.js';
import Notifications from '../shared/Notifications.js';
import Friends from './Friends.js';

type userSearchResults = {
  user_name: string | undefined,
  first_name: string | undefined,
  last_name: string | undefined,
  profile_url: string | undefined
}

function IndividualChat() {
  const [searchVal, setsearchVal] = useState<string>("");
  const [searchRes, setsearchRes] = useState<userSearchResults[]>([])
  const searchByUsername = async (username:string)=>{
    try {
      let { data: users, error } = await supabase
        .from('users')
        .select("*")
        .eq('user_name', username.trim());
        setsearchRes(users);
        if(error){
          console.log("ERR", error)
        }
                
    } catch (error) {
      console.log("ERR", error);
    }
  }
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setsearchVal(e.target.value);
    if(searchVal.length >=2){
      searchByUsername(e.target.value);
    }
  }
  return (
    <>
    {/* <SideNav /> */}
    <main className='w-full h-screen'>
      <div className="flex">
      <SideNav />
     </div>

      {/* section for search users */}
     {/* if search resuklts is greater than 0 then only show results component*/}
     {/* Pending Friend Requests */}
     {/* <FriendRequest /> */}

     {/* <Notifications /> */}
     {/* <Friends /> */}
     <div>
     </div>
    </main>
    </>
  )
}

export default IndividualChat