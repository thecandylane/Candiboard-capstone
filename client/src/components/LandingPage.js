import { useContext, useEffect, useState } from "react"
import Login from "../pages/Login"
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
// import useUser from "../hooks/useUser";


const LandingPage = () => {
    // const { user, isLoading} = useUser()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const { user, login } = useContext(UserContext)
    useEffect(() => {
      if(user){
        navigate('/home')

      }
    },[])

    async function handleLogin(e) {
      e.preventDefault();
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          login(data.user);
          navigate("/home");
        } else {
          const data = await response.json();
          throw new Error(data.message);  
        }
      } catch (error) {
        console.error(error);
        alert("Error logging in");
      }
    }
    
    // if (isLoading){
    //   return <div>Loading...</div>
    // }
    // if (user){
    //   console.log(user)
    // }

    return (
        <div>
          <h1 className='text-center'>Welcome to Candiboard</h1>
            <h2 className='text-center'>please Log in or Sign up for a free account!</h2>
            <Login setEmail={setEmail} email={email} password={password} setPassword={setPassword} handleLogin={handleLogin}/>
        </div>
    )
}

export default LandingPage