import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const apiErrorMessage = (error) => {
    const data = error?.response?.data
    if (typeof data === 'string') return data
    if (data?.message) return data.message
    if (!error?.response) return 'Cannot reach server. Check that the API is running and the URL is correct.'
    return error?.message || 'Something went wrong. Please try again.'
  }

  const handleSendOtp = async () => {
    const trimmed = email.trim()
    if (!trimmed) {
      setErr('Please enter your email.')
      return
    }
    setErr('')
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email: trimmed }, { withCredentials: true })
      setEmail(trimmed)
      setStep(2)
    } catch (error) {
      setErr(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  const handleVerifyOtp = async () => {
    setErr('')
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email: email.trim(), otp: String(otp).trim() }, { withCredentials: true })
      setStep(3)
    } catch (error) {
      setErr(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErr('Passwords do not match.')
      return
    }
    setErr('')
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email: email.trim(), newPassword }, { withCredentials: true })
      navigate('/signin')
    } catch (error) {
      setErr(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className='flex items-center  gap-4 mb-4'>
          <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={() => navigate("/signin")} />
          <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
        </div>
        {step == 1
          &&
          <div>
            <div className='mb-6'>
              <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
              <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleSendOtp} disabled={loading}>
              {loading ? <ClipLoader size={20} color='white' /> : "Send Otp"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>}

        {step == 2
          &&
          <div>
            <div className='mb-6'>
              <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>OTP</label>
              <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} value={otp} required />
            </div>
            <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleVerifyOtp} disabled={loading}>
              {loading ? <ClipLoader size={20} color='white' /> : "Verify"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>}
        {step == 3
          &&
          <div>
            <div className='mb-6'>
              <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
              <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter New Password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
            </div>
            <div className='mb-6'>
              <label htmlFor="ConfirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
              <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required />
            </div>
            <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleResetPassword} disabled={loading}>
              {loading ? <ClipLoader size={20} color='white' /> : "Reset Password"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>}
      </div>
    </div>
  )
}

export default ForgotPassword
