// components/how-it-works-section.tsx
import { HOW_IT_WORKS_STEPS } from "./how-it-works-section.data";

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-[#F8F9FA] py-16 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            <span className="text-[#FF2B2B]">How </span>
            <span className="text-[#253C95]">Rentiq </span>
            <span className="text-[#FF2B2B]">Work</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-500 font-medium">
            Book anything in 4 simple steps
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center bg-white rounded-3xl p-8 pt-12 shadow-sm border border-neutral-100 transition-all hover:shadow-md text-center group"
              >
                {/* Floating Top Icon */}
                <div
                  className={`absolute -top-7 flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconBg} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-7 w-7" />
                </div>

                {/* Step Title */}
                <h3 className="mt-4 text-xl font-bold text-[#253C95]">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
