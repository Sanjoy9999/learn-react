import React from "react";
import { useState ,useEffect} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ThemeProvider } from "./context/Theme";
import ThemeBtn from "./components/ThemeBtn";
import Card from "./components/Card";

function App() {
  // Set default theme to light
  const [themeMode, setThemeMode] = useState('light');

const lightTheme = ()=>{
  setThemeMode("light")
}

const darkTheme = ()=>{
  setThemeMode("dark")
} 

//Actual theme in theme 

useEffect(()=>{
  const html = document.querySelector('html');
  html.classList.remove('light','dark');
  html.classList.add(themeMode);
},[themeMode])



  return (
    <>
    <ThemeProvider value={{themeMode,darkTheme,lightTheme}}>
      <div className="flex flex-wrap min-h-screen items-center">
        <div className="w-full">
          <div className="w-full max-w-sm mx-auto flex
           justify-end mb-4">
            <ThemeBtn/>
          </div>

          <div className="w-full max-w-sm mx-auto">
           <Card/>
          </div>
        </div>
      </div>
      </ThemeProvider>
    </>
  );
}

export default App;
