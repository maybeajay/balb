import { useEffect, useState } from 'react';
import { FaGlobe, FaTwitter, FaLinkedin, FaEnvelope, FaUserCheck, FaMapMarkerAlt } from 'react-icons/fa';
import {supabase} from '../../supabase.js';
import { MdOutlineVerified } from "react-icons/md";
const MyPrfofile = () => {
    const [profileData, setprofileData] = useState([]);
      // get user details on render
  useEffect(() => {
    async function getprofileData() {
      try {
        let { data: users, error } = await supabase
        .from("users")
        .select('*')
        .eq("id", "aabd8b96-518b-4357-ae47-03f3749c138c");
        console.log("users", users)
        if(!error){
          setprofileData(users);
        }
      } catch (error) {
        
      }
    }

    getprofileData();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-lg p-8 w-full max-w-4xl">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <img className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8" src={profileData[0]?.profile_url} alt="Profile" />
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-3xl font-bold">{profileData[0]?.user_name}</h2>
              <MdOutlineVerified  className="text-green-500 ml-5 mt-2" />
            </div>
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-gray-600 mr-2" />
              <p className="text-gray-600">India, In</p>
            </div>
            <div className="flex space-x-4 mb-4">
              <FaGlobe className="text-gray-600" />
              <FaTwitter className="text-gray-600" />
              <FaLinkedin className="text-gray-600" />
              <FaEnvelope className="text-gray-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">First Name</h3>
                <p className="text-gray-600">{profileData[0]?.first_name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Last Name</h3>
                <p className="text-gray-600">{profileData[0]?.last_name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Email</h3>
                <p className="text-gray-600">{profileData[0]?.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Joined At</h3>
                <p className="text-gray-600">{new Date(profileData[0].created_at).toISOString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPrfofile;
