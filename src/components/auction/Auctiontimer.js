import React, { useState, useLayoutEffect } from "react";

const Auctiontimer = (props) => {

   

    const [days, setDays] = useState(parseInt(props.tminus/(3600*24)));
    const [hours, setHours] =useState(parseInt((props.tminus/3600)%24));
    const [minutes, setMinutes] = useState(parseInt((props.tminus%3600/60)));
    const [seconds, setSeconds] = useState(parseInt(props.tminus%60));
  

    const handleChange = () => {
        props.gettime(false)
    }

    useLayoutEffect(() => {
      const countdown = setInterval(() => {
        if (parseInt(seconds) > 0) {
          setSeconds(parseInt(seconds) - 1);
        }

        if (parseInt(seconds) === 0) {
          if (parseInt(minutes) === 0) {

            if(parseInt(hours) === 0) {

                if(parseInt(days) === 0)
                {
                    handleChange()
                    clearInterval(countdown);
                }
                else
                {
                    setDays(parseInt(days)-1);
                    setHours(23)
                    setMinutes(59)
                    setSeconds(59)
                }
               
            }
            else{
                setHours(parseInt(hours)-1);
                setMinutes(59);
                setSeconds(59)
            }

            
          } else {
            setMinutes(parseInt(minutes) - 1);
            setSeconds(59);
          }
        }

       


      }, 1000);
      return () => clearInterval(countdown);
    }, [minutes, seconds]);




  return (
    <>
    
    {days}일 {hours<10 ? `0${hours}` : hours}시간  { minutes < 10 ? `0${minutes}` : minutes}분 {seconds < 10 ? `0${seconds}` : seconds}초
    </>
  );
};

export default Auctiontimer;