import  { useEffect } from 'react'
import { LuUser } from 'react-icons/lu'
import { Link } from 'react-router-dom'

type Props = {
    users: any
}

export default function UserSeachResults({users}: Props) {
  const highlightMatchingChars = (userName)=>{

  }
  return (
   <div className='flex flex-row p-3'>
    <div className='flex justify-between items-center'>
    {
        users.map((item)=>(
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700" key={item?.id}>
      <li className="py-3 sm:py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {
                item?.profile_url ? <img
                className="w-8 h-8 rounded-full"
                src={item?.profile_url}
                alt="Neil image"
              /> : <div className='bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center'><LuUser /></div>
            }
          </div>
          <div className="flex-1 min-w-0 ms-4 hover:cursor-pointer">
            <Link to={`/profile/${item?.user_name}`}>
            <p className="text-sm font-medium text-gray-900 truncate hover:text-purple-500 ">
            {item?.user_name}
            </p>
            </Link>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              email@windster.com
            </p>
          </div>
        </div>
      </li>
      </ul>
        ))
    }
    </div>
   </div>
  )
}