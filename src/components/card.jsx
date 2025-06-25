// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
// import { ArrowRight, Bookmark, Calendar } from "lucide-react";
// import { useState, useEffect } from "react";
// import { format, parse, isValid } from "date-fns";
// import PropTypes from 'prop-types';
// import { getSchoolCardData } from '../data/schoolCardData';

// // Helper to clean and parse deadline string from API
// const parseDeadline = (deadlineStr) => {
//   if (!deadlineStr) return null;

//   const cleaned = deadlineStr
//     .replace(/(\d+)(st|nd|rd|th)/gi, "$1")
//     .replace(/\./g, "")
//     .trim();

//   // Try parsing with date-fns format "d MMMM yyyy" (e.g. "31 October 2025")
//   const parsedDate = parse(cleaned, "d MMMM yyyy", new Date());
//   if (isValid(parsedDate)) return parsedDate;

//   // fallback: try native Date parse
//   const fallbackDate = new Date(cleaned);
//   if (isValid(fallbackDate)) return fallbackDate;

//   console.warn("Invalid deadline string:", deadlineStr);
//   return null;
// };

// const SchoolCard = ({
//   id,
//   title,
//   description,
//   image,
//   location,
//   applicationDeadline,
//   bookmarked,
//   onBookmark,
//   applicationFees
// }) => {
//   const now = new Date();
//   const deadline = parseDeadline(applicationDeadline);

//   const daysUntil = deadline && isValid(deadline)
//     ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
//     : null;

//   const getDeadlineClass = () => {
//     if (daysUntil === null || daysUntil < 0) return "text-gray-500";
//     if (daysUntil < 7) return "text-red-500";
//     if (daysUntil < 30) return "text-orange-500";
//     return "text-green-500";
//   };

//   // Generate the university page link based on the school ID
//   const universityLink = `/university/${id}`;

//   return (
//     <div className="rounded-xl overflow-hidden bg-white border shadow-sm transition-all hover:shadow-md">
//       <div className="relative h-40 w-full overflow-hidden">
//         <img
//           src={image}
//           alt={title}
//           className="w-full h-full object-cover"
//         />
//         <button
//           onClick={() => onBookmark(id)}
//           className={`absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full ${
//             bookmarked ? "text-yellow-500" : "text-gray-500"
//           }`}
//         >
//           <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-yellow-500" : ""}`} />
//         </button>
//       </div>
//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
//         </div>
//         <p className="text-sm text-gray-500 line-clamp-2 mb-2">{description}</p>
//         <div className="flex items-center gap-1 text-sm">
//           <Calendar className="h-4 w-4" />
//           <span>Deadline:</span>
//           <span className={getDeadlineClass()}>
//             {deadline && isValid(deadline)
//               ? format(deadline, "MMM d, yyyy")
//               : "No deadline"}
//             {deadline && isValid(deadline) && daysUntil !== null
//               ? daysUntil > 0
//                 ? ` (${daysUntil} days left)`
//                 : " (Passed)"
//               : null}
//           </span>
//         </div>

//         {applicationFees && (applicationFees.ghanaian || applicationFees.international) && (
//           <div className="text-xs text-gray-600 mb-2 mt-2">
//             <div>Application Fees:</div>
//             {applicationFees.ghanaian && (
//               <div>Ghanaian Applicants: {applicationFees.ghanaian}</div>
//             )}
//             {applicationFees.international && (
//               <div>International Applicants: {applicationFees.international}</div>
//             )}
//           </div>
//         )}
//       </div>
//       <div className="px-4 pb-4 pt-0 flex justify-between items-center">
//         <div className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{location}</div>
//         <Link to={universityLink}>
//           <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
//             Details <ArrowRight className="h-4 w-4" />
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// SchoolCard.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   image: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
//   location: PropTypes.string.isRequired,
//   applicationDeadline: PropTypes.string.isRequired,
//   bookmarked: PropTypes.bool.isRequired,
//   onBookmark: PropTypes.func.isRequired,
//   applicationFees: PropTypes.object,
// };

// const CardList = () => {
//   const [bookmarks, setBookmarked] = useState([]);
//   const [schools, setSchools] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userData = sessionStorage.getItem("userData");
//   const userId = userData ? JSON.parse(userData).id : null;

