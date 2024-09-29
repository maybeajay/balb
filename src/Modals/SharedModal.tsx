import { Dispatch, SetStateAction } from 'react';

type Props = {
  title: string;
  description: string;
  onClick: () => void;
  isVisible: boolean;
  setisVisible: Dispatch<SetStateAction<boolean>>;
};

const SharedModal = ({ title, description, onClick, isVisible, setisVisible }: Props) => {
  return (
    <>
      {isVisible && (
        <div className={`${isVisible && "ring-2"} "fixed inset-0 flex items-center justify-center z-50"`}>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setisVisible(false)} 
          ></div>

          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-lg p-6 relative z-10 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setisVisible(false)}
              >
                &times;
              </button>
            </div>

            <p className="text-gray-700 mb-4">{description}</p>

            <div className='flex flex-row justify-between items-center p-3'>
            <button
              className="bg-white hover:bg-[#8b5cf6] hover:text-white text-[#8b5cf6] font-semibold py-2 px-4 rounded  border-[2px] border-[#8b5cf6] w-[10vw]"
              onClick={onClick}
            >
            Yes
            </button>

            <button
              className="bg-white hover:bg-[#ED1C24] hover:text-white text-[#ED1C24] font-semibold py-2 px-4 rounded  border-[2px] border-red-400 w-[10vw]"
              onClick={()=>setisVisible(false)}
            >
            Cancel
            </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SharedModal;