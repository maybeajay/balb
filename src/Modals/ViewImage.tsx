import {Dispatch, SetStateAction} from 'react'

type Props = {
    imgUrl: string,
    isActive: boolean,
    setisActive: Dispatch<SetStateAction<boolean>>
}

const ViewImage = ({imgUrl, setisActive}: Props) => {
  return (
    <>
 <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75"
  data-dialog-target="image-dialog"
>
  <div className="relative h-auto p-4 shadow-md cursor-pointer rounded-xlflex items-center justify-center w-2/5 -2/5">
    <button
      className="absolute top-4 right-4 text-black hover:text-gray-700"
      onClick={()=>setisActive(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <img
      alt="nature"
      className="object-cover object-center w-full h-full"
      src={imgUrl}
    />
  </div>
</div>
</>

  )
}

export default ViewImage;