import React, { useState, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';

import { client } from '../../utils/client';

import logo from '../../assets/images/logo-color.png';

interface userDetails {
  access_token: string;
  authuser: string;
  expires_in: number;
}

const Login = () => {
  const [ user, setUser ] = useState<userDetails>();
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (response : any) => setUser(response),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      if (user && !isLoggedIn) {
        setIsLoggedIn(true);
        axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          const profile = res.data;
          sessionStorage.setItem('user', JSON.stringify(profile));
  
          const { name, picture, id } = profile as any;
          
          // create user doc object
          const doc = {
            _id: id,
            _type: 'user',
            userName: name,
            image: picture,
          }
          client.createIfNotExists(doc)
            .then(() => {
              navigate('/', { replace: true })
              // eslint-disable-next-line react-hooks/exhaustive-deps
            })
        })
        .catch((err) => console.log(err));
      }
    },
    [ user, navigate ]
  );

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-screen'>
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 gap-5'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='logo'/>
          </div>
          <div className='shadow-2xl'>
            <button 
              type='button'
              className='bg-[#d9d9d9] flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
              onClick={() => login()}
            >
              <FcGoogle className='mr-4'/> Sign in with Google
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login