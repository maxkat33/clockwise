import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'

function App() {
  return (
    <div className={`relative min-h-[100dvh] flex flex-col bg-slate-200 font-[Lato] text-slate-800 text-base sm:text-lg md:text-xl lg:text-2xl`}>
      <Header />
      <Home />
      <Footer />
    </div>
  )
}

export default App
