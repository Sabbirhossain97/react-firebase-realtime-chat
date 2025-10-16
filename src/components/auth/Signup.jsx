import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import Spinner from "../Spinner";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setTimeout(() => {
                setLoading(false)
                navigate("/chat")
                toast.success('Register successfull!', {
                    position: 'top-center'
                })
            }, 1500)
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, {
                position: 'top-center'
            })
        }
    };

    return (
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl text-center font-bold leading-tight tracking-tightmd:text-2xl text-white">
                    Register your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={(e) => handleSignUp(e)}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                        <input type="email" value={email} name="email" id="email" onChange={e => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@company.com" required="" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" value={password} name="password" id="password" onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                    </div>
                    <button type="submit" className="w-full mt-4 flex justify-center text-center cursor-pointer text-white bg-gray-700 transition duration-300 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5">
                        {loading ? <div className="flex gap-2 items-center"><Spinner /> Processing</div> : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Signup