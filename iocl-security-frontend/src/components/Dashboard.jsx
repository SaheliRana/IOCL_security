// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // const Dashboard = () => {
// //   const [workers, setWorkers] = useState([]);
// //   const [count, setCount] = useState(0);

// //   useEffect(() => {
// //     axios.get('http://127.0.0.1:8000/api/dashboard-data/')
// //       .then((res) => {
// //         console.log(res);
// //         const inside = res.data.workers || [];
// //         setWorkers(inside);
// //         setCount(res.data.count || 0);
// //       })
// //       .catch((err) => {
// //         console.error('Error fetching dashboard data:', err);
// //       });
// //   }, []);

// //   const downloadCSV = (type) => {
// //     const url =
// //       type === 'attendance'
// //         ? 'http://127.0.0.1:8000/export-csv/'
// //         : 'http://127.0.0.1:8000/export-currently-inside/';
// //     window.open(url, '_blank');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 text-gray-800 p-10">
// //       <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
// //         <h1 className="text-3xl font-bold text-green-700 mb-4">Checked-In Workers</h1>
// //         <p className="text-lg font-medium mb-6">
// //           <span className="font-semibold text-gray-700">Total currently inside:</span> {count}
// //         </p>

// //         <ul className="space-y-3">
// //           {workers.map((worker, index) => (
// //             <li
// //               key={index}
// //               className="bg-green-100 border-l-4 border-green-500 px-4 py-3 rounded-md hover:bg-green-200 transition"
// //             >
// //               {worker.name} ({worker.employee_id})
// //             </li>
// //           ))}
// //         </ul>

