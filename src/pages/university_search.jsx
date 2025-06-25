// import { useState } from 'react';
// import { Search, Filter, MapPin, Users, TrendingUp, Star } from 'lucide-react';
// import Header from '../components/header';
// import SearchCardList from '../components/search_card';
// import Footer from '../components/footer';
// import { Button } from '../components/button';
// import { Card, CardContent } from '../components/Cardui';

// const UniversitySearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFilters, setSelectedFilters] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);

//   const filters = [
//     'Public Universities',
//     'Private Universities', 
//     'Technology Focus',
//     'Medical Programs',
//     'Business Programs',
//     'Engineering Programs'
//   ];

//   const stats = [
//     { icon: Users, label: 'Total Universities', value: '4', color: 'from-blue-500 to-blue-600' },
//     { icon: MapPin, label: 'Locations', value: '3 Regions', color: 'from-green-500 to-green-600' },
//     { icon: TrendingUp, label: 'Programs', value: '1000+', color: 'from-purple-500 to-purple-600' },
//     { icon: Star, label: 'Success Rate', value: '85%', color: 'from-orange-500 to-orange-600' }
//   ];

//   const handleFilterToggle = (filter) => {
//     setSelectedFilters(prev => 
//       prev.includes(filter) 
//         ? prev.filter(f => f !== filter)
//         : [...prev, filter]
//     );
//   };

//   const clearFilters = () => {
//     setSelectedFilters([]);
//     setSearchTerm('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//       <Header />
      
//       {/* Hero Section */}
//       <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden">
//         <div className="absolute inset-0">
//           <img 
//             className="w-full h-full object-cover object-center" 
//             src="./uni-search-hero.jpeg" 
//             alt="University Search" 
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
//               Find Your
//               <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                 Dream University
//               </span>
//             </h1>
//             <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
//               Discover the perfect university for your academic journey. Explore programs, compare options, and take the first step towards your future.
//             </p>
            
//             {/* Enhanced Search Bar */}
//             <div className="max-w-4xl mx-auto">
//               <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
//                 <div className="flex flex-col md:flex-row gap-2">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search universities, programs, or locations..."
//                       className="w-full pl-12 pr-4 py-4 text-gray-900 bg-transparent border-0 rounded-xl focus:outline-none focus:ring-0 text-base md:text-lg placeholder-gray-500"
//                     />
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="lg"
//                       onClick={() => setShowFilters(!showFilters)}
//                       className="bg-white/90 hover:bg-white border-gray-200 text-gray-700 rounded-xl px-6"
//                     >
//                       <Filter className="w-4 h-4 mr-2" />
//                       Filters
//                       {selectedFilters.length > 0 && (
//                         <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
//                           {selectedFilters.length}
//                         </span>
//                       )}
//                     </Button>
//                     <Button 
//                       size="lg" 
//                       className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 shadow-lg"
//                     >
//                       Search
//                     </Button>
//                   </div>
//                 </div>
                
//                 {/* Filter Pills */}
//                 {showFilters && (
//                   <div className="mt-4 p-4 bg-gray-50 rounded-xl">
//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {filters.map((filter) => (
//                         <button
//                           key={filter}
//                           onClick={() => handleFilterToggle(filter)}
//                           className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                             selectedFilters.includes(filter)
//                               ? 'bg-blue-600 text-white shadow-md'
//                               : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
//                           }`}
//                         >
//                           {filter}
//                         </button>
//                       ))}
//                     </div>
//                     {selectedFilters.length > 0 && (
//                       <button
//                         onClick={clearFilters}
//                         className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                       >
//                         Clear all filters
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-12 md:py-16 bg-white/50 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {stats.map((stat, index) => (
//               <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
//                 <CardContent className="p-6 text-center">
//                   <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
//                     <stat.icon className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
//                   <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Active Filters Display */}
//       {selectedFilters.length > 0 && (
//         <section className="py-4 bg-blue-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-sm font-medium text-blue-900">Active filters:</span>
//               {selectedFilters.map((filter) => (
//                 <span
//                   key={filter}
//                   className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                 >
//                   {filter}
//                   <button
//                     onClick={() => handleFilterToggle(filter)}
//                     className="ml-2 text-blue-600 hover:text-blue-800"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Search Results Section */}
//       <section className="py-12 md:py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                 Discover Universities
//               </h2>
//               <p className="text-gray-600">
//                 {searchTerm ? `Showing results for "${searchTerm}"` : 'Explore all available universities'}
//               </p>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                 <option>Sort by Relevance</option>
//                 <option>Sort by Name</option>
//                 <option>Sort by Location</option>
//                 <option>Sort by Application Deadline</option>
//               </select>
//             </div>
//           </div>
          
//           <SearchCardList searchTerm={searchTerm} filters={selectedFilters} />
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default UniversitySearch;






import { useState } from "react";
import { Search, Filter, MapPin, Users, TrendingUp, Star } from "lucide-react";
import Header from "../components/header";
import SearchCardList from "../components/search_card";
import Footer from "../components/footer";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/Cardui";

const UniversitySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const filters = [
    "Public Universities",
    "Private Universities",
    "Technology Focus",
    "Medical Programs",
    "Business Programs",
    "Engineering Programs",
  ];

  const stats = [
    {
      icon: Users,
      label: "Total Universities",
      value: "4",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MapPin,
      label: "Locations",
      value: "3 Regions",
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      label: "Programs",
      value: "1000+",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Star,
      label: "Success Rate",
      value: "85%",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const handleFilterToggle = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover object-center"
            src="./uni-search-hero.jpeg"
            alt="University Search"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dream University
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the perfect university for your academic journey. Explore
              programs, compare options, and take the first step towards your
              future.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search universities, programs, or locations..."
                      className="w-full pl-12 pr-4 py-4 text-gray-900 bg-transparent border-0 rounded-xl focus:outline-none focus:ring-0 text-base md:text-lg placeholder-gray-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowFilters(!showFilters)}
                      className="bg-white/90 hover:bg-white border-gray-200 text-gray-700 rounded-xl px-6"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {selectedFilters.length > 0 && (
                        <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                          {selectedFilters.length}
                        </span>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 shadow-lg"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Filter Pills */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {filters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => handleFilterToggle(filter)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedFilters.includes(filter)
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    {selectedFilters.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Active Filters Display */}
      {selectedFilters.length > 0 && (
        <section className="py-4 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-blue-900">
                Active filters:
              </span>
              {selectedFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {filter}
                  <button
                    onClick={() => handleFilterToggle(filter)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search Results Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Discover Universities
              </h2>
              <p className="text-gray-600">
                {searchTerm
                  ? `Showing results for "${searchTerm}"`
                  : "Explore all available universities"}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
                <option value="deadline">Sort by Application Deadline</option>
              </select>
            </div>
          </div>

          <SearchCardList
            searchTerm={searchTerm}
            filters={selectedFilters}
            sortBy={sortBy}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UniversitySearch;
