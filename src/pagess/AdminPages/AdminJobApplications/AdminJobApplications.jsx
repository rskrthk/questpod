"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import LightTable from "@/components/FormComponents/TableField";
import withAuth from "@/middleware/withAuth";
import axios from "axios";
import { Eye, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/lib/dialog";
import toast from "react-hot-toast";

const STAGES = [
  "Resume Sent to Company",
  "Resume Shortlist",
  "Company Interview Process",
  "To be offered",
  "Offer Received",
  "Offer Accepted"
];

function AdminJobApplications({ id }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`/api/admin/job/${id}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post("/api/admin/application/update-status", {
        applicationId: appId,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Status updated");
      fetchApplications(); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: "Applicant",
      accessorKey: "user.name",
    },
    {
      header: "Email",
      accessorKey: "user.email",
    },
    {
      header: "Applied Date",
      accessorKey: "createdAt",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <select
          value={info.getValue()}
          onChange={(e) => updateStatus(info.row.original.id, e.target.value)}
          className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
        >
          {STAGES.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() => openDetails(info.row.original)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          {info.row.original.user?.resume && (
             <a 
               href={`/api/view-file?userId=${info.row.original.userId}`} 
               target="_blank" 
               rel="noreferrer"
               className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
               title="View Resume"
             >
                <FileText size={18} />
             </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="w-full max-w-8xl mx-auto min-h-screen bg-gray-100 text-gray-800 p-4">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Job Applications</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <LightTable columns={columns} data={applications} title="" />
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Details for {selectedApp?.user?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
               <div>
                 <h4 className="font-medium text-gray-900">Custom Questions & Answers</h4>
                 {selectedApp?.answers ? (
                   <div className="mt-2 space-y-3 bg-gray-50 p-4 rounded-lg">
                      {(() => {
                        try {
                          const answers = JSON.parse(selectedApp.answers);
                          
                          if (Array.isArray(answers)) {
                            return answers.map((item, idx) => (
                              <div key={idx}>
                                <p className="text-sm font-medium text-gray-700">{item.question}</p>
                                <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
                              </div>
                            ));
                          }
                          
                          return Object.entries(answers).map(([q, a], idx) => (
                            <div key={idx}>
                              <p className="text-sm font-medium text-gray-700">{q}</p>
                              <p className="text-sm text-gray-600 mt-1">{typeof a === 'object' ? JSON.stringify(a) : a}</p>
                            </div>
                          ));
                        } catch (e) {
                          console.error("Parse error:", e);
                          return <p className="text-sm text-red-500">Error parsing answers</p>;
                        }
                      })()}
                   </div>
                 ) : (
                   <p className="text-sm text-gray-500 mt-2">No custom questions answered.</p>
                 )}
               </div>
               
               {selectedApp?.user?.resume && (
                  <div className="mt-4">
                    <a 
                      href={`/api/view-file?userId=${selectedApp.userId}`}
                      target="_blank"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <FileText size={16} /> View Resume
                    </a>
                  </div>
               )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminJobApplications, ["admin"]);
