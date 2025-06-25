// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Calendar,
//   Clock,
//   BookmarkCheck,
//   ArrowRight,
//   Frown,
//   School as SchoolIcon,
// } from "lucide-react";
// import { format, isBefore, addDays } from "date-fns";
// import { getSchoolCardData } from "../data/schoolCardData"; // async function
// import Header from "../components/header";
// import Footer from "../components/footer";
// import toast from "react-hot-toast";

// const Dashboard = () => {
//   const [bookmarked, setBookmarked] = useState([]);
//   const [upcoming, setUpcoming] = useState([]);
//   const [loadingBookmarks, setLoadingBookmarks] = useState(true);
//   const [schoolCardData, setSchoolCardData] = useState([]);
//   const [loadingSchools, setLoadingSchools] = useState(true);

//   const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
//   const userData = sessionStorage.getItem("userData");
//   const userId = userData ? JSON.parse(userData).id : null;

//   useEffect(() => {
//     // Load school data on mount
//     setLoadingSchools(true);
//     getSchoolCardData()
//       .then((data) => {
//         setSchoolCardData(data);
//         setLoadingSchools(false);
//       })
//       .catch(() => {
//         toast.error("Failed to load school data");
//         setSchoolCardData([]);
//         setLoadingSchools(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (!isAuthenticated || !userId) return;

//     setLoadingBookmarks(true);
//     fetch(`/api/bookmarks/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && Array.isArray(data.bookmarks)) {
//           const bookmarkIds = data.bookmarks.map((school) => school.id);
//           setBookmarked(bookmarkIds);
//         } else {
//           setBookmarked([]);
//           toast.error("Failed to load bookmarked schools");
//         }
//       })
//       .catch(() => {
//         toast.error("Failed to load bookmarked schools");
//         setBookmarked([]);
//       })
//       .finally(() => setLoadingBookmarks(false));
//   }, [isAuthenticated, userId]);

//   useEffect(() => {
//     // When schoolCardData changes, compute upcoming deadlines
//     if (!schoolCardData.length) {
//       setUpcoming([]);
//       return;
//     }
//     const today = new Date();
//     const in30 = addDays(today, 30);
//     const upcomingSchools = schoolCardData
//       .filter((school) => {
//         if (!school.applicationDeadline) return false;
//         const deadline = new Date(school.applicationDeadline);
//         return !isBefore(deadline, today) && isBefore(deadline, in30);
//       })
//       .sort(
//         (a, b) =>
//           new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
//       );

//     setUpcoming(upcomingSchools);
//   }, [schoolCardData]);

//   const daysLeft = (date) => {
//     const now = new Date();
//     const deadline = new Date(date);
//     return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-6 py-8 pt-24">
//         {!isAuthenticated ? (
//           <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
//             <Frown className="h-24 w-24 text-gray-400 mb-6" />
//             <h2 className="text-2xl font-semibold text-gray-700">
//               Log in to see your dashboard
//             </h2>
//           </div>
//         ) : loadingSchools ? (
//           <p>Loading school data...</p>
//         ) : (
//           <>
//             <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-2xl font-semibold flex items-center">
//                     <Clock className="mr-2 h-8 w-8 text-blue-600" />
//                     Upcoming Deadlines
//                   </h2>
//                   <Link to="/schools">
//                     <button className="px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300 transition">
//                       View All Schools
//                     </button>
//                   </Link>
//                 </div>

//                 {upcoming.length > 0 ? (
//                   <div className="space-y-4">
//                     {upcoming.slice(0, 3).map((school) => {
//                       const days = daysLeft(school.applicationDeadline);
//                       const urgency =
//                         days < 7
//                           ? "bg-red-50 border-red-200 text-red-800"
//                           : days < 14
//                           ? "bg-orange-50 border-orange-200 text-orange-800"
//                           : "bg-green-50 border-green-200 text-green-800";

//                       return (
//                         <div
//                           key={school.id}
//                           className={`p-4 border rounded-lg ${urgency}`}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <Link
//                                 to={`/schools/${school.id}`}
//                                 className="font-semibold hover:underline"
//                               >
//                                 {school.title}
//                               </Link>
//                               <div className="text-sm flex items-center mt-1 text-gray-600">
//                                 <Calendar className="mr-1 h-4 w-4" />
//                                 Deadline:{" "}
//                                 {format(
//                                   new Date(school.applicationDeadline),
//                                   "MMM d, yyyy"
//                                 )}
//                               </div>
//                             </div>
//                             <span className="text-sm font-medium px-2 py-1 border rounded-md">
//                               {days} days left
//                             </span>
//                           </div>
//                           <div className="mt-3 flex justify-end">
//                             <Link to={`/schools/${school.id}`}>
//                               <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-orange-700 hover:bg-orange-100 transition">
//                                 Apply Now
//                               </button>
//                             </Link>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="p-6 border text-center bg-white rounded-lg">
//                     <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-3" />
//                     <p className="text-gray-500">
//                       No upcoming deadlines in the next 30 days.
//                     </p>
//                     <Link to="/schools">
//                       <button className="mt-4 px-3 py-1 text-sm border border-gray-300 rounded-md text-orange-700 hover:bg-orange-100 transition">
//                         Search Schools
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-2xl font-semibold flex items-center">
//                     <BookmarkCheck className="mr-2 h-8 w-8 text-yellow-500" />
//                     Bookmarked Schools
//                   </h2>

