import Image from "next/image";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

// Component for the first section: Professional Experience
const PortfolioSectionOne = () => {
  // List component for experience summary points
  const List = ({ text }) => (
    <p className="text-body-color mb-5 flex items-center text-lg font-medium">
      <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  return (
    <section id="experience" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              
              <div className="mb-12 max-w-[570px] lg:mb-0">
                <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  🧑‍💻 Professional Experience at **ZerocodeHr**
                </h2>
                <p className="text-base !leading-relaxed text-body-color md:text-lg">
[cite_start]                  Software Engineer focused on full-stack development for a Long-Term Incentives Management product (June, 2024 - Present)[cite: 20, 22, 23].
                </p>
              </div>

              <div
                className="mb-12 max-w-[570px] lg:mb-0"
                data-wow-delay=".15s"
              >
                <div className="mx-[-12px] flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
[cite_start]                    <List text="Developed front-end widgets using **React** and integrated APIs for data retrieval/submission[cite: 24]." />
[cite_start]                    <List text="Developed back-end controllers and defined service-layer business logic[cite: 25, 26]." />
                  </div>

                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
[cite_start]                    <List text="Contributed repository interface methods that execute **HQL queries**[cite: 28]." />
[cite_start]                    <List text="Currently developing and integrating **stored procedures** for complex database operations[cite: 29]." />
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder for image relevant to software engineering or full-stack development */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0">
                

[Image of full-stack development architecture]

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSectionOne;