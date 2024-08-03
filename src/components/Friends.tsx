import React, { useEffect, useState } from 'react'
import {supabase} from '../../supabase.js'
import { catchErrors } from '../slices/errorsSlice';

function Friends() {
    const [friendsData, setfriendsData] = useState([]);
    const [myFriends, setmyFriends] = useState([]);
    const getFriends = async()=>{
        let { data: users, error } = await supabase
        .from('users')
        .select()
        .eq("id", friendsData[0]?.id);
        if(!error)
        setmyFriends(users);
        console.log("asdas", users)
        console.log("ERR", error);
    }
    useEffect(()=>{
        (async function getUserFriends(){
            try {
                let { data: friends, error } = await supabase
                .from('friends')
                .select()
                .eq("user_id","aabd8b96-518b-4357-ae47-03f3749c138c")
                .eq("is_accepted", true)
                .eq("is_pending", false)
                setfriendsData(friends);
                console.log(friends);
                if(error){
                    catchErrors(error.message);
                }
            }finally{

            }
        })()

        friendsData.length > 0 && getFriends();
    }, [])
  return (
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
            
          </ul>
        </div>
  )
}

export default Friends