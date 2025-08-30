import React from 'react'
import { Link } from 'react-router-dom'
import ThemeSwitcher from '@/components/ThemeSwitcher'

const landingpage = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <p>Welcome to Spare part ERP</p>
      <Link to="/login">Login</Link>
      <ThemeSwitcher />
    </div>
  )
}

export default landingpage