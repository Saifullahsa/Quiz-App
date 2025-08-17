import React from 'react'
import { useNavigate } from 'react-router-dom'


function Error() {
  const navigate = useNavigate();
const handleBack = () => {
  navigate("/")
}
  return (
   <div className="min-h-screen bg-black p-6 italic text-red-600 flex 
     flex-col space-y-5 items-center justify-center">
      <center><h1 className="font-bold text-4xl ">404 Error</h1></center>
      <button 
       className="px-2 py-1 mb-3 bg-blue-600 hover:bg-blue-700 text-white rounded border-2 flex items-center justify-center text-sm"
      onClick={handleBack}>GO Back</button>
     </div>
  )
}

export default Error