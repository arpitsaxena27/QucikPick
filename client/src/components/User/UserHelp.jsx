import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Store, Map, ShoppingCart, Navigation, CreditCard, ChevronDown } from "lucide-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const HelpPage = () => {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const helpSections = [
    {
      title: "Login to Your Account",
      icon: <LogIn size={24} />, 
      content:
        "Start by logging into your account. If you don't have an account yet, you can create one by clicking on the 'Sign Up' button on the login page.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Select a Mart",
      icon: <Store size={24} />, 
      content:
        "After logging in, you'll be prompted to select a Walmart mart location. Choose the mart you're currently at or planning to visit.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Navigate the Mart Map",
      icon: <Map size={24} />, 
      content:
        "Once you select a mart, the MartMap component will open, showing you a top-view layout of the store. This map displays all shelves and sections in the store.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Explore Shelves",
      icon: <Navigation size={24} />, 
      content:
        "Tap on any shelf display on the map to see a list of items available in that section. This helps you discover what products are available in each area of the store.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Find the Shortest Path",
      icon: <Navigation size={24} />, 
      content:
        "When you click on a specific item, the app will display the shortest path from your current position to the shelf containing that item. Follow the highlighted path to easily find your item.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Add Items to Cart",
      icon: <ShoppingCart size={24} />, 
      content:
        "After finding and taking an item from the shelf, you can add it to your cart by clicking the 'Add to Cart' button. You can view all items in your cart at any time by clicking on the cart icon.",
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Checkout and Payment",
      icon: <CreditCard size={24} />, 
      content:
        "When you're done shopping, proceed to checkout. You can pay for your items using various online payment methods available in the app.",
      image: "/placeholder.svg?height=200&width=350",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center bg-white text-blue-900 rounded-full shadow-lg hover:bg-gray-200"
      >
        <ArrowBackIcon></ArrowBackIcon>
      </button>
      <div className="text-center mb-6 mt-8">
        <h1 className="text-5xl font-bold mb-6">How to Use Our App</h1>
        <p className="text-gray-600 mb-10">Follow this step-by-step guide to navigate our store and find items with ease.</p>
      </div>
      <div>
        {helpSections.map((section, index) => (
          <div key={index} className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={() => toggleSection(index)} className="w-full flex items-center justify-between p-4 bg-gray-100">
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
                  <img src={section.image} alt={section.title} className="max-w-full h-auto rounded border border-gray-300" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-6 bg-gray-100 mt-6 text-center rounded-lg">
        <h3 className="text-xl font-semibold">Need More Help?</h3>
        <p className="text-gray-700">If you have any questions or need additional assistance, please don&apos;t hesitate to contact our support team.</p>
        <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-md">Contact Support</button>
      </div>
    </div>
  );
};

export default HelpPage;