//   useEffect(() => {
//     async function fetchSchools() {
//       setLoading(true);
//       const data = await getSchoolCardData();
//       setSchools(data);
//       setLoading(false);         
//     }
//     fetchSchools();
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     fetch(`/api/bookmarks/${userId}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success && Array.isArray(data.bookmarks)) {
//           const ids = data.bookmarks.map(school => school.id);
//           setBookmarked(ids);
//         }
//       })
//       .catch(() => toast.error("Failed to load bookmarks"));
//   }, [userId]);

//   const toggleBookmark = async (id) => {
//     if (!userId) {
//       toast.error("Please log in to bookmark schools.");
//       return;
//     }

//     const isBookmarked = bookmarks.includes(id);
//     const school = schools.find((school) => school.id === id);

//     try {
//       if (isBookmarked) {
//         const res = await fetch('/api/unbookmark', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId, schoolId: id }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           setBookmarked(prev => prev.filter(b => b !== id));
//           toast.success("Bookmark removed");
//         } else {
//           toast.error("Failed to remove bookmark");
//         }
//       } else {
//         const res = await fetch('/api/bookmark', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId, school }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           setBookmarked(prev => [...prev, id]);
//           toast.success("School bookmarked!");
//         } else {
//           toast.error("Failed to add bookmark");
//         }
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading school information...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-6">
//       {schools.map(card => (
//         <SchoolCard
//           key={card.id}
//           {...card}
//           bookmarked={bookmarks.includes(card.id)}
//           onBookmark={toggleBookmark}
//         />
//       ))}
//     </div>
//   );
// };

// export default CardList;




import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parse, isValid } from "date-fns";
import PropTypes from "prop-types";
import { getSchoolCardData } from "../data/schoolCardData";
import { useBookmarks } from "../contexts/BookmarkContext";

// Helper to clean and parse deadline string from API
const parseDeadline = (deadlineStr) => {
  if (!deadlineStr) return null;

  const cleaned = deadlineStr
    .replace(/(\d+)(st|nd|rd|th)/gi, "$1")
    .replace(/\./g, "")
    .trim();

  // Try parsing with date-fns format "d MMMM yyyy" (e.g. "31 October 2025")
  const parsedDate = parse(cleaned, "d MMMM yyyy", new Date());
  if (isValid(parsedDate)) return parsedDate;

  // fallback: try native Date parse
  const fallbackDate = new Date(cleaned);
  if (isValid(fallbackDate)) return fallbackDate;

  console.warn("Invalid deadline string:", deadlineStr);
  return null;
};

const SchoolCard = ({
  id,
  title,
  description,
  image,
  location,
  applicationDeadline,
  applicationFees,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(id);

  const now = new Date();
  const deadline = parseDeadline(applicationDeadline);

  const daysUntil =
    deadline && isValid(deadline)
      ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

  const getDeadlineClass = () => {
    if (daysUntil === null || daysUntil < 0) return "text-gray-500";
    if (daysUntil < 7) return "text-red-500";
    if (daysUntil < 30) return "text-orange-500";
    return "text-green-500";
  };

  const handleBookmarkClick = () => {
    const school = {
      id,
      title,
      description,
      image,
      location,
      applicationDeadline,
      applicationFees,
    };
    toggleBookmark(id, school);
  };

  // Generate the university page link based on the school ID
  const universityLink = `/university/${id}`;

  return (
    <div className="rounded-xl overflow-hidden bg-white border shadow-sm transition-all hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full ${
            bookmarked ? "text-yellow-500" : "text-gray-500"
          }`}
        >
          <Bookmark
            className={`h-5 w-5 ${bookmarked ? "fill-yellow-500" : ""}`}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{description}</p>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          <span>Deadline:</span>
          <span className={getDeadlineClass()}>
            {deadline && isValid(deadline)
              ? format(deadline, "MMM d, yyyy")
              : "No deadline"}
            {deadline && isValid(deadline) && daysUntil !== null
              ? daysUntil > 0
                ? ` (${daysUntil} days left)`
                : " (Passed)"
              : null}
          </span>
        </div>

        {applicationFees &&
          (applicationFees.ghanaian || applicationFees.international) && (
            <div className="text-xs text-gray-600 mb-2 mt-2">
              <div>Application Fees:</div>
              {applicationFees.ghanaian && (
                <div>Ghanaian Applicants: {applicationFees.ghanaian}</div>
              )}
              {applicationFees.international && (
                <div>
                  International Applicants: {applicationFees.international}
                </div>
              )}
            </div>
          )}
      </div>
      <div className="px-4 pb-4 pt-0 flex justify-between items-center">
        <div className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
          {location}
        </div>
        <Link to={universityLink}>
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Details <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};

SchoolCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  applicationDeadline: PropTypes.string.isRequired,
  applicationFees: PropTypes.object,
};

const CardList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      setLoading(true);
      const data = await getSchoolCardData();
      setSchools(data);
      setLoading(false);
    }
    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading school information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-6">
      {schools.map((card) => (
        <SchoolCard key={card.id} {...card} />
      ))}
    </div>
  );
};

export default CardList;




















































