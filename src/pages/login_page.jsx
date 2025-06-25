import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalContainer from '../components/modalContainer';
import successAnimation from '../animations/success.json'; // Adjust path as needed
import errorAnimation from '../animations/error.json'; // Adjust path as needed

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('success');
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Effect for redirect after successful login
  useEffect(() => {
    if (modalOpen && modalStatus === 'success') {
      const redirectTimer = setTimeout(() => {
        navigate('/landing-page');
      }, 3000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [modalOpen, modalStatus, navigate]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) {
      newErrors.password = "Required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log('Sending request to:', '/api/login');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      // Handle the response
      if (response.ok) {
        // Successful login
        setModalStatus('success');
        setModalMessage(data.message || 'Login successful! Redirecting to dashboard in 3 seconds...');
        setModalOpen(true);
        
        // Store all necessary authentication data
        sessionStorage.setItem('isAuthenticated', 'true');
        
        if (data.token) {
          sessionStorage.setItem('authToken', data.token);
        }
        
        if (data.sessionId) {
          sessionStorage.setItem('sessionId', data.sessionId);
        }
        
        // Store user data for the header to use
        if (data.user) {
          sessionStorage.setItem('userData', JSON.stringify(data.user));
        }
      } else {
        // Failed login
        setModalStatus('error');
        setModalMessage(data.message || 'Login failed. Please check your credentials.');
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Logging in error:', error);
      setModalStatus('error');
      setModalMessage('An error occurred while connecting to the server. Please try again later.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div
      className={`min-h-screen w-full p-2 sm:p-8 pb-12 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#4a1d96] via-[#2d1b69] to-[#1e3a8a]"
          : "bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#ede9fe]"
      }`}
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

      {/* Modal Container */}
      <ModalContainer 
        isOpen={modalOpen}
        status={modalStatus}
        message={modalMessage}
        onClose={closeModal}
        animationData={modalStatus === 'success' ? successAnimation : errorAnimation}
      />

      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div
          className={`grid w-full max-w-full sm:max-w-6xl grid-cols-1 gap-8 rounded-2xl ${
            darkMode ? "bg-white/5" : "bg-white/60"
          } p-2 sm:p-8 shadow-2xl backdrop-blur-xl backdrop-filter md:grid-cols-2`}
        >
          <div className="flex flex-col justify-center space-y-4">
            <div className="text-center px-4 sm:px-0 mb-8">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  darkMode ? "bg-white/10" : "bg-gray-800/10"
                } backdrop-blur-md`}
              >
                <i
                  className={`fas fa-graduation-cap text-3xl ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                ></i>
              </div>
              <h1
                className={`mt-6 text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Welcome Back
              </h1>
              <p
                className={`mt-3 ${
                  darkMode ? "text-gray-200" : "text-gray-600"
                }`}
              >
                Sign in to your account
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 px-4 sm:px-8 w-full max-w-none sm:max-w-md mx-auto"
            >
              <div className="space-y-2 h-[85px]">
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    id="email"
                    className={`peer w-full rounded-xl ${
                      darkMode
                        ? "border-white/10 bg-white/10 text-white"
                        : "border-gray-300 bg-white/90 text-gray-800"
                    } px-5 py-4 backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:ring-offset-0 placeholder-transparent`}
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className={`absolute -top-6 left-0 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-5 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:left-0 peer-focus:text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Email address
                  </label>
                  <i
                    className={`fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  ></i>
                </div>
                {error.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.email}
                  </span>
                )}
              </div>
              <div className="space-y-2 h-[85px]">
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    id="password"
                    className={`peer w-full rounded-xl ${
                      darkMode
                        ? "border-white/10 bg-white/10 text-white"
                        : "border-gray-300 bg-white/90 text-gray-800"
                    } px-5 py-4 backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:ring-offset-0 placeholder-transparent`}
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className={`absolute -top-6 left-0 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-5 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:left-0 peer-focus:text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Password
                  </label>
                  <i
                    className={`fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  ></i>
                </div>
                {error.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.password}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <a
                  href="/account/forgot-password"
                  className={`${
                    darkMode
                      ? "text-purple-300 hover:text-purple-200"
                      : "text-purple-600 hover:text-purple-700"
                  }`}
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 disabled:opacity-50 hover:shadow-xl hover:transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
              
              {/* Error message below the submit button */}
              {error.form && (
                <div className="mt-4 bg-red-500 text-white p-4 rounded-md">
                  {error.form}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border-t ${
                      darkMode ? "border-white/10" : "border-gray-200"
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
                className={`flex w-full items-center justify-center rounded-lg transition-transform duration-300 ${
                  darkMode
                    ? "bg-white/20 text-white border border-white/30 hover:bg-white/25"
                    : "bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 text-gray-700 font-medium shadow-md hover:scale-[1.02]"
                } px-5 py-4`}
              >
                <i className="fab fa-google mr-2"></i>
                Sign in with Google
              </button>
              <p
                className={`mt-4 mb-8 text-center text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
                  className={`${
                    darkMode
                      ? "text-purple-300 hover:text-purple-200"
                      : "text-purple-600 hover:text-purple-700"
                  }`}
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>

          <div className="hidden md:block">
            <img
              src="./image1.jpg"
              alt="Students studying in the modern UniGhana library"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>

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
  );
}

export default LoginPage;