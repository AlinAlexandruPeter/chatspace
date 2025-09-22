import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImgPattern from '../components/AuthImgPattern';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [showPassword, setshowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required")
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email")
    if (!formData.password.trim()) return toast.error("Password is required")
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters")

    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    const success = validateForm()
    if (success) {
      signup(formData)
    }
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-color">
              <MessageSquare className='size-10 text-primary' />
            </div>
            <h1 className="text-4xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60 text-2xl">Get started with your account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium text-xl">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className='size-5 text-base-content/40' />
                </div>
                <input
                  type="text"
                  className='input input-bordered p-6 pl-10 w-full bg-transparent focus:outline-none text-lg'
                  placeholder='John Doe'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium text-xl">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className='size-5 text-base-content/40' />
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
                  <Lock className='size-5 text-base-content/40' />
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

            <button type='submit' className="btn btn-primary w-full mt-4 text-lg">
              {isSigningUp ? (
                <>
                  <Loader2 className='size-5 animate-spin mr-2' />
                  Loading...
                </>
              ) : "Sign Up"}
            </button>
          </form>

          <div className="text-center text-lg">
            <div className="text-base-content/40">
                Already have an account?{" "}
                <Link to={"/login"} className='link link-primary'>
                  Login
                </Link>
            </div>
          </div>
        </div>
      </div>

      <AuthImgPattern
        title="Join Us"
        subtitle="Connect with friends, share moments, and stay in touch with the loved ones."
      />
    </div>
  )
}

export default SignUp