import SideNav from './SideNav'
import FriendRequest from '../shared/FriendRequest.js';
import Notifications from '../shared/Notifications.js';
import ChatBox from './ChatBox.js';
import { useSelector } from 'react-redux';
import { useState } from 'react';
function IndividualChat() {
  const {activeChatID} = useSelector(state=>state?.user);
  const [isFriendReqVisible, setisFriendReqVisible] = useState<boolean>(true);
  return (
    <>
      <div className="flex">
        {/* SideNav with 20% width */}
        <div className="basis-1/5">
          <SideNav />
        </div>
        {
          isFriendReqVisible && <FriendRequest setVisible={setisFriendReqVisible}/>
        }
  
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