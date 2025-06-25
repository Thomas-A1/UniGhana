export async function getSchoolCardData() {
  const CACHE_KEY = 'schoolCardDataCache';
  const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours TTL

  const staticData = [
    {
      id: "AcademicCity",
      title: "Academic City University",
      description: "A top private university in Ghana.",
      image: "./academic-city.jpeg",
      link: "#",
      location: "Accra, Ghana",
      applicationDeadline: "",
    },
    {
      id: "ug",
      title: "University of Ghana",
      description: "Ghana's premier university located in Legon.",
      image: "./ug.jpeg",
      link: "#",
      location: "Legon, Accra",
      applicationDeadline: "",
    },
    {
      id: "knust",
      title: "Kwame Nkrumah University of Science and Technology",
      description: "The Kwame Nkrumah University of Science and Technology (KNUST) is a premier public university in Ghana, established in 1951. Located in Kumasi, the cultural capital of the Ashanti Region, KNUST is renowned for its excellence in science, technology, engineering, and agriculture. ",
      image: "./KNUST.jpg",
      link: "/university/3",
      location: "Kumasi, Ghana",
      applicationDeadline: "",
    },
    {
      id: "Ashesi",
      title: "Ashesi University",
      description: "Known for innovation and leadership education.",
      image: "./ASHESI.jpg",
      link: "#",
      location: "Berekuso, Ghana",
      applicationDeadline: "",
    }
  ];

  // Load cache with timestamp
  let cached = null;
  try {
    const cachedJson = localStorage.getItem(CACHE_KEY);
    if (cachedJson) cached = JSON.parse(cachedJson);
  } catch {
    cached = null;
  }

  // Check cache validity
  const now = Date.now();
  const isCacheValid = cached && cached.timestamp && (now - cached.timestamp) < TTL_MS;

  if (isCacheValid && Array.isArray(cached.data)) {
    // Return valid cached data immediately, but update in background
    fetchAndUpdateCache(); // async, no await
    return cached.data;
  } else if (cached && Array.isArray(cached.data)) {
    // Cache expired but available: return stale and update in background
    fetchAndUpdateCache(); // async, no await
    return cached.data;
  } else {
    // No cache or invalid: fetch fresh data and return (with fallback to staticData)
    try {
      const freshData = await fetchAndUpdateCache();
      return freshData;
    } catch {
      return staticData;
    }
  }

  async function fetchAndUpdateCache() {
    try {
      const response = await fetch('api/schools/knust-admission');
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const text = await response.text();
        console.warn(`Unexpected status ${response.status} while fetching KNUST data`);
        console.warn("Response body:", text);
        return cached?.data || staticData;
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.warn("Unexpected content type while fetching KNUST data:", contentType);
        console.warn("Response body:", text);
        return cached?.data || staticData;
      }

      const result = await response.json();
      const knustData = result.data;

      // Clone to avoid mutating cached or static data
      const updatedData = JSON.parse(JSON.stringify(cached?.data || staticData));

      const knust = updatedData.find(school => school.id === "knust");

      if (knust) {
        knust.description = knust.description || knustData?.description || "";

        if (knustData?.applicationDeadline && typeof knustData.applicationDeadline === "string") {
          knust.applicationDeadline = knustData.applicationDeadline.trim();
        } else {
          knust.applicationDeadline = knust.applicationDeadline || "";
        }

        knust.applicationFees = knustData?.applicationFees || knust.applicationFees || {};
      } else {
        console.warn("KNUST school data with id '3' not found");
      }

      // Update cache with timestamp
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: updatedData
      }));

      return updatedData;
    } catch (error) {
      console.error("Error fetching KNUST admission info:", error);
      return cached?.data || staticData;
    }
  }
}




// src/data/schoolCardData.js

// export async function getSchoolCardData() {
//   const schoolCardData = [
//     {
//       id: "1",
//       title: "Academic City University",
//       description: "",
//       image: "./academic-city.jpeg",
//       link: "#",
//       location: "Accra, Ghana",
//       applicationDeadline: "", // empty by default
//     },
//     {
//       id: "2",
//       title: "University of Ghana",
//       description: "",
//       image: "./ug.jpeg",
//       link: "#",
//       location: "Legon, Accra",
//       applicationDeadline: "",
//     },
//     {
//       id: "3",
//       title: "Kwame Nkrumah University of Science and Technology",
//       description: "",
//       image: "./knust.jpeg",
//       link: "#",
//       location: "Kumasi, Ghana",
//       applicationDeadline: "",
//     },
//     {
//       id: "4",
//       title: "Ashesi University",
//       description: "",
//       image: "./ashesi.jpeg",
//       link: "#",
//       location: "Berekuso, Ghana",
//       applicationDeadline: "",
//     }
//   ];

//   try {
//   const response = await fetch('api/schools/knust-admission');

//   const contentType = response.headers.get("content-type");

//   if (!response.ok) {
//     const text = await response.text();
//     console.warn(`Unexpected status ${response.status} while fetching KNUST data`);
//     console.warn("Response body:", text);
//     return schoolCardData; // Return fallback data
//   }

//   if (!contentType || !contentType.includes("application/json")) {
//     const text = await response.text(); 
//     console.warn("Unexpected content type while fetching KNUST data:", contentType);
//     console.warn("Response body:", text);
//     return schoolCardData; // Return fallback data
//   }

//   const result = await response.json();
//   const knustData = result.data;

//   // Find the school entry with id "3"
//   const knust = schoolCardData.find(school => school.id === "3");

//   if (knust) {
//     knust.description = knustData?.description || "";
//     knust.applicationDeadline = isValidDate(knustData?.applicationDeadline)
//       ? knustData.applicationDeadline
//       : "";
//     knust.applicationFees = knustData?.applicationFees || {};
//   } else {
//     console.warn("KNUST school data with id '3' not found in schoolCardData");
//   }
// } catch (error) {
//   console.error("Error fetching KNUST admission info:", error);
// }

// return schoolCardData;

// function isValidDate(dateStr) {
//   const d = new Date(dateStr);
//   return !isNaN(d.getTime());
// }
// }
