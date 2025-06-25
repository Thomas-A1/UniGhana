"use client";
import { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import PropTypes from 'prop-types';

function ModalContainer({ isOpen, status, message, onClose, animationData }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 dark:bg-black/70 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-md transform transition-all duration-300 relative ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-xl" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* 🎞️ Lottie Animation */}
          {animationData && (
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay={true}
              className="w-28 h-28 mb-2"
            />
          )}

          <h2 className="text-xl font-inter font-bold text-gray-900 dark:text-white mb-2">
            {status === "success" ? "Success" : "Error"}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 font-inter text-sm">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

ModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(["success", "error"]).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  animationData: PropTypes.object // optional Lottie JSON object
};
export default ModalContainer;
