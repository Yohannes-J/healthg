import React from "react";
import "./index.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import Profile from "./pages/Profile";
import MyAppointment from "./pages/MyAppointment";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./components/Chat";

const App = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // <-- get userId here

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-appointment"
          element={
            <PrivateRoute>
              <MyAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointment/:docId"
          element={
            <PrivateRoute>
              <Appointment />
            </PrivateRoute>
          }
        />

        {/* Pass userId prop to Chat */}
          <Route path="/chat/:docId" element={<Chat />} />

        {/* Prevent access to login when logged in */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
