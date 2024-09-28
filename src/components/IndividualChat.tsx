import React, { useState } from 'react'
import SideNav from './SideNav'
import { supabase } from "../supabase.js";
import UserSeachResults from '../shared/UserSeachResults.js';
import FriendRequest from '../shared/FriendRequest.js';
import Notifications from '../shared/Notifications.js';
import Friends from './Friends.js';
import ChatBox from './ChatBox.js';
import { useSelector } from 'react-redux';
function IndividualChat() {
  const {activeChatID} = useSelector(state=>state?.user);

  return (
    <>
      <div className="flex">
        {/* SideNav with 20% width */}
        <div className="basis-1/5">
          <SideNav />
        </div>
  
        {/* Main Content (ChatBox) with 80% width */}
        <main className="flex-grow">
          <div className="flex">
            {activeChatID && <ChatBox  selectedId={activeChatID}/>}
          </div>
          <div>
            {/* Additional content can go here */}
          </div>
        </main>
      </div>
    </>
  );
  
}

export default IndividualChat