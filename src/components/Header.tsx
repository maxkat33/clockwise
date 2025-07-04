import { PiClockClockwiseFill } from "react-icons/pi";

const Header = () => {
  return (
    <header className="p-4 flex items-center gap-2 text-5xl">
      <PiClockClockwiseFill />
      <h1 className="font-bold">
        ClockWise
      </h1>
    </header>
  )
}

export default Header