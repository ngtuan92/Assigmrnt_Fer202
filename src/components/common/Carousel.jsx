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
                    <img src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg" style={{width: '100%', height: '600px', objectFit: 'cover'}}/>
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg"  style={{width: '100%', height: '600px', objectFit: 'cover'}}/>
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src="https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg" style={{width: '100%', height: '600px', objectFit: 'cover'}} />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        )
    }

    export default Carousels
