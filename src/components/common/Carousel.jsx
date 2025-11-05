import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';

const Carousels = () => {
        const [index, setIndex] = useState(0);

        const handleSelect = (selectedIndex) => {
            setIndex(selectedIndex);
        };
        return (
            <Carousel activeIndex={index} onSelect={handleSelect} >
                <Carousel.Item >
                    <img src="https://i-learning.edu.vn/wp-content/uploads/2023/07/banner-toeic-moi.png" style={{width: '100%', height: '600px', objectFit: 'cover'}}/>
                  
                </Carousel.Item>
                <Carousel.Item>
                    <img src="https://han02.vstorage.vngcloud.vn/public/Default/Media/Images/191b6f62-aba8-48d3-84b5-50fc37fe0ddf/default_image_191b6f62-aba8-48d3-84b5-50fc37fe0ddf_1921-x-641-(8)_1727235862347.jpg"  style={{width: '100%', height: '600px', objectFit: 'cover'}}/>
                   
                </Carousel.Item>
                <Carousel.Item>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp2ojP9f_1SZCp9WBy3wSdMxtObcFH6qu4MBjngu6SQfkX5F6AzR4zvrjrbPw_Mxy1Vxc&usqp=CAU" style={{width: '100%', height: '600px', objectFit: 'cover'}} />
                  
                </Carousel.Item>
            </Carousel>
        )
    }

    export default Carousels
