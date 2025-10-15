import Users from '../components/Users'
import Message from '../components/Message'

function Chat() {
  return (
    <div className='py-10 bg-slate-900 min-h-screen'>
      <div className='flex mx-auto py-10 h-full max-w-7xl text-white border border-gray-700 rounded-xl bg-slate-800/50'>
        <Users />
        <Message />
      </div>
    </div>
  )
}

export default Chat