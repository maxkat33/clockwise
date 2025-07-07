import { PiClockClockwiseLight } from "react-icons/pi";

const Footer = () => {
  return (
    <footer className='shrink-0 p-2 flex justify-center items-center gap-5'>
      <div className="flex justify-center items-center text-2xl  font-[600]">
        <PiClockClockwiseLight/>
        <h3 className="font-[Poiret_One]">
          ClockWise
        </h3>
      </div>
      <p className="">©2025</p>
    </footer>
  )
}

export default Footer