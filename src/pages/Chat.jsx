import Users from '../components/Users'
import Message from '../components/Message'

function Chat() {
  return (
    <div className='pb-10 bg-slate-900 max-h-screen overflow-hidden'>
      <div className='h-auto scale-95'>
        <div className='flex mx-auto h-full max-w-7xl text-white border border-gray-700 rounded-xl bg-slate-800/50'>
          <Users />
          <Message />
        </div>
      </div>
    </div>
  )
}

export default Chat