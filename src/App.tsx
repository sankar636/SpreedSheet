import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Spreadsheet } from './SpreedSheet/SpreedSheet'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Spreadsheet />
    </>
  )
}

export default App
