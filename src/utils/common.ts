export const sidebarFaqList = [
    {
      id: 1,
      title: 'What we use your data for',
      description: `We've made it easy! Explore our step-by-step guide to getting started with [Company/Product Name]. From account creation to utilizing our services, we'll walk you through the process.`,
    },
    {
      id: 2,
      title: 'What we use your data for',
      description: `We've made it easy! Explore our step-by-step guide to getting started with [Company/Product Name]. From account creation to utilizing our services, we'll walk you through the process.`,
    },
]

export const generalFaqList = [
    {
      id: 1,
      title: 'What is VYE.Socials?',
      description: `Voice Your Experience is all about unblocking insights, shaping policies and empowering Nigeria’s future!`,
    },
    {
      id: 2,
      title: 'What we use your data for',
      description: `We've made it easy! Explore our step-by-step guide to getting started with [Company/Product Name]. From account creation to utilizing our services, we'll walk you through the process.`,
    },
]

export const dataFaqList = [
    {
      id: 1,
      title: 'Why do you need my data?',
      description: `Voice Your Experience is all about unblocking insights, shaping policies and empowering Nigeria’s future!`,
    },
    {
      id: 2,
      title: 'How will my data be used?',
      description: `We've made it easy! Explore our step-by-step guide to getting started with [Company/Product Name]. From account creation to utilizing our services, we'll walk you through the process.`,
    },
]

export const policyFaqList = [
    {
      id: 1,
      title: 'Why do you need my data?',
      description: `Voice Your Experience is all about unblocking insights, shaping policies and empowering Nigeria’s future!`,
    },
    {
      id: 2,
      title: 'How will my data be used?',
      description: `We've made it easy! Explore our step-by-step guide to getting started with [Company/Product Name]. From account creation to utilizing our services, we'll walk you through the process.`,
    },
]

export const AgeGroupList = ['18-25', '26-30', '31-40', '41-50', 'Over 50']

export const ProductList = [
    'Pumbler',
    'Software Engineer',
    'Carpenter',
]

export const StateList = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"
]

export const getGreeting = () =>{
  const date = new Date();
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning 😊";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon 🌞";
  } else {
    return "Good evening 🌜";
  }
}

export const formatDate = (dateString: string) =>{
  const date = new Date(dateString);
  
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const getFormattedDate = () =>{
  const date = new Date();
  const day = date.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const daySuffix = getDaySuffix(day);

  return `Today ${month} ${day}${daySuffix}, ${year}`;
}

export const getFirstCharacters = (str: string) => {
  return str.split(' ').map((word: string) => word.charAt(0)).join('');
};

const getDaySuffix = (day: number) =>{
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}