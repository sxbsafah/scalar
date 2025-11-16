import LightLogoIcon from "@/assets/LightLogo.svg";
import DarkLogoIcon from "@/assets/DarkLogo.svg";
import { useTheme } from "@/hooks/useTheme";



const Logo = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex items-center gap-3 mb-4">
      <img src={resolvedTheme === "dark" ? DarkLogoIcon : LightLogoIcon} width={32} height={32} alt="LogoIcon" className={"size-8"} />
      <h1 className="font-semibold text-[28px]">Scalar</h1>
    </div>
  )
}

export default Logo