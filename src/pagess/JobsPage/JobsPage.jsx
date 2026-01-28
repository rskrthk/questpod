"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicJobs } from "@/redux/slices/jobSlice";
import Layout from "@/components/Layout/Layout";
import { Briefcase, Clock, IndianRupee, Building2, CheckCircle2 } from "lucide-react";
import moment from "moment";

import { useRouter } from "next/navigation";
import withAuth from "@/middleware/withAuth";

function JobsPage() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.job);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchPublicJobs());
  }, [dispatch]);

  const handleCardClick = (id) => {
    router.push(`/jobs/${id}`);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Latest Jobs</h1>
            <p className="text-gray-500 mt-2">Find your dream job from top companies</p>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => handleCardClick(job.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(JobsPage, ["user"]);

function JobCard({ job, onClick }) {
  const skillsList = job.skills ? job.skills.split(',').map(s => s.trim()) : [];
  const displaySkills = skillsList.slice(0, 3);
  const extraSkills = skillsList.length > 3 ? skillsList.slice(3) : [];

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
            {job.companyIcon ? (
              <img src={job.companyIcon} alt={job.company} className="h-full w-full object-contain" />
            ) : (
              <Building2 className="text-gray-400" size={24} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{job.title}</h3>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{job.company}</span>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <span>{job.location}</span>
                <span>•</span>
                <span>Posted {moment(job.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors whitespace-nowrap">
          <CheckCircle2 size={14} />
          Quick Apply
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase size={16} className="text-gray-400" />
          <span className="text-sm">{job.experience ? `${job.experience} Experience` : "Experience not specified"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <IndianRupee size={16} className="text-gray-400" />
          <span className="text-sm">{job.salary || "Not specified"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} className="text-gray-400" />
          <span className="text-sm">{job.noticePeriod ? `${job.noticePeriod} Notice Period` : "Immediate Joiner"}</span>
        </div>
         <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold">
                {job.type}
            </span>
        </div>
      </div>

      {skillsList.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <span className="text-gray-400">⚙️</span>
            <span>Must have expert skills:</span>
            {displaySkills.map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    {skill}
                </span>
            ))}
          </div>
           {extraSkills.length > 0 && (
             <div className="flex flex-wrap gap-2 mt-1 pl-7">
                 {extraSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                        {skill}
                    </span>
                 ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
}
