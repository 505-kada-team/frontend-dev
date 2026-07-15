import AppRoutes from "@/routes/AppRoutes"

import { Toaster } from 'react-hot-toast' 

function App() {
  return (
    <>
      <AppRoutes />
      
      <Toaster 
        position="top-center" // Posisinya bisa diatur: top-right, bottom-center, dll
        reverseOrder={false}
      />
    </>
  )
}

export default App