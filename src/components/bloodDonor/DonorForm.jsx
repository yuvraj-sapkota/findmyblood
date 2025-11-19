import { Check, Heart, MapPin, Phone, Upload, Loader2 } from "lucide-react";
import React, { useState } from "react";

const DonorForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [identityPreview, setIdentityPreview] = useState(null);
  const [testPreview, setTestPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    bloodGroup: "",
    gender: "",
    contact: "",
    location: "",
    identityPhoto: null,
    testDocument: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      setFormData((prev) => ({ ...prev, [name]: file }));

      // Generate preview
      if (name === "identityPhoto") {
        setIdentityPreview(URL.createObjectURL(file));
      }
      if (name === "testDocument") {
        setTestPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("age", formData.age);
      payload.append("bloodGroup", formData.bloodGroup);
      payload.append("gender", formData.gender);
      payload.append("contact", formData.contact);
      payload.append("location", formData.location);

      if (formData.identityPhoto) {
        payload.append("identityPhoto", formData.identityPhoto);
      }
      if (formData.testDocument) {
        payload.append("testDocument", formData.testDocument);
      }

      const response = await fetch(
        "https://findmyblood.onrender.com/api/donors",
        {
          method: "POST",
          body: payload,
        }
      );

      console.log(response);
      if (response.ok) {
        setShowPopup(true);
        setSubmitted(true);

        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            fullName: "",
            age: "",
            bloodGroup: "",
            gender: "",
            contact: "",
            location: "",
            identityPhoto: null,
            testDocument: null,
          });
          setIdentityPreview(null);
          setTestPreview(null);
        }, 2000);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-linear-to-r from-red-600 to-pink-600 px-8 py-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-3">
              Register as a Donor
            </h2>
            <p className="text-red-50 text-lg">
              Fill out the form below to join our life-saving community
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="65"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="18-65 years"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="+00977 9827451382"
                />
              </div>
            </div>

            {/* LOCATION */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Location *
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-32 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="City, State or Use Live Location"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="absolute right-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-700 transition"
                >
                  Use Current Location
                </button>
              </div>
            </div>

            {/* IDENTITY PHOTO */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Photo of Identity (ID Card/Passport) *
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-500 transition-colors">
                <input
                  type="file"
                  name="identityPhoto"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center pointer-events-none">
                  {identityPreview ? (
                    <img
                      src={identityPreview}
                      className="w-32 h-32 object-cover mx-auto rounded-xl mb-3"
                      alt="Preview"
                    />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  )}

                  <p className="text-gray-600 font-medium">
                    {formData.identityPhoto
                      ? formData.identityPhoto.name
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* TEST DOCUMENT */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">
                Blood Group Test Document (Optional)
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-500 transition-colors">
                <input
                  type="file"
                  name="testDocument"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center pointer-events-none">
                  {testPreview ? (
                    <img
                      src={testPreview}
                      className="w-32 h-32 object-cover mx-auto rounded-xl mb-3"
                      alt="Preview"
                    />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  )}

                  <p className="text-gray-600 font-medium">
                    {formData.testDocument
                      ? formData.testDocument.name
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading || submitted}
              className={`w-full bg-linear-to-r from-red-600 to-pink-600 text-white font-bold py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3
  ${
    loading || submitted
      ? "opacity-60 cursor-not-allowed hover:scale-100"
      : "hover:from-red-700 hover:to-pink-700"
  }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Submitting...
                </>
              ) : submitted ? (
                <>
                  <Check className="w-6 h-6" />
                  Registration Submitted Successfully!
                </>
              ) : (
                <>
                  <Heart className="w-6 h-6" fill="currentColor" />
                  Register as Donor
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center animate-fadeIn">
            <Check className="w-14 h-14 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Request Submitted 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              Your donor registration request has been submitted.
              <br />
              Please wait for approval.
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl w-full font-semibold hover:bg-red-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DonorForm;
