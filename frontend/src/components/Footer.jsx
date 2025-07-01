import React from "react";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";

const Footer = () => {
  const { t } = useTranslation(); // Use the useTranslation hook to access the translation function

  return (
    <div className="md:mx-10">
      <div className="grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/*--- Left Section ---*/}
        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-lg">
          <img src={assets.logo} alt="Healthcare Logo" className="w-24 mb-4" />
          <p className="w-full md:w-2/3 leading-6">
            {t('footer.description')}
          </p>
        </div>

        {/*--- Center Section ---*/}
        <div>
          <p className="text-xl font-medium mb-5">{t('footer.company')}</p>
          <ul className="flex flex-col gap-2 text-blue-600">
            <li>{t('footer.home')}</li>
            <li>{t('footer.aboutUs')}</li>
            <li>{t('footer.contactUs')}</li>
            <li>{t('footer.privacyPolicy')}</li>
          </ul>
        </div>

        {/*--- Right Section ---*/}
        <div>
          <p className="text-xl font-medium mb-5">{t('footer.getInTouch')}</p>
          <ul className="flex flex-col gap-2 text-blue-600">
            <li>📞 0943-60-56-06</li>
            <li>✉️ ezra16mom@gmail.com</li>
          </ul>
        </div>
      </div>

      {/*--- Copyright Section ---*/}
      <div className="border-t border-gray-300 text-center py-4 text-gray-500 text-sm">
        <p className="py-5 text-sm text-center font-medium">{t('footer.copyright')}</p>
      </div>
    </div>
  );
};

export default Footer;
