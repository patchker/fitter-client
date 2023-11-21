import logo from './logo.svg';
import './App.css';
import HomePage from "./pages/HomePage/HomePage"
import "./"
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import Header from './pages/HomePage/Header';
import Footer from './pages/HomePage/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UserProfile from "./pages/Profile/UserProfile";
import Dashboard from "./pages/HomePage/Dashboard";
import PurchaseComponent from "./pages/Payment/PurchaseComponent";
import Dieta from "./pages/Dieta/Dieta";
import PurchaseDiet from "./pages/Dieta/PurchaseDiet";
import SuccessPage from "./pages/Payment/SuccessPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import { PaymentProvider } from './contexts/PaymentContext';
import OrderList from "./pages/DietMaker/OrderList";
import DietCalendar from "./pages/DietCalendar/DietCalendar";
import withAuthProtection from "./config/withAuthProtection";
import RecipeDetail from "./pages/Recipes/RecipeDetail";
import DietMaker from "./pages/DietMaker/DietMaker";
import UserList from "./pages/DietMaker/UserList";
import DietConfig from "./pages/DietCalendar/DietConfig";
import Body from "./pages/Body/Body";
import AddTraining from "./pages/Body/AddTraining";
import { OrderProvider } from './contexts/orderPlacedContext';
import ActualMeasurements from './pages/Body/components/ActualMeasurements';
import AddMeasurement from './pages/Body/components/AddMeasurement';
import Trainings from './pages/Body/components/Trainings';

const ProtectedDietCalendar = withAuthProtection(DietCalendar);
const ProtectedOrderList = withAuthProtection(OrderList);
const ProtectedPurchaseDiet = withAuthProtection(PurchaseDiet);
const ProtectedPaymentPage = withAuthProtection(PaymentPage);
const ProtectedSuccessPage = withAuthProtection(SuccessPage);
const ProtectedUserProfile = withAuthProtection(UserProfile);
const ProtectedRecipeDetail = withAuthProtection(RecipeDetail);
const ProtectedDietMaker = withAuthProtection(DietMaker);
const ProtectedUserList = withAuthProtection(UserList);
const ProtectedDietConfig = withAuthProtection(DietConfig);
const ProtectedBody = withAuthProtection(Body);
const ProtectedAddTraining = withAuthProtection(AddTraining);
const ProtectedActualMeasurements = withAuthProtection(ActualMeasurements);
const ProtectedAddMeasurement = withAuthProtection(AddMeasurement);
const ProtectedTrainings = withAuthProtection(Trainings);
//const [orderPlaced, setOrderPlaced] = useState(false);

function App() {
  return (
    <div className="App">
      <Router>

        <div className="min-h-screen flex flex-col font-poppins">
          <OrderProvider>

          <Header/>
          <div className="mb-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/UserProfile" element={<ProtectedUserProfile />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/purchasecomponent" element={<PurchaseComponent />} />
            <Route path="/Dieta" element={<PaymentProvider><Dieta /></PaymentProvider> } />
            <Route path="/PaymentPage" element={<PaymentProvider><ProtectedPaymentPage /></PaymentProvider>} />
            <Route path="/SuccessPage" element={<ProtectedSuccessPage />} />
            <Route path="/OrderList" element={<ProtectedOrderList />} />
            <Route path="/UserList" element={<ProtectedUserList />} />
            <Route path="/DietCalendar" element={<ProtectedDietCalendar />} />
            <Route path="/dietmaker/:nick" element={<ProtectedDietMaker />} />
            <Route path="/PurchaseDiet/:planType" element={<PaymentProvider><ProtectedPurchaseDiet /></PaymentProvider>} />
            <Route path="/recipe/:id" element={<ProtectedRecipeDetail />} />
            <Route path="/dietconfig" element={<ProtectedDietConfig />} />
            <Route path="/body" element={<ProtectedBody />} />
            <Route path="/addtraining" element={<ProtectedAddTraining />} />
            <Route path="/addmeasurement" element={<ProtectedAddMeasurement />} />
            <Route path="/body/measurements" element={<ProtectedActualMeasurements />} />
            <Route path="/trainings" element={<ProtectedTrainings />} />


          </Routes>
          </div>

          <Footer />
          </OrderProvider>

        </div>
      </Router>
    </div>
  );
}

export default App;
