import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import Chat from "../components/Chat";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]); // Array of slots per day
  const [slotIndex, setSlotIndex] = useState(0); // Selected day index
  const [slotTime, setSlotTime] = useState(null); // Selected time
  const navigate = useNavigate();

  useEffect(() => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  }, [doctors, docId]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    if (slotTime === null) {
      toast.warn("Please select a time slot");
      return;
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (docInfo) {
      generateAvailableSlots();
    }
  }, [docInfo]);

  const generateAvailableSlots = () => {
    let today = new Date();
    let newDocSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // We'll create slots from 10:00 to 21:00 every 30 mins
      let slots = [];
      let slotTimePointer = new Date(currentDate);
      slotTimePointer.setHours(10, 0, 0, 0); // start at 10:00

      let endSlotTime = new Date(currentDate);
      endSlotTime.setHours(21, 0, 0, 0); // end at 21:00

      // Get doctor's available time for the day name
      const dayName = daysOfWeek[currentDate.getDay()];
      let docStartTime = null;
      let docEndTime = null;

      if (docInfo.availableTime && docInfo.availableTime[dayName]) {
        // Parse time strings like "10:00" to Date objects on currentDate
        const [startHour, startMinute] = docInfo.availableTime[dayName].start
          .split(":")
          .map(Number);
        const [endHour, endMinute] = docInfo.availableTime[dayName].end
          .split(":")
          .map(Number);

        docStartTime = new Date(currentDate);
        docStartTime.setHours(startHour, startMinute, 0, 0);

        docEndTime = new Date(currentDate);
        docEndTime.setHours(endHour, endMinute, 0, 0);
      }

      while (slotTimePointer < endSlotTime) {
        let formattedTime = slotTimePointer.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        let day = slotTimePointer.getDate();
        let month = slotTimePointer.getMonth() + 1;
        let year = slotTimePointer.getFullYear();

        const slotDate = day + "_" + month + "_" + year;

        // Check if slot is booked
        const isBooked =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime);

        // Check if slot is within doctor's available time
        let isWithinAvailableTime = true;
        if (docStartTime && docEndTime) {
          isWithinAvailableTime =
            slotTimePointer >= docStartTime && slotTimePointer < docEndTime;
        }

        slots.push({
          datetime: new Date(slotTimePointer),
          time: formattedTime,
          isBooked,
          isWithinAvailableTime,
        });

        slotTimePointer.setMinutes(slotTimePointer.getMinutes() + 30);
      }

      newDocSlots.push(slots);
    }

    setDocSlots(newDocSlots);

    // Reset slotTime when slots refresh
    setSlotTime(null);
    setSlotIndex(0);
  };

  // Function to navigate to the chat page
  const goToChat = () => {
    navigate(`/chat/${docId}`);
  };

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt="Doctor"
          />
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {docInfo.fees} {currencySymbol}
              </span>
            </p>
          </div>
        </div>

        {docInfo.availableTime && (
          <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700">
            <p className="text-lg mb-2">Doctor Availability</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2 px-4 border">Day</th>
                  <th className="py-2 px-4 border">Start Time</th>
                  <th className="py-2 px-4 border">End Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(docInfo.availableTime).map(
                  ([day, time], index) => (
                    <tr key={index} className="text-gray-700">
                      <td className="py-2 px-4 border">{day}</td>
                      <td className="py-2 px-4 border">{time.start}</td>
                      <td className="py-2 px-4 border">{time.end}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((daySlots, index) =>
                daySlots.length > 0 ? (
                  <div
                    key={index}
                    onClick={() => setSlotIndex(index)}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                      slotIndex === index
                        ? "bg-primary text-white"
                        : "border border-gray-200"
                    }`}
                  >
                    <p>{daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                    <p>{daySlots[0].datetime.getDate()}</p>
                  </div>
                ) : null
              )}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots[slotIndex].map((slot, index) => (
                <p
                  key={index}
                  onClick={() =>
                    !slot.isBooked && slot.isWithinAvailableTime
                      ? setSlotTime(slot.time)
                      : null
                  }
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    slot.isBooked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed line-through"
                      : !slot.isWithinAvailableTime
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : slot.time === slotTime
                      ? "bg-primary text-white"
                      : "text-black-600 border border-black-600"
                  }`}
                  title={
                    slot.isBooked
                      ? "Slot already booked"
                      : !slot.isWithinAvailableTime
                      ? "Doctor not available at this time"
                      : "Available slot"
                  }
                >
                  {slot.time.toLowerCase()}
                </p>
              ))}
          </div>

          {slotTime && (
            <p className="mt-2 text-green-600 font-semibold">
              Selected Time: {slotTime}
            </p>
          )}

          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book An Appointment
          </button>

          <button 
            onClick={goToChat}
            className="bg-gray-200 text-gray-700 text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Chat with Doctor
          </button>
          
         
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
