import React from 'react'
import  './upload.css'
import {Link} from 'react-router-dom';


export default function AdminBar(){
    return(
        <div className="admin_btn_flex">
                <Link to="/uploadartist">
                    <div className="admin_btn">
                        <p>작가 업로드</p>
                    </div>
                </Link>
                <Link to="/searchartist">
                    <div className="admin_btn">
                        <p>작가 조회</p>
                    </div>
                </Link>
                <Link to="/uploadartwork">
                    <div className="admin_btn">
                        <p>작품 업로드</p>
                    </div>
                </Link>
                <Link  to="/searchartwork">
                    <div className="admin_btn">
                        <p>작품 조회</p>
                    </div>
                </Link>
                <Link to="/uploadauction">
                    <div className="admin_btn">
                        <p>경매 업로드</p>
                    </div>
                </Link>
                <Link to="/auctionmain">
                    <div className="admin_btn">
                        <p>경매 조회</p>
                    </div>
                </Link>
            </div>


    )
}