import React from "react";
import { useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import { useNavigate } from "react-router-dom";

export const API_BASE_URL = 'https://10.14.113.135:7269'

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

async function sendHash(myData: LogInData | SignUpData, url:string): Promise<Boolean> {
    try {
            const data = await postData({
                url,
                myData: myData,
            });

            if (data) {
                return true;
            } else {
                console.error ("Что-то пошло не так при попытке авторизоваться")
            }
    } catch (err) {
        console.error("Ошибка при попытке авторизации", err);
    }
    return false;
}

function isLogInData (object: any): object is LogInData {
    return 'userName' in object;
}

async function postData({url, myData}: {
    url: string,
    myData: LogInData | SignUpData,
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
        alert("Вы успешно зарегистрировались!")
    }
    else {
        alert("Что-то пошло не так")
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
        alert("Вы успешно вошли!")
        sessionStorage.setItem('userId', logInData.user_id);
        sessionStorage.setItem('authToken', logInData.auth_token);
        sessionStorage.setItem('userName', myData.userName);
        return data;
    } else {
        alert("Что-то пошло не так")
        return;
    }
}
}

export function LogPassInputs({isSignIn}: {isSignIn: boolean}) {
    const [loginData, setLoginData] = useState({
        login: "",
        password: ""
    })
    const navigate = useNavigate();

    async function handleLogIn() {
        const passwordHash = await computeSha256Hash(loginData.password);
        const userData = {
            userName: loginData.login,
            userPasswordHash: passwordHash
        }
        const url = `${API_BASE_URL}/api/User/GetUser`;

        const isSuccess = await sendHash(userData, url)

        if (isSuccess) {
            sessionStorage.setItem('pass', passwordHash)
            navigate("/");
        }

    }

    async function handleSignUp() {
        const passwordHash = await computeSha256Hash(loginData.password);

        const signUpData = {
            user_login:loginData.login,
            user_password:passwordHash}

        const url = `${API_BASE_URL}/api/User/CreateUser`  
        
        sendHash(signUpData, url)

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
    const [isSignIn, setIsSignIn] = useState(true)
    return(
        <div className="flex flex-col items-center mt-32 min-w-16">
            <div className="flex justify-center  w-1/5 flex-row h-min mt-5 items-center">
                <div className="flex justify-center items-center w-1/3 p-1 border-r-0  h-min border-2 hover:cursor-pointer" onClick={!isSignIn? ()=> setIsSignIn(true): undefined}>Войти</div>
                <div className="flex justify-center items-center w-2/3 p-1 h-min border-2 hover:cursor-pointer" onClick={isSignIn? ()=> setIsSignIn(false): undefined}>Зарегистрироваться</div>
            </div>
                {isSignIn? <SignIn isSignIn={true} />: <SignUp isSignIn={false} />}
        </div>
    )
}