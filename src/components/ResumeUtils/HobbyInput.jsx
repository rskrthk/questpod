import React, { useState, useRef, useEffect } from "react";

const HobbyInput = ({ hobbies = [], onHobbiesChange, label, placeholder }) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();

  const allSuggestions = [
    //  Creative & Artistic
    "Drawing",
    "Sketching",
    "Painting",
    "Digital Art",
    "Calligraphy",
    "Tattoo Designing",
    "Graffiti",
    "Photography",
    "Street Photography",
    "Film Photography",
    "Videography",
    "Drone Photography",
    "Video Editing",
    "Graphic Design",
    "Animation",
    "Illustration",
    "3D Art",
    "Fashion Illustration",
    "Interior Designing",
    "Fashion Styling",
    "Scrapbooking",
    "Origami",
    "Sculpting",
    "Resin Art",
    "Makeup Artistry",
    "Nail Art",
    "Crafting with Cricut",
    "Watercolor Art",

    //  Performing Arts & Music
    "Singing",
    "Karaoke",
    "Dancing",
    "Bharatanatyam",
    "Hip Hop Dance",
    "Playing Guitar",
    "Playing Piano",
    "Playing Drums",
    "Playing Violin",
    "Beatboxing",
    "Music Production",
    "DJing",
    "Listening to Music",
    "Rapping",
    "Acting",
    "Theatre",
    "Stand-up Comedy",
    "Voice Acting",
    "Lip Syncing",

    //  Writing & Reading
    "Creative Writing",
    "Blogging",
    "Journaling",
    "Script Writing",
    "Storytelling",
    "Poetry",
    "Reading Fiction",
    "Reading Non-fiction",
    "Book Reviews",
    "Academic Research",
    "Copywriting",
    "Technical Writing",
    "Resume Building",
    "Writing on Medium",
    "Writing Fanfiction",
    "Bullet Journaling",
    "Comic Book Writing",

    //  Gaming & Puzzles
    "Online Gaming",
    "Console Gaming",
    "Mobile Gaming",
    "Game Development",
    "VR Gaming",
    "Board Games",
    "Card Games",
    "Chess",
    "Sudoku",
    "Crossword Puzzles",
    "Rubik’s Cube",
    "Brain Teasers",
    "Dungeons & Dragons",
    "Escape Rooms",
    "Speed Cubing",

    //  Tech & Digital
    "Programming",
    "Web Development",
    "App Development",
    "Open Source Contribution",
    "Cybersecurity",
    "Ethical Hacking",
    "Robotics",
    "AI/ML Projects",
    "Blockchain",
    "Data Analysis",
    "Game Development",
    "Tech Blogging",
    "UI/UX Design",
    "3D Printing",
    "Electronics DIY",
    "Web3 Exploration",
    "API Integration",
    "Arduino Projects",
    "Typing Speed Practice",
    "Automation Scripting",

    //  Career & Productivity
    "Project Management",
    "Networking",
    "Resume Design",
    "Mock Interviews",
    "LinkedIn Optimization",
    "Startup Pitching",
    "Entrepreneurship",
    "Side Hustles",
    "Freelancing",
    "Financial Planning",
    "Business Branding",
    "Market Research",
    "Cold Emailing",
    "Job Hunting",
    "Creating Portfolios",
    "Online Mentorship",

    //  Academic & Competitive
    "MUN (Model United Nations)",
    "Debating",
    "Public Speaking",
    "Quizzing",
    "Olympiads",
    "Hackathons",
    "Business Case Solving",
    "Online Courses",
    "E-Learning",
    "Teaching Juniors",
    "Mentoring",
    "Student Leadership",
    "Organizing College Fests",
    "Campus Ambassador Work",
    "Writing Research Papers",
    "Internship Hunting",
    "Certification Courses",
    "Startup Incubation",

    //  Wellness & Self-Development
    "Yoga",
    "Meditation",
    "Journaling",
    "Fitness",
    "Gym Workouts",
    "Running",
    "Zumba",
    "Diet Planning",
    "Life Coaching",
    "Mind Mapping",
    "Therapy Sessions",
    "Minimalism",
    "Gratitude Journaling",
    "Breathwork",
    "Sun Gazing",
    "Ice Bathing",
    "Digital Detoxing",
    "Habit Tracking",
    "Sleep Optimization",

    //  Sports & Outdoor
    "Swimming",
    "Cricket",
    "Football",
    "Basketball",
    "Volleyball",
    "Badminton",
    "Table Tennis",
    "Skating",
    "Martial Arts",
    "Archery",
    "Cycling",
    "Trekking",
    "Hiking",
    "Rock Climbing",
    "Adventure Sports",
    "Camping",
    "Nature Walks",
    "Bird Watching",
    "Astrophotography",
    "Kayaking",
    "Running Marathons",

    //  Travel & Culture
    "Traveling",
    "Solo Traveling",
    "Backpacking",
    "Exploring Cafes",
    "Food Tasting",
    "Cultural Festivals",
    "Language Learning",
    "Sign Language",
    "Cultural Exchange",
    "World History",
    "Visiting Museums",
    "Foreign Languages",
    "Travel Photography",
    "Virtual Tours",
    "Homestays & Hostels",
    "Trying Local Street Food",

    // DIY & Homemaking
    "Cooking",
    "Baking",
    "Meal Planning",
    "Gardening",
    "Pet Training",
    "Interior Decor",
    "Soap Making",
    "Candle Making",
    "Jewelry Making",
    "Furniture Building",
    "Upcycling",
    "Home Automation DIY",
    "Meal Prepping",
    "Minimalist Organizing",
    "Cleaning Routines",
    "Home Renovation Planning",

    //  Social & Community
    "Volunteering",
    "Fundraising",
    "Blood Donation Camps",
    "Community Cleanups",
    "Event Planning",
    "Hosting Podcasts",
    "Student Clubs",
    "Social Media Management",
    "NGO Participation",
    "Animal Rescue",
    "Mental Health Advocacy",
    "Public Awareness Campaigns",
    "Debate Moderation",

    //  Media & Content Creation
    "YouTube Content Creation",
    "Vlogging",
    "Podcasting",
    "Streaming on Twitch",
    "Instagram Reels",
    "Short Film Making",
    "Influencer Marketing",
    "Editing Memes",
    "Newsletter Writing",
    "Reel Editing",
    "TikTok Trends",
    "Creating Course Videos",
    "Building Online Audience",

    //  Professional & Learning
    "Stock Trading",
    "Crypto Analysis",
    "UI/UX Research",
    "Business Analytics",
    "Excel Modeling",
    "Portfolio Management",
    "LinkedIn Content Creation",
    "No-Code Tools",
    "Product Management",
    "Growth Hacking",
    "Business Podcasts",
    "Slide Deck Creation",
    "Notion Building",
    "Figma Prototyping",

    //  Lifestyle & Interests
    "Fashion Blogging",
    "Thrifting",
    "Astrology",
    "Tarot Reading",
    "Learning Spirituality",
    "Pet Sitting",
    "Board Game Hosting",
    "Event Photography",
    "Interior Styling",
    "Time Management",
    "Digital Planning",
    "Skincare Routines",
    "Decorating Workspaces",
    "Cafe Hopping",
    "Bucket List Planning",

    "Karate",
    "Kung Fu",
    "Taekwondo",
    "Judo",
    "Jiu-Jitsu",
    "Krav Maga",
    "Muay Thai",
    "Capoeira",
    "Aikido",
    "Kalaripayattu",
    "Wrestling",
    "Kickboxing",

    // Intellectual/Skill-Based
    "Speed Reading",
    "Philosophy Debates",
    "Learning Chess Tactics",
    "Public Speaking Contests",
    "Spelling Bees",
    "Cryptic Crossword Solving",
    "Scientific Journaling",
    "Document Analysis",
    "Historical Reenactment",
    "Data Visualization Projects",

    // Technical/Engineering
    "PCB Design",
    "IoT Projects",
    "CAD Modeling",
    "Raspberry Pi Projects",
    "MATLAB Simulations",
    "Drone Programming",
    "Home Server Building",
    "Network Configuration",
    "Linux Customization",
    "Algorithm Optimization",

    // Sustainability & Eco-Friendly
    "Composting",
    "Urban Farming",
    "Zero Waste Living",
    "Sustainable Fashion",
    "Solar Panel DIY",
    "Eco Art",
    "Eco-Bricking",
    "Recycled Craftwork",
    "Seed Saving",
    "Tree Planting",

    // Advanced Content Creation
    "Cinematography",
    "Voice Over Dubbing",
    "Foley Sound Creation",
    "Interview Hosting",
    "Documentary Creation",
    "Drone Videography",
    "Instagram Aesthetic Planning",
    "B-Roll Collection",
    "Stop Motion Animation",
    "Editing Transitions",

    // Collection & Exploration
    "Coin Collecting",
    "Stamp Collecting",
    "Fossil Hunting",
    "Antique Restoration",
    "Puzzle Building",
    "Geocaching",
    "Cave Exploring",
    "Urban Exploration",
    "Vintage Tech Repair",
    "Metal Detecting",
  ];

  const handleAddHobby = (hobby) => {
    const trimmed = hobby.trim();
    if (trimmed && !hobbies.includes(trimmed)) {
      onHobbiesChange([...hobbies, trimmed]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemoveHobby = (hobbyToRemove) => {
    const updated = hobbies.filter((h) => h !== hobbyToRemove);
    onHobbiesChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHobby(inputValue);
    }
  };

  const filteredSuggestions = allSuggestions
    .filter(
      (s) =>
        s.toLowerCase().includes(inputValue.toLowerCase()) &&
        !hobbies.includes(s)
    )
    .slice(0, 8); // Show top 8 max

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={inputRef} className="relative w-full">
      {/* Selected Hobby Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {hobbies.map((hobby, index) => (
          <span
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {hobby}
            <button
              type="button"
              onClick={() => handleRemoveHobby(hobby)}
              className="ml-2 text-blue-600 hover:text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-auto text-sm">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleAddHobby(suggestion)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HobbyInput;
