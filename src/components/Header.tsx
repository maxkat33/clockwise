import { PiClockClockwiseLight } from "react-icons/pi";

const Header = () => {
  return (
    <header className="shrink-0 p-3 shadow-md shadow-slate-400">
      <h1 className="flex items-center text-4xl font-[300]">
        CL<PiClockClockwiseLight />CK<span className="font-[500]">WISE</span>
      </h1>
    </header>
  )
}

export default Header