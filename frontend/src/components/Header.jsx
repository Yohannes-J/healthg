import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";

const Header = () => {
  const { t, i18n } = useTranslation(); // Import translation function
  const [location, setLocation] = useState(""); // State to hold the searched location
  const [mapUrl, setMapUrl] = useState(""); // State to hold the map URL
  const [userLocation, setUserLocation] = useState(null); // To store user's current coordinates

  // Fetch user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          // Set the map URL to display the user's current location initially with a marker
          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=AIzaSyCkudzW5XxGDvQ9Jk2cfDlvidZAOszTj7Q&q=${latitude},${longitude}&zoom=14`
          );
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert(t("geolocationNotSupported"));
        }
      );
    } else {
      alert(t("geolocationNotSupported"));
    }
  }, [t]);

  // Handle search for healthcare centers when the user clicks the button
  const handleSearch = () => {
    if (location) {
      const query = encodeURIComponent(location + " healthcare center");
      setMapUrl(
        `https://www.google.com/maps/embed/v1/search?key=AIzaSyCkudzW5XxGDvQ9Jk2cfDlvidZAOszTj7Q&q=${query}`
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">
      {/* Left Side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight lg:leading-tight">
          {t("welcome")}
        </p>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          {t("bookAppointment")}
          <img className="w-3" src={assets.arrow_icon} alt="" />
        </a>

        {/* Search Healthcare Location */}
        <div className="mt-6 w-full">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full p-3 rounded-md text-gray-700"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="mt-2 bg-white text-primary px-5 py-2 rounded-full hover:scale-105 transition-all duration-300"
          >
            {t("searchButton")}
          </button>
        </div>
      </div>

      {/* Right Side (Image & Map) */}
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt={t("aboutUsImageAlt")}
        />

        {/* Display Map, initially showing user's location with a marker */}
        {mapUrl && (
          <iframe
            title="User Location or Healthcare"
            className="w-full h-64 mt-6 rounded-lg"
            src={mapUrl}
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Header;
