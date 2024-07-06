import React, { useState } from 'react'
import SideNav from './SideNav'
import { supabase } from "../supabase.js";
import UserSeachResults from '../shared/UserSeachResults.js';

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
    <main>
      <input type='text' name='searchName' value={searchVal} onChange={(e)=>handleChange(e)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>

      {/* section for search users */}
     {/* if search resuklts is greater than 0 then only show results component*/}
     {
      searchRes.length >=1  && <UserSeachResults users={searchRes}/>
     }
    </main>
    </>
  )
}

export default IndividualChat