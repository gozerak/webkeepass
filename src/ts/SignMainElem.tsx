import React from "react";
import { useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import { useNavigate } from "react-router-dom";
import { useMessage } from "./hooks/useMessage";

export const API_BASE_URL = 'https://10.1.6.30:7269'

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

    async function handleLogIn() {
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

    async function handleSignUp() {
        const passwordHash = await computeSha256Hash(loginData.password);

        const signUpData = {
            user_login:loginData.login,
            user_password:passwordHash}

        const url = `${API_BASE_URL}/api/User/CreateUser`  
        
        sendHash(signUpData, url, showMessage)

    }
    

    return(
        <div className="border-2 w-1/5 h-auto flex flex-col justify-center items-center p-5 mt-0 border-t-0 ">
            <div className="flex flex-col mb-4">
                <label htmlFor="login" className="mb-2">Логин</label>
                <input 
                id='login' 
                value={loginData.login} 
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
                className="border-2 border-gray-500 p-2" 
                type="password" 
                placeholder="Пароль"
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
            </div>
            {isSignIn?
            <button className="border-2 border-black border-opacity-35 rounded-full bg-blue-800 text-white px-16 py-2" onClick={handleLogIn}>Войти</button>:
            <button className="border-2 border-black border-opacity-35 rounded-full bg-blue-800 text-white px-4 py-2" onClick={handleSignUp}>Зарегистрироваться</button>   
        }
            </div>
    )
}

export default function SignMainElem() {
    const [isSignIn, setIsSignIn] = useState(true);
    const { message, showMessage } = useMessage();
    return(
        <div className="flex flex-col items-center mt-32 min-w-16">
            <div className="flex justify-center  w-1/5 flex-row h-min mt-5 items-center">
                <div className="flex justify-center items-center w-1/3 p-1 border-r-0  h-min border-2 hover:cursor-pointer" onClick={!isSignIn? ()=> setIsSignIn(true): undefined}>Войти</div>
                <div className="flex justify-center items-center w-2/3 p-1 h-min border-2 hover:cursor-pointer" onClick={isSignIn? ()=> setIsSignIn(false): undefined}>Зарегистрироваться</div>
            </div>
                {isSignIn? <SignIn isSignIn={true} showMessage={showMessage} />: <SignUp isSignIn={false} showMessage={showMessage} />}
                {message && (
                <div
                    className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 h-fit w-fit px-4 py-2 text-white text-center rounded-md ${
                        message.isError ? "bg-red-600" : "bg-green-600"
                    }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    )
}