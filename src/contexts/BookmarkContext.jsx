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

  // Fetch user ID from sessionStorage
  const userData = sessionStorage.getItem("userData");
  const userId = userData ? JSON.parse(userData).id : null;

  const CACHE_KEY = userId ? `bookmarks_${userId}` : "guestBookmarks";

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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookmarks/${userId}`);
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
        const fallback = localStorage.getItem(CACHE_KEY);
        if (fallback) setBookmarks(JSON.parse(fallback));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

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

    const isBookmarked = bookmarks.includes(id);
    const endpoint = isBookmarked ? `${import.meta.env.VITE_API_BASE_URL}/unbookmark` : `${import.meta.env.VITE_API_BASE_URL}/bookmark`;
    const payload = isBookmarked
      ? { userId, schoolId: id }
      : { userId, school };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        const updated = isBookmarked
          ? bookmarks.filter((b) => b !== id)
          : [...bookmarks, id];
        setBookmarks(updated);
        persistToLocal(updated);
        toast.success(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
      } else {
        toast.error("Failed to update bookmark.");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("An error occurred.");
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
