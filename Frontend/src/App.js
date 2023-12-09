import React from 'react';
import './App.css';
import ImageUploader from './ImageUploader';
import YourComponent from './YourComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Header />
    <Routes>
        <Route exact path="/" element={<ImageUploader />}/>
        <Route exact path="/getall" element={< YourComponent/>}/>
         </Routes>
         {/* <Footer /> */}
    </div>

    </BrowserRouter>
  );
}

export default App;
