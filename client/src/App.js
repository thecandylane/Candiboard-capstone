import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import './App.css'

const App = () => {
  return(
    
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route/>
        <Route/>
      </Routes>
    </BrowserRouter>
  )
}

export default App