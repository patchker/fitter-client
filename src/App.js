import logo from './logo.svg';
import './App.css';
import HomePage from "./pages/HomePage/HomePage"
import "./"
import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
import { AuthProvider } from './contexts/AuthContext';
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
import Ingredients from "./pages/DietCalendar/components/Ingredients";
import MealAI from "./pages/DietCalendar/MealAI";
import Confirm from './pages/Register/Confirm';
import { BrowserRouter } from 'react-router-dom';

import { TrainingProvider } from './contexts/TrainingContext';


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
const ProtectedIngredients = withAuthProtection(Ingredients);
//const [orderPlaced, setOrderPlaced] = useState(false);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const password = localStorage.getItem('password');
    if (password === 'inz') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (enteredPassword) => {
    if (enteredPassword === 'inz') {
      localStorage.setItem('password', enteredPassword);
      setIsAuthenticated(true);
    } else {
      alert('Nieprawidłowe hasło!');
    }
  };

  if (!isAuthenticated) {
    return <Login2 onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Helmet>
        <title>Fitter</title>
      </Helmet>
      <Router basename="/works/fitter">


        <div className="min-h-screen flex flex-col font-poppins">
          <OrderProvider>
            <TrainingProvider>

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
            <Route path="/dieteditor/:nick" element={<ProtectedDietMaker />} />
            <Route path="/PurchaseDiet/:planType" element={<PaymentProvider><ProtectedPurchaseDiet /></PaymentProvider>} />
            <Route path="/recipe/:id" element={<ProtectedRecipeDetail />} />
            <Route path="/dietconfig" element={<ProtectedDietConfig />} />
            <Route path="/body" element={<ProtectedBody />} />

            <Route path="/addtraining" element={<ProtectedAddTraining />} />
              <Route path="/trainings" element={<ProtectedTrainings />} />

            <Route path="/verify/:token" element={<Confirm/>} />

            <Route path="/addmeasurement" element={<ProtectedAddMeasurement />} />
            <Route path="/body/measurements" element={<ProtectedActualMeasurements />} />
            <Route path="/ingredients" element={<ProtectedIngredients />} />
            <Route path="/mealai" element={<MealAI />} />


          </Routes>
          </div>

          <Footer />
            </TrainingProvider>

          </OrderProvider>

        </div>
      </Router>
    </div>
  );
}
function Login2({ onLogin }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(password);
  };

  return (
      <div className="flex justify-center items-center mt-40">
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div className="flex flex-col items-center mb-6">
            <span className="font-masque text-6xl mb-2">FITTER</span>
            <span>Autoryzacja</span>
          </div>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-200 rounded w-full p-2 mb-4"
          />
          <button
              type="submit"
              className="w-full bg-emerald-500 px-3 py-1 rounded text-white font-semibold"
          >
            Wejdź
          </button>
        </form>
      </div>
  );

}
export default App;
