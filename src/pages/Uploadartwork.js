/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import './upload.css'
import AdminBar from './AdminBar';
import {dev_ver} from './global_const';
import queryString from 'query-string'

export default function UploadArtwork(){
 

    const [data,setdata] = useState(
        {
            artwork:'',
            size:'',
            year:"",
            type:'',
            KRWpriceStart:'',
            KRWpriceEnd:'',
            USDpriceStart:'',
            USDpriceEnd:'',
            enddate:'',
            artworkInfo:'',
            artistInfo:"",
            artistyearInfo:''
        }
    );

    const [artist,setArtist] = useState('');
    const [artname,setArtname] = useState('');
    const [exhibition,setExhibition] = useState('');    
    const [artrelease_date,setArtrelease_date] = useState('');
    const [imagesize,setImagesize] = useState('');
    const [imageurl,setImageurl] = useState('');
    const [imagetype,setImagetype] = useState('');
    const [KRW_upper,setKRW_upper] = useState('');
    const [KRW_lower,setKRW_lower] = useState('');
    const [USD_upper,setUSD_upper] = useState('');
    const [USD_lower,setUSD_lower] = useState('');
    const [arttext,setArttext] = useState('');

    const [file, setFile] =useState();

    useEffect(()=>{
        const query = queryString.parse(location.search)

        if(query.id!=undefined && query.id.length>=1)
        {
            axios.post(`http://${dev_ver}:4000/api/imgupload/search`,{
                id:query.id
            })
            .then((result)=>{
                if(result.data!=undefined)
                {
                    setArtist(result.data.artist)
                    setArtname(result.data.artname)
                    setExhibition(result.data.exhibition)
                    setArtrelease_date(result.data.artrelease_date)
                    setImagesize(result.data.imagesize)
                    setImagetype(result.data.imagetype)
                    setKRW_lower(result.data.KRW_lower)
                    setKRW_upper(result.data.KRW_upper)
                    setUSD_lower(result.data.USD_lower)
                    setUSD_upper(result.data.USD_upper)
                    setArttext(result.data.arttext)
                }
            })
            .catch((err)=>{
                alert(err)
            })

        }


    },[])

    function upload()
    {
        

        const query = queryString.parse(location.search)

        


        const formData = new FormData();
        formData.append('file',file)


        if(query.id==undefined && (artist==undefined || artist.length<1))
        {
            alert('작가명은 필수 입력사항입니다')
            return false
        }
        if(query.id==undefined && (artname==undefined || artname.length<1))
        {
            alert('작품명은 필수 입력사항입니다')
            return false
        }


        if(KRW_lower!=undefined && KRW_upper!=undefined && KRW_lower.length>=1 && KRW_upper.length>=1 && parseInt(KRW_upper) < parseInt(KRW_lower))
        {
            alert("KRW에서 제시한 상한가가 하한가보다 작을 수 없습니다\n상한가 : "+KRW_upper+", 하한가 : "+KRW_lower)
            return false
        }
        if(USD_lower!=undefined && USD_upper !=undefined &&USD_lower.length>=1 && USD_upper.length>=1 && parseInt(USD_upper) < parseInt(USD_lower))
        {
            alert("USD에서 제시한 상한가가 하한가보다 작을 수 없습니다")
            return false
        }

        if(query.id==undefined && file==undefined)
        {
            alert('작품 이미지 파일을 업로드 하십시오')
            return false
        }

        let jsondata = {}

        if(artist!=undefined && !isNaN(artist))
        {
            jsondata.artist =artist
        }
        if(artname != undefined && artname.length>=1)
        {
            jsondata.artname = artname
        }
        if(exhibition!=undefined && !isNaN(exhibition))
        {
            jsondata.exhibition = exhibition
        }
        if(artrelease_date!=undefined && artrelease_date.length>=1)
        {
            jsondata.artrelease_date = artrelease_date
        }

        if(imagesize!=undefined && imagesize.length>=1)
        {
            jsondata.imagesize = imagesize
        }

        if(file!=null && file.name!=undefined)
        {
            jsondata.imageurl = file.name
        }
   
        if(imagetype!=undefined && imagetype.length>=1)
        {
            jsondata.imagetype = imagetype
        }

        if(KRW_upper != undefined && !isNaN(KRW_upper))
        {
            jsondata.KRW_upper =KRW_upper
        }
        if(KRW_lower!=undefined && !isNaN(KRW_lower))
        {
            jsondata.KRW_lower = KRW_lower
        }
        if(USD_upper != undefined && !isNaN(USD_upper))
        {
            jsondata.USD_upper = USD_upper
        }

        if(USD_lower != undefined && !isNaN(USD_lower))
        {
            jsondata.USD_lower = USD_lower
            
        }
        if(arttext!=undefined && arttext.length>=1)
        {
            jsondata.arttext = arttext
        }

        if(query.id != undefined && query.id.length>=1)
        {
            console.log('한번더'+query.id)
            jsondata.id = query.id
        }

       // console.log(jsondata)

        axios.post(`http://${dev_ver}:4000/api/imgupload`, jsondata)
                .then((result) => {
                    if(result.data.notexist)
                    {
                        alert("DB에 해당 작가가 존재하지 않습니다.")
                    }

                    else if(result.data.success)
                        alert("DB업로드 성공")
                    else
                        alert('DB업로드 실패')
                })
                .catch((err) => {
                    alert("DB업로드 실패 \n"+err)
                })


        if(file!=null && file.name != undefined)
        {
            axios.post(`http://${dev_ver}:4000/api/fileupload`, formData,{headers:{"Content-Type":"multipart/form-data"}})
            .then((result) => {
                if(result.data.success)
                { 
                    alert("파일업로드 성공")

                    
                }
                else
                    alert('파일업로드 실패')
            })
            .catch((err) => {
                alert("파일업로드 실패 \n"+err)
            })
        }
            

        
    }

    return(
        <div>
                <AdminBar></AdminBar>
                <div className="Upload_Artwork_Page">
                    <p className="Upload_Artwork_Title">미술품 업로드</p>
                    <div className="Upload_Artwork_Box">
                        <input className="Upload_input1" onChange={(e)=>{setArtist(e.target.value)}} type="text" maxLength="20"          value={artist=='' ? null : artist}  placeholder={artist=='' ? "작가번호" : artist}/>
                        <input className="Upload_input1" onChange={(e)=>{setArtname(e.target.value)}} type="text" maxLength="20"         value={artname=='' ? null : artname}  placeholder={artname=='' ? "작품명" : artname}/>
                        <input className="Upload_input1" onChange={(e)=>{setArtrelease_date(e.target.value)}} type="text" maxLength="20" value={artrelease_date=='' ? null : artrelease_date}  placeholder={artrelease_date=='' ? "작품 년도" : artrelease_date}/>
                        <input className="Upload_input1" onChange={(e)=>{setExhibition(e.target.value)}} type="text" maxLength="20"      value={exhibition=='' ? null : exhibition}  placeholder={exhibition=='' ? "전시관 번호" : exhibition}/>
                        <input className="Upload_input1" onChange={(e)=>{setImagesize(e.target.value)}} type="text" maxLength="9"        value={imagesize=='' ? null : imagesize}  placeholder={imagesize=='' ? "작품 크기(ex. '250x350' )" : imagesize}/>
                        <input className="Upload_input1" onChange={(e)=>{setImagetype(e.target.value)}} type="text" maxLength="9"        value={imagetype=='' ? null : imagetype}  placeholder={imagetype=='' ? "종류(ex. '유화' , '수채화' )" : imagetype}/>
                        <input className="Upload_input1" onChange={(e)=>{setKRW_lower(e.target.value)}} type="text" maxLength="9"        value={KRW_lower=='' ? null : KRW_lower}  placeholder={KRW_lower=='' ? "KRW 예상 하한가" : KRW_lower}/>
                        <input className="Upload_input1" onChange={(e)=>{setKRW_upper(e.target.value)}} type="text" maxLength="9"        value={KRW_upper=='' ? null : KRW_upper}  placeholder={KRW_upper=='' ? "KRW 예상 상한가" : KRW_upper}/>
                        <input className="Upload_input1" onChange={(e)=>{setUSD_lower(e.target.value)}} type="text" maxLength="9"        value={USD_lower=='' ? null : USD_lower}  placeholder={USD_lower=='' ? "USD 예상 하한가" : USD_lower}/>
                        <input className="Upload_input1" onChange={(e)=>{setUSD_upper(e.target.value)}} type="text" maxLength="9"        value={USD_upper=='' ? null : USD_upper}  placeholder={USD_upper=='' ? "USD 예상 상한가" : USD_upper}/>
                        <input className="Upload_input_file" onChange={(e=>{setFile(e.target.files[0])})} title="파일 업로드" type="file"/>
                        <textarea className="Upload_input2" onChange={(e)=>{setArttext(e.target.value)}} value={arttext=='' ? null : arttext} placeholder={arttext=='' ? "작품 설명(ex. '- 이것은 유화이다' )" : arttext}/>
                        <div className="Upload_Artwork_btn_flex">
                            <div className="Upload_Artwork_btn1" onClick={upload}><p>업로드</p></div>
                            <div className="Upload_Artwork_btn1" onClick={() => {window.location.replace("/")}}><p>취소</p></div>
                        </div>
                    </div>

                </div>
        </div>






    )


    
}