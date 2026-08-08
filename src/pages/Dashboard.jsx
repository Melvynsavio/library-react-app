import { useEffect, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import {

BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
PieChart,
Pie,
Cell

} from "recharts";
const Dashboard = () => {

  return (

    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar/>

      <div className="ml-72 flex-1">

        <Navbar/>

        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <DashboardCard
              title="Books"
              value="0"
              color="bg-blue-600"
            />

            <DashboardCard
              title="Members"
              value="0"
              color="bg-green-600"
            />

            <DashboardCard
              title="Issued"
              value="0"
              color="bg-orange-500"
            />

            <DashboardCard
              title="Available"
              value="0"
              color="bg-purple-600"
            />

          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-10">

            <div className="bg-white rounded-2xl shadow-lg p-8">

              <h2 className="text-2xl font-bold">

                📊 Library Analytics

              </h2>

              <div className="mt-8 h-72 flex items-center justify-center text-gray-400">

                Charts will be added here.

              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">

              <h2 className="text-2xl font-bold">

                📋 Recent Activity

              </h2>

              <div className="mt-8">

                <p>No recent activity.</p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;