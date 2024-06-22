import React, {Dispatch, SetStateAction} from 'react'

type Props = {
    imgUrl: string,
    isActive: boolean,
    setisActive: Dispatch<SetStateAction<boolean>>
}

const ViewImage = ({imgUrl, setisActive}: Props) => {
  return (
    <>
  <div
    className="relative flex flex-col h-64 overflow-hidden text-gray-700 transition-opacity bg-white shadow-md cursor-pointer w-96 rounded-xl bg-clip-border hover:opacity-90"
    data-dialog-target="image-dialog"
  >
    <img
      alt="nature"
      className="object-cover object-center w-full h-full"
      src={imgUrl}
    />
  </div>
  <div
    data-dialog-backdrop="image-dialog"
    data-dialog-backdrop-close="true"
    className="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300"
  >
    <div
      className="relative m-4 w-3/4 min-w-[75%] max-w-[75%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
      role="dialog"
      data-dialog="image-dialog"
    >
      <div className="flex items-center justify-between p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
        <div className="flex items-center gap-3">
          <img
            alt="tania andrew"
            src={imgUrl}
            className="relative inline-block object-cover object-center rounded-full h-9 w-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-500 transition-all hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-dark="true"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-5 h-5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div className="relative p-0 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
        <img
          alt="nature"
          className="h-[48rem] w-full object-cover object-center"
          src={imgUrl}
        />
      </div>
      <div onClick={()=>setisActive(false)}>
        x
      </div>
    </div>
  </div>
</>

  )
}

export default ViewImage;