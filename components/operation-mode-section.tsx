// components/operation-mode-section.tsx
import Image from "next/image";

const operationSteps = [
  {
    step: "1",
    title: "Find & Book",
    description:
      "Search nearby listings or post a request — vendors send offers to you. Pick your dates, pay via escrow or KHQR, and your funds are held safely until pickup.",
    image: "/img/ope.png", // Updated asset path
  },
  {
    step: "2",
    title: "Pick Up",
    description:
      "Show your unique QR code to the vendor at pickup. They scan it to confirm your booking, inspect the item together, and you're good to go.",
    image: "/img/oope1.png", // Updated asset path
  },
  {
    step: "3",
    title: "Return & Review",
    description:
      "We pick, pack and ship all incoming orders directly from our own warehouse until 12pm on the same day.",
    image: "/img/ope2.png", // Updated asset path
  },
];

export default function OperationModeSection() {
  return (
    <section className="w-full bg-[#Fcfcfc] py-20 px-4 sm:px-8 relative overflow-hidden">
      {/* SVG Connecting S-Curve Lines Background matching your reference */}
      <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-center overflow-hidden">
        <div className="w-full max-w-7xl relative h-full">
          <svg
            className="absolute inset-0 w-full h-full text-red-400"
            fill="none"
            viewBox="0 0 1200 860"
            preserveAspectRatio="none"
          >
            <path
              d="M 850 200 C 650 200, 550 330, 350 330 C 150 330, 250 550, 450 550 C 650 550, 650 680, 850 680"
              stroke="#FF4D4D"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header with Underline */}
        <div className="mb-24 text-center flex flex-col items-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl inline-block">
            <span className="text-[#253C95]">Operation </span>
            <span className="text-[#FF2B2B]">Mode</span>
          </h2>
          <div className="mt-3 h-1 w-24 bg-[#FF2B2B] rounded-full"></div>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col gap-28 relative">
          {operationSteps.map((item, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Content */}
                <div className="flex-1 max-w-xl flex flex-col items-start text-left z-10 bg-[#Fcfcfc]/80 backdrop-blur-[2px] py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2B2B] text-white font-bold text-lg shadow-sm">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-[#FF2B2B]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-neutral-500 text-base leading-relaxed pl-14">
                    {item.description}
                  </p>
                </div>

                {/* Illustration Card */}
                <div className="flex-1 flex justify-center w-full z-10">
                  <div className="relative w-full max-w-md h-[300px] sm:h-[350px] bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex items-center justify-center overflow-hidden group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}