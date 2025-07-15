import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn,ChevronDown, Edit2, Settings, TrendingUp } from "lucide-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RetailerHelp = () => {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const helpSections = [
    {
      title: "Login as Retailer",
      icon: <LogIn size={24} />,
      content:
        "Retailers should use the dedicated retailer login page to access the management dashboard. Ensure you have the correct credentials.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Change Shelf Names",
      icon: <Edit2 size={24} />,
      content:
        "Easily update shelf names to match your inventory. Go to the shelf management section and edit the names to reflect current product offerings.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "CRUD Operations on Shelf Items",
      icon: <Settings size={24} />,
      content:
        "Perform Create, Read, Update, and Delete operations on the items in each shelf. This ensures that your inventory is always up-to-date.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Track Store Progress",
      icon: <TrendingUp size={24} />,
      content:
        "Monitor your store's performance by checking the revenue dashboard. Track total sales, stock levels, and overall progress easily.",
      image: "/placeholder.svg?height=200&width=350",
    },
  ];

  return (
    <div className=" mx-auto py-8 px-4 relative">
      {/* Rounded Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center bg-white text-blue-900 rounded-full shadow-lg hover:bg-gray-200"
      >
        <ArrowBackIcon />
      </button>

      <div className="text-center mb-6 mt-8 md:mt-0">
        <h1 className="text-5xl font-bold mb-6">How to Use the Retailer App</h1>
        <p className="text-gray-600 mb-10">
          Follow this guide to manage your store and shelves effectively.
        </p>
      </div>

      <div>
        {helpSections.map((section, index) => (
          <div key={index} className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
            <button 
              onClick={() => toggleSection(index)} 
              className="w-full flex items-center justify-between p-4 bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 p-3 rounded-full flex items-center justify-center w-10 h-10">
                  {section.icon}
                </div>
                <h2 className="text-lg font-medium">{section.title}</h2>
              </div>
              <ChevronDown size={24} className={openSection === index ? "rotate-180" : ""} />
            </button>
            {openSection === index && (
              <div className="p-4 bg-white grid md:grid-cols-2 gap-3">
                <p className="text-gray-700">{section.content}</p>
                <div className="flex justify-center">
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="max-w-full h-auto rounded border border-gray-300" 
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-100 mt-6 text-center rounded-lg">
        <h3 className="text-xl font-semibold">Need More Help?</h3>
        <p className="text-gray-700">
          If you have any questions or need additional assistance, please contact our support team.
        </p>
        <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-md">Contact Support</button>
      </div>
    </div>
  );
};

export default RetailerHelp;
