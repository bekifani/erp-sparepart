import React from 'react'
import { Link } from 'react-router-dom'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import Catalog from '../ERP/Catalog'

const landingpage = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <p>Welcome to Spare part ERP</p>
      <Link to="/login">Login</Link>
      <ThemeSwitcher />
      <Catalog/>
    </div>
  )
}

export default landingpage