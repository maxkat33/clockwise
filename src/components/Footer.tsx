import { PiClockClockwiseLight } from "react-icons/pi";

const Footer = () => {
  return (
    <footer className='shrink-0 p-2 flex justify-center items-center gap-2 text-xl'>
      <div className="flex justify-center items-center text-2xl font-[600]">
        <h3 className="flex items-center text-xl font-[300]">
          CL<PiClockClockwiseLight />CK<span className="font-[500]">WISE</span>
        </h3>
      </div>
      <p className="font-[300]">©2025</p>
    </footer>
  )
}

export default Footer