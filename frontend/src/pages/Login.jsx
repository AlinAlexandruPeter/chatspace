import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import React, { useState } from 'react' 
import { useAuthStore } from '../store/useAuthStore';
import AuthImgPattern from '../components/AuthImgPattern';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-color">
              <MessageSquare className='size-10 text-primary' />
            </div>
            <h1 className="text-4xl font-bold mt-2">You're back</h1>
            <p className="text-base-content/60 text-2xl">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>

            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium text-xl">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className='size-5 text-base-content' />
                </div>
                <input
                  type="email"
                  className='input input-bordered p-6 pl-10 w-full bg-transparent  focus:outline-none'
                  placeholder='email@example.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium text-xl">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className='size-5 text-base-content' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className='input input-bordered p-6 pl-10 w-full bg-transparent  focus:outline-none'
                  placeholder='********'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center z-10'
                  onClick={() => setshowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type='submit' className="btn btn-primary w-full mt-4 text-lg" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className='size-5 animate-spin mr-2' />
                  Loading...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="text-center text-lg">
            <div className="text-base-content/40">
                Don{"\'"}t have an account?{" "}
                <Link to={"/signup"} className='link link-primary'>
                  Sign Up
                </Link>
            </div>
          </div>
        </div>
      </div>

      <AuthImgPattern
        title="Welcome Back"
        subtitle="Glad to see you again. Jump in and start chatting from where you left."
      />
    </div>
  )
}

export default Login