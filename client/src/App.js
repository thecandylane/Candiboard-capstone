import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import './App.css'
import Home from "./pages/Home";
import useUser from "./hooks/useUser";
import TopicView from "./pages/TopicView";
import AdminPage from "./pages/AdminPage";
import SubtopicGrading from "./pages/Grading";
import MatchingPage from "./pages/CandidateMatchingPage";

const App = () => {
  const {user} = useUser()
  return(
    
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/signup" element={<Signup/>}/>
        {!user ? 
        <></>
        :
        <>
        <Route path='/admin' element={<AdminPage />}/>
        <Route exact path="/home" element={<Home/>}/>
        <Route path='/topic/:id' element={<TopicView />}/>
        <Route path='/grading'element={<SubtopicGrading />} />
        <Route path="/matching-page" element={<MatchingPage />} />
        </>
         }
      </Routes>
    </BrowserRouter>
  )
}

export default App