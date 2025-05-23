import React, { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'

function Github() {
    const data = useLoaderData();

    // const [data, setData] = useState(null);

    // useEffect(() => {
    //   fetch('https://api.github.com/users/hiteshchoudhary')
    //   .then(response => response.json())
    //   .then(data =>{
    //    console.log(data)
    //    setData(data)
    //   })
    // }, [])
    
  return (
    <div className="text-center m-4 bg-gray-600 text-white p-4 text-3xl">
      Github followers: {data ? data.followers : "Loading..."}
      <img src={data ? data.avatar_url : "Loading..."} alt="Git picture" 
      width={300}/>
    </div>
  )
}

export default Github


export const githubInfoLoader = async () => {
    const response =  await fetch('https://api.github.com/users/sanjoy9999')
    return response.json();
}
