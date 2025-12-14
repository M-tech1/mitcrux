import AboutBusiness from "./sections/aboutUs";
import ContactPage from "./sections/contact";
import Hero from "./sections/hero";
// import TeamPage from "./sections/outTeam";
import Services from "./sections/services";
import TheRightSoftware from "./sections/theRightSoftware";
import WhatConcernsUs from "./sections/whatConcernsUs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutBusiness />
      <Services />
      <WhatConcernsUs />
      <TheRightSoftware />
      {/* <TeamPage /> */}
      <ContactPage />
    </>
  );
}
