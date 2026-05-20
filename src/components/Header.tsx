import ITF from "@/assets/ITF.jpeg";
import NATDF from "@/assets/NATDF.jpeg";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { content } = useLanguage();
  return (
    <div className="flex justify-between items-center w-full bg-blue-700 py-4 px-4 sm:px-6 shadow-md z-40 relative">
      <img
        src={ITF}
        alt="ITF Logo"
        className="h-16 sm:h-20 lg:h-24 rounded shadow-sm"
      />
      <h1 className="text-white text-sm sm:text-xl lg:text-3xl font-heading font-bold text-center flex-grow mx-4 leading-tight">
        {content.header.title}
      </h1>
      <img
        src={NATDF}
        alt="NATDF Logo"
        className="h-16 sm:h-20 lg:h-24 rounded shadow-sm"
      />
    </div>
  );
}
