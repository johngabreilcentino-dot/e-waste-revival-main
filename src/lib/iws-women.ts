export type IwsWoman = {
  id: string;
  name: string;
  title: string;
  location: string;
  photo: string;
  summary: string;
  story: string;
  focus: string;
  goal: string;
  sponsorship: string;
  impact: string;
};

export const iwsWomen: IwsWoman[] = [
  {
    id: "maria-santos",
    name: "Maria Santos",
    title: "Community Repair Mentor",
    location: "Cebu City",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    summary:
      "Maria trains youth to assess small appliances while recovering parts safely and sustainably.",
    story:
      "Maria grew up in a small barangay where broken fans, rice cookers, and microwaves were left to rot. She now runs workshops that teach safe appliance handling and keep bulky e-waste out of landfills.",
    focus: "Repair training",
    goal: "Raise ₱120,000 for tools, parts, transport, and workshop supplies.",
    sponsorship:
      "Sponsor Maria to expand her training program and support 40 young learners this year.",
    impact:
      "Your support helps 40 students gain appliance recovery skills, recycles 500kg of e-waste, and creates local green jobs.",
  },
  {
    id: "ana-velasquez",
    name: "Ana Velasquez",
    title: "E-Waste Awareness Organizer",
    location: "Davao",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    summary:
      "Ana leads awareness campaigns that connect families and schools to proper e-waste disposal.",
    story:
      "After seeing toxic waste contaminate a river near her community, Ana launched neighborhood campaigns to educate parents and teachers about safe disposal and recycling.",
    focus: "Community outreach",
    goal: "Secure ₱90,000 for event materials, transport, and educational kits.",
    sponsorship: "Support Ana to reach 2,000 households with workshops and school visits.",
    impact:
      "Each sponsorship helps prevent harmful appliance waste from entering waterways while building long-term recycling habits.",
  },
  {
    id: "camila-reyes",
    name: "Camila Reyes",
    title: "Digital Inclusion Coach",
    location: "Quezon City",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    summary: "Camila teaches women and seniors how to safely reuse repaired small appliances.",
    story:
      "Camila collects donated small appliances, coordinates safe repair checks, and coaches learners on practical reuse at home.",
    focus: "Refurbish + reuse",
    goal: "Raise ₱110,000 for refurbishment equipment, internet access, and training sessions.",
    sponsorship:
      "Help Camila provide 60 repaired small appliances with training to families in need.",
    impact:
      "Your support transforms old appliances into useful household tools and local livelihood opportunities.",
  },
  {
    id: "jessica-castro",
    name: "Jessica Castro",
    title: "Zero-Waste Policy Advocate",
    location: "Manila",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    summary:
      "Jessica builds partnerships with LGUs and schools to make e-waste recycling widely accessible.",
    story:
      "Jessica works with local governments to create collection points and program guides, helping barangays comply with e-waste laws without extra cost.",
    focus: "Policy + partnerships",
    goal: "Secure ₱130,000 for pilot collection points, training materials, and community events.",
    sponsorship:
      "Support Jessica to launch new drop-off hubs and awareness drives in Metro Manila.",
    impact:
      "Every sponsorship helps communities access safe disposal and keeps toxic materials out of landfills.",
  },
];
