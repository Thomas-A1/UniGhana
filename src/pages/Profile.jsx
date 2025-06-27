
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Pencil, AlertTriangle, Mail, GraduationCap, Check, Settings, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/header';
import VerificationModal from '../components/VerificationModal';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [userId, setUserId] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authToken = sessionStorage.getItem("authToken");
      const isAuth = sessionStorage.getItem("isAuthenticated") === "true";

      if (!isAuth || !authToken) {
        navigate("/");
        return;
      }

      const userData = sessionStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUserId(parsedUser.id);
        setEditForm(parsedUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleImageUpload = async (event) => {
    if (!user) {
      toast.error("Please wait for profile data to load.");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("userId", user.id);

      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/upload-profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, profileImage: data.imageUrl };
        setUser(updatedUser);
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        toast.success("Profile image updated successfully!");
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const handleResendVerification = async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ userId: user.id, email: user.email })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Verification code sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to send verification code');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          ...editForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Verification Alert */}
          {!user.emailVerified && (
            <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-lg shadow-lg">
              <div className="p-4 sm:p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-orange-800">
                      Account Verification Required
                    </h3>
                    <p className="mt-2 text-sm text-orange-700">
                      Your email address hasn&apos;t been verified yet. Please
                      verify your account to access all features.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowVerificationModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Verify Now
                      </button>
                      <button
                        onClick={handleResendVerification}
                        className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            <div className="px-6 sm:px-8 pb-8">
              <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-600">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Upload Overlay */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <Pencil className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* User Info */}
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </p>
                      {user.emailVerified && (
                        <div className="flex items-center justify-center sm:justify-start mt-2">
                          <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            <Check className="w-4 h-4 mr-1" />
                            Verified Account
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel Edit" : "Edit Profile"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>
                  {isEditing && (
                    <button
                      onClick={handleSaveProfile}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.firstName || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {user.firstName || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.lastName || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {user.lastName || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 pr-10">
                        {user.email}
                      </p>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {user.emailVerified ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Level
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.educationLevel || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            educationLevel: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select education level</option>
                        <option value="high-school">High School</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="postgraduate">Postgraduate</option>
                      </select>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
                        {user.educationLevel || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {user.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status & Quick Actions */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium text-gray-700">
                        Email Verification
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Pending"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium text-gray-700">
                        Profile Status
                      </span>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Profile Completion
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      85%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Universities Saved
                    </span>
                    <span className="text-sm font-medium text-gray-900">3</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="text-sm font-medium text-gray-900">1</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    View Saved Universities
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 mr-3" />
                    Account Settings
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mail className="w-5 h-5 mr-3" />
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && userId &&(
        <VerificationModal
          userId={user.id}
          email={user.email}
          onResendCode={handleResendVerification}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;