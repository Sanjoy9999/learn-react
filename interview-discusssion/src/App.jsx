import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  console.log("App rerendered", Math.random());
  const [value, setValue] = useState({
    value: 0,
  });

  // const [multipliedValue,setMultipliedValue] = useState(1)
  //let multipliedValue = value * 5;

  // const multiplyByFive = () =>{
  // setMultipliedValue(value*5)
  // setValue(value + 1)
  // }

  const clickMe = () => {
    setValue({
      value: 0,
    });
  };

  useEffect(()=>{},[value.value])

  return (
    <>
      <h1>Main value: {value.value}</h1>
      <button onClick={clickMe}>Click to multiply by 5</button>
      {/* <h1>Multiplied value: {multipliedValue}</h1> */}
    </>
  );
}

export default App;
