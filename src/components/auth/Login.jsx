import { useState } from "react"
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setTimeout(() => {
                setLoading(false)
                navigate("/chat")
                toast.success('Sign in successfull!', {
                    position: 'top-center'
                })
            }, 1500)
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, {
                position: 'top-center'
            })
            setLoading(false)
            setError(error.message);
        }
    };

    return (
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl text-center font-bold leading-tight tracking-tightmd:text-2xl text-white">
                    Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={(e) => handleLogin(e)}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-white">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@company.com" required="" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full mt-4 flex justify-center text-center cursor-pointer text-white bg-gray-700 transition duration-300 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5">
                        {loading ? <div className="flex gap-2 items-center"><Spinner /> Processing</div> : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login