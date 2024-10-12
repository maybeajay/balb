import { ChangeEvent, useState } from "react";

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoUpdate: boolean;
  tracking?: boolean;  // Optional if not initialized at the beginning
  lastseen: false
}
const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    notifications: false,
    darkMode: true,
    autoUpdate: false,
    lastseen: false
  });

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row p-6 bg-gray-100 height-[100%]">
      {/* Left Side Label */}
      <div className="w-full md:w-1/4 mb-6 md:mb-0 h-full">
        <h2 className="text-xl font-bold text-gray-800">Settings</h2>
        <p className="mt-2 text-gray-600 text-lg">Customize your preferences</p>
      </div>

      {/* Right Side Content */}
      <div className="w-full md:w-3/4 bg-white shadow-md rounded-lg p-6">
        {/* Section: General */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">General</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="notifications"
              id="notifications"
              className="mr-3 h-5 w-5 text-[#8b5cf6] custom-checkbox"
              checked={settings.notifications}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="notifications" className="text-gray-700">Find me through search</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="darkMode"
              id="darkMode"
              className="mr-3 h-5 w-5 text-blue-600"
              checked={settings.darkMode}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="darkMode" className="text-gray-700">Dark Mode</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="lastseen"
              id="darkMode"
              className="mr-3 h-5 w-5 text-blue-600"
              checked={settings.lastseen}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="darkMode" className="text-gray-700">Last Seen</label>
          </div>
        </div>

        {/* Section: Updates */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Updates</h3> 
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="autoUpdate"
              id="autoUpdate"
              className="mr-3 h-5 w-5 text-blue-600"
              checked={settings.autoUpdate}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="autoUpdate" className="text-gray-700">Enable Auto Updates</label>
          </div>
        </div>

        {/* Section: Privacy */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Privacy</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="tracking"
              id="tracking"
              className="mr-3 h-5 w-5 text-blue-600"
              checked={settings.tracking}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="tracking" className="text-gray-700">Allow Tracking</label>
          </div>
        </div>

           {/* Section: Updates */}
           <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Updates</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="autoUpdate"
              id="autoUpdate"
              className="mr-3 h-5 w-5 text-blue-600"
              checked={settings.autoUpdate}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="autoUpdate" className="text-gray-700">Enable Auto Updates</label>
          </div>
        </div>

        {/* update settings button */}
        <button className="btn bg-[#8b5cf6] text-white w-40 h-10 rounded-md">
          Update Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;