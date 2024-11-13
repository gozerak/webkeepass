import React, { useEffect, useState } from 'react';
import '../css/App.css';
import Header from './Header';
import MainPage from './MainPage';
import SignInUpPage from './SignInUpPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [pass, setPass] = useState<string | null>(null)

  useEffect(() => {
    if(sessionStorage.getItem('password')) {
      setPass(sessionStorage.getItem("password"))
    }
  })

  return (
    <Router>
      <Routes>
        <Route path ="/" element={<MainPage pass={pass}/>} />
        <Route path ="/auth" element={<SignInUpPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

{/* <div className="App">
  {pass?
 <MainPage pass={pass}/> :
 <SignInUpPage/>
 }
</div> */}