"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, uploadUserResume } from "@/redux/slices/authSlice";
import Layout from "@/components/Layout/Layout";
import { User, FileText, Upload, Eye } from "lucide-react";
import toast from "react-hot-toast";
import withAuth from "@/middleware/withAuth";

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only PDF and Word documents are allowed");
        e.target.value = null; // Reset input
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await dispatch(uploadUserResume(formData)).unwrap();
      toast.success("Resume uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error(error || "Failed to upload resume");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-gray-500 mt-1 capitalize badge bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block text-sm font-medium">
                    {user?.role}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  Resume
                </h3>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  {user?.resume ? (
                    <div className="mb-6">
                      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-50 p-2 rounded-lg">
                            <FileText className="text-red-500" size={24} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.resumeName || "Uploaded Resume"}
                            </p>
                          </div>
                        </div>
                        <a 
                          href={user.resume}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </a>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Update your resume:</p>
                    </div>
                  ) : (
                    <div className="text-center mb-6">
                      <p className="text-gray-500 mb-2">You haven't uploaded a resume yet.</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer border border-gray-200 rounded-lg bg-white"
                    />
                    <button
                      onClick={handleUpload}
                      disabled={!file || loading}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                    >
                      {loading ? "Uploading..." : (
                        <>
                          <Upload size={18} />
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(ProfilePage, ["user"]);
