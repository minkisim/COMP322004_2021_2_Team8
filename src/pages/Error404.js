import Error from 'react';
import '../App.css'
import { Link } from 'react-router-dom';

export default function Error404(){
        return(
            <div className="error_page">
                <p className="error_p1">Error 404</p>
                <p className="error_p2">Page Not Found</p>

                <Link to="/"><div className="error_btn"><p>홈페이지 이동</p></div></Link>
            </div>
        );
}