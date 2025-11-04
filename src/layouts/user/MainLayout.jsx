import React from 'react'
import Header from '../../components/common/Header'
import Footer from '../../components/common/footer'

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}

export default MainLayout
