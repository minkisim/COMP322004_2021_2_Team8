import React, {useState,useEffect} from 'react'
import axios from 'axios'
import './upload.css'
import AdminBar from './AdminBar';
import {dev_ver} from '../pages/global_const';

export default function UploadAuction(){

    const [artname, setArtname] = useState('');
    const [artistyear, setArtistyear] = useState('');
    const [begintime, setBegintime] = useState('');
    const [endtime, setEndtime] = useState('');
    const [artistinfo, setArtistinfo] = useState('');
    const [unit, setUnit] = useState('')

    function upload_auction()
    {
        console.log(begintime)
        if(artname==undefined || artname.length<1)
            {
                alert('작품명을 입력하십시오')
                return false
            }
        
        if(begintime==undefined || begintime.length<1)
            {
                alert('시작일을 선택하십시오')
                return false
            }

        if(endtime==undefined || endtime.length<1)
            {
                alert('종료일을 선택하십시오')
                return false
            }

        if(unit==undefined || isNaN(unit))
        {
            alert('경매 단위를 입력하십시오')
            return false
        }
        
        var diff1 = begintime.split('-')
        var diff2 = endtime.split('-')

        var diffdate1 = new Date(diff1[0],diff1[1],diff1[2])
        var diffdate2 = new Date(diff2[0],diff2[1],diff2[2])

        if(diffdate1.getTime() > diffdate2.getTime())
        {
            alert('경매 시작일이 경매 종료일 이후로 설정할 수 없습니다.')
            return false
        }


        axios.post(`http://${dev_ver}:4000/api/auction_upload`,{
            art_id:artname,
            artistyear:artistyear,        
            begintime:begintime,
            endtime: endtime,
            unit:unit
            
        })
        .then((result) => {
            if(result.data.notlogin)
            {
                alert('로그인이 필요합니다.')
                document.location.href='/loginPage'
            }
            else if(result.data.auctionexist)
            {
                alert('이미 경매에 등록된 작품입니다.')
            }
            else if(result.data.nosuchart)
            {
                alert('해당 작품이 존재하지 않습니다.')
            }

            else if(result.data.success)
            {
                alert('경매등록성공')
            }

            else{
                alert('경매등록실패')
            }
            
        })
        .catch((err)=>{
            alert(err)
        })
    }

    function handleunit(e)
    {
       let temp = e.target.value.replace(/[^0-9]/g,"")
       e.target.value = temp
        setUnit(temp)
    }

    return(
        <div>
                <AdminBar></AdminBar>
                <div className="Upload_Artwork_Page">
                    <p className="Upload_Artwork_Title">경매 일정 업로드</p>
                    <div className="Upload_Artwork_Box">
                        <input className="Upload_input1" onChange={(e)=>{setArtname(e.target.value)}} type="text" maxlength="20" placeholder="작품번호"/>
                        <input className="Upload_input1" onChange={(e)=>{setArtistyear(e.target.value)}} type="text" maxlength="9" placeholder="작가 년도(ex. '1990~' or '1990~2030' )"/>
                        <input className="Upload_input1" onChange={handleunit}  type="text" placeholder="경매 단위" />

                        <input className="Upload_date" onChange={(e)=>{setBegintime(e.target.value)}} type="date" title="시작일"/>
                        <input className="Upload_date" onChange={(e)=>{setEndtime(e.target.value)}} type="date" title="마감일"/>
                        
                        <div className="Upload_Artwork_btn_flex">
                            <div className="Upload_Artwork_btn1" onClick={upload_auction}><p>업로드</p></div>
                            <div className="Upload_Artwork_btn1" onClick={() => {window.location.replace("/")}}><p>취소</p></div>
                        </div>
                    </div>

                </div>
        </div>






    )


    
}