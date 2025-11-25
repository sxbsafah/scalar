import Title from "@/components/Title";
import DarkMode from "@/assets/DarkMode.png";
import LightMode from "@/assets/LightMode.png";
import { useTheme } from "@/hooks/useTheme";

const Settings = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <>
      <Title Title="Settings" subTitle="Manage Your Settings" />
      <div className="flex gap-4">
        <button className={`hover:scale-[1.03] duration-200  ${resolvedTheme === "dark" ? "border-2 border-primary rounded-md" : ""}`} onClick={() => setTheme("dark")}>
          <img src={DarkMode}/>
        </button>
        <button className={`hover:scale-[1.03] duration-200  ${resolvedTheme === "light" ? "border-2 border-primary rounded-md" : ""}`} onClick={() => setTheme("light")}>
          <img src={LightMode} />
        </button>
      </div>
    </>
  );
};

export default Settings;