//                   {/* Link to bookmarked schools */}

//                 <Link to="/bookmarks">
//                     <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
//                      View All Bookmarks
//                    </button>
//                   </Link>
//                  </div>
                

//                 {loadingBookmarks ? (
//                   <p>Loading bookmarks...</p>
//                 ) : bookmarked.length > 0 ? (
//                   <div className="space-y-4">
//                     {schoolCardData
//                       .filter((school) => bookmarked.includes(school.id))
//                       .slice(0, 3)
//                       .map((school) => (
//                         <div
//                           key={school.id}
//                           className="flex border rounded-lg overflow-hidden bg-white"
//                         >
//                           <div className="w-24 h-24 shrink-0">
//                             <img
//                               src={school.image}
//                               alt={school.title}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="p-3 flex-1 flex flex-col justify-between">
//                             <div>
//                               <Link
//                                 to={`/schools/${school.id}`}
//                                 className="font-semibold hover:underline"
//                               >
//                                 {school.title}
//                               </Link>
//                               <div className="text-xs mt-1 text-gray-500">
//                                 {school.location}
//                               </div>
//                             </div>
//                             <div className="text-right mt-2">
//                               <Link to={`/university/${school.id}`}>
//                                 <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
//                                   Details <ArrowRight className="h-3 w-3" />
//                                 </button>
//                               </Link>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 ) : (
//                   <div className="p-6 border text-center bg-white rounded-lg">
//                     <BookmarkCheck className="mx-auto h-10 w-10 text-gray-400 mb-3" />
//                     <p className="text-gray-500">No bookmarked schools yet.</p>
//                     <Link to="/schools">
//                       <button className="mt-4 px-3 py-1 text-sm border border-gray-300 rounded-md text-orange-700 hover:bg-orange-100 transition">
//                         Browse Schools
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <section className="mb-12">
//               <h2 className="text-2xl font-semibold mb-4 flex items-center">
//                 <SchoolIcon className="mr-2 h-8 w-8 text-indigo-600" />
//                 College Application Statistics
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
//                   <div className="text-xl font-bold">{schoolCardData.length}</div>
//                   <div className="text-sm text-gray-500">Total Schools</div>
//                 </div>
//                 <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
//                   <div className="text-xl font-bold">{bookmarked.length}</div>
//                   <div className="text-sm text-gray-500">Bookmarked</div>
//                 </div>
//                 <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
//                   <div className="text-xl font-bold">{upcoming.length}</div>
//                   <div className="text-sm text-gray-500">Upcoming Deadlines</div>
//                 </div>
//               </div>
//             </section>

