import { useState } from 'react'
import Users from '../components/Users'
import Message from '../components/Message'

function Chat() {
  const [chatSideBar, setChatSideBar] = useState(false)
  return (
    <div className='bg-slate-900 max-h-sceen overflow-hidden'>
      <div className='lg:scale-95'>
        <div className='flex mx-auto max-w-7xl relative text-white border border-gray-700 lg:rounded-xl bg-slate-800/50'>
          <Users chatSideBar={chatSideBar} setChatSideBar={setChatSideBar} />
          <Message setChatSideBar={setChatSideBar} />
        </div>
      </div>
    </div>
  )
}

export default Chat