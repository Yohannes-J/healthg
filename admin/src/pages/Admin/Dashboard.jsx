import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData, backendUrl } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  if (!dashData) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading dashboard data...
      </div>
    );
  }

  const handleCancel = async (appointmentId) => {
    await cancelAppointment(appointmentId);
    toast.success("Appointment cancelled successfully");
    getDashData(); // Refresh dashboard after cancel
  };

  return (
    <div className="m-5">
      {/* Summary Cards */}
      <div className="flex flex-wrap gap-3">
        <SummaryCard
          icon={assets.doctor_icon}
          count={dashData.doctors || 0}
          label="Doctors"
        />
        <SummaryCard
          icon={assets.appointments_icon}
          count={dashData.appointments || 0}
          label="Appointments"
        />
        <SummaryCard
          icon={assets.patients_icon}
          count={dashData.patients || 0}
          label="Patients"
        />
        <SummaryCard
          icon={assets.earning_icon}
          count={`${(
            dashData.totalFeesFromAppointments || 0
          ).toLocaleString()} Birr`}
          label="Total Fees"
        />
        <SummaryCard
          icon={assets.comfee_icon}
          count={`${(dashData.adminCommission || 0).toLocaleString()} Birr`}
          label="Admin Commission (10%)"
        />
      </div>

      {/* Latest Appointments */}
      <div className="bg-white mt-10 border rounded">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <img src={assets.list_icon} alt="Latest Bookings" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4">
          {dashData.latestAppointments.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No recent appointments.
            </div>
          ) : (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              >
                <img
                  className="rounded-full w-10 h-10 object-cover"
                  src={`${backendUrl}${item.docData?.image}`}
                  alt={`Dr. ${item.docData?.name}`}
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.docData?.name}
                  </p>
                  <p className="text-gray-600">{item.slotTime}</p>
                </div>
                <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
                <button
                  className="text-red-500 px-2 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                  onClick={() => handleCancel(item._id)}
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// SummaryCard component
const SummaryCard = ({ icon, count, label }) => (
  <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
    <img className="w-14" src={icon} alt={label} />
    <div>
      <p className="text-xl font-semibold text-gray-600">{count}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  </div>
);

export default Dashboard;
