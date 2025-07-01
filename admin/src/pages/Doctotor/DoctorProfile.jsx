import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const handleTimeChange = (day, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      availableTime: {
        ...prev.availableTime,
        [day]: {
          ...prev.availableTime?.[day],
          [field]: value,
        },
      },
    }));
  };

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        availableTime: profileData.availableTime,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="flex flex-col gap-4 m-5">
        <div>
          <img
            className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
            src={`${backendUrl}${profileData.image}`}
            alt=""
          />
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            <p className="text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium text-neutral-800">About:</p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}{" "}
                Birr
              </span>
            </p>

            {/* Address */}
            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line1: e.target.value,
                          },
                        }))
                      }
                      value={profileData.address?.line1 || ""}
                      className="block mb-1 border rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line2: e.target.value,
                          },
                        }))
                      }
                      value={profileData.address?.line2 || ""}
                      className="block border rounded px-2 py-1"
                    />
                  </>
                ) : (
                  <>
                    {profileData.address?.line1 || ""}
                    <br />
                    {profileData.address?.line2 || ""}
                  </>
                )}
              </p>
            </div>

            {/* Availability Checkbox */}
            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
              />
              <label>Available</label>
            </div>

            {/* Weekly Time Slots */}
            {isEdit && (
              <div className="mt-4">
                <p className="text-md font-medium text-gray-700 mb-2">
                  Weekly Availability:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="flex flex-col border p-2 rounded bg-gray-50"
                    >
                      <p className="font-medium">{day}</p>
                      <label className="text-sm mt-1">Start Time:</label>
                      <input
                        type="time"
                        value={profileData.availableTime?.[day]?.start || ""}
                        onChange={(e) =>
                          handleTimeChange(day, "start", e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <label className="text-sm mt-1">End Time:</label>
                      <input
                        type="time"
                        value={profileData.availableTime?.[day]?.end || ""}
                        onChange={(e) =>
                          handleTimeChange(day, "end", e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edit / Save Button */}
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
