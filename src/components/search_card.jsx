/* eslint-disable no-case-declarations */

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { MapPin, Users, TrendingUp, Star, Calendar, ArrowRight, Bookmark, Search} from 'lucide-react';
// import PropTypes from 'prop-types';
// import { Card, CardContent } from '../components/Cardui';
// import { Badge } from '../components/badge';
// import { Button } from '../components/button';
// import toast from 'react-hot-toast';
// import { useBookmarks } from '../contexts/BookmarkContext';

// // Static data for universities without API endpoints yet
// const staticUniversityData = [
//   {
//     id: "1",
//     title: "Academic City University",
//     description: "A leading private university focused on innovative technology and business education with strong industry partnerships.",
//     image: "./academic-city.jpeg",
//     location: "Accra, Greater Accra",
//     population: 1300,
//     acceptanceRate: 75,
//     rating: 4.2,
//     established: "2003",
//     type: "Private",
//     programs: ["Business", "Technology", "Engineering"],
//     applicationDeadline: "30th November 2024",
//     applicationFees: {
//       ghanaian: "GH¢300.00",
//       international: "USD$120.00"
//     }
//   },
//   {
//     id: "2", 
//     title: "University of Ghana",
//     description: "Ghana's premier and largest university, offering world-class education across diverse academic disciplines.",
//     image: "./ug.jpeg",
//     location: "Legon, Greater Accra", 
//     population: 38000,
//     acceptanceRate: 45,
//     rating: 4.6,
//     established: "1948",
//     type: "Public",
//     programs: ["Liberal Arts", "Medicine", "Engineering", "Business"],
//     applicationDeadline: "15th December 2024",
//     applicationFees: {
//       ghanaian: "GH¢200.00",
//       international: "USD$80.00"
//     }
//   },
//   {
//     id: "4",
//     title: "University of Cape Coast",
//     description: "Excellence in education and research with strong focus on teacher training and liberal arts education.",
//     image: "./ucc.jpeg",
//     location: "Cape Coast, Central Region",
//     population: 25000,
//     acceptanceRate: 55,
//     rating: 4.3,
//     established: "1962",
//     type: "Public", 
//     programs: ["Education", "Arts", "Science", "Business"],
//     applicationDeadline: "20th December 2024",
//     applicationFees: {
//       ghanaian: "GH¢180.00",
//       international: "USD$75.00"
//     }
//   }
// ];

// // KNUST static base data (will be merged with API data)
// const knustBaseData = {
//   id: "3",
//   title: "Kwame Nkrumah University of Science and Technology",
//   image: "./KNUST.jpg",
//   location: "Kumasi, Ashanti Region",
//   population: 85000,
//   acceptanceRate: 54,
//   rating: 4.5,
//   established: "1951", 
//   type: "Public",
//   programs: ["Engineering", "Science", "Medicine", "Agriculture"]
// };

// const SearchCard = ({
//   id,
//   title,
//   description,
//   image,
//   location,
//   population,
//   acceptanceRate,
//   rating,
//   established,
//   type,
//   programs,
//   applicationDeadline,
//   applicationFees,
// }) => {
//   const { isBookmarked, toggleBookmark } = useBookmarks();
//   const bookmarked = isBookmarked(id);

//   const handleBookmarkClick = () => {
//     const school = {
//       id,
//       title,
//       description,
//       image,
//       location,
//       population,
//       acceptanceRate,
//       rating,
//       established,
//       type,
//       programs,
//       applicationDeadline,
//       applicationFees,
//     };
//     toggleBookmark(id, school);
//   };
//   return (
//     <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
//       <div className="relative h-48 overflow-hidden">
//         <img
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//           src={image}
//           alt={title}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//         {/* University Type Badge */}
//         <Badge
//           variant={type === "Public" ? "default" : "secondary"}
//           className="absolute top-3 left-3 bg-white/90 text-gray-800 font-medium"
//         >
//           {type}
//         </Badge>

//         {/* Bookmark Button */}
//         <button
//           onClick={handleBookmarkClick}
//           className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
//             bookmarked
//               ? "bg-yellow-500 text-white"
//               : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
//           }`}
//         >
//           <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
//         </button>

//         {/* Rating */}
//         <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
//           <Star className="w-4 h-4 text-yellow-500 fill-current" />
//           <span className="text-sm font-medium text-gray-800">{rating}</span>
//         </div>
//       </div>