//             <section className="text-center py-10 bg-white rounded-lg shadow-sm">
//               <h2 className="text-2xl font-bold mb-2">
//                 Ready to explore more schools?
//               </h2>
//               <p className="text-gray-600 mb-5 max-w-xl mx-auto">
//                 Discover institutions that match your interests and academic
//                 goals.
//               </p>
//               <Link to="/schools">
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                   Browse All Schools
//                 </button>
//               </Link>
//             </section>
//           </>
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  BookmarkCheck,
  ArrowRight,
  Frown,
  School as SchoolIcon,
} from "lucide-react";
import { format, isBefore, addDays } from "date-fns";
import { getSchoolCardData } from "../data/schoolCardData";
import { useBookmarks } from "../contexts/BookmarkContext";
import Header from "../components/header";
import Footer from "../components/footer";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [schoolCardData, setSchoolCardData] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);

  const {
    bookmarks,
    loading: loadingBookmarks,
    bookmarkCount,
  } = useBookmarks();

  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    // Load school data on mount
    setLoadingSchools(true);
    getSchoolCardData()
      .then((data) => {
        setSchoolCardData(data);
        setLoadingSchools(false);
      })
      .catch(() => {
        toast.error("Failed to load school data");
        setSchoolCardData([]);
        setLoadingSchools(false);
      });
  }, []);

  useEffect(() => {
    // When schoolCardData changes, compute upcoming deadlines
    if (!schoolCardData.length) {
      setUpcoming([]);
      return;
    }
    const today = new Date();
    const in30 = addDays(today, 30);
    const upcomingSchools = schoolCardData
      .filter((school) => {
        if (!school.applicationDeadline) return false;
        const deadline = new Date(school.applicationDeadline);
        return !isBefore(deadline, today) && isBefore(deadline, in30);
      })
      .sort(
        (a, b) =>
          new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
      );

    setUpcoming(upcomingSchools);
  }, [schoolCardData]);

  const daysLeft = (date) => {
    const now = new Date();
    const deadline = new Date(date);
    return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  };

  // Get bookmarked schools from the full school data
  const bookmarkedSchools = schoolCardData.filter((school) =>
    bookmarks.includes(school.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-6 py-8 pt-24">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Frown className="h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700">
              Log in to see your dashboard
            </h2>
          </div>
        ) : loadingSchools ? (
          <p>Loading school data...</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Clock className="mr-2 h-8 w-8 text-blue-600" />
                    Upcoming Deadlines
                  </h2>
                  <Link to="/schools">
                    <button className="px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300 transition">
                      View All Schools
                    </button>
                  </Link>
                </div>

                {upcoming.length > 0 ? (
                  <div className="space-y-4">
                    {upcoming.slice(0, 3).map((school) => {
                      const days = daysLeft(school.applicationDeadline);
                      const urgency =
                        days < 7
                          ? "bg-red-50 border-red-200 text-red-800"
                          : days < 14
                          ? "bg-orange-50 border-orange-200 text-orange-800"
                          : "bg-green-50 border-green-200 text-green-800";

                      return (
                        <div
                          key={school.id}
                          className={`p-4 border rounded-lg ${urgency}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Link
                                to={`/schools/${school.id}`}
                                className="font-semibold hover:underline"
                              >
                                {school.title}
                              </Link>
                              <div className="text-sm flex items-center mt-1 text-gray-600">
                                <Calendar className="mr-1 h-4 w-4" />
                                Deadline:{" "}
                                {format(
                                  new Date(school.applicationDeadline),
                                  "MMM d, yyyy"
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-medium px-2 py-1 border rounded-md">
                              {days} days left
                            </span>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Link to={`/schools/${school.id}`}>
                              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-orange-700 hover:bg-orange-100 transition">
                                Apply Now
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 border text-center bg-white rounded-lg">
                    <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-gray-500">
                      No upcoming deadlines in the next 30 days.
                    </p>
                    <Link to="/schools">
                      <button className="mt-4 px-3 py-1 text-sm border border-gray-300 rounded-md text-orange-700 hover:bg-orange-100 transition">
                        Search Schools
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <BookmarkCheck className="mr-2 h-8 w-8 text-yellow-500" />
                    Bookmarked Schools
                  </h2>

                  <Link to="/bookmarks">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
                      View All Bookmarks
                    </button>
                  </Link>
                </div>

                {loadingBookmarks ? (
                  <p>Loading bookmarks...</p>
                ) : bookmarkedSchools.length > 0 ? (
                  <div className="space-y-4">
                    {bookmarkedSchools.slice(0, 3).map((school) => (
                      <div
                        key={school.id}
                        className="flex border rounded-lg overflow-hidden bg-white"
                      >
                        <div className="w-24 h-24 shrink-0">
                          <img
                            src={school.image}
                            alt={school.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/schools/${school.id}`}
                              className="font-semibold hover:underline"
                            >
                              {school.title}
                            </Link>
                            <div className="text-xs mt-1 text-gray-500">
                              {school.location}
                            </div>
                          </div>
                          <div className="text-right mt-2">
                            <Link to={`/university/${school.id}`}>
                              <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                Details <ArrowRight className="h-3 w-3" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border text-center bg-white rounded-lg">
                    <BookmarkCheck className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-gray-500">No bookmarked schools yet.</p>
                    <Link to="/schools">
                      <button className="mt-4 px-3 py-1 text-sm border border-gray-300 rounded-md text-orange-700 hover:bg-orange-100 transition">
                        Browse Schools
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <SchoolIcon className="mr-2 h-8 w-8 text-indigo-600" />
                College Application Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
                  <div className="text-xl font-bold">
                    {schoolCardData.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Schools</div>
                </div>
                <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
                  <div className="text-xl font-bold">{bookmarkCount}</div>
                  <div className="text-sm text-gray-500">Bookmarked</div>
                </div>
                <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
                  <div className="text-xl font-bold">{upcoming.length}</div>
                  <div className="text-sm text-gray-500">
                    Upcoming Deadlines
                  </div>
                </div>
              </div>
            </section>

            <section className="text-center py-10 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-2">
                Ready to explore more schools?
              </h2>
              <p className="text-gray-600 mb-5 max-w-xl mx-auto">
                Discover institutions that match your interests and academic
                goals.
              </p>
              <Link to="/schools">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Browse All Schools
                </button>
              </Link>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
