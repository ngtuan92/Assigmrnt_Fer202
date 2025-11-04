import React from 'react'
import Carousel from '../../../components/common/Carousel'
import AboutUs from './AboutUs'
import { Container } from 'react-bootstrap'
import OutstandingExams from './OutstandingExams'
import MainLayout from '../../../layouts/user/MainLayout'

const HomePage = () => {
  return (
    <div>
      <MainLayout>
        <Carousel />
        <Container className='my-5'>
          <AboutUs />
          <OutstandingExams />
        </Container>
      </MainLayout>
    </div>
  )
}

export default HomePage