//       <CardContent className="p-6">
//         <div className="mb-4">
//           <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
//             {title}
//           </h3>
//           <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
//             {description}
//           </p>
//         </div>

//         {/* Location */}
//         <div className="flex items-center gap-2 text-gray-500 mb-4">
//           <MapPin className="w-4 h-4" />
//           <span className="text-sm">{location}</span>
//           <span className="text-xs text-gray-400">• Est. {established}</span>
//         </div>

//         {/* Programs */}
//         <div className="mb-4">
//           <div className="flex flex-wrap gap-1">
//             {programs.slice(0, 3).map((program, index) => (
//               <Badge key={index} variant="outline" className="text-xs">
//                 {program}
//               </Badge>
//             ))}
//             {programs.length > 3 && (
//               <Badge variant="outline" className="text-xs text-gray-500">
//                 +{programs.length - 3} more
//               </Badge>
//             )}
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div className="text-center p-3 bg-gray-50 rounded-lg">
//             <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
//             <div className="text-sm font-semibold text-gray-900">
//               {population.toLocaleString()}
//             </div>
//             <div className="text-xs text-gray-500">Students</div>
//           </div>
//           <div className="text-center p-3 bg-gray-50 rounded-lg">
//             <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
//             <div className="text-sm font-semibold text-gray-900">
//               {acceptanceRate}%
//             </div>
//             <div className="text-xs text-gray-500">Accept Rate</div>
//           </div>
//         </div>

//         {/* Application Info */}
//         {applicationDeadline && (
//           <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//             <div className="flex items-center gap-2 mb-1">
//               <Calendar className="w-4 h-4 text-blue-600" />
//               <span className="text-sm font-medium text-blue-900">
//                 Application Deadline
//               </span>
//             </div>
//             <div className="text-sm text-blue-700">{applicationDeadline}</div>
//           </div>
//         )}

//         {/* Application Fees */}
//         {applicationFees && (
//           <div className="mb-4 text-xs text-gray-600">
//             <div className="font-medium mb-1">Application Fees:</div>
//             {applicationFees.ghanaian && (
//               <div>Ghanaian: {applicationFees.ghanaian}</div>
//             )}
//             {applicationFees.international && (
//               <div>International: {applicationFees.international}</div>
//             )}
//           </div>
//         )}

//         {/* Action Button */}
//         <Link to={`/university/${id}`} className="block">
//           <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg group">
//             View Details
//             <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//           </Button>
//         </Link>
//       </CardContent>
//     </Card>
//   );
// };

// SearchCard.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   image: PropTypes.string.isRequired,
//   location: PropTypes.string.isRequired,
//   population: PropTypes.number.isRequired,
//   acceptanceRate: PropTypes.number.isRequired,
//   rating: PropTypes.number.isRequired,
//   established: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired,
//   programs: PropTypes.arrayOf(PropTypes.string).isRequired,
//   applicationDeadline: PropTypes.string,
//   applicationFees: PropTypes.object,
//   bookmarked: PropTypes.bool.isRequired,
//   onBookmark: PropTypes.func.isRequired,
// };

// const SearchCardList = ({ searchTerm = '', filters = [], sortBy = 'relevance' }) => {
//   const [universityData, setUniversityData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [setBookmarks] = useState([]);

//   const userData = sessionStorage.getItem("userData");
//   const userId = userData ? JSON.parse(userData).id : null;

//   // Fetch university data (API for KNUST, static for others)
//   useEffect(() => {
//     const fetchUniversityData = async () => {
//       setLoading(true);
      
//       const CACHE_KEY = 'knustDataCache';
//       const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

//       // Load cached KNUST data
//       const cachedJson = localStorage.getItem(CACHE_KEY);
//       let cachedKnustData = null;
//       let isExpired = true;

//       if (cachedJson) {
//         try {
//           const parsed = JSON.parse(cachedJson);
//           if (parsed.timestamp && parsed.data) {
//             const age = Date.now() - parsed.timestamp;
//             isExpired = age > TTL_MS;
//             cachedKnustData = parsed.data;
//           }
//         } catch {
//           // ignore parse errors
//         }
//       }

