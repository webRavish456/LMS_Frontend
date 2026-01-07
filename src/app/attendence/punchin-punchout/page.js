"use client";
import { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, Bell, User } from "lucide-react";
import Layout from "@/components/Layout"; 

export default function PunchPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Calcutta",
  });

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="flex items-center gap-3">
          <User className="text-gray-600 w-8 h-8" />
          <h1 className="text-2xl font-semibold">Punch-In / Punch-Out</h1>
        </div>

        <div className="flex gap-4 items-center">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium">
            Punch In
          </button>
          
        </div>
      </header>

     
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        <div className="col-span-2 space-y-6">
        
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-medium">
              Good Morning, <span className="font-semibold text-gray-900">Super Admin</span>
            </h2>
            <p className="mt-2 text-gray-500 text-lg">
              It's <span className="font-semibold text-gray-900">{formattedTime}</span> (Asia/Calcutta)
            </p>

            <div className="flex gap-10 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <LogIn className="text-green-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-medium">Not Yet</p>
                  <p className="text-sm text-gray-500">Punch in time</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <LogOut className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-medium">Not Yet</p>
                  <p className="text-sm text-gray-500">Punch out time</p>
                </div>
              </div>
            </div>
          </div>

          
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-2xl p-6">
              <p className="text-4xl font-bold">0</p>
              <p className="text-gray-600 mt-2">Total leave allowance</p>
              <div className="flex gap-6 mt-3 text-sm">
                <p className="text-blue-600 font-medium">CL - 0</p>
                <p className="text-green-600 font-medium">SL - 0</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-2xl p-6">
              <p className="text-4xl font-bold">0</p>
              <p className="text-gray-600 mt-2">Total leave taken</p>
              <div className="flex gap-6 mt-3 text-sm">
                <p className="text-blue-600 font-medium">Paid - 0</p>
                <p className="text-green-600 font-medium">Un Paid - 0</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-2xl p-6">
              <p className="text-4xl font-bold">0</p>
              <p className="text-gray-600 mt-2">Total leave available</p>
              <div className="flex gap-6 mt-3 text-sm">
                <p className="text-blue-600 font-medium">CL - 0</p>
                <p className="text-green-600 font-medium">SL - 0</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-2xl p-6">
              <p className="text-4xl font-bold">0</p>
              <p className="text-gray-600 mt-2">Leave request pending</p>
              <div className="flex gap-6 mt-3 text-sm">
                <p className="text-blue-600 font-medium">Paid - 0</p>
                <p className="text-green-600 font-medium">Un Paid - 0</p>
              </div>
            </div>
          </div>
        </div>

       
        <div className="bg-white shadow rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Time Log</h2>
          <div>
            <h3 className="text-lg font-medium mb-1">Today</h3>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Scheduled</span>
              <span>9h 0m 0s</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Worked</span>
              <span>00:00</span>
            </div>
            <div className="text-gray-600 text-sm">Break</div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-1 mt-4">This Month</h3>
            <div className="text-gray-600 text-sm mb-2">Total Schedule time</div>

            <div className="mt-2">
              <p className="text-sm text-gray-600">Worked time -</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
              </div>

              <p className="text-sm text-gray-600 mt-3">Shortage time -</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-yellow-500 h-2 rounded-full w-2/4"></div>
              </div>

              <p className="text-sm text-gray-600 mt-3">Over time -</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
