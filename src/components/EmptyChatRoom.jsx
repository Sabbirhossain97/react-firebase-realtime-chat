
function EmptyChatRoom() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-slate-900 text-center p-6 h-full">
            <svg
                className="w-20 h-20 text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 16.5a2.5 2.5 0 01-2.5 2.5H5l-4 4V5A2 2 0 013 3h15.5a2.5 2.5 0 012.5 2.5v11z"
                ></path>
            </svg>
            <h1 className="text-2xl font-semibold text-gray-200">
                Select a user to chat
            </h1>
            <p className="text-gray-400 mt-2">
                Your messages will appear here once you select a user from the list.
            </p>
        </div>
    )
}

export default EmptyChatRoom