//       // Create KNUST data (use cached if available, otherwise base data)
//       let knustData = {
//         ...knustBaseData,
//         description: cachedKnustData?.description || "Leading technological university in West Africa, renowned for engineering, science, and innovation programs.",
//         applicationDeadline: cachedKnustData?.applicationDeadline || "31st October 2025",
//         applicationFees: cachedKnustData?.applicationFees || {
//           ghanaian: "GH¢250.00",
//           international: "USD$100.00"
//         }
//       };

//       // Combine all university data
//       const allUniversities = [
//         ...staticUniversityData,
//         knustData
//       ];

//       setUniversityData(allUniversities);
//       setLoading(false);

//       // Fetch fresh KNUST data if expired
//       if (isExpired) {
//         try {
//           const response = await fetch('/api/schools/knust-admission');
//           if (!response.ok) throw new Error("API failed");

//           const result = await response.json();
//           if (result.success && result.data) {
//             const apiData = result.data;

//             // Update KNUST data with API response
//             const updatedKnustData = {
//               ...knustBaseData,
//               description: apiData.description || knustData.description,
//               applicationDeadline: apiData.applicationDeadline || knustData.applicationDeadline,
//               applicationFees: apiData.applicationFees || knustData.applicationFees
//             };

//             // Update if different
//             const hasChanged = JSON.stringify(cachedKnustData) !== JSON.stringify(apiData);
//             if (hasChanged) {
//               localStorage.setItem(
//                 CACHE_KEY,
//                 JSON.stringify({ timestamp: Date.now(), data: apiData })
//               );

//               // Update university data with fresh API data
//               const updatedUniversities = [
//                 ...staticUniversityData,
//                 updatedKnustData
//               ];
//               setUniversityData(updatedUniversities);
//             }
//           }
//         } catch (err) {
//           console.warn("API error; using cached data if available.", err);
//         }
//       }
//     };

//     fetchUniversityData();
//   }, []);

//   // Load bookmarks
//   useEffect(() => {
//     if (!userId) return;

//     fetch(`/api/bookmarks/${userId}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success && Array.isArray(data.bookmarks)) {
//           const ids = data.bookmarks.map(school => school.id);
//           setBookmarks(ids);
//         }
//       })
//       .catch(() => toast.error("Failed to load bookmarks"));
//   }, [userId]);

//   // Filter data based on search term and filters
//   // Filter and sort data
//   const processedData = universityData
//     .filter(university => {
//       // Filter by search term
//       const matchesSearch = !searchTerm || 
//         university.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         university.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         university.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         university.programs.some(program => 
//           program.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//       // Filter by selected filters
//       const matchesFilters = filters.length === 0 || filters.some(filter => {
//         if (filter === 'Public Universities') return university.type === 'Public';
//         if (filter === 'Private Universities') return university.type === 'Private';
//         if (filter === 'Technology Focus') return university.programs.some(p => 
//           p.toLowerCase().includes('technology') || p.toLowerCase().includes('engineering')
//         );
//         if (filter === 'Medical Programs') return university.programs.some(p => 
//           p.toLowerCase().includes('medicine') || p.toLowerCase().includes('health')
//         );
//         if (filter === 'Business Programs') return university.programs.some(p => 
//           p.toLowerCase().includes('business')
//         );
//         if (filter === 'Engineering Programs') return university.programs.some(p => 
//           p.toLowerCase().includes('engineering')
//         );
//         return false;
//       });

//       return matchesSearch && matchesFilters;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return a.title.localeCompare(b.title);
//         case 'location':
//           return a.location.localeCompare(b.location);
//         case 'deadline':
//           // Sort by deadline date
//           const dateA = new Date(a.applicationDeadline || '2099-12-31');
//           const dateB = new Date(b.applicationDeadline || '2099-12-31');
//           return dateA - dateB;
//         default:
//           return 0; // relevance - keep original order
//       }
//     });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading universities...</p>
//         </div>
//       </div>
//     );
//   }

//   if (processedData.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <div className="max-w-md mx-auto">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-gray-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No universities found</h3>
//           <p className="text-gray-600">
//             Try adjusting your search terms or filters to find what you&apos;re looking for.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//       {processedData.map(card => (
//         <SearchCard
//           key={card.id}
//           {...card}
//         />
//       ))}
//     </div>
//   );
// };

// SearchCardList.propTypes = {
//   searchTerm: PropTypes.string,
//   filters: PropTypes.arrayOf(PropTypes.string),
//   sortBy: PropTypes.string,
// };

// export default SearchCardList;



