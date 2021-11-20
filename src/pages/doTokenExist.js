import Cookies from 'js-cookie';
const doTokenExist = () => !!Cookies.get('user')

 export default doTokenExist;
