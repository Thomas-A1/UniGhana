"use client";
import { useState, useEffect} from 'react';
import VerificationModal from '../components/VerificationModal';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    educationLevel: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      if (isAuthenticated) {
        navigate('/landing-page');
      }
    };
    
    checkAuth();
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.educationLevel) newErrors.educationLevel = "Required";

    if (!formData.password) {
      newErrors.password = "Required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log('Sending request to:', '/api/signup');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          educationLevel: formData.educationLevel,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - Save the userId and show verification modal
        setUserId(data.userId);
        setShowVerificationModal(true);
        setSuccessMessage('User created successfully. Please verify your email.');
      } else {
        // Handle the error returned from the backend
        setErrors({ form: data.error || data.message || 'Registration failed. Please try again.' });
        // Clear the error message after 5 seconds
        setTimeout(() => {
          setErrors((prevErrors) => ({ ...prevErrors, form: "" }));
        }, 5000); // 7 seconds
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ form: 'An error occurred. Please try again later.' });
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setErrors((prevErrors) => ({ ...prevErrors, form: "" }));
      }, 5000);
    } finally {
      setLoading(false);
    }

  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return true;
    } catch (error) {
      console.error('Error resending code:', error);
      throw error;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-b from-purple-900 to-purple-800"
          : "bg-gradient-to-br from-purple-50 to-blue-50"
      } flex items-center justify-center p-4 transition-all duration-300`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md z-50"
      >
        <i
          className={`fas ${
            darkMode ? "fa-sun" : "fa-moon"
          } text-gray-800 dark:text-white`}
        ></i>
      </button>

      <div
        className={`w-full max-w-6xl grid md:grid-cols-2 gap-8 ${
          darkMode ? "bg-white/5" : "bg-white/60"
        } rounded-xl p-8 shadow-xl transition-all duration-300`}
      >
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  darkMode ? "bg-white/10" : "bg-gray-800/10"
                } backdrop-blur-md`}
              >
              <i
                className={`fas fa-graduation-cap text-2xl ${
                  darkMode ? "text-purple-200" : "text-gray-600"
                }`}
              ></i>
            </div>
            <h1
              className={`text-3xl font-bold mb-2 font-inter ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Access UniGhana
            </h1>
            <p className={`${darkMode ? "text-purple-200" : "text-gray-600"}`}>
              Sign up to start your journey with us
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  className={`w-full h-12 px-4 rounded-md border ${
                    darkMode
                      ? "border-white/10 bg-white/10 text-white text-white placeholder-white"
                      : "border-gray-300 bg-white/90 text-gray-900"
                  } px-5 py-4 backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:ring-offset-0 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  className={`w-full h-12 px-4 rounded-md border ${
                    darkMode
                      ? "border-white/10 bg-white/10 text-white text-white placeholder-white"
                      : "border-gray-300 bg-white/90 text-gray-900"
                  } px-5 py-4 backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:ring-offset-0 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className={`w-full h-12 px-4 rounded-md border ${
                  darkMode
                      ? "border-white/10 bg-white/10 text-white text-white placeholder-white"
                      : "border-gray-300 bg-white/90 text-gray-900"
                  } px-5 py-4 backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:ring-offset-0 ${
                  errors.email ? "border-red-500" : ""
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="educationLevel"
                placeholder="Educational Level"
                className={`w-full h-12 px-4 rounded-md border ${
                  darkMode
                      ? "border-white/10 bg-white/10 text-white text-white placeholder-white"
                      : "border-gray-300 bg-white/90 text-gray-900"
                  } px-5 py-4 backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:ring-offset-0 ${
                  errors.educationLevel ? "border-red-500" : ""
                }`}
                value={formData.educationLevel}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                readOnly
              />
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <i
                  className={`fas fa-chevron-down ${
                    darkMode ? "text-purple-300" : "text-gray-500"
                  }`}
                ></i>
              </div>

              {/* Dropdown Menu */}
              <div
                className={`absolute w-full mt-1 rounded-md shadow-lg overflow-hidden transition-all duration-300 ${
                  isDropdownOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                } ${
                  darkMode ? "bg-purple-800 backdrop-blur-sm" : "bg-white"
                }`}
              >
                {[
                  "High School",
                  "Undergraduate",
                  ""

                ].map((level) => (
                  <div
                    key={level}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        educationLevel: level,
                      }));
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                      darkMode
                        ? "text-white hover:bg-purple-700/50"
                        : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {level}
                  </div>
                ))}
              </div>
              {errors.educationLevel && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.educationLevel}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full h-12 px-4 rounded-md border ${
                    darkMode
                      ? "border-white/10 bg-white/10 text-white text-white placeholder-white"
                      :  "border-gray-300 bg-white/90 text-gray-900"
                  } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className={`w-full h-12 px-4 rounded-md border ${
                    darkMode
                      ? "border-white/10 bg-white/10 text-white text-white placeholder-white"
                      :  "border-gray-300 bg-white/90 text-gray-900"
                  } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className={`h-4 w-4 rounded border ${
                  darkMode
                    ? "border-purple-600 bg-purple-800/30"
                    : "border-gray-200 bg-white"
                } transition-colors duration-300`}
              />
              <label
                htmlFor="rememberMe"
                className={`ml-2 ${
                  darkMode ? "text-purple-200" : "text-gray-700"
                }`}
              >
                Remember me
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 disabled:opacity-50 hover:shadow-xl hover:transform hover:scale-[1.02]" ${
                darkMode
                  ? "bg-purple-500 hover:bg-purple-400"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white disabled:opacity-50`}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {/* Success message below the submit button */}
            {successMessage && (
              <div className="mt-4 bg-green-500 text-white p-4 rounded-md">
                {successMessage}
              </div>
            )}

            {/* Error message below the submit button */}
            {errors.form && (
              <div className="mt-4 bg-red-500 text-white p-4 rounded-md">
                {errors.form}
              </div>
            )}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${
                    darkMode ? "border-purple-600" : "border-gray-200"
                  }`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                  <span
                    className={`bg-transparent px-2 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Or continue with
                  </span>
                </div>
            </div>
             <button
                type="button"
                // onClick={handleGoogleSignIn}
                className={`flex w-full items-center justify-center rounded-lg transition-transform duration-300 ${
                  darkMode
                    ? "bg-white/20 text-white border border-white/30 hover:bg-white/25"
                    : "bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 text-gray-700 font-medium shadow-md hover:scale-[1.02]"
                } px-5 py-4`}
              >
                <i className="fab fa-google mr-2"></i>
                Sign up with Google
              </button>
            <p
              className={`text-center mt-6 ${
                darkMode ? "text-purple-200" : "text-gray-600"
              }`}
            >
              Already have an account?
              <a
                href="/"
                className={`ml-1 ${
                  darkMode
                    ? "text-purple-100 hover:text-purple-200"
                    : "text-purple-600 hover:text-purple-700"
                }`}
              >
                Sign in
              </a>
            </p>
          </form>
        </div>

  
         {/* <div className={`${darkMode ? "bg-purple-800/30" : "bg-purple-800/30"} rounded-xl p-2 flex items-center justify-center`}> */}
  <div className={`hidden md:flex ${darkMode ? "bg-purple-800/30" : "bg-purple-600"} rounded-xl p-2 items-center justify-center`}>
  <img
    src="/unighana-logo-transparent-bg.png"
    alt="UniGhana Logo"
    className="w-4/5 h-4/5 object-contain"
  />
</div>
 
 {/* Verification Modal */}
      {showVerificationModal && userId &&(
        <VerificationModal
          userId={userId}
          email={formData.email}
          onResendCode={handleResendCode}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      
      <style>{`
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px ${
      darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)"
    } inset;
    -webkit-text-fill-color: ${darkMode ? "white" : "#1f2937"};
    transition: background-color 5000s ease-in-out 0s;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  form {
    animation: fadeIn 0.5s ease-out;
  }
`}</style>
        
      </div>
    </div>
  );
}

export default RegisterPage;