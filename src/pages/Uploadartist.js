/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import './upload.css'
import AdminBar from './AdminBar';
import { dev_ver } from './global_const';
import queryString from 'query-string'

export default function UploadArtist(){

    const [artist,setArtist] = useState('')
    const [life_term,setLife_term] = useState('')
    const [file,setFile] = useState('')
    const [artistInfo, setArtistInfo] = useState('')
    const [artistyearInfo,setArtistyearInfo] = useState('')
    const [] = useState('')

    const [data,setdata] = useState(
        {
            artist:'',
            artistyear:'',        
            artworkInfo:'',
            artistInfo:"",
            artistyearInfo:''
        }
    );

    useEffect(()=>{
        const query = queryString.parse(location.search)

        if(query.id!=undefined && query.id.length>=1)
        {
            axios.post(`http://${dev_ver}:4000/api/artist_upload/search`,{
                id: query.id
            })
            .then((result)=>{
                setArtist(result.data.artist)
                setLife_term(result.data.life_term)
                setArtistInfo(result.data.artist_info)
                setArtistyearInfo(result.data.artistyearInfo)
            })
            .catch((err)=>{
                alert(err)
            })
        }
    },[])


    function artistupload()
    {
        const query = queryString.parse(location.search)

        console.log("query : "+query.id)

        const formData = new FormData();
        formData.append('file',file)


        let jsondata = {}

        if(artist!=undefined && artist.length >= 1)
        {
            jsondata.artist = artist
        }
        if(life_term!=undefined && life_term.length >= 1)
        {
            jsondata.life_term = life_term
        }
        if(file!=null)
        {
            jsondata.filename = file.name
        }
        if(artistInfo!=undefined && artistInfo.length >= 1)
        {
            jsondata.artistInfo = artistInfo
        }
        if(artistyearInfo!=undefined && artistyearInfo.length >= 1)
        {
            jsondata.artistyearInfo = artistyearInfo
        }

        if(query.id != undefined && query.id.length>=1)
        {
            jsondata.id = query.id
        }
  

        axios.post(`http://${dev_ver}:4000/api/artist_upload`, jsondata)
                .then((result) => {
                    if(result.data.success)
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
                    <p className="Upload_Artwork_Title">작가 정보 업로드</p>
                    <div className="Upload_Artwork_Box">
                        <input className="Upload_input1" onChange={(e)=>{setArtist(e.target.value)}}      value={artist=='' ? null : artist} type="text" maxLength="20" placeholder="작가명"/>
                        <input className="Upload_input1" onChange={(e) => {setLife_term(e.target.value)}} value={life_term=='' ? null : life_term} type="text" maxLength="9" placeholder="작가 년도(ex. '1990~' or '1990~2030' )"/>
                        <input className="Upload_input_file" onChange={(e)=>{setFile(e.target.files[0])}} multiple="multiple" title="파일 업로드" type="file"/>
                        <textarea className="Upload_input2" onChange={(e)=>{setArtistInfo(e.target.value)}} value={artistInfo=='' ? null : artistInfo} placeholder="작가 설명(ex. '언제 태어나 언제 뭘했고 등등' )" />
                        <textarea className="Upload_input2" onChange={(e) => {setArtistyearInfo(e.target.value)}} value={artistyearInfo=='' ? null : artistyearInfo} placeholder="작가 연혁(ex. '1973 뭘 그림' )" />
                        {console.log(artistyearInfo)}
                        <div className="Upload_Artwork_btn_flex">
                            <div className="Upload_Artwork_btn1" onClick={artistupload}><p>업로드</p></div>
                            <div className="Upload_Artwork_btn1" onClick={() => {window.location.replace("/")}}><p>취소</p></div>
                        </div>
                    </div>

                </div>
        </div>





    )


    
}