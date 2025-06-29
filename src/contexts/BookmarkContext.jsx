// import { createContext, useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import toast from "react-hot-toast";

// const BookmarkContext = createContext();

// export const useBookmarks = () => {
//   const context = useContext(BookmarkContext);
//   if (!context) {
//     throw new Error("useBookmarks must be used within a BookmarkProvider");
//   }
//   return context;
// };

// export const BookmarkProvider = ({ children }) => {
//   const [bookmarks, setBookmarks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch user ID from sessionStorage
//   const userData = sessionStorage.getItem("userData");
//   const userId = userData ? JSON.parse(userData).id : null;

//   const CACHE_KEY = userId ? `bookmarks_${userId}` : "guestBookmarks";

//   // Load bookmarks on mount
//   useEffect(() => {
//     const load = async () => {
//       if (!userId) {
//         // Load guest bookmarks from localStorage
//         const stored = localStorage.getItem(CACHE_KEY);
//         setBookmarks(stored ? JSON.parse(stored) : []);
//         return;
//       }

//       setLoading(true);
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookmarks/${userId}`);
//         const data = await res.json();

//         if (data.success && Array.isArray(data.bookmarks)) {
//           const ids = data.bookmarks.map((school) => school.id);
//           setBookmarks(ids);
//           localStorage.setItem(CACHE_KEY, JSON.stringify(ids));
//         } else {
//           setBookmarks([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch bookmarks:", error);
//         const fallback = localStorage.getItem(CACHE_KEY);
//         if (fallback) setBookmarks(JSON.parse(fallback));
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [userId]);

//   const persistToLocal = (list) => {
//     localStorage.setItem(CACHE_KEY, JSON.stringify(list));
//   };

//   const toggleBookmark = async (id, school) => {
//     if (!userId) {
//       // Guest bookmark toggle (local only)
//       const isBookmarked = bookmarks.includes(id);
//       const updated = isBookmarked
//         ? bookmarks.filter((b) => b !== id)
//         : [...bookmarks, id];
//       setBookmarks(updated);
//       persistToLocal(updated);
//       toast.success(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
//       return;
//     }

//     const isBookmarked = bookmarks.includes(id);
//     const endpoint = isBookmarked ? `${import.meta.env.VITE_API_BASE_URL}/unbookmark` : `${import.meta.env.VITE_API_BASE_URL}/bookmark`;
//     const payload = isBookmarked
//       ? { userId, schoolId: id }
//       : { userId, school };

//     try {
//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (data.success) {
//         const updated = isBookmarked
//           ? bookmarks.filter((b) => b !== id)
//           : [...bookmarks, id];
//         setBookmarks(updated);
//         persistToLocal(updated);
//         toast.success(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
//       } else {
//         toast.error("Failed to update bookmark.");
//       }
//     } catch (err) {
//       console.error("Toggle error:", err);
//       toast.error("An error occurred.");
//     }
//   };

//   const isBookmarked = (id) => bookmarks.includes(id);

//   return (
//     <BookmarkContext.Provider
//       value={{
//         bookmarks,
//         loading,
//         toggleBookmark,
//         isBookmarked,
//         bookmarkCount: bookmarks.length,
//       }}
//     >
//       {children}
//     </BookmarkContext.Provider>
//   );
// };

// BookmarkProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const BookmarkContext = createContext();

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user data and token from sessionStorage
  const userData = sessionStorage.getItem("userData");
  const userId = userData ? JSON.parse(userData).id : null;

  // FIXED: Simplified and consistent token retrieval
  const getAuthToken = () => {
    // Primary source: authToken from sessionStorage (set by both login methods)
    let token = sessionStorage.getItem("authToken");

    // Debug logging
    if (token) {
      console.log("✅ Token found in sessionStorage");
      console.log("Token length:", token.length);

      // Validate JWT format (should have 3 parts separated by dots)
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("❌ Invalid JWT format - token does not have 3 parts");
        console.error("Token:", token.substring(0, 50) + "...");
        return null;
      }

      // Check if it looks like a JWT (not Google's ID token)
      try {
        const header = JSON.parse(atob(parts[0]));
        console.log("Token header:", header);

        // If it's a Google ID token, it will have different structure
        if (header.kid && header.alg === "RS256" && !header.typ) {
          console.error(
            "❌ This appears to be a Google ID token, not your JWT"
          );
          return null;
        }
      } catch (e) {
        console.error("❌ Could not parse token header:", e);
        return null;
      }
    } else {
      console.log("❌ No token found in sessionStorage");
    }

    return token;
  };

  const CACHE_KEY = userId ? `bookmarks_${userId}` : "guestBookmarks";

  // Create headers with authentication
  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set");
    } else {
      console.warn("⚠️ No valid token available for Authorization header");
    }

    return headers;
  };

  // Load bookmarks on mount
  useEffect(() => {
    const load = async () => {
      if (!userId) {
        // Load guest bookmarks from localStorage
        const stored = localStorage.getItem(CACHE_KEY);
        setBookmarks(stored ? JSON.parse(stored) : []);
        return;
      }

      setLoading(true);
      try {
        const token = getAuthToken();

        if (!token) {
          console.warn("No valid authentication token found");
          toast.error("Please log in again to access your bookmarks");

          // Clear auth data
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("userData");

          // Fall back to local storage
          const fallback = localStorage.getItem(CACHE_KEY);
          if (fallback) setBookmarks(JSON.parse(fallback));
          return;
        }

        console.log(
          `📡 Fetching bookmarks from: ${
            import.meta.env.VITE_API_BASE_URL
          }/bookmarks/${userId}`
        );

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/bookmarks/${userId}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        console.log("📡 Bookmarks fetch response status:", res.status);

        if (res.status === 400) {
          const errorData = await res.json();
          console.error(
            "❌ 400 Bad Request - Invalid token format:",
            errorData
          );
          toast.error("Your session has expired. Please log in again.");

          // Clear all auth data
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("userData");

          // Redirect to login
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);

          return;
        }

        if (res.status === 401) {
          console.error("❌ 401 Unauthorized - token expired or invalid");
          toast.error("Please log in again");

          // Clear invalid token
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("userData");

          // Fall back to local storage
          const fallback = localStorage.getItem(CACHE_KEY);
          if (fallback) setBookmarks(JSON.parse(fallback));
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.bookmarks)) {
          const ids = data.bookmarks.map((school) => school.id);
          setBookmarks(ids);
          localStorage.setItem(CACHE_KEY, JSON.stringify(ids));
          console.log("✅ Bookmarks loaded successfully:", ids.length, "items");
        } else {
          console.log("📝 No bookmarks found");
          setBookmarks([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch bookmarks:", error);
        toast.error("Failed to load bookmarks");

        // Fall back to local storage on error
        const fallback = localStorage.getItem(CACHE_KEY);
        if (fallback) setBookmarks(JSON.parse(fallback));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, CACHE_KEY]);

  const persistToLocal = (list) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  };

  const toggleBookmark = async (id, school) => {
    if (!userId) {
      // Guest bookmark toggle (local only)
      const isBookmarked = bookmarks.includes(id);
      const updated = isBookmarked
        ? bookmarks.filter((b) => b !== id)
        : [...bookmarks, id];
      setBookmarks(updated);
      persistToLocal(updated);
      toast.success(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      toast.error("Please log in to bookmark schools");
      return;
    }

    const isBookmarked = bookmarks.includes(id);
    const endpoint = isBookmarked
      ? `${import.meta.env.VITE_API_BASE_URL}/unbookmark`
      : `${import.meta.env.VITE_API_BASE_URL}/bookmark`;

    const payload = isBookmarked
      ? { userId, schoolId: id }
      : { userId, school };

    try {
      console.log(
        `📡 ${isBookmarked ? "Unbookmarking" : "Bookmarking"} school:`,
        id
      );

      const res = await fetch(endpoint, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log("📡 Bookmark toggle response status:", res.status);

      if (res.status === 400) {
        const errorData = await res.json();
        console.error("❌ 400 Bad Request during bookmark toggle:", errorData);
        toast.error("Your session has expired. Please log in again.");

        // Clear auth data
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("userData");

        // Redirect to login
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);

        return;
      }

      if (res.status === 401) {
        console.error("❌ 401 Unauthorized during bookmark toggle");
        toast.error("Please log in again");

        // Clear invalid token
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("userData");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        const updated = isBookmarked
          ? bookmarks.filter((b) => b !== id)
          : [...bookmarks, id];
        setBookmarks(updated);
        persistToLocal(updated);
        toast.success(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
        console.log("✅ Bookmark toggle successful");
      } else {
        toast.error(data.message || "Failed to update bookmark.");
      }
    } catch (err) {
      console.error("❌ Bookmark toggle error:", err);
      toast.error("An error occurred while updating bookmark.");
    }
  };

  const isBookmarked = (id) => bookmarks.includes(id);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        loading,
        toggleBookmark,
        isBookmarked,
        bookmarkCount: bookmarks.length,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

BookmarkProvider.propTypes = {
  children: PropTypes.node.isRequired,
};