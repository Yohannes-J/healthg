import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
    };

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-green-400">
            <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="" />
            <ul className="hidden md:flex items-start gap-5 font-medium">
                <NavLink to="/">
                    <li className="py-1">{t('home')}</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/doctors">
                    <li className="py-1">{t('doctors')}</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/about">
                    <li className="py-1">{t('about')}</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/contact">
                    <li className="py-1">{t('contact')}</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
            </ul>
            <div className="flex items-center gap-4">
                <select onChange={handleLanguageChange} className="bg-white text-black p-2 rounded-md">
                    <option value="en">English</option>
                    <option value="am">አማርኛ</option>
                </select>
                {token ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img className="w-10 rounded-full" src={assets.profile_pic} alt="" />
                        <img className="w-2.5" src={assets.dropdown_icon} alt="" />
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                                <p onClick={() => navigate('profile')} className="hover:text-black cursor-pointer">{t('myProfile')}</p>
                                <p onClick={() => navigate('my-appointment')} className="hover:text-black cursor-pointer">{t('myAppointment')}</p>
                                <p onClick={logout} className="hover:text-black cursor-pointer">{t('logout')}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">
                        {t('signUpOrSignIn')}
                    </button>
                )}
                <img onClick={() => setShowMenu(true)} className="w-6 m-9 md:hidden" src={assets.menu_icon} alt="" />
                {/*---- mobile menu */}
                <div className={`${showMenu ? 'fixed w-full ' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className="flex item-center justify-between px-5 py-6">
                        <img className="w-36" src={assets.logo} alt="" />
                        <img className="w-7 h-7" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <ul className="flex flex-col item-center gap-2 mt-5 px-5 text-lg font-medium">
                        <NavLink onClick={() => setShowMenu(false)} to="/"><p className="px-4 py-2 rounded inline-block">{t('home')}</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className="px-4 py-2 rounded inline-block">{t('doctors')}</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/about"><p className="px-4 py-2 rounded inline-block">{t('about')}</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className="px-4 py-2 rounded inline-block">{t('contact')}</p></NavLink>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
