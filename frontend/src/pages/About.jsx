import React from 'react';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation(); 

  return (
    <div className="p-6 text-gray-800">
      <div className="text-center mb-6 text-2xl pt-10 text-gray-500">
        <p className="text-3xl font-bold">
          {t("aboutUsTitle")} <span className="text-gray-700 font-medium">{t("aboutUsSubtitle")}</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          src={assets.about_image}
          alt={t("aboutUsImageAlt")}
          className="w-full md:max-w-[360px]"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p className="text-lg">{t("aboutDescription1")}</p>
          <p className="text-lg">{t("aboutDescription2")}</p>
          <p className="text-lg">{t("aboutDescription3")}</p>
          <b className="text-xl font-semibold block mt-4">{t("ourVision")}</b>
          <p className="text-lg">{t("aboutVision")}</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>{t("whyChooseUs")} <span className='text-gray-700 font-semibold'>{t("chooseUsSubtitle")}</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>{t("efficiency")}</b>
          <p>{t("efficiencyDescription")}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>{t("convenience")}</b>
          <p>{t("convenienceDescription")}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>{t("personalization")}</b>
          <p>{t("personalizationDescription")}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
