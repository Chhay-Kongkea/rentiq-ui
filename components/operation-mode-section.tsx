// components/operation-mode-section.tsx
import Image from "next/image";

const operationSteps = [
  {
    step: "1",
    title: "Find & Book",
    description:
      "Search nearby listings or post a request — vendors send offers to you. Pick your dates, pay via escrow or KHQR, and your funds are held safely until pickup.",
    image: "/img/ope.png",
  },
  {
    step: "2",
    title: "Pick Up",
    description:
      "Show your unique QR code to the vendor at pickup. They scan it to confirm your booking, inspect the item together, and you're good to go.",
    image: "/img/oope1.png",
  },
  {
    step: "3",
    title: "Return & Review",
    description:
      "We pick, pack and ship all incoming orders directly from our own warehouse until 12pm on the same day.",
    image: "/img/ope2.png",
  },
];

export default function OperationModeSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-12">
      <div className="w-full bg-[#Fcfcfc] py-20 px-6 sm:px-8 relative overflow-hidden rounded-3xl">
        {/* SVG Connecting S-Curve Lines Background matching your reference */}
        <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-center overflow-hidden">
          <div className="w-full max-w-7xl relative h-full">
            <svg
              className="absolute inset-0 h-full w-full"
              fill="none"
              viewBox="0 0 1200 860"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="operation-line-gradient" x1="250" y1="190" x2="900" y2="690" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F73030" stopOpacity="0.25" />
                  <stop offset="0.5" stopColor="#F73030" />
                  <stop offset="1" stopColor="#FF6B6B" stopOpacity="0.45" />
                </linearGradient>
                <filter id="operation-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M 860 190 C 690 190 700 325 465 325 S 245 535 470 535 S 650 690 860 690"
                stroke="#F73030"
                strokeOpacity="0.08"
                strokeWidth="10"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 860 190 C 690 190 700 325 465 325 S 245 535 470 535 S 650 690 860 690"
                stroke="url(#operation-line-gradient)"
                strokeWidth="3"
                strokeDasharray="12 12"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                filter="url(#operation-line-glow)"
                className="operation-path"
              />


            </svg>
          </div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          {/* Section Header with Underline */}
          <div className="mb-24 text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl inline-block">
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
                  style={{ animationDelay: `${index * 180}ms` }}
                  className={`operation-step flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Content */}
                  <div className="flex-1 max-w-xl flex flex-col items-start text-left z-10 bg-[#Fcfcfc]/80 backdrop-blur-[2px] py-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="operation-step-number flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2B2B] text-white font-bold text-lg shadow-sm">
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
                    <div style={{ animationDelay: `${index * 350}ms` }}
                      className="operation-illustration relative flex h-[300px] w-full max-w-md items-center justify-center overflow-hidden bg-transparent sm:h-[350px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
