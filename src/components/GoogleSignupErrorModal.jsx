import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const GoogleSignupErrorModal = ({ message, darkMode, navigate }) => {
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(interval);
      navigate("/");
    }

    return () => clearInterval(interval);
  }, [countdown, navigate]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        className={`max-w-md w-full rounded-lg shadow-lg p-8 text-center ${
          darkMode ? "bg-purple-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Account Exists</h2>
        <p className="mb-4">{message}</p>
        <p className="text-sm mb-4">
          Redirecting to login in {countdown} second{countdown !== 1 && "s"}...
        </p>
        <button
          onClick={() => navigate("/")}
          className={`mt-4 w-full py-2 rounded ${
            darkMode
              ? "bg-purple-700 hover:bg-purple-600"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
};

GoogleSignupErrorModal.propTypes = {
  message: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default GoogleSignupErrorModal;
