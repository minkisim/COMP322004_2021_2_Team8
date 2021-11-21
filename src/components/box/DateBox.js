import React, { useState } from 'react';
import './box.css'
function DateBox(props){

    return(
        <div>
            <p className="exhibition_date_title">전시 일정</p>
            <div className="exhibition_date">
                <div className="exhibition_date_box">
                    { props.data && props.data.map( member => <div className="date_box"><p>{member.data}</p></div>)}
                </div>
            </div>
        </div>
    )}
export default DateBox;