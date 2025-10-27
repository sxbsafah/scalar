import  LogoIcon  from "@/assets/Logo.png";



const Logo = () => {
  return (
    <div className="flex items-center gap-3 ">
      <img src={LogoIcon} width={32} height={32} alt="LogoIcon" className={"size-8"} />
      <h1 className="font-semibold text-[32px]">Scalar</h1>
    </div>
  )
}

export default Logo