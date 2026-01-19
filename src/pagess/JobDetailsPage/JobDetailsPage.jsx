"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicJobById, clearCurrentJob } from "@/redux/slices/jobSlice";
import Layout from "@/components/Layout/Layout";
import { 
  Briefcase, 
  Clock, 
  IndianRupee, 
  Building2, 
  MapPin, 
  Bookmark, 
  AlertTriangle,
  X
} from "lucide-react";
import moment from "moment";
import parse from "html-react-parser";
import FullScreenLoader from "@/lib/FullScreenLoader";
import Link from "next/link";

export default function JobDetailsPage({ id }) {
  const dispatch = useDispatch();
  const { currentJob, loading, error } = useSelector((state) => state.job);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (id) {
      dispatch(fetchPublicJobById(id));
    }
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob?.expireIn) {
      const timer = setInterval(() => {
        const now = moment();
        const expiration = moment(currentJob.expireIn);
        const duration = moment.duration(expiration.diff(now));

        if (duration.asMilliseconds() <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0 });
          clearInterval(timer);
        } else {
          setTimeLeft({
            days: Math.floor(duration.asDays()),
            hours: duration.hours(),
            minutes: duration.minutes(),
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentJob]);

  if (loading) return <FullScreenLoader />;
  if (error) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    </Layout>
  );
  if (!currentJob) return null;

  const skillsList = currentJob.skills ? currentJob.skills.split(',').map(s => s.trim()) : [];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex gap-6 w-full">
                <div className="h-20 w-20 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden flex-shrink-0">
                  {currentJob.companyIcon ? (
                    <img src={currentJob.companyIcon} alt={currentJob.company} className="h-full w-full object-contain" />
                  ) : (
                    <Building2 className="text-gray-400" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentJob.title}</h1>
                      <div className="text-gray-600 mb-1 font-medium">{currentJob.company}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        <span>{currentJob.location}</span>
                        <span>•</span>
                        <span>Posted {moment(currentJob.createdAt).fromNow()}</span>
                      </div>
                    </div>
                    
                    {/* Countdown Timer */}
                    {currentJob.expireIn && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm whitespace-nowrap">
                        <span>The job will expire in</span>
                        <div className="flex gap-1 font-mono text-red-600 font-semibold">
                          <span className="px-2 py-1 bg-red-50 rounded border border-red-100">{timeLeft.days} days</span>
                          <span>:</span>
                          <span className="px-2 py-1 bg-red-50 rounded border border-red-100">{timeLeft.hours} hrs</span>
                          <span>:</span>
                          <span className="px-2 py-1 bg-red-50 rounded border border-red-100">{timeLeft.minutes} min</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase className="text-gray-400" size={20} />
                <span className="font-medium">{currentJob.experience ? `${currentJob.experience} Experience` : "Experience not specified"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <IndianRupee className="text-gray-400" size={20} />
                <span className="font-medium">{currentJob.salary || "(Flexible)"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="text-gray-400" size={20} />
                <span className="font-medium">{currentJob.noticePeriod ? `${currentJob.noticePeriod} Notice Period` : "Immediate"}</span>
              </div>
              <div>
                 <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-sm font-semibold">
                    {currentJob.type}
                 </span>
              </div>
            </div>

            {skillsList.length > 0 && (
                <div className="mt-8 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-xl">⚙️</span>
                        <span className="font-medium">Must have expert skills:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-4">
                    {currentJob.applicationLink && (
                        <a 
                            href={currentJob.applicationLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Now
                        </a>
                    )}
                    <button className="px-6 py-2.5 border border-blue-200 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                        <X size={18} />
                        Not Interested
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700">
                        <AlertTriangle size={16} className="text-yellow-500" />
                        Report Content Issue
                    </button>
                </div>
                <button className="flex items-center gap-2 text-gray-600 font-medium hover:text-blue-600">
                    <Bookmark size={20} />
                    Save Job
                </button>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-6 border-b border-gray-100 pb-4">Job Description</h2>
            
            <div className="prose max-w-none text-gray-700 space-y-6">
               {/* Role Overview */}
               <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 underline decoration-blue-200 underline-offset-4">Role Overview:</h3>
                  {currentJob.description ? (
                      <div className="job-description-content">
                          {parse(currentJob.description)}
                      </div>
                  ) : (
                      <p>No description available.</p>
                  )}
               </div>

               {/* Requirements */}
               {currentJob.requirements && (
                   <div className="mt-8">
                       <h3 className="text-lg font-bold text-gray-900 mb-3 underline decoration-blue-200 underline-offset-4">Key Requirements & Responsibilities:</h3>
                       <div className="job-requirements-content">
                           {parse(currentJob.requirements)}
                       </div>
                   </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
