import React from 'react'
import Header from '../../../components/common/Header'
import Carousel from '../../../components/common/Carousel'
import Footer from '../../../components/common/footer'
import AboutUs from './AboutUs'

const HomePage = () => {
  return (
    <div>
      <Header />
      <Carousel/>
      <AboutUs />
      <Footer/>
    </div>
  )
}

export default HomePage
