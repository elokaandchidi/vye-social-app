export default function authHeader() {
    const tokenStr = localStorage.getItem("token");
    let token = null;
    if (tokenStr)
      token = JSON.parse(tokenStr);    
    if (token && token.accessToken) {
      return { Authorization: 'Bearer ' + token.accessToken };
    } else {
      return { Authorization: '' };
    }
  }