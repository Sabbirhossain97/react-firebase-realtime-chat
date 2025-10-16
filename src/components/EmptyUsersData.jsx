import React from 'react'

function EmptyUsersData() {
  return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 mt-10 space-y-3">
          <div className="bg-slate-800/60 p-6 rounded-2xl shadow-md ">
              <h2 className="text-lg font-semibold text-white">No unread messages found</h2>
              <p className="text-sm text-gray-400">
                  It seems like there are no users available right now.
                  Try refreshing or wait for someone to come online
              </p>
          </div>
      </div>
  )
}

export default EmptyUsersData