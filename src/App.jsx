import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Contact, Experience, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";
import VoiceChat from "./components/VoiceChat";
import InterviewBot from "./components/InterviewBot";

const MainPage = () => (
  <div className='relative z-0 bg-primary'>
    <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
      <Navbar />
      <Hero />
    </div>
    <StarsCanvas />
    <About />
    <Experience />
    <Tech />
    <Works />
    <div className='relative z-0'>
      <Contact />
    </div>
    
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/interview" element={<InterviewBot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
