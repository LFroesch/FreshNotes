import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/authUser";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoggingIn } = useAuthStore();

    const handleLogin = (e) => {
        e.preventDefault();
        login({ email, password });
    }

    return (
        <div className='min-h-screen bg-base-200 flex items-center justify-center'>
            <div className='w-full max-w-md p-8 space-y-6 bg-base-100 rounded-lg shadow-xl'>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary font-mono">FreshNotes</h1>
                    <p className="text-base-content/70 mt-2">Sign in to your account</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleLogin}>
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
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                
                <div className="text-center">
                    <p className="text-base-content/70">
                        Don't have an account?{" "}
                        <Link to={"/signup"} className="link link-primary">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;