"use client";

import Image from "next/image";

interface ITeamMember {
  name: string;
  title: string;
  years: string;
  specializationTitle: string;
  specialization: string;
  bio: string;
  image: string;
}

const teamMembers: ITeamMember[] = [
  {
    name: "Engr. Martins AKE",
    title: "Director",
    years: "6+ years",
    specializationTitle: "Strategic Leadership & Business Development",
    specialization:
      "Leading Mitcrux vision with extensive experience in technology leadership.",
    bio: "",
    image: "/team/onumah.jpg",
  },
  {
    name: "Engr. Enger Colman",
    title: "Lead Software Engineer",
    years: "12+ years",
    specializationTitle: "CBT Systems & Software Architecture",
    specialization:
      "Expert in developing robust CBT platforms and managing complex software development projects.",
    bio: "",
    image: "/team/enger.jpg",
  },
  {
    name: "Mr. Ikeme Okechukwu",
    title: "Security Systems Specialist",
    years: "15+ years",
    specializationTitle: "CCTV Installation & Network Security",
    specialization:
      "Specialized in advanced surveillance systems and security infrastructure for institutions.",
    bio: "",
    image: "/team/ikeme.jpg",
  },
  {
    name: "Mr. Maji Olobo",
    title: "Business Dev. Manager",
    years: "8+ years",
    specializationTitle: "Client Relations & Marketing Strategy",
    specialization:
      "Expert in identifying opportunities and building lasting partnerships with educational institutions.",
    bio: "",
    image: "/team/maji.jpg",
  },
];

export default function TeamPage() {
  return (
    <section className="bg-[#f9f9fc] py-16 px-6 flex flex-col items-center">
      <div className="max-w-7xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Our Expert{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-800">
            Team
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Meet the experienced professionals behind Mitcrux&apos;s success. Our
          team combines decades of experience in technology, education, and
          security systems.
        </p>

        {/* Team Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-cyan-600 font-medium text-sm mb-2">
                {member.title}
              </p>
              <span className="inline-block bg-cyan-100 text-cyan-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {member.years}
              </span>

              <div className="text-left">
                <p className="font-semibold text-sm mb-1">Specialization:</p>
                <p className="text-cyan-600 font-medium text-sm mb-1">
                  {member.specializationTitle}
                </p>
                <p className="text-gray-600 text-sm">{member.specialization}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Expertise Section */}
        <div className="mt-16 bg-gradient-to-r from-cyan-500 to-cyan-800  text-white rounded-2xl shadow-lg grid md:grid-cols-3 gap-6 p-10 text-center">
          <div>
            <h3 className="text-4xl font-bold">47+</h3>
            <p className="mt-2 text-sm uppercase tracking-wide">
              Years Combined Experience
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">200+</h3>
            <p className="mt-2 text-sm uppercase tracking-wide">
              Projects Delivered
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">100%</h3>
            <p className="mt-2 text-sm uppercase tracking-wide">
              Client Satisfaction Rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
