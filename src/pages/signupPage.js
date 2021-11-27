import React,{useState} from 'react';
import axios from 'axios';
import './login.css';
import { useForm } from 'react-hook-form';

import {dev_ver} from './global_const';

function SignupPage({history}){
    const { handleSubmit, register, watch, errors } = useForm();

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordcheck, setPasswordcheck] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [isIdChecked, setIsIdChecked] = useState('no');

    function joinForm()
    {
        if(username == '')
        {
            alert('아이디를 입력하십시오')
            return false
        }

        if(isIdChecked != 'yes')
        {
            alert('아이디 중복체크를 확인해 주십시오')
            return false
        }

        if(name == '')
        {
            alert('이름을 입력하십시오')
            return false
        }

        if(password == '')
        {
            alert('비밀번호를 입력하십시오')
            return false
        }

        if(password != passwordcheck)
        {
            alert('비밀번호가 일치하지 않습니다')
            return false
        }

        if(email == '')
        {
            alert('이메일을 입력하십시오')
            return false
        }

        if(phone == '')
        {
            alert('전화번호를 입력하십시오')
            return false
        }

        axios.post(`http://${dev_ver}:4000/api/joinForm`,{
            username: username,
            name:name,
            password: password,
            email: email,
            phone:phone
        })
        .then((result) =>
        {
            if(result.data.success==false)
            {
                alert("회원가입 실패")
                return false;
            }

            alert("회원가입 성공")
            history.push("/");
        })
        .catch(() => {
            alert('error')
        })
    }

    function checkId()
    {
        axios.post(`http://${dev_ver}:4000/api/checkId`,
        {
            username: username
        })
        .then((result) => {
            
            if(result.data.success == true)
            {
                setIsIdChecked('yes');
                alert('사용가능한 아이디입니다');
            }

            else if(result.data.success=='null')
            {
                setIsIdChecked('no');
                alert('아이디를 입력해 주십시오')
            }
            else
            {
                setIsIdChecked('no');
                alert('해당아이디는 사용 불가능합니다')
            }
        })
        .catch(() => {
            alert('Error')
        })
    }


        return(
            <div>
                <div className="signup_box">
                    <img src="/img/logo.png" alt="로고 이미지" />
                    <input maxLength="20" type="text" placeholder="ID" onChange={(e) => {setUsername(e.target.value); setIsIdChecked('no')}} />
                    <div className="signup_check_id" onClick={checkId}><p>중복확인</p></div>

                    <input maxLength="20" type="text" placeholder="name" onChange={(e) => setName(e.target.value)}/>
                    <input maxLength="20" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <input maxLength="20" type="password" placeholder="Password check" onChange={(e) => setPasswordcheck(e.target.value)}/>
                    <input type="text" placeholder="E-Mail" maxLength="30" onChange={(e) => setEmail(e.target.value)}/>
                    
                    <input maxLength="15" type="text" placeholder="Phone" onChange={(e) => setPhone(e.target.value)}/>
                    
                    <div className="signup_btn" onClick={joinForm}><p>Sign Up</p></div>
                </div>
            </div>
        )
}
export default SignupPage;
