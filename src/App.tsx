import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'

function App() {
  return (
    <div className='min-h-screen flex flex-col bg-slate-100 font-[Lato]'>
      <Header />
      <Home />
      <Footer />
    </div>
  )
}

export default App
