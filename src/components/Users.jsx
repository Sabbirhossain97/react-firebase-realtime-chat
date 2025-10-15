import React from 'react'
import { UserRound } from 'lucide-react'

function Users() {
    return (
        <div className="space-y-4 w-1/4 border-r border-zinc-800">
            <h1 className='px-4 py-4 text-2xl font-bold'>Users(2)</h1>
            <hr className='border-b border-zinc-800' />
            <div className='max-h-[720px] space-y-4 overflow-y-auto'>
                <div className="w-11/12 mx-auto px-6 py-4 bg-slate-800/80 transition duration-300 hover:opacity-75 cursor-pointer rounded-md shadow-users">
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className="relative">
                                <UserRound />
                            </div>
                            <div className="ml-4">
                                <p className="font-heebo text-[18px] font-bold leading-6">
                                    Peter Johnson
                                </p>
                                <p className=" font-heebo text-[14px] not-italic font-medium leading-6 opacity-40">
                                    Online
                                </p>
                            </div>
                        </div>
                        <p className="text-[16px] font-lato not-italic font-normal leading-5 opacity-50">
                            3h ago
                        </p>
                    </div>
                    <div className=" mt-4">
                        <p className="font-heebo text-[14px] font-normal leading-5">
                            Analysis of foreign experience, as it is commo…
                        </p>
                    </div>
                </div>
                <div className="w-11/12 mx-auto px-6 py-4 bg-slate-800/80 transition duration-300 hover:opacity-75 cursor-pointer rounded-md shadow-users">
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className="relative">
                                <UserRound />
                            </div>
                            <div className="ml-4">
                                <p className="font-heebo text-[18px] font-bold leading-6">
                                    Peter Johnson
                                </p>
                                <p className=" font-heebo text-[14px] not-italic font-medium leading-6 opacity-40">
                                    Online
                                </p>
                            </div>
                        </div>
                        <p className="text-[16px] font-lato not-italic font-normal leading-5 opacity-50">
                            3h ago
                        </p>
                    </div>
                    <div className=" mt-4">
                        <p className="font-heebo text-[14px] font-normal leading-5">
                            Analysis of foreign experience, as it is commo…
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users