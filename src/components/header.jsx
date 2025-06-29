import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    // Check for token in URL (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const userFromUrl = urlParams.get("user");

    if (tokenFromUrl) {
      // Store token and user data from URL
      sessionStorage.setItem("authToken", tokenFromUrl);
      sessionStorage.setItem("isAuthenticated", "true");

      if (userFromUrl) {
        try {
          const userData = JSON.parse(decodeURIComponent(userFromUrl));
          sessionStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data from URL:", error);
        }
      }

      // Clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    const fetchUserProfile = async (token) => {
      try {
        console.log("Fetching user profile with token...");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          sessionStorage.setItem("userData", JSON.stringify(userData));
          console.log("User profile fetched successfully:", userData);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Unknown error" }));
          console.error("Profile fetch error:", errorData);

          // Handle authentication errors
          if (response.status === 401 || response.status === 403) {
            console.warn("Token invalid or expired, clearing auth data");
            clearAuthData();
          } else if (response.status === 400) {
            console.error("Bad request - token format issue");
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("Network error fetching user profile:", error);
        // Don't clear auth data for network errors - user might still be authenticated
      }
    };

    const clearAuthData = () => {
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      setIsAuthenticated(false);
      setUser(null);
    };

    const checkAuth = async () => {
      const authToken = sessionStorage.getItem("authToken");
      const isAuth = sessionStorage.getItem("isAuthenticated") === "true";

      if (isAuth && authToken) {
        // Validate token format (basic check)
        if (
          !authToken ||
          authToken.trim() === "" ||
          authToken === "undefined"
        ) {
          console.warn("Invalid token format, clearing auth data");
          clearAuthData();
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        const userData = sessionStorage.getItem("userData");
        if (userData && userData !== "undefined") {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setLoading(false);
          } catch (error) {
            console.error("Error parsing stored user data:", error);
            await fetchUserProfile(authToken);
            setLoading(false);
          }
        } else {
          await fetchUserProfile(authToken);
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");

    setIsAuthenticated(false);
    setUser(null);
    setIsProfileOpen(false);

    const sessionId = sessionStorage.getItem("sessionId");
    if (sessionId) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) throw new Error("Logout failed");

        sessionStorage.removeItem("sessionId");
        toast.success("Logged out successfully!", {
          duration: 4000,
          position: "top-center",
          style: { background: "green", color: "white" },
        });

        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } catch (err) {
        console.error("Error logging out:", err);
        toast.error("Failed to log out. Please try again.");
      }
    }
  };

  const getLinkClassName = (path) => {
    return location.pathname === path
      ? "block py-2 px-3 text-purple-hover rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-purple-hover md:p-0 md:dark:hover:text-purple-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
      : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-purple md:p-0 md:dark:hover:text-purple-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";
  };

  // Don't render anything while loading to avoid flashing login button
  if (loading) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="../unighana-logo.png"
            className="h-12"
            alt="Unighana Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-[#5A076F] dark:text-white">
            UniGhana
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated && user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                className="flex items-center gap-2 text-gray-700 hover:text-purple focus:outline-none"
                onClick={toggleProfileMenu}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-purple"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple text-white flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
                <span className="hidden md:block">
                  {user.firstName || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} />
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/">
              <button
                type="button"
                className="text-white bg-[#5A076F] hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-[#5A076F] dark:hover:bg-purple dark:focus:ring-purple-800"
              >
                Log In
              </button>
            </Link>
          )}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-2"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            isOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/landing-page"
                className={getLinkClassName("/landing-page")}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/university-search"
                className={getLinkClassName("/university-search")}
              >
                University Search
              </Link>
            </li>
            <li>
              <Link
                to="/scholarships"
                className={getLinkClassName("/scholarships")}
              >
                Scholarships
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={getLinkClassName("/dashboard")}>
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
