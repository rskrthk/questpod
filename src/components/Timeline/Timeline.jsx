import React from 'react';
import { 
  FileUp, 
  FileSearch, 
  Briefcase, 
  Mail, 
  PartyPopper, 
  Trophy 
} from 'lucide-react';

const STAGES = [
  {
    title: "Resume Sent to Company",
    description: "Your resume will be shared with the company",
    icon: FileUp
  },
  {
    title: "Resume Shortlist",
    description: "Company will be shortlisting your resume for interviews",
    icon: FileSearch
  },
  {
    title: "Company Interview Process",
    description: "Details will be unlocked after resume is shortlisted",
    icon: Briefcase
  },
  {
    title: "To be offered",
    description: "This is when you will negotiate your offer",
    icon: Mail
  },
  {
    title: "Offer Received",
    description: "When you receive an offer letter from the company",
    icon: PartyPopper
  },
  {
    title: "Offer Accepted",
    description: "Once you accept the offer received",
    icon: Trophy
  }
];

const Timeline = ({ currentStatus }) => {
  const currentIndex = STAGES.findIndex(s => s.title === currentStatus);
  // If status not found (e.g. "Applied"), default to index 0
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Application Status</h3>
      <div className="flex flex-col">
        {STAGES.map((stage, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;
          const isPending = index > activeIndex;

          let iconColor = "text-gray-300";
          if (isActive) iconColor = "text-blue-600";
          else if (isCompleted) iconColor = "text-blue-400";

          let titleColor = "text-gray-500";
          if (isActive) titleColor = "text-blue-700";
          else if (isCompleted) titleColor = "text-gray-900";

          return (
            <div key={index} className="flex gap-4 relative">
              {/* Line connector */}
              {index !== STAGES.length - 1 && (
                <div className={`absolute left-[15px] top-10 bottom-[-10px] w-0.5 border-l-2 border-dotted ${isCompleted ? 'border-blue-300' : 'border-gray-200'}`} />
              )}
              
              {/* Icon */}
              <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 ${isActive ? 'border-blue-600' : isCompleted ? 'border-blue-400' : 'border-gray-200'}`}>
                <stage.icon size={16} className={iconColor} />
              </div>

              {/* Content */}
              <div className="pb-8">
                <h4 className={`font-semibold text-base ${titleColor}`}>{stage.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
