import {Routes,Route} from "react-router-dom"
import HomePage from "../components/Homepage";
import MartInfo from "../components/User/MartInfo";
import Marts from "../components/User/Marts";
import UserLoginPage from "../components/User/UserLoginPage";
import RetailLoginPage from "../components/Retailer/RetailLoginPage";  
import RetailerMap from "../components/Retailer/RetailerMap";
import Revenue from "../components/Retailer/Revenue";
import RetailerHelp from "../components/Retailer/RetailerHelp";
import UserHelp from "../components/User/UserHelp";
import Checkout from "../components/User/Checkout";
import LandingPage from "../components/LandingPage";
import PaymentSuccess from "../components/User/PaymentSucess";

function Customroute() {
    return (
        <Routes>
          <Route path="/lp" element={<LandingPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/retail-login" element={<RetailLoginPage />} />   
          <Route path="/mart" element={<Marts />} />
          <Route path="/MartInfo" element={<MartInfo />} />
          <Route path="/retailer-map" element={<RetailerMap />} />
          <Route path="/revenue" element={<Revenue></Revenue>} />
          <Route path="/retailer-help" element={<RetailerHelp></RetailerHelp>} />
          <Route path="/user-help" element={<UserHelp></UserHelp>} />
          <Route path="/checkout" element={<Checkout></Checkout>} />
          <Route path="/payment-success" element={<PaymentSuccess></PaymentSuccess>} />
        </Routes>
    );
  }
export default Customroute;