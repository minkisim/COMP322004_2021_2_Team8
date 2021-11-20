import React, { Component } from "react";
import Slider from "react-slick";
import Slidercomponent01 from "../components/slider/slidercomponent01";

export default class SimpleSlider2 extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000
    };
    return (
      <div>
        <Slider ref={c => (this.slider = c)} {...settings}>
          {this.props.dataset && this.props.dataset.map( data => <div><Slidercomponent01 data={data}></Slidercomponent01></div>)}
        </Slider>
        <div>
          <button className="button1" onClick={this.previous}>
            &lt;
          </button>
          <button className="button2" onClick={this.next}>
            &gt;
          </button>
        </div>
      </div>
    );
  }
}
