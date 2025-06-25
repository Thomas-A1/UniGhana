
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Cardui";
import { Bookmark, MapPin, Globe, Phone, Mail, Users, GraduationCap, Star, ArrowRight, Calendar, Clock, FileText, DollarSign, MessageSquare, ChevronRight, Bell, CheckCircle, GraduationCap as GradCap, BookOpen, AlertTriangle } from "lucide-react";import toast from "react-hot-toast";
import { Progress } from "../components/progress";
import { Alert, AlertDescription } from "../components/alert";
import staticUniversityData from "../data/schoolStaticData";


const UniversityPage = () => {
  const { id } = useParams();
  const [Bookmarked, setBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [universityData, setUniversityData] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const userData = sessionStorage.getItem("userData");
  const userId = userData ? JSON.parse(userData).id : null;

  useEffect(() => {
    const fetchUniversityData = async () => {
      setLoading(true);
      setLoadingProgress(0);
      setServerError(false);

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const staticData = staticUniversityData[id] || staticUniversityData.knust;
      const CACHE_KEY = `universityDataCache_${id}`;
      const TTL_MS = 24 * 60 * 60 * 1000; 

      // Load cached data
      const cachedJson = localStorage.getItem(CACHE_KEY);
      let cachedApiData = null;
      let isExpired = true;

      if (cachedJson) {
        try {
          const parsed = JSON.parse(cachedJson);
          if (parsed.timestamp && parsed.data) {
            const age = Date.now() - parsed.timestamp;
            isExpired = age > TTL_MS;
            cachedApiData = parsed.data;
          }
        } catch {
          // ignore parse errors
        }
      }

      // Show static + cached data immediately
      setUniversityData(staticData);
      setApiData(cachedApiData);
      setLoadingProgress(100);
      setLoading(false);
      clearInterval(progressInterval);

      // For API-supported universities, fetch fresh data if expired
      if ((id === "3" || id === "knust") && isExpired) {
        setApiLoading(true);
        try {
          const response = await fetch('/api/schools/knust-admission');
          
          if (response.status === 500) {
            setServerError(true);
            toast({
              title: "Server Error",
              description: "Server is currently down. Displaying static data which may not be up to date.",
              variant: "destructive",
            });
            setApiLoading(false);
            return;
          }
          
          if (!response.ok) throw new Error("API failed");

          const result = await response.json();
          if (result.success && result.data) {
            const newApiData = result.data;

            // Update if different
            const hasChanged = JSON.stringify(cachedApiData) !== JSON.stringify(newApiData);
            if (hasChanged) {
              localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ timestamp: Date.now(), data: newApiData })
              );
              setApiData(newApiData);
              setServerError(false);
            }
          }
        } catch (err) {
          console.warn("API error; using stale data if available.", err);
          setServerError(true);
          toast({
            title: "Connection Error",
            description: "Unable to fetch latest data. Displaying cached information.",
            variant: "destructive",
          });
        } finally {
          setApiLoading(false);
        }
      }
    };

    fetchUniversityData();
  }, [id]);

  // Check bookmark status
  useEffect(() => {
    if (!userId || !id) return;

    fetch(`/api/bookmarks/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.bookmarks)) {
          const isBookmarked = data.bookmarks.some(school => school.id === id);
          setBookmarked(isBookmarked);
        }
      })
      .catch(() => {
        console.error("Failed to check bookmark status");
      });
  }, [userId, id]);

  // Combine static and API data
  const university = universityData ? {
    ...universityData,
    description: apiData?.description || `A world-class academic center of excellence, spearheading West Africa's pursuit of technological advancement. ${universityData.shortName} is known for its cutting-edge research and innovation.`,
    publishedDate: apiData?.publishedDate || "Published: 11 Apr 2025",
    applicationDeadline: apiData?.applicationDeadline || "31st October 2025",
    applicationFees: apiData?.applicationFees || {
      ghanaian: "GH¢250.00",
      international: "USD$100.00"
    },
    courses: apiData?.courses || [
      "BSc. Computer Science", "BSc. Engineering", "BSc. Business Administration",
      "BSc. Medicine", "BSc. Agriculture", "BSc. Architecture"
    ]
  } : null;

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'admissions', label: 'Admissions', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'quiz', label: 'Course Quiz', icon: Star },
    { id: 'connect', label: 'Connect', icon: Phone },
  ];

  const quizQuestions = [
    {
      question: "What type of subjects do you enjoy most?",
      options: ["Math & Sciences", "Arts & Languages", "Business & Economics", "Technology & Engineering"]
    },
    {
      question: "What work environment appeals to you?",
      options: ["Laboratory/Research", "Creative Studio", "Office/Corporate", "Field Work/Outdoors"]
    },
    {
      question: "Which career path interests you most?",
      options: ["Healthcare/Medicine", "Design/Arts", "Management/Leadership", "Innovation/Technology"]
    },
    {
      question: "What's your preferred learning style?",
      options: ["Hands-on/Practical", "Theoretical/Research", "Group Projects", "Independent Study"]
    }
  ];

  const handleBookmark = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to bookmark universities.",
        variant: "destructive",
      });
      return;
    }

    if (bookmarkLoading) return;

    setBookmarkLoading(true);

    try {
      if (Bookmarked) {
        const res = await fetch('/api/unbookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, schoolId: id }),
        });
        const data = await res.json();
        if (data.success) {
          setBookmarked(false);
          toast.success("University unbookmarked!");
        } else {
          toast.error("Failed to remove bookmark");
        }
      } else {
        const res = await fetch('/api/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, school: university }),
        });
        const data = await res.json();
        if (data.success) {
          setBookmarked(true);
          toast.success("University bookmarked!");
        } else {
          toast.error("Failed to add bookmark");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Bookmark error:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuizAnswer = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setShowQuizResult(false);
  };

  const getRecommendedCourses = () => {
    const preferences = quizAnswers;
    const courses = university?.courses || [];
    
    if (preferences.includes("Math & Sciences") || preferences.includes("Technology & Engineering")) {
      return courses.filter(course => 
        course.includes("Computer") || course.includes("Engineering") || course.includes("Science")
      ).slice(0, 3);
    } else if (preferences.includes("Arts & Languages") || preferences.includes("Creative Studio")) {
      return courses.filter(course => 
        course.includes("Art") || course.includes("Design") || course.includes("Language")
      ).slice(0, 3);
    } else if (preferences.includes("Business & Economics")) {
      return courses.filter(course => 
        course.includes("Business") || course.includes("Administration") || course.includes("Management")
      ).slice(0, 3);
    }
    
    return courses.slice(0, 3);
  };

  // Helper function to parse admission requirements
  const parseAdmissionRequirements = () => {
    if (!apiData?.admissionRequirements) return { requirements: [], applicationProcess: [] };
    
    const requirements = [];
    const applicationProcess = [];
    
    apiData.admissionRequirements.forEach(item => {
      if (item.includes('WASSCE/SSSCE Holders') || 
          item.includes('ADVANCED LEVEL Holders') || 
          item.includes('MATURE STUDENTS') ||
          item.includes('HND Holders') ||
          item.includes('International Applicants') ||
          item.includes('French speaking countries')) {
        requirements.push(item);
      } else if (item.includes('Option') || 
                 item.includes('Purchase') || 
                 item.includes('Select') ||
                 item.includes('USSD') ||
                 item.includes('Ghana Post')) {
        applicationProcess.push(item);
      }
    });
    
    return { requirements: requirements.slice(0, 6), applicationProcess: applicationProcess.slice(0, 8) };
  };

  const { requirements, applicationProcess } = parseAdmissionRequirements();

  if (loading || !university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header/>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-4">Loading university information...</p>
            <div className="w-full max-w-xs mx-auto">
              <Progress value={loadingProgress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">{loadingProgress}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Server Status Notification */}
      {serverError && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
          <Alert variant="destructive" className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-orange-800">
              <strong>Server down:</strong> Data provided could be static and not dynamic
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* API Loading Indicator */}
      {apiLoading && (
        <div className="fixed top-20 left-4 right-4 z-40 max-w-md mx-auto">
          <Alert className="border-blue-200 bg-blue-50">
            <Bell className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              Fetching latest information...
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Responsive Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] mt-16">
        <div className="absolute inset-0">
          <img 
            src={university.heroImage} 
            alt={university.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        
        {/* University Logo - Responsive positioning */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 lg:right-24 z-20 translate-y-8 md:translate-y-12">
          <div className="bg-white/95 backdrop-blur-sm p-2 md:p-3 rounded-xl shadow-2xl border border-white/20">
            <img 
              src={university.logo} 
              alt={`${university.shortName} Logo`}
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
          </div>
        </div>
        
        {/* Hero Content - Responsive */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">{university.name}</h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium text-xs md:text-sm">{university.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-xs md:text-sm">{university.rating}/5</span>
                  </div>
                </div>
              </div>
              <Button
                variant={Bookmarked ? "default" : "secondary"}
                size="lg"
                className={`${Bookmarked ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/90 hover:bg-white text-gray-900"} backdrop-blur-sm ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleBookmark}
                disabled={bookmarkLoading}
              >
                <Bookmark className={`w-4 h-4 md:w-5 md:h-5 mr-2 ${Bookmarked ? 'fill-current' : ''}`} />
                {bookmarkLoading ? 'Saving...' : (Bookmarked ? 'Saved' : 'Save')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          
          {/* Mobile Navigation Tabs */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto space-x-2 pb-4">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                    activeSection === item.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
         
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-16 hover:lg:w-64 transition-all duration-300 group">
            <Card className="sticky top-24 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`group/item relative flex items-center w-full py-3 rounded-xl transition-all duration-300 ${
                          activeSection === item.id 
                            ? 'bg-blue-100 text-blue-700 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="ml-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          {item.label}
                        </span>
                      </button>
                    </div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:flex-1">
            
            {/* Quick Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-600 mx-auto mb-2 md:mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">{university.studentCount}</div>
                  <div className="text-blue-600 font-medium text-sm md:text-base">Students</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-2 md:mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-green-700 mb-1">{university.facultyCount}</div>
                  <div className="text-green-600 font-medium text-sm md:text-base">Faculty</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 md:p-6 text-center">
                  <Calendar className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mx-auto mb-2 md:mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">{university.established}</div>
                  <div className="text-purple-600 font-medium text-sm md:text-base">Established</div>
                </CardContent>
              </Card>
            </div>

            {/* Overview Section */}
            <section id="overview" className="mb-8 md:mb-12">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader className="pb-4 md:pb-6">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">About {university.shortName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-8">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">{university.staticDescription}</p>
                  
                  {/* YouTube Video Section - Fully responsive */}
                  {(id === "3" || id === "knust") && (
                    <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-black">
                      <div className="aspect-video relative">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/qqRUfvKvapY"
                            title="KNUST Campus Tour"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                      </div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg">
                        <span className="text-xs md:text-sm font-medium text-gray-800">{university.shortName} Campus Experience</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Academics Section - Responsive */}
            <section id="academics" className="mb-8 md:mb-12">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Academic Programs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Faculties & Schools</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                      {university.programs.map((program, index) => (
                        <Card key={index} className="p-3 md:p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2 md:mb-3" />
                          <div className="font-semibold text-xs md:text-sm text-gray-800">{program}</div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Available Courses</h3>
                    
                    {/* Server Error Alert for Available Courses */}
                    {serverError && !apiLoading && (
                      <Alert variant="destructive" className="mb-4 border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-orange-800">
                          Server down: Data seen could be static and not dynamic
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3 max-h-80 md:max-h-96 overflow-y-auto">
                      {apiLoading ? (
                        <div className="space-y-4 col-span-full py-8">
                          <Progress value={65} className="h-2" />
                          <p className="text-sm text-gray-600 text-center">Loading available courses...</p>
                        </div>
                      ) : (
                        <>
                          {university.courses.slice(0, 20).map((course, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              <span className="text-xs md:text-sm text-gray-700">{course}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    
                    {!apiLoading && (
                      <div className="mt-4 text-center">
                        <a
                            href={university.courseslink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="sm">
                            View All {university.courses.length} Courses
                            <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Admissions Section - Responsive */}
            <section id="admissions" className="mb-8 md:mb-12">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Admissions Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-8">
                  
                  {/* Notifications Panel */}
                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-orange-400 border-0 shadow-lg">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="flex-shrink-0">
                          <Bell className="w-5 h-5 md:w-6 md:h-6 text-orange-600 mt-1" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg md:text-xl font-bold text-orange-800 mb-2">Latest Notifications</h4>
                          {apiData?.description ? (
                            <div className="text-sm md:text-base text-orange-700 leading-relaxed">
                              {apiData.description}
                            </div>
                          ) : (
                            <div className="text-sm md:text-base text-orange-600 italic">
                              <div className="space-y-4 col-span-full py-8">
                                <Progress value={65} className="h-2" />
                                <p className="text-sm text-gray-600 text-center">No recent notifications at the moment, checking...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 p-4 md:p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Clock className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                        <div>
                          <h4 className="text-lg md:text-xl font-bold text-red-700">Application Deadline</h4>
                          <p className="text-red-600 text-sm md:text-base">{university.applicationDeadline}</p>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-red-600">{university.publishedDate}</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 p-4 md:p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                        <div>
                          <h4 className="text-lg md:text-xl font-bold text-green-700">Application Fees</h4>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-600 text-sm md:text-base">Ghanaian Students:</span>
                          <span className="font-bold text-green-700 text-sm md:text-base">{university.applicationFees.ghanaian}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600 text-sm md:text-base">International Students:</span>
                          <span className="font-bold text-green-700 text-sm md:text-base">{university.applicationFees.international}</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Admission Requirements Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Admission Requirements</h3>
                      {apiLoading && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-600">Loading requirements...</span>
                        </div>
                      )}
                    </div>

                    {/* Server Error Alert for Requirements */}
                    {serverError && !apiLoading && (
                      <Alert variant="destructive" className="mb-4 border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-orange-800">
                          Server down: Data seen could be static and not dynamic
                        </AlertDescription>
                      </Alert>
                    )}

                    {apiLoading ? (
                      <div className="space-y-4">
                        <Progress value={45} className="h-2" />
                        <p className="text-sm text-gray-600 text-center">Loading admission requirements...</p>
                      </div>
                    ) : requirements.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Entry Requirements */}
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                          <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <GradCap className="w-5 h-5 text-blue-600" />
                              </div>
                              <CardTitle className="text-lg md:text-xl text-blue-800">Entry Requirements</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {requirements.map((req, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{req}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* How to Apply */}
                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                          <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                              </div>
                              <CardTitle className="text-lg md:text-xl text-purple-800">How to Apply</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {applicationProcess.map((process, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                                <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{process}</p>
                              </div>
                            ))}
                            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                              <p className="text-xs md:text-sm text-purple-700 font-medium">
                              💡 Visit <span className="font-bold">
                                  <a
                                  href={university.completeapplication}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline"
                                  >
                                  apps.knust.edu.gh
                                  </a>
                              </span> to complete your application online.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No specific admission requirements available at the moment.</p>
                      </div>
                    )}
                  </div>

                  <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 rounded-2xl">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                        <div>
                          <h4 className="text-lg md:text-xl font-bold">Ready to Apply?</h4>
                          <p className="text-blue-100 text-sm md:text-base">Join thousands of students at {university.shortName}</p>
                        </div>
                      </div>
                      <a href={university.courseslink} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                          Start Application
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="mb-8 md:mb-12">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Student Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  {[
                    {
                      name: "John Doe",
                      course: "Computer Engineering",
                      rating: 5,
                      review: `${university.shortName} has provided me with excellent opportunities in technology and research. The faculty is world-class and the campus facilities are outstanding.`
                    },
                    {
                      name: "Jane Smith",
                      course: "Business Administration",
                      rating: 4,
                      review: `Great university with strong industry connections. The business program has prepared me well for the corporate world.`
                    },
                    {
                      name: "Michael Johnson",
                      course: "Civil Engineering",
                      rating: 5,
                      review: `The hands-on approach to learning and state-of-the-art laboratories make ${university.shortName} an excellent choice for students.`
                    }
                  ].map((review, index) => (
                    <Card key={index} className="p-4 md:p-6 border-0 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-base md:text-lg">{review.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900 text-sm md:text-base">{review.name}</h4>
                            <Badge variant="outline" className="text-xs w-fit">{review.course}</Badge>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-gray-700 text-sm md:text-base">{review.review}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <div className="text-center">
                    <Button variant="outline">
                      Load More Reviews
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Course Recommendation Quiz */}
            <section id="quiz" className="mb-8 md:mb-12">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Find Your Perfect Course</CardTitle>
                  <p className="text-gray-600 text-sm md:text-base">Take our interactive quiz to discover courses that match your interests</p>
                </CardHeader>
                <CardContent>
                  {!showQuizResult ? (
                    <div className="space-y-4 md:space-y-6">
                      <div className="bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900">
                          Question {quizStep + 1} of {quizQuestions.length}
                        </h3>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">{quizQuestions[quizStep].question}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          {quizQuestions[quizStep].options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="lg"
                              className="h-auto p-3 md:p-4 text-left justify-start hover:bg-blue-50 hover:border-blue-300 text-sm md:text-base"
                              onClick={() => handleQuizAnswer(option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 md:space-y-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Recommended Courses for You!</h3>
                        <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Based on your interests, here are some courses you might love:</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                          {getRecommendedCourses().map((course, index) => (
                            <Card key={index} className="p-3 md:p-4 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
                              <p className="font-semibold text-blue-800 text-xs md:text-sm">{course}</p>
                            </Card>
                          ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <Button onClick={resetQuiz} variant="outline">
                            Retake Quiz
                          </Button>
                          <a
                            href={university.readcourses}
                            target="_blank"
                            rel="noopener noreferrer"
                        > 
                          <Button>
                            Learn More About These Courses
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Connect Section */}
            <section id="connect" className="mb-8 md:mb-12">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Get Connected</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Contact Information</h3>
                      <div className="space-y-3 md:space-y-4">
                        {[
                          { icon: Globe, label: "Website", value: university.website, type: "link" },
                          { icon: Phone, label: "Phone", value: university.phone, type: "text" },
                          { icon: Mail, label: "Email", value: university.email, type: "email" },
                          { icon: MapPin, label: "Location", value: university.location, type: "text" }
                        ].map((item, index) => (
                          <Card key={index} className="p-3 md:p-4 border-0 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs md:text-sm text-gray-600 font-medium">{item.label}</div>
                                {item.type === "link" ? (
                                  <a href={item.value} className="text-blue-600 hover:underline font-medium text-sm md:text-base break-all">
                                    {item.value}
                                  </a>
                                ) : item.type === "email" ? (
                                  <a href={`mailto:${item.value}`} className="text-blue-600 hover:underline font-medium text-sm md:text-base break-all">
                                    {item.value}
                                  </a>
                                ) : (
                                  <span className="font-medium text-gray-800 text-sm md:text-base">{item.value}</span>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Quick Actions</h3>
                      <div className="space-y-3">
                        {[
                          { icon: Mail, label: "Request Information" },
                          { icon: Users, label: "Schedule Campus Visit" },
                          { icon: Phone, label: "Talk to Admissions" }
                        ].map((action, index) => (
                          <Button key={index} variant="outline" size="lg" className="w-full justify-start h-12 md:h-14 text-left rounded-xl text-sm md:text-base">
                            <action.icon className="w-4 h-4 md:w-5 md:h-5 mr-3 md:mr-4" />
                            <span className="font-medium">{action.label}</span>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityPage;




















// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/header";
// import { Button } from "../components/button";
// import { Badge } from "../components/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/Cardui";
// import { Bookmark, MapPin, Globe, Phone, Mail, Users, GraduationCap, Star, ArrowRight, Calendar, Clock, FileText, DollarSign, MessageSquare, ChevronRight, Bell } from "lucide-react";
// import toast from "react-hot-toast";

// const UniversityPage = () => {
//   const { id } = useParams();
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [activeSection, setActiveSection] = useState("overview");
//   const [quizStep, setQuizStep] = useState(0);
//   const [quizAnswers, setQuizAnswers] = useState([]);
//   const [showQuizResult, setShowQuizResult] = useState(false);
//   const [universityData, setUniversityData] = useState(null);
//   const [apiData, setApiData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [bookmarkLoading, setBookmarkLoading] = useState(false);

//   const userData = sessionStorage.getItem("userData");
//   const userId = userData ? JSON.parse(userData).id : null;

//   // Static university data that doesn't come from API
//   const staticUniversityData = {
//     knust: {
//       id: "knust",
//       name: "Kwame Nkrumah University of Science and Technology",
//       shortName: "KNUST",
//       location: "Kumasi, Ashanti Region",
//       heroImage: "./KNUST.jpg",
//       logo: "./knust-logo.png",
//       website: "https://www.knust.edu.gh",
//       phone: "+233 32 206 0331",
//       email: "info@knust.edu.gh",
//       established: "1951",
//       studentCount: "60,000+",
//       facultyCount: "2,500+",
//       rating: 4.5,
//       staticDescription: "The Kwame Nkrumah University of Science and Technology (KNUST) is a premier public university in Ghana, established in 1951. Located in Kumasi, the cultural capital of the Ashanti Region, KNUST is renowned for its excellence in science, technology, engineering, and agriculture. The university was named after Ghana's first President, Dr. Kwame Nkrumah, and has grown to become one of the leading technological universities in Africa. KNUST offers undergraduate and postgraduate programs across various disciplines, with a strong emphasis on research and innovation. The university is home to state-of-the-art laboratories, modern lecture halls, and extensive research facilities that support cutting-edge research in areas such as renewable energy, biotechnology, and sustainable development.",
//       programs: [
//         "Engineering", "Medicine", "Agriculture", "Business", "Science", 
//         "Architecture", "Pharmacy", "Law", "Arts", "Education"
//       ]
//     },
//     "3": {
//       id: "3",
//       name: "Kwame Nkrumah University of Science and Technology",
//       shortName: "KNUST",
//       location: "Kumasi, Ashanti Region",
//       heroImage: "./KNUST.jpg",
//       logo: "./knust-logo.png",
//       website: "https://www.knust.edu.gh",
//       phone: "+233 32 206 0331",
//       email: "info@knust.edu.gh",
//       established: "1951",
//       studentCount: "60,000+",
//       facultyCount: "2,500+",
//       rating: 4.5,
//       staticDescription: "The Kwame Nkrumah University of Science and Technology (KNUST) is a premier public university in Ghana, established in 1951. Located in Kumasi, the cultural capital of the Ashanti Region, KNUST is renowned for its excellence in science, technology, engineering, and agriculture. The university was named after Ghana's first President, Dr. Kwame Nkrumah, and has grown to become one of the leading technological universities in Africa. KNUST offers undergraduate and postgraduate programs across various disciplines, with a strong emphasis on research and innovation. The university is home to state-of-the-art laboratories, modern lecture halls, and extensive research facilities that support cutting-edge research in areas such as renewable energy, biotechnology, and sustainable development.",
//       programs: [
//         "Engineering", "Medicine", "Agriculture", "Business", "Science", 
//         "Architecture", "Pharmacy", "Law", "Arts", "Education"
//       ]
//     },
//     "1": {
//       id: "1",
//       name: "Academic City University",
//       shortName: "ACU",
//       location: "Accra, Ghana",
//       heroImage: "./academic-city.jpeg",
//       logo: "./academic-city.jpeg",
//       website: "https://www.acity.edu.gh",
//       phone: "+233 30 123 4567",
//       email: "info@acity.edu.gh",
//       established: "2003",
//       studentCount: "5,000+",
//       facultyCount: "300+",
//       rating: 4.2,
//       staticDescription: "Academic City University (ACU) is a leading private university in Ghana, established in 2003. Located in the heart of Accra, ACU is committed to providing world-class education that prepares students for the global marketplace. The university focuses on innovation, entrepreneurship, and practical learning experiences that bridge the gap between academia and industry.",
//       programs: ["Business", "Computing", "Engineering", "Arts", "Science"]
//     }
//   };

//  useEffect(() => {
//     const fetchUniversityData = async () => {
//       setLoading(true);

//       const staticData = staticUniversityData[id] || staticUniversityData.knust;
//       const CACHE_KEY = `universityDataCache_${id}`;
//       const TTL_MS = 24 * 60 * 60 * 1000; 

//       // Load cached data
//       const cachedJson = localStorage.getItem(CACHE_KEY);
//       let cachedApiData = null;
//       let isExpired = true;

//       if (cachedJson) {
//         try {
//           const parsed = JSON.parse(cachedJson);
//           if (parsed.timestamp && parsed.data) {
//             const age = Date.now() - parsed.timestamp;
//             isExpired = age > TTL_MS;
//             cachedApiData = parsed.data;
//           }
//         } catch {
//           // ignore parse errors
//         }
//       }

//       // Show static + cached data immediately
//       setUniversityData(staticData);
//       setApiData(cachedApiData);
//       setLoading(false);

//       // For API-supported universities, fetch fresh data if expired
//       if ((id === "3" || id === "knust") && isExpired) {
//         try {
//           const response = await fetch('/api/schools/knust-admission');
//           if (!response.ok) throw new Error("API failed");

//           const result = await response.json();
//           if (result.success && result.data) {
//             const newApiData = result.data;

//             // Update if different
//             const hasChanged = JSON.stringify(cachedApiData) !== JSON.stringify(newApiData);
//             if (hasChanged) {
//               localStorage.setItem(
//                 CACHE_KEY,
//                 JSON.stringify({ timestamp: Date.now(), data: newApiData })
//               );
//               setApiData(newApiData);
//             }
//           }
//         } catch (err) {
//           console.warn("API error; using stale data if available.", err);
//         }
//       }
//     };

//     fetchUniversityData();
//   }, [id]);


//   // Check bookmark status
//   useEffect(() => {
//     if (!userId || !id) return;

//     fetch(`/api/bookmarks/${userId}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success && Array.isArray(data.bookmarks)) {
//           const isBookmarked = data.bookmarks.some(school => school.id === id);
//           setIsBookmarked(isBookmarked);
//         }
//       })
//       .catch(() => {
//         console.error("Failed to check bookmark status");
//       });
//   }, [userId, id]);

//   // Combine static and API data
//   const university = universityData ? {
//     ...universityData,
//     publishedDate: apiData?.publishedDate || "Published: 11 Apr 2025",
//     applicationDeadline: apiData?.applicationDeadline || "31st October 2025",
//     applicationFees: apiData?.applicationFees || {
//       ghanaian: "GH¢250.00",
//       international: "USD$100.00"
//     },
//     courses: apiData?.courses || [
//       "BSc. Computer Science", "BSc. Engineering", "BSc. Business Administration",
//       "BSc. Medicine", "BSc. Agriculture", "BSc. Architecture"
//     ]
//   } : null;

//   // ... keep existing code (sidebarItems, quizQuestions, handleBookmark, scrollToSection, handleQuizAnswer, resetQuiz, getRecommendedCourses)

//   const sidebarItems = [
//     { id: 'overview', label: 'Overview', icon: FileText },
//     { id: 'academics', label: 'Academics', icon: GraduationCap },
//     { id: 'admissions', label: 'Admissions', icon: Calendar },
//     { id: 'reviews', label: 'Reviews', icon: MessageSquare },
//     { id: 'quiz', label: 'Course Quiz', icon: Star },
//     { id: 'connect', label: 'Connect', icon: Phone },
//   ];

//   const quizQuestions = [
//     {
//       question: "What type of subjects do you enjoy most?",
//       options: ["Math & Sciences", "Arts & Languages", "Business & Economics", "Technology & Engineering"]
//     },
//     {
//       question: "What work environment appeals to you?",
//       options: ["Laboratory/Research", "Creative Studio", "Office/Corporate", "Field Work/Outdoors"]
//     },
//     {
//       question: "Which career path interests you most?",
//       options: ["Healthcare/Medicine", "Design/Arts", "Management/Leadership", "Innovation/Technology"]
//     },
//     {
//       question: "What's your preferred learning style?",
//       options: ["Hands-on/Practical", "Theoretical/Research", "Group Projects", "Independent Study"]
//     }
//   ];

//   const handleBookmark = async () => {
//     if (!userId) {
//       toast({
//         title: "Error",
//         description: "Please log in to bookmark universities.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (bookmarkLoading) return;

//     setBookmarkLoading(true);

//     try {
//       if (isBookmarked) {
//         const res = await fetch('/api/unbookmark', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId, schoolId: id }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           setIsBookmarked(false);
//           toast({
//             title: "Success",
//             description: "University unbookmarked!",
//           });
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to remove bookmark",
//             variant: "destructive",
//           });
//         }
//       } else {
//         const res = await fetch('/api/bookmark', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId, school: university }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           setIsBookmarked(true);
//           toast({
//             title: "Success",
//             description: "University bookmarked!",
//           });
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to add bookmark",
//             variant: "destructive",
//           });
//         }
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Something went wrong",
//         variant: "destructive",
//       });
//       console.error("Bookmark error:", error);
//     } finally {
//       setBookmarkLoading(false);
//     }
//   };

//   const scrollToSection = (sectionId) => {
//     setActiveSection(sectionId);
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const handleQuizAnswer = (answer) => {
//     const newAnswers = [...quizAnswers, answer];
//     setQuizAnswers(newAnswers);
    
//     if (quizStep < quizQuestions.length - 1) {
//       setQuizStep(quizStep + 1);
//     } else {
//       setShowQuizResult(true);
//     }
//   };

//   const resetQuiz = () => {
//     setQuizStep(0);
//     setQuizAnswers([]);
//     setShowQuizResult(false);
//   };

//   const getRecommendedCourses = () => {
//     const preferences = quizAnswers;
//     const courses = university?.courses || [];
    
//     if (preferences.includes("Math & Sciences") || preferences.includes("Technology & Engineering")) {
//       return courses.filter(course => 
//         course.includes("Computer") || course.includes("Engineering") || course.includes("Science")
//       ).slice(0, 3);
//     } else if (preferences.includes("Arts & Languages") || preferences.includes("Creative Studio")) {
//       return courses.filter(course => 
//         course.includes("Art") || course.includes("Design") || course.includes("Language")
//       ).slice(0, 3);
//     } else if (preferences.includes("Business & Economics")) {
//       return courses.filter(course => 
//         course.includes("Business") || course.includes("Administration") || course.includes("Management")
//       ).slice(0, 3);
//     }
    
//     return courses.slice(0, 3);
//   };

//   if (loading || !university) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//         <Header/>
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading university information...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//       <Header />
      
//       {/* Responsive Hero Section */}
//       <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] mt-16">
//         <div className="absolute inset-0">
//           <img 
//             src={university.heroImage} 
//             alt={university.name}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
//         </div>
        
//         {/* University Logo - Responsive positioning */}
//         <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 lg:right-24 z-20 translate-y-8 md:translate-y-12">
//           <div className="bg-white/95 backdrop-blur-sm p-2 md:p-3 rounded-xl shadow-2xl border border-white/20">
//             <img 
//               src={university.logo} 
//               alt={`${university.shortName} Logo`}
//               className="w-10 h-10 md:w-12 md:h-12 object-contain"
//             />
//           </div>
//         </div>
        
//         {/* Hero Content - Responsive */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
//               <div className="flex-1">
//                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">{university.name}</h1>
//                 <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
//                   <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
//                     <MapPin className="w-3 h-3 md:w-4 md:h-4" />
//                     <span className="font-medium text-xs md:text-sm">{university.location}</span>
//                   </div>
//                   <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
//                     <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
//                     <span className="font-medium text-xs md:text-sm">{university.rating}/5</span>
//                   </div>
//                 </div>
//               </div>
//               <Button
//                 variant={isBookmarked ? "default" : "secondary"}
//                 size="lg"
//                 className={`${isBookmarked ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/90 hover:bg-white text-gray-900"} backdrop-blur-sm ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 onClick={handleBookmark}
//                 disabled={bookmarkLoading}
//               >
//                 <Bookmark className={`w-4 h-4 md:w-5 md:h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
//                 {bookmarkLoading ? 'Saving...' : (isBookmarked ? 'Saved' : 'Save')}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
//         <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          
//           {/* Mobile Navigation Tabs */}
//           <div className="lg:hidden">
//             <div className="flex overflow-x-auto space-x-2 pb-4">
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => scrollToSection(item.id)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
//                     activeSection === item.id 
//                       ? 'bg-blue-100 text-blue-700' 
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <item.icon className="w-4 h-4" />
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           </div>
         
//           {/* Desktop Sidebar */}
//           <div className="hidden lg:block lg:w-16 hover:lg:w-64 transition-all duration-300 group">
//             <Card className="sticky top-24 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
//               <CardContent className="p-2">
//                 <nav className="space-y-1">
//                   {sidebarItems.map((item) => (
//                     <div key={item.id} className="relative">
//                       <button
//                         onClick={() => scrollToSection(item.id)}
//                         className={`group/item relative flex items-center w-full py-3 px-2 rounded-xl transition-all duration-300 ${
//                           activeSection === item.id 
//                             ? 'bg-blue-100 text-blue-700 shadow-sm' 
//                             : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
//                         }`}
//                       >
//                         <item.icon className="w-5 h-5 flex-shrink-0" />
//                         <span className="ml-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//                           {item.label}
//                         </span>
//                       </button>
//                     </div>
//                   ))}
//                 </nav>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="lg:flex-1">
            
//             {/* Quick Stats Cards - Responsive Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
//               <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//                 <CardContent className="p-4 md:p-6 text-center">
//                   <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-600 mx-auto mb-2 md:mb-3" />
//                   <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">{university.studentCount}</div>
//                   <div className="text-blue-600 font-medium text-sm md:text-base">Students</div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//                 <CardContent className="p-4 md:p-6 text-center">
//                   <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-2 md:mb-3" />
//                   <div className="text-2xl md:text-3xl font-bold text-green-700 mb-1">{university.facultyCount}</div>
//                   <div className="text-green-600 font-medium text-sm md:text-base">Faculty</div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
//                 <CardContent className="p-4 md:p-6 text-center">
//                   <Calendar className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mx-auto mb-2 md:mb-3" />
//                   <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">{university.established}</div>
//                   <div className="text-purple-600 font-medium text-sm md:text-base">Established</div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Overview Section */}
//             <section id="overview" className="mb-8 md:mb-12">
//               <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
//                 <CardHeader className="pb-4 md:pb-6">
//                   <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">About {university.shortName}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6 md:space-y-8">
//                   <p className="text-base md:text-lg text-gray-700 leading-relaxed">{university.staticDescription}</p>
                  
//                   {/* YouTube Video Section - Fully responsive */}
//                   {(id === "3" || id === "knust") && (
//                     <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-black">
//                       <div className="aspect-video relative">
//                         <iframe
//                             className="w-full h-full"
//                             src="https://www.youtube.com/embed/qqRUfvKvapY"
//                             title="KNUST Campus Tour"
//                             frameBorder="0"
//                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                             allowFullScreen
//                         />

//                       </div>
//                       <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg">
//                         <span className="text-xs md:text-sm font-medium text-gray-800">{university.shortName} Campus Experience</span>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </section>

//             {/* Academics Section - Responsive */}
//             <section id="academics" className="mb-8 md:mb-12">
//               <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Academic Programs</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6 md:space-y-8">
//                   <div>
//                     <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Faculties & Schools</h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
//                       {university.programs.map((program, index) => (
//                         <Card key={index} className="p-3 md:p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl">
//                           <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2 md:mb-3" />
//                           <div className="font-semibold text-xs md:text-sm text-gray-800">{program}</div>
//                         </Card>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Available Courses</h3>
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3 max-h-80 md:max-h-96 overflow-y-auto">
//                       {university.courses.slice(0, 20).map((course, index) => (
//                         <div key={index} className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                           <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
//                           <span className="text-xs md:text-sm text-gray-700">{course}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="mt-4 text-center">
//                       <Button variant="outline" size="sm">
//                         View All {university.courses.length} Courses
//                         <ArrowRight className="w-4 h-4 ml-2" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </section>

//             {/* Admissions Section - Responsive */}
//             <section id="admissions" className="mb-8 md:mb-12">
//               <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Admissions Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6 md:space-y-8">
                  
//                   {/* Notifications Panel */}
//                   <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-orange-400 border-0 shadow-lg">
//                     <CardContent className="p-4 md:p-6">
//                       <div className="flex items-start gap-3 md:gap-4">
//                         <div className="flex-shrink-0">
//                           <Bell className="w-5 h-5 md:w-6 md:h-6 text-orange-600 mt-1" />
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="text-lg md:text-xl font-bold text-orange-800 mb-2">Latest Notifications</h4>
//                           {apiData?.description ? (
//                             <div className="text-sm md:text-base text-orange-700 leading-relaxed">
//                               {apiData.description}
//                             </div>
//                           ) : (
//                             <div className="text-sm md:text-base text-orange-600 italic">
//                               No recent notifications at the moment
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//                     <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 p-4 md:p-6">
//                       <div className="flex items-center gap-4 mb-4">
//                         <Clock className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
//                         <div>
//                           <h4 className="text-lg md:text-xl font-bold text-red-700">Application Deadline</h4>
//                           <p className="text-red-600 text-sm md:text-base">{university.applicationDeadline}</p>
//                         </div>
//                       </div>
//                       <p className="text-xs md:text-sm text-red-600">{university.publishedDate}</p>
//                     </Card>

//                     <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 p-4 md:p-6">
//                       <div className="flex items-center gap-4 mb-4">
//                         <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
//                         <div>
//                           <h4 className="text-lg md:text-xl font-bold text-green-700">Application Fees</h4>
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-green-600 text-sm md:text-base">Ghanaian Students:</span>
//                           <span className="font-bold text-green-700 text-sm md:text-base">{university.applicationFees.ghanaian}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-green-600 text-sm md:text-base">International Students:</span>
//                           <span className="font-bold text-green-700 text-sm md:text-base">{university.applicationFees.international}</span>
//                         </div>
//                       </div>
//                     </Card>
//                   </div>

//                   <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 rounded-2xl">
//                     <CardContent className="p-6 md:p-8">
//                       <div className="flex items-center gap-4 mb-4">
//                         <Calendar className="w-6 h-6 md:w-8 md:h-8" />
//                         <div>
//                           <h4 className="text-lg md:text-xl font-bold">Ready to Apply?</h4>
//                           <p className="text-blue-100 text-sm md:text-base">Join thousands of students at {university.shortName}</p>
//                         </div>
//                       </div>
//                       <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
//                         Start Application
//                         <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </CardContent>
//               </Card>
//             </section>

//             {/* ... keep existing code (reviews, quiz, and connect sections) */}

//             {/* Reviews Section */}
//             <section id="reviews" className="mb-8 md:mb-12">
//               <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Student Reviews</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4 md:space-y-6">
//                   {[
//                     {
//                       name: "John Doe",
//                       course: "Computer Engineering",
//                       rating: 5,
//                       review: `${university.shortName} has provided me with excellent opportunities in technology and research. The faculty is world-class and the campus facilities are outstanding.`
//                     },
//                     {
//                       name: "Jane Smith",
//                       course: "Business Administration",
//                       rating: 4,
//                       review: `Great university with strong industry connections. The business program has prepared me well for the corporate world.`
//                     },
//                     {
//                       name: "Michael Johnson",
//                       course: "Civil Engineering",
//                       rating: 5,
//                       review: `The hands-on approach to learning and state-of-the-art laboratories make ${university.shortName} an excellent choice for students.`
//                     }
//                   ].map((review, index) => (
//                     <Card key={index} className="p-4 md:p-6 border-0 bg-gradient-to-r from-gray-50 to-white">
//                       <div className="flex items-start gap-3 md:gap-4">
//                         <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-blue-600 font-bold text-base md:text-lg">{review.name.charAt(0)}</span>
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
//                             <h4 className="font-bold text-gray-900 text-sm md:text-base">{review.name}</h4>
//                             <Badge variant="outline" className="text-xs w-fit">{review.course}</Badge>
//                           </div>
//                           <div className="flex items-center gap-1 mb-3">
//                             {[...Array(5)].map((_, i) => (
//                               <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
//                             ))}
//                           </div>
//                           <p className="text-gray-700 text-sm md:text-base">{review.review}</p>
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
                  
//                   <div className="text-center">
//                     <Button variant="outline">
//                       Load More Reviews
//                       <ChevronRight className="w-4 h-4 ml-2" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </section>

//             {/* Course Recommendation Quiz */}
//             <section id="quiz" className="mb-8 md:mb-12">
//               <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Find Your Perfect Course</CardTitle>
//                   <p className="text-gray-600 text-sm md:text-base">Take our interactive quiz to discover courses that match your interests</p>
//                 </CardHeader>
//                 <CardContent>
//                   {!showQuizResult ? (
//                     <div className="space-y-4 md:space-y-6">
//                       <div className="bg-gray-100 rounded-full h-2">
//                         <div 
//                           className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                           style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
//                         />
//                       </div>
                      
//                       <div>
//                         <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900">
//                           Question {quizStep + 1} of {quizQuestions.length}
//                         </h3>
//                         <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">{quizQuestions[quizStep].question}</p>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
//                           {quizQuestions[quizStep].options.map((option, index) => (
//                             <Button
//                               key={index}
//                               variant="outline"
//                               size="lg"
//                               className="h-auto p-3 md:p-4 text-left justify-start hover:bg-blue-50 hover:border-blue-300 text-sm md:text-base"
//                               onClick={() => handleQuizAnswer(option)}
//                             >
//                               {option}
//                             </Button>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center space-y-4 md:space-y-6">
//                       <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                         <Star className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
//                       </div>
                      
//                       <div>
//                         <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Recommended Courses for You!</h3>
//                         <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Based on your interests, here are some courses you might love:</p>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
//                           {getRecommendedCourses().map((course, index) => (
//                             <Card key={index} className="p-3 md:p-4 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
//                               <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
//                               <p className="font-semibold text-blue-800 text-xs md:text-sm">{course}</p>
//                             </Card>
//                           ))}
//                         </div>
                        
//                         <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
//                           <Button onClick={resetQuiz} variant="outline">
//                             Retake Quiz
//                           </Button>
//                           <Button>
//                             Learn More About These Courses
//                             <ArrowRight className="w-4 h-4 ml-2" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </section>

//             {/* Connect Section */}
//             <section id="connect" className="mb-8 md:mb-12">
//               <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">Get Connected</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6 md:space-y-8">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//                     <div>
//                       <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Contact Information</h3>
//                       <div className="space-y-3 md:space-y-4">
//                         {[
//                           { icon: Globe, label: "Website", value: university.website, type: "link" },
//                           { icon: Phone, label: "Phone", value: university.phone, type: "text" },
//                           { icon: Mail, label: "Email", value: university.email, type: "email" },
//                           { icon: MapPin, label: "Location", value: university.location, type: "text" }
//                         ].map((item, index) => (
//                           <Card key={index} className="p-3 md:p-4 border-0 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300">
//                             <div className="flex items-center gap-3 md:gap-4">
//                               <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
//                                 <item.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
//                               </div>
//                               <div className="min-w-0 flex-1">
//                                 <div className="text-xs md:text-sm text-gray-600 font-medium">{item.label}</div>
//                                 {item.type === "link" ? (
//                                   <a href={item.value} className="text-blue-600 hover:underline font-medium text-sm md:text-base break-all">
//                                     {item.value}
//                                   </a>
//                                 ) : item.type === "email" ? (
//                                   <a href={`mailto:${item.value}`} className="text-blue-600 hover:underline font-medium text-sm md:text-base break-all">
//                                     {item.value}
//                                   </a>
//                                 ) : (
//                                   <span className="font-medium text-gray-800 text-sm md:text-base">{item.value}</span>
//                                 )}
//                               </div>
//                             </div>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Quick Actions</h3>
//                       <div className="space-y-3">
//                         {[
//                           { icon: Mail, label: "Request Information" },
//                           { icon: Users, label: "Schedule Campus Visit" },
//                           { icon: Phone, label: "Talk to Admissions" }
//                         ].map((action, index) => (
//                           <Button key={index} variant="outline" size="lg" className="w-full justify-start h-12 md:h-14 text-left rounded-xl text-sm md:text-base">
//                             <action.icon className="w-4 h-4 md:w-5 md:h-5 mr-3 md:mr-4" />
//                             <span className="font-medium">{action.label}</span>
//                             <ArrowRight className="w-4 h-4 ml-auto" />
//                           </Button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </section>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UniversityPage;
