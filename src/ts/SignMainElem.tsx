import React from "react";
import { useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import { useNavigate } from "react-router-dom";
import { useMessage } from "./hooks/useMessage";
import { Key, LogIn, UserPlus } from "lucide-react";

export const API_BASE_URL = 'https://10.1.4.59:7269'

async function computeSha256Hash(message:string) {
    // Преобразуем строку в ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Вычисляем хеш с использованием SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Преобразуем ArrayBuffer в строку в формате hex
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

async function computeHmacSha256(message: string, secretKey: string) {
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    const keyData = encoder.encode(secretKey);
    
    const cryptoKey = await crypto.subtle.importKey(
        'raw', 
        keyData, 
        { name: 'HMAC', hash: { name: 'SHA-256' } }, 
        false, 
        ['sign', 'verify']
    );

    const hashBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export interface LogInData {
    userName: string,
    userPasswordHash: string,
}

export interface SignUpData {
    user_login: string,
    user_password: string
}

interface FetchedLogInData {
    user_id: string,
    auth_token: string
    message: string
}

async function sendHash(myData: LogInData | SignUpData,
     url:string,
     showMessage: (text: string, isError?: boolean) => void): Promise<Boolean> {
    try {
            const data = await postData({
                url,
                myData: myData,
                showMessage
            });

            if (data) {
                return true;
            } else {
                showMessage ("Неправильный логин или пароль", true)
            }
    } catch (err) {
        showMessage("Ошибка при попытке авторизации", true);
    }
    return false;
}

function isLogInData (object: any): object is LogInData {
    return 'userName' in object;
}

async function postData({url, myData, showMessage}: {
    url: string,
    myData: LogInData | SignUpData,
    showMessage: (text: string, isError?: boolean) => void;
}) {
    if (!isLogInData(myData)) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(myData)
    });
    if (response.status === 200) {
        showMessage("Вы успешно зарегистрировались!", false)
    }
    else {
        showMessage("Что-то пошло не так", true)
        return;
    }
    return response.json();
} else {
    const response = await fetch(`${url}?userName=${myData.userName}&userPasswordHash=${myData.userPasswordHash}`, {
        method: 'GET'
    });
    if (response.status === 200) {
        const data = await response.json();
        const logInData: FetchedLogInData = data
        sessionStorage.setItem('userId', logInData.user_id);
        sessionStorage.setItem('authToken', logInData.auth_token);
        sessionStorage.setItem('userName', myData.userName);
        return data;
    } else {
        showMessage("Что-то пошло не так", true)
        return;
    }
}
}

export function LogPassInputs({isSignIn, showMessage}: {isSignIn: boolean, showMessage: (text: string, isError?: boolean) => void}) {
    const [loginData, setLoginData] = useState({
        login: "",
        password: ""
    })
    const navigate = useNavigate();

    async function handleLogIn(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const passwordHash = await computeSha256Hash(loginData.password);
        const forBrowserHash = await computeHmacSha256 (loginData.password, 'zxcArtemdolboebzxc');

        const userData = {
            userName: loginData.login,
            userPasswordHash: passwordHash
        }
        const url = `${API_BASE_URL}/api/User/GetUser`;

        const isSuccess = await sendHash(userData, url, showMessage)
        console.log(passwordHash)
        if (isSuccess) {
            sessionStorage.setItem('pass', forBrowserHash)
            navigate("/");
        }

    }

    async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const passwordHash = await computeSha256Hash(loginData.password);

        const signUpData = {
            user_login:loginData.login,
            user_password:passwordHash}

        const url = `${API_BASE_URL}/api/User/CreateUser`  
        
        sendHash(signUpData, url, showMessage)

    }


    

    return(
        <form className="border-2 w-1/5 h-auto flex flex-col justify-center items-center p-5 mt-0 border-t-0 "
        onSubmit={(e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение
            if (isSignIn) {
              handleLogIn(e);
            } else {
              handleSignUp(e);
            }
          }}
          >
            <div className="flex flex-col mb-4">
                <label htmlFor="login" className="mb-2">Логин</label>
                <input 
                id='login' 
                value={loginData.login} 
                maxLength={50}
                className="border-2 border-gray-500 p-2" 
                type="text" 
                placeholder="Логин"
                onChange={(e) => setLoginData({...loginData, login: e.target.value})}
                />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor='password' className="mb-2">Пароль</label>
                <input id="password" 
                value={loginData.password} 
                maxLength={50}
                className="border-2 border-gray-500 p-2" 
                type="password" 
                placeholder="Пароль"
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
            </div>
            <button
                type="submit"
                className="border-2 border-black border-opacity-35 rounded-full bg-blue-800 text-white px-12 py-2 w-min-fit"
                >
    {isSignIn ? "Войти" : "Зарегистрироваться"}
  </button>
            </form>
    )
}

