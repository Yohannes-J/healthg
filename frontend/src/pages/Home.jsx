import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import SpecialDoctors from '../components/SpecialDoctors'
import Banner from '../components/Banner'


const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialityMenu/>
      <SpecialDoctors/>
      <Banner/>
    
    </div>
  )
}

export default Home
