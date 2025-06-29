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

  // Get auth token - check multiple possible locations
  const getAuthToken = () => {
    // Try to get token from sessionStorage directly
    let token = sessionStorage.getItem("authToken");

    // If not found, try to get from userData object
    if (!token && userData) {
      const parsedUserData = JSON.parse(userData);
      token =
        parsedUserData.token ||
        parsedUserData.accessToken ||
        parsedUserData.idToken;
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
          console.warn("No authentication token found");
          // Fall back to local storage if no token
          const fallback = localStorage.getItem(CACHE_KEY);
          if (fallback) setBookmarks(JSON.parse(fallback));
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/bookmarks/${userId}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        if (res.status === 401) {
          console.error("Authentication failed - token may be expired");
          toast.error("Please log in again");
          // Clear invalid token
          sessionStorage.removeItem("authToken");
          // Fall back to local storage
          const fallback = localStorage.getItem(CACHE_KEY);
          if (fallback) setBookmarks(JSON.parse(fallback));
          return;
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.bookmarks)) {
          const ids = data.bookmarks.map((school) => school.id);
          setBookmarks(ids);
          localStorage.setItem(CACHE_KEY, JSON.stringify(ids));
        } else {
          setBookmarks([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
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
      const res = await fetch(endpoint, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        console.error("Authentication failed during bookmark toggle");
        toast.error("Please log in again");
        // Clear invalid token
        sessionStorage.removeItem("authToken");
        return;
      }

      const data = await res.json();

      if (data.success) {
        const updated = isBookmarked
          ? bookmarks.filter((b) => b !== id)
          : [...bookmarks, id];
        setBookmarks(updated);
        persistToLocal(updated);
        toast.success(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
      } else {
        toast.error(data.message || "Failed to update bookmark.");
      }
    } catch (err) {
      console.error("Toggle error:", err);
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