export default function SignMainElem() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const { message, showMessage } = useMessage();

  const navigate = useNavigate();

    async function handleLogIn(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const passwordHash = await computeSha256Hash(loginData.password);
        const forBrowserHash = await computeHmacSha256 (loginData.password, 'zxcArtemdolboebzxc');

        const userData = {
            userName: loginData.login,
            userPasswordHash: passwordHash
        }
        const url = `${API_BASE_URL}/api/User/GetUser`;

        const isSuccess = await sendHash(userData, url, showMessage)
        console.log(passwordHash)
        if (isSuccess) {
            sessionStorage.setItem('pass', forBrowserHash)
            navigate("/");
        }

    }

    async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const passwordHash = await computeSha256Hash(loginData.password);

        const signUpData = {
            user_login:loginData.login,
            user_password:passwordHash}

        const url = `${API_BASE_URL}/api/User/CreateUser`  
        
        sendHash(signUpData, url, showMessage)

    }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
        
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 w-full h-20 max-w-md">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isSignIn
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <LogIn className="w-4 h-4" />
            Войти
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${!isSignIn
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <UserPlus className="w-4 h-4" />
            Зарегистрироваться
          </button>
        </div>

        
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение
            if (isSignIn) {
              handleLogIn(e);
            } else {
              handleSignUp(e);
            }
          }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-2"
        >
          <div className="">
            <div className=" w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-800">
              {isSignIn ? 'Добро пожаловать!' : 'Создать аккаунт'}
            </h2>
            <p className="text-center text-gray-600 mt-2">
              {isSignIn ? 'Войдите в свой аккаунт' : 'Зарегистрируйтесь для начала работы'}
            </p>

          <div className="flex flex-col">
            <div className="flex flex-col h-24 w-9/10 px-4">

              <label className="text-sm font-medium text-gray-700">
                Логин
              </label>
              <input
                value={loginData.login}
                maxLength={50}
                className=" px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                type="text"
                placeholder="Введите логин"
                onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
                />
                </div>
              <div className="flex flex-col h-24 pb-8 w-9/10 px-4 mb-4">

              <label className="text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                value={loginData.password}
                maxLength={50}
                className=" px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                type="password"
                placeholder="Введите пароль"
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                </div>
          
          <button
            type="submit"
            className="mb-4 py-3 px-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none"
            >
            {isSignIn ? (
                <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Войти
              </span>
            ) : (
                <span className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Зарегистрироваться
              </span>
            )}
          </button>
            </div>
          </div>
        </form>

        
        {message && (
  <div
    className={`fixed bottom-6 h-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg animate-slideUp
      max-w-sm w-full z-50 ${
      message.isError
        ? 'bg-gradient-to-r from-red-500 to-red-600'
        : 'bg-gradient-to-r from-green-500 to-emerald-600'
    }`}
    
  >
    <div className="flex items-center gap-3 text-white">
      {message.isError ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span className="font-medium flex-1">{message.text}</span>
      
    </div>
  </div>
)}
    </div>
  );
}