// //         <div className="mt-8 flex flex-wrap gap-4">
// //           <button
// //             onClick={() => downloadCSV('attendance')}
// //             className="bg-green-600 text-white font-semibold px-5 py-3 rounded-md hover:bg-green-700 transition"
// //           >
// //             Download Attendance CSV
// //           </button>
// //           <button
// //             onClick={() => downloadCSV('inside')}
// //             className="bg-blue-600 text-white font-semibold px-5 py-3 rounded-md hover:bg-blue-700 transition"
// //           >
// //             Download Currently Inside CSV
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Dashboard = () => {
//   const [workers, setWorkers] = useState([]);
//   const [count, setCount] = useState(0);
//   const [overtimeLogs, setOvertimeLogs] = useState([]);

//   useEffect(() => {
//     // Fetch currently inside data
//     axios.get('http://127.0.0.1:8000/api/dashboard-data/')
//       .then((res) => {
//         setWorkers(res.data.workers || []);
//         setCount(res.data.count || 0);
//       })
//       .catch((err) => {
//         console.error('Error fetching dashboard data:', err);
//       });

//     // Fetch overtime alert data
//     axios.get('http://127.0.0.1:8000/api/overtime-alerts-data/')
//       .then((res) => {
//         setOvertimeLogs(res.data.overtime_workers || []);
//       })
//       .catch((err) => {
//         console.error('Error fetching overtime data:', err);
//       });
//   }, []);

//   const downloadCSV = (type) => {
//     const url =
//       type === 'attendance'
//         ? 'http://127.0.0.1:8000/export-csv/'
//         : 'http://127.0.0.1:8000/export-currently-inside/';
//     window.open(url, '_blank');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800 p-10">
//       <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-12">

//         {/* SECTION: Checked-In Workers */}
//         <section>
//           <h1 className="text-3xl font-bold text-green-700 mb-4">Checked-In Workers</h1>
//           <p className="text-lg font-medium mb-6">
//             <span className="font-semibold text-gray-700">Total currently inside:</span> {count}
//           </p>
//           <ul className="space-y-3">
//             {workers.map((worker, index) => (
//               <li
//                 key={index}
//                 className="bg-green-100 border-l-4 border-green-500 px-4 py-3 rounded-md hover:bg-green-200 transition"
//               >
//                 {worker.name} ({worker.employee_id})
//               </li>
//             ))}
//           </ul>
//         </section>

//         {/* SECTION: Overtime Alerts */}
//         <section>
//           <h2 className="text-2xl font-bold text-red-600 mb-2">Overtime Alerts</h2>
//           <p className="text-sm text-gray-600 mb-4">Workers checked in for more than 10 hours</p>
//           {overtimeLogs.length > 0 ? (
//             <ul className="space-y-3">
//               {overtimeLogs.map((log, index) => (
//                 <li
//                   key={index}
//                   className="bg-red-100 border-l-4 border-red-600 px-4 py-3 rounded-md hover:bg-red-200 transition"
//                 >
//                   <strong>{log.name}</strong> ({log.employee_id})<br />
//                   Checked in at: {log.checked_in_at}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="bg-green-100 text-green-700 px-4 py-3 rounded-md text-center">
//               No workers have exceeded 10 hours.
//             </div>
//           )}
//         </section>

//         {/* SECTION: Download Buttons */}
//         <div className="mt-8 flex flex-wrap gap-4">
//           <button
//             onClick={() => downloadCSV('attendance')}
//             className="bg-green-600 text-white font-semibold px-5 py-3 rounded-md hover:bg-green-700 transition"
//           >
//             Download Attendance CSV
//           </button>
//           <button
//             onClick={() => downloadCSV('inside')}
//             className="bg-blue-600 text-white font-semibold px-5 py-3 rounded-md hover:bg-blue-700 transition"
//           >
//             Download Currently Inside CSV
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [count, setCount] = useState(0);
  const [overtimeLogs, setOvertimeLogs] = useState([]);

  useEffect(() => {
    // Fetch checked-in workers
    axios.get('http://127.0.0.1:8000/api/dashboard-data/')
      .then((res) => {
        setWorkers(res.data.workers || []);
        setCount(res.data.count || 0);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
      });

    // Fetch overtime workers
    axios.get('http://127.0.0.1:8000/api/overtime-alerts-data/')
      .then((res) => {
        setOvertimeLogs(res.data.overtime_workers || []);
      })
      .catch((err) => {
        console.error('Error fetching overtime data:', err);
      });
  }, []);

  const downloadCSV = (type) => {
    const url =
      type === 'attendance'
        ? 'http://127.0.0.1:8000/export-csv/'
        : 'http://127.0.0.1:8000/export-currently-inside/';
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 px-4 py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white flex flex-col items-center">
      <div className="w-full max-w-5xl bg-slate-800 shadow-lg rounded-2xl p-8 md:p-12 space-y-10">

        {/* Checked-In Workers Section */}
        <section>
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">Checked-In Workers</h1>
          <p className="text-lg mb-6">
            <span className="font-semibold text-gray-200">Total currently inside:</span> {count}
          </p>

          {workers.length > 0 ? (
            <ul className="space-y-3">
              {workers.map((worker, index) => (
                <li
                  key={index}
                  className="bg-slate-700 text-white px-4 py-3 rounded-md border-l-4 border-green-400 shadow-sm hover:bg-slate-600 transition"
                >
                  {worker.name} ({worker.employee_id})
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-md text-center">
              No workers are currently checked in.
            </div>
          )}
        </section>

        {/* Overtime Alerts Section */}
        <section>
          <h2 className="text-3xl font-bold text-pink-400 mb-4">Overtime Alerts</h2>
          <p className="text-sm text-gray-300 mb-4">Workers checked in for more than 10 hours</p>

          {overtimeLogs.length > 0 ? (
            <ul className="space-y-3">
              {overtimeLogs.map((log, index) => (
                <li
                  key={index}
                  className="bg-red-200 text-red-900 px-4 py-3 rounded-md border-l-4 border-red-600 hover:bg-red-300 transition"
                >
                  <strong>{log.name}</strong> ({log.employee_id})<br />
                  Checked in at: {log.checked_in_at}
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md text-center">
              No workers have exceeded 10 hours.
            </div>
          )}
        </section>

        {/* Download Buttons */}
        <div className="pt-4 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => downloadCSV('attendance')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-md hover:shadow-xl transition-all"
          >
            Download Attendance CSV
          </button>
          <button
            onClick={() => downloadCSV('inside')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:shadow-xl transition-all"
          >
            Download Currently Inside CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

