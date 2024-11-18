import { useState } from 'react'
import GlobalChat from './GlobalChat';
import IndividualChat from './IndividualChat';
import { RiGlobalLine } from "react-icons/ri";
import { FaHouseUser } from "react-icons/fa";
type Props = {}
function Home({}: Props) {
  const [currentPage, setCurrentPage] = useState("Individual");
  return (
    <div className='container'>
                <p className="text-red-400 text-center text-xl">The web app is still in production and i am still fixing those error whenever i got time</p>
      <section className='flex justify-around mt-10 ease-in-out'>
        <div   className={`${currentPage === "Global" ? 'bg-violet-500' : 'bg-gray-400'} border-white rounded-lg w-[15%] h-[50px] text-center text-white cursor-pointer flex items-center justify-center gap-3 transition-all ease-in-out`}
          onClick={() => setCurrentPage("Global")}>
            <RiGlobalLine size={30}/>
          <p>Global</p>
        </div>
        <div
          className={`${currentPage === "Individual" ? 'bg-violet-500' : 'bg-gray-400'} border-white rounded-lg w-[15%] h-[50px] text-center text-white cursor-pointer flex items-center justify-center gap-3 transition-all ease-in-out`}
          onClick={() => setCurrentPage("Individual")}
        >
          <FaHouseUser size={30}/>
          <p>Individual</p>
        </div>
        </section>

        <main>
          {
            currentPage =="Global" ? <>    <p className='text-center font-sm mt-2 text-[#9ca3af] text-md'>Do not share personal information here</p>
            <p className='text-center font-sm text-[#9ca3af] text-sm'>You can delete a message upto 15 minutes</p>
            <GlobalChat /></> :<IndividualChat />
          }
        </main>
    </div>
  )
}

export default Home