import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  TrendingUp,
  Star,
  Calendar,
  ArrowRight,
  Bookmark,
  Search,
} from "lucide-react";
import PropTypes from "prop-types";
import { Card, CardContent } from "../components/Cardui";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { useBookmarks } from "../contexts/BookmarkContext";

// Static data for universities without API endpoints yet
const staticUniversityData = [
  {
    id: "AcademicCity",
    title: "Academic City University",
    description:
      "A leading private university focused on innovative technology and business education with strong industry partnerships.",
    image: "./academic-city.jpeg",
    location: "Accra, Greater Accra",
    population: 1300,
    acceptanceRate: 75,
    rating: 4.2,
    established: "2003",
    type: "Private",
    programs: ["Business", "Technology", "Engineering"],
    applicationDeadline: "30th November 2024",
    applicationFees: {
      ghanaian: "GH¢300.00",
      international: "USD$120.00",
    },
  },
  {
    id: "ug",
    title: "University of Ghana",
    description:
      "Ghana's premier and largest university, offering world-class education across diverse academic disciplines.",
    image: "./ug.jpeg",
    location: "Legon, Greater Accra",
    population: 38000,
    acceptanceRate: 45,
    rating: 4.6,
    established: "1948",
    type: "Public",
    programs: ["Liberal Arts", "Medicine", "Engineering", "Business"],
    applicationDeadline: "15th December 2024",
    applicationFees: {
      ghanaian: "GH¢200.00",
      international: "USD$80.00",
    },
  },
  {
    id: "CapeCoast",
    title: "University of Cape Coast",
    description:
      "Excellence in education and research with strong focus on teacher training and liberal arts education.",
    image: "./ucc.jpeg",
    location: "Cape Coast, Central Region",
    population: 25000,
    acceptanceRate: 55,
    rating: 4.3,
    established: "1962",
    type: "Public",
    programs: ["Education", "Arts", "Science", "Business"],
    applicationDeadline: "20th December 2024",
    applicationFees: {
      ghanaian: "GH¢180.00",
      international: "USD$75.00",
    },
  },
];

// KNUST static base data (will be merged with API data)
const knustBaseData = {
  id: "knust",
  title: "Kwame Nkrumah University of Science and Technology",
  image: "./KNUST.jpg",
  location: "Kumasi, Ashanti Region",
  population: 85000,
  acceptanceRate: 54,
  rating: 4.5,
  established: "1951",
  type: "Public",
  programs: ["Engineering", "Science", "Medicine", "Agriculture"],
};

