import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

function valuetext(value) {

  let temp = value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  return `${temp}만원`;
}

export default function SearchSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 100000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.getValue(newValue);
};

 return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {`${value[0].toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} ~ ${value[1].toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} 만원`} 
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        step={100}
        min={0}
        max={100000}
      />
    </div>
  );
}