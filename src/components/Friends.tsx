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
        .eq("id", friendsData[0].id);
        setmyFriends(users);
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
        
                if(error){
                    catchErrors(error.message);
                }
            }finally{

            }
        })()

        friendsData.length > 0 && getFriends();
    }, [])
  return (
    <div>Friends</div>
  )
}

export default Friends