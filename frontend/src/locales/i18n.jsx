import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to our Healthcare Service",
      bookAppointment: "Book Appointment",
      searchPlaceholder: "Search healthcare location...",
      searchButton: "Search Location",
      aboutUsTitle: "ABOUT",
      aboutUsSubtitle: "US",
      aboutUsImageAlt: "About Us",
      aboutDescription1: "Welcome to our health center! We are dedicated to providing top-notch medical services with a team of highly qualified doctors and healthcare professionals.",
      aboutDescription2: "You can easily connect with specialists, book appointments, and receive professional medical guidance—all in one place.",
      aboutDescription3: "Our mission is to ensure accessible, reliable, and high-quality healthcare services for everyone, making your well-being our top priority.",
      ourVision: "Our Vision",
      aboutVision: "We aim to revolutionize healthcare accessibility by bridging the gap between patients and medical experts through a seamless, technology-driven experience.",
      whyChooseUs: "WHY CHOOSE US?",
      efficiency: "Efficiency",
      efficiencyDescription: "Our healthcare system ensures quick access to medical professionals, minimizing wait times and streamlining the appointment process for a hassle-free experience.",
      convenience: "Convenience",
      convenienceDescription: "With online booking, virtual consultations, and easy access to medical records, we make healthcare more accessible and stress-free for our patients.",
      personalization: "Personalization",
      personalizationDescription: "We prioritize patient-centered care, offering tailored medical advice, treatment plans, and services that cater to individual health needs and preferences.",
      
      specialityMenuTitle: "Find By Speciality",
      specialityMenuSubtitle: "Simply come here and schedule an appointment with special doctors",
      
      footer: {
        description: "Welcome to our healthcare guidance page! We provide expert medical advice, connect you with top healthcare professionals, and ensure you receive the best care possible.",
        company: "Company",
        home: "Home",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        privacyPolicy: "Privacy Policy",
        getInTouch: "Get In Touch",
        copyright: "Copy-Right© 2025 Healthcare - All Rights Reserved",
      },
    },
  },
  am: {
    translation: {
      welcome: "እንኳን ወደ የእኛ የጤና አገልግሎት ቦታ በደህና መጡ",
      bookAppointment: "ቀጠሮ ይያዙ",
      searchPlaceholder: "የጤና አገልግሎት ቦታ ይፈልጉ...",
      searchButton: "ቦታ ይፈልጉ",
      aboutUsTitle: "ስለ እኛ",
      aboutUsSubtitle: "እኛ",
      aboutUsImageAlt: "ስለ እኛ",
      aboutDescription1: "ወደ ጤናችን ተቀባ እንኳን ደህና መጡ! እኛ በከፍተኛ ተሞክሮ በታምራት ሐኪሞች እና በሕክምና ባለሞያዎች ቡድን የተሞላ አምስት የጤና አገልግሎቶችን እንሰጣለን።",
      aboutDescription2: "በቀላሉ ከሐኪሞች ጋር መገናኘት፣ ቀጠሮዎችን ማዕከላዊ ቦታ እንዲቀይሩና ሕክምና መምሪያ ስለማግኘት፣ ሁሉንም በአንድ ቦታ እንደምታገኙ አደርጋለን።",
      aboutDescription3: "የእኛ ስልጣን ለሁሉም በእርስዎ ተገቢ ፣ ምንጭ እና ስለነገምን አምስት ትኩረት እንሰጣለን።",
      ourVision: "ራዕዩት",
      aboutVision: "የጤና አንጻር በማስተላለፊያ በጣም ማንም ማንም እንኳን እንደምታበረታ እና ማንነት በማጣላቸው ተማሪዎችን አድርጋለን።",
      whyChooseUs: "ለምን እኛን ይምረጡ?",
      efficiency: "አቅም",
      efficiencyDescription: "የጤና አገልግሎት በምታበረት የምንታበረት።",
      convenience: "ምቹነት",
      personalization: "ግልጽነት",
      
      specialityMenuTitle: "በስፔሻሊቲ ይፈልጉ",
      specialityMenuSubtitle: "በቀላሉ እዚህ መጡ እና ከሐኪሞች ጋር ቀጠሮ ይያዙ",
      
      footer: {
        description: 
          "ወደ ጤናችን ተቀባ እንኳን ደህና መጡ! እኛ በከፍተኛ ተሞክሮ በታምራት ሐኪሞች እና በሕክምና ባለሞያዎች ቡድን የተሞላ አምስት የጤና አገልግሎቶችን እንሰጣለን። እኛ የሐኪሞችን መታወቂያ በተሞክሮ በምታበረት፣ በመስመር እና እንዲሁም በማንም እንደምታገኙ አስተምሯል።",
        company: "ኩባንያ",
        home: "መነሻ ገፅ",
        aboutUs: "ስለ እኛ",
        contactUs: "እኛን እንደምታገኙ",
        privacyPolicy: "የግል መረጃ ፖሊሲ",
        getInTouch: "እንዴት ተገናኙ",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;