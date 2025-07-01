import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'

function App() {
  return (
    <div className='h-screen w-screen flex flex-col items-center bg-sky-100'>
      <Header />
      <Home />
      <Footer />
    </div>
  )
}

export default App
