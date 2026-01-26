import ITF from "@/assets/ITF.jpeg"
import NATDF from "@/assets/NATDF.jpeg"

export default function Header() {
  return (
    <div className="flex justify-between w-full content-center bg-blue-600">
      <img src={ITF} alt="ITF Logo" className="h-18 sm:h-20 md:h-20" />
      <h1 className="text-white text-md sm:text-2xl md:text-3xl text-center content-center">NATIONAL AMERICAN TAEKWON-DO FEDERATION (NATF-ITF)</h1>
      <img src={NATDF} alt="NATDF Logo" className="h-18 sm:h-20 md:h-20" />
    </div>
  );
}