const SearchCard = ({
  id,
  title,
  description,
  image,
  location,
  population,
  acceptanceRate,
  rating,
  established,
  type,
  programs,
  applicationDeadline,
  applicationFees,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(id);

  const handleBookmarkClick = () => {
    const school = {
      id,
      title,
      description,
      image,
      location,
      population,
      acceptanceRate,
      rating,
      established,
      type,
      programs,
      applicationDeadline,
      applicationFees,
    };
    toggleBookmark(id, school);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={image}
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <Badge
          variant={type === "Public" ? "default" : "outline"}
          className="absolute top-3 left-3 bg-white/90 text-gray-800 font-medium"
        >
          {type}
        </Badge>

        <button
          onClick={handleBookmarkClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            bookmarked
              ? "bg-yellow-500 text-white"
              : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-800">{rating}</span>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
          <span className="text-xs text-gray-400">• Est. {established}</span>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {programs.slice(0, 3).map((program, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {program}
              </Badge>
            ))}
            {programs.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{programs.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {population.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {acceptanceRate}%
            </div>
            <div className="text-xs text-gray-500">Accept Rate</div>
          </div>
        </div>

        {applicationDeadline && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Application Deadline
              </span>
            </div>
            <div className="text-sm text-blue-700">{applicationDeadline}</div>
          </div>
        )}

        {applicationFees && (
          <div className="mb-4 text-xs text-gray-600">
            <div className="font-medium mb-1">Application Fees:</div>
            {applicationFees.ghanaian && (
              <div>Ghanaian: {applicationFees.ghanaian}</div>
            )}
            {applicationFees.international && (
              <div>International: {applicationFees.international}</div>
            )}
          </div>
        )}

        <Link to={`/university/${id}`} className="block">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg group">
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

SearchCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  population: PropTypes.number.isRequired,
  acceptanceRate: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  established: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  programs: PropTypes.arrayOf(PropTypes.string).isRequired,
  applicationDeadline: PropTypes.string,
  applicationFees: PropTypes.object,
};

const SearchCardList = ({
  searchTerm = "",
  filters = [],
  sortBy = "relevance",
}) => {
  const [universityData, setUniversityData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch university data (API for KNUST, static for others)
  useEffect(() => {
    const fetchUniversityData = async () => {
      setLoading(true);

      const CACHE_KEY = "knustDataCache";
      const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

      // Load cached KNUST data
      const cachedJson = localStorage.getItem(CACHE_KEY);
      let cachedKnustData = null;
      let isExpired = true;

      if (cachedJson) {
        try {
          const parsed = JSON.parse(cachedJson);
          if (parsed.timestamp && parsed.data) {
            const age = Date.now() - parsed.timestamp;
            isExpired = age > TTL_MS;
            cachedKnustData = parsed.data;
          }
        } catch {
          // ignore parse errors
        }
      }

      // Create KNUST data (use cached if available, otherwise base data)
      let knustData = {
        ...knustBaseData,
        description:
          cachedKnustData?.description ||
          "Leading technological university in West Africa, renowned for engineering, science, and innovation programs.",
        applicationDeadline:
          cachedKnustData?.applicationDeadline || "31st October 2025",
        applicationFees: cachedKnustData?.applicationFees || {
          ghanaian: "GH¢250.00",
          international: "USD$100.00",
        },
      };

      // Combine all university data
      const allUniversities = [...staticUniversityData, knustData];

      setUniversityData(allUniversities);
      setLoading(false);

      // Fetch fresh KNUST data if expired
      if (isExpired) {
        try {
          const response = await fetch("/api/schools/knust-admission");
          if (!response.ok) throw new Error("API failed");

          const result = await response.json();
          if (result.success && result.data) {
            const apiData = result.data;

            // Update KNUST data with API response
            const updatedKnustData = {
              ...knustBaseData,
              description: apiData.description || knustData.description,
              applicationDeadline:
                apiData.applicationDeadline || knustData.applicationDeadline,
              applicationFees:
                apiData.applicationFees || knustData.applicationFees,
            };

            // Update if different
            const hasChanged =
              JSON.stringify(cachedKnustData) !== JSON.stringify(apiData);
            if (hasChanged) {
              localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ timestamp: Date.now(), data: apiData })
              );

              // Update university data with fresh API data
              const updatedUniversities = [
                ...staticUniversityData,
                updatedKnustData,
              ];
              setUniversityData(updatedUniversities);
            }
          }
        } catch (err) {
          console.warn("API error; using cached data if available.", err);
        }
      }
    };

    fetchUniversityData();
  }, []);

  // Filter and sort data
  const processedData = universityData
    .filter((university) => {
      // Filter by search term
      const matchesSearch =
        !searchTerm ||
        university.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        university.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.programs.some((program) =>
          program.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filter by selected filters
      const matchesFilters =
        filters.length === 0 ||
        filters.some((filter) => {
          if (filter === "Public Universities")
            return university.type === "Public";
          if (filter === "Private Universities")
            return university.type === "Private";
          if (filter === "Technology Focus")
            return university.programs.some(
              (p) =>
                p.toLowerCase().includes("technology") ||
                p.toLowerCase().includes("engineering")
            );
          if (filter === "Medical Programs")
            return university.programs.some(
              (p) =>
                p.toLowerCase().includes("medicine") ||
                p.toLowerCase().includes("health")
            );
          if (filter === "Business Programs")
            return university.programs.some((p) =>
              p.toLowerCase().includes("business")
            );
          if (filter === "Engineering Programs")
            return university.programs.some((p) =>
              p.toLowerCase().includes("engineering")
            );
          return false;
        });

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "location":
          return a.location.localeCompare(b.location);
        case "deadline":
          // Sort by deadline date
          const dateA = new Date(a.applicationDeadline || "2099-12-31");
          const dateB = new Date(b.applicationDeadline || "2099-12-31");
          return dateA - dateB;
        default:
          return 0; // relevance - keep original order
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No universities found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {processedData.map((card) => (
        <SearchCard key={card.id} {...card} />
      ))}
    </div>
  );
};

SearchCardList.propTypes = {
  searchTerm: PropTypes.string,
  filters: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.string,
};

export default SearchCardList;
