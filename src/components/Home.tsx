import { useState } from 'react'
import GlobalChat from './GlobalChat';
import IndividualChat from './IndividualChat';
import { RiGlobalLine } from "react-icons/ri";
import { FaHouseUser } from "react-icons/fa";
type Props = {}
function Home({}: Props) {
  const [currentPage, setCurrentPage] = useState("Individual");
  return (
    <div className='container gap-10 justify-between'>
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

        <main className='flex items-center h-[80vh]'>
          {
            currentPage =="Global" ? <GlobalChat /> :<IndividualChat />
          }
        </main>
    </div>
  )
}

export default Home