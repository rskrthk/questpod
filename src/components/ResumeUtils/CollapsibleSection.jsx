import React from "react";
import { ChevronDown, Sparkles, Trash2 } from "lucide-react";

const CollapsibleSection = ({
  title,
  children,
  isOpen,
  onToggle,
  isAiPowered,
  onDelete,
  itemLabel = "",
}) => {
  let displayTitle = title;
  if (itemLabel) {
    displayTitle = `${title} (${itemLabel})`;
  }

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div
        className="flex justify-between items-center py-4 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex justify-between items-center gap-2">
          {/* Add flex-grow to this div so it expands and pushes other items */}
          <div className="truncate flex-grow max-w-sm">
            <h2 className="text-base truncate font-semibold text-gray-800">
              {displayTitle}
            </h2>
          </div>

          {isAiPowered && (
            <div className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
              {/* Add flex-shrink-0 to prevent this from compressing */}
              <Sparkles size={12} /> <span> AI-powered</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <Trash2
              size={16}
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggling the section when delete is clicked
                onDelete();
              }}
            />
          )}
          <ChevronDown
            size={20}
            className={`text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="pb-4 px-4 bg-white rounded-b-lg">{children}</div>
      )}
    </div>
  );
};

export default CollapsibleSection;
