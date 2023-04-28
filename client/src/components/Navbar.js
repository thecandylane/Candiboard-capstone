import { useNavigate } from "react-router-dom"
import useUser from "../hooks/useUser"
import { useContext } from "react"
import UserContext from "../context/UserContext"


const Navbar = () => {
    const { user, getAuthHeaders } = useUser()
    const { logout } = useContext(UserContext)
    const navigate = useNavigate()
    
    async function handleLogout() {
        try {
          const headers = await getAuthHeaders();
          const response = await fetch("/logout", {
            method: "POST",
            headers: headers,
            credentials: "include",
          });
          if (response.ok) {
            logout()
            const data = await response.json();
            console.log("successfully logged out", data);
            navigate("/");
            window.location.reload()
          } else {
            const data = await response.json();
            throw new Error(data.message);
          }
        } catch (error) {
          console.error(error);
          alert("Error logging out");
        }
      }

    return (
        <nav className="bg-slate-500">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="mx-auto">
                    <h1 onClick={() => navigate('/')} className="text-6xl text-center text">Candiboard</h1>
                </div>
                {user?.admin ?
                <button
                onClick={() => navigate('/admin')}
                className="bg-white text-slate-500 mx-2 px-4 py-2 rounded"
                name="Admin"
            >
                Admin
            </button>  
                :
                <></>
                }
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="bg-white text-slate-500 px-4 py-2 rounded"
                        name="logout"
                    >
                        Logout
                    </button>
                ) : (
                    <></>
                )}
            </div>
        </nav>
    )
}

export default Navbar

