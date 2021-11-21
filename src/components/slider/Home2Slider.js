import ShowWindow4 from "../showWindow/ShowWindow4";
import React, { Component } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

export default class SimpleSlider extends Component {


  render() {
    var settings = {
      dots: true,
      infinite: false,
      speed: 700,
      slidesToShow: 5,
      slidesToScroll: 5,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    };
   // console.log('내부 데이터');
   // console.log(this.props.dataset);
    return (
      <div>
      
        <Slider {...settings}>
          {this.props.dataset && this.props.dataset.map( data => <Link to={`/exhibition3/${data.id}`}><div><ShowWindow4 data={data}></ShowWindow4></div></Link>
          )}
        </Slider>
      </div>
    );
  }
}