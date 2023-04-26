import { useState } from "react"
import Login from "./Login"


const LandingPage = () => {
    const [email ,setEmail] = useState('');
    const [password ,setPassword] = useState('');
    // const token = localStorage.getItem("token");

    function handleLogin(e){
      e.preventDefault()
      fetch('/token', {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          "email":email,
          "password":password
        })
      })
      .then(r => {
        if (r.status === 200) return r.json()
        else alert('there has been error');
      })
      .then(data => {
        console.log("from the backend", data)
        localStorage.setItem("token", data.access_token)
      })
      .catch(err => console.error('ERRORRRR', err))
    }
    


    return (
        <div>
          <h1 class='text-center'>Welcome to Candiboard</h1>
            <h2 class='text-center'>please Log in or Sign up for a free account!</h2>
            <Login setEmail={setEmail} email={email} password={password} setPassword={setPassword} handleLogin={handleLogin}/>
            {/* {token && token!='' && token!=undefined ?
            
            <div>hello</div>
          :
          
          
          } */}
        </div>
    )
}

export default LandingPage