// // card.jsx
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
// import { ArrowRight, Bookmark, Calendar } from "lucide-react";
// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import PropTypes from 'prop-types';
// import { getSchoolCardData } from '../data/schoolCardData'; // async function

// const SchoolCard = ({
//   id,
//   title,
//   description,
//   image,
//   link,
//   location,
//   applicationDeadline,
//   bookmarked,
//   onBookmark,
//   applicationFees
// }) => {
//   const now = new Date();
//   const deadline = new Date(applicationDeadline);
//   const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

//   const getDeadlineClass = () => {
//     if (daysUntil < 0) return "text-gray-500";
//     if (daysUntil < 7) return "text-red-500";
//     if (daysUntil < 30) return "text-orange-500";
//     return "text-green-500";
//   };

//   return (
//     <div className="rounded-xl overflow-hidden bg-white border shadow-sm transition-all hover:shadow-md">
//       <div className="relative h-40 w-full overflow-hidden">
//         <img
//           src={image}
//           alt={title}
//           className="w-full h-full object-cover"
//         />
//         <button
//           onClick={() => onBookmark(id)}
//           className={`absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full ${
//             bookmarked ? "text-yellow-500" : "text-gray-500"
//           }`}
//         >
//           <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-yellow-500" : ""}`} />
//         </button>
//       </div>
//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
//         </div>
//         <p className="text-sm text-gray-500 line-clamp-2 mb-2">{description || "No description available"}</p>
//         <div className="flex items-center gap-1 text-sm mb-2">
//           <Calendar className="h-4 w-4" />
//           <span>Deadline:</span>
//           <span className={getDeadlineClass()}>
//             {deadline && !isNaN(deadline)
//               ? format(deadline, "MMM d, yyyy")
//               : "No deadline"}
//             {deadline && !isNaN(deadline)
//               ? daysUntil > 0
//                 ? ` (${daysUntil} days left)`
//                 : " (Passed)"
//               : null}
//           </span>
//         </div>
//         {/* Show application fee if present */}
//         {applicationFees && (applicationFees.ghanaian || applicationFees.international) && (
//           <div className="text-xs text-gray-600 mb-2">
//             <div>Fees:</div>
//             {applicationFees.ghanaian && <div>Ghanaian Applicants: {applicationFees.ghanaian}</div>}
//             {applicationFees.international && <div>International Applicants: {applicationFees.international}</div>}
//           </div>
//         )}
//       </div>
//       <div className="px-4 pb-4 pt-0 flex justify-between items-center">
//         <div className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{location}</div>
//         <Link to={link}>
//           <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
//             Details <ArrowRight className="h-4 w-4" />
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// SchoolCard.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string,
//   image: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
//   location: PropTypes.string.isRequired,
//   applicationDeadline: PropTypes.string,
//   bookmarked: PropTypes.bool.isRequired,
//   onBookmark: PropTypes.func.isRequired,
//   applicationFees: PropTypes.object,
// };

// const CardList = () => {
//   const [bookmarks, setBookmarks] = useState([]);
//   const [schools, setSchools] = useState([]);
//   const userData = sessionStorage.getItem("userData");
//   const userId = userData ? JSON.parse(userData).id : null;

//   useEffect(() => {
//     async function fetchSchools() {
//       const data = await getSchoolCardData();
//       setSchools(data);
//     }

//     fetchSchools();
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     async function fetchBookmarks() {
//       try {
//         const res = await fetch(`api/bookmark/schools/${userId}`);
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         const result = await res.json();
//         if (result?.status === "success") {
//           setBookmarks(result.data);
//         } else {
//           toast.error("Failed to load bookmarks");
//         }
//       } catch {
//         toast.error("Failed to load bookmarks");
//       }
//     }

//     fetchBookmarks();
//   }, [userId]);

//   const toggleBookmark = async (id) => {
//     if (!userId) {
//       toast.error("Please login to bookmark schools");
//       return;
//     }

//     const isBookmarked = bookmarks.includes(id);
//     const url = `api/bookmark/schools/${userId}`;
//     const method = isBookmarked ? "DELETE" : "POST";

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       if (!res.ok) throw new Error(`Status ${res.status}`);
//       const result = await res.json();
//       if (result.status === "success") {
//         setBookmarks((prev) =>
//           isBookmarked ? prev.filter((b) => b !== id) : [...prev, id]
//         );
//       } else {
//         toast.error("Failed to update bookmark");
//       }
//     } catch {
//       toast.error("Failed to update bookmark");
//     }
//   };

//   return (
//     <div className="px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-6">
//       {schools.map((card) => (
//         <SchoolCard
//           key={card.id}
//           {...card}
//           bookmarked={bookmarks.includes(card.id)}
//           onBookmark={toggleBookmark}
//         />
//       ))}
//     </div>
//   );
// };
// export default CardList;