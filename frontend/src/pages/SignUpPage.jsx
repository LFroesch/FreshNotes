import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/authUser";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { signup, isSigningUp } = useAuthStore();

    const handleSignUp = async (e) => {
        e.preventDefault();
        signup({email, username, password})
    }

    return (
        <div className='min-h-screen bg-base-200 flex items-center justify-center'>
            <div className='w-full max-w-md p-8 space-y-6 bg-base-100 rounded-lg shadow-xl'>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary font-mono">FreshNotes</h1>
                    <p className="text-base-content/70 mt-2">Create your account</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary w-full" 
                        disabled={isSigningUp}
                    >
                        {isSigningUp ? "Creating account..." : "Sign Up"}
                    </button>
                </form>
                
                <div className="text-center">
                    <p className="text-base-content/70">
                        Already have an account?{" "}
                        <Link to={"/login"} className="link link-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;