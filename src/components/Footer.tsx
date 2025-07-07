import { PiClockClockwiseFill } from "react-icons/pi";

const Footer = () => {
  return (
    <footer className='p-2 flex justify-center items-center gap-5'>
      <div className="flex justify-center items-center text-2xl font-[600]">
        <PiClockClockwiseFill/>
        <h3>
          ClockWise
        </h3>
      </div>
      <p className="">©2025</p>
    </footer>
  )
}

export default Footer