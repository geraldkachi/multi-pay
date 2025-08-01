
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from "./pages/home/Home"
// import Profile from './pages/profile/Profile';
// import Settings from './pages/settings/Settings';
// import TransactionReferences from './pages/home/TransactionId';
// import PaymentsReview from './pages/home/PaymentsReview';
// import MakePayment from './pages/home/MakePayment';
// // import './App.css'
// // Create a NotFound component
// function NotFound() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-4xl font-bold text-red-600">404</h1>
//       <p className="text-xl mt-4">Page Not Found</p>
//       <a 
//         href="/" 
//         className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//       >
//         Return Home
//       </a>
//     </div>
//   );
// }
// function App() {

//   return (
//     <>
//      <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         {/* <Route path="/transaction-references" element={<TransactionReferences />} /> */}
//         <Route path="/:id" element={<TransactionReferences />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/settings" element={<Settings />} />
//         <Route path="/payment-batch-review" element={<PaymentsReview />} />
//         <Route path="/make-payment" element={<MakePayment />} />

//         {/* <Route path="/about" element={<About />} /> */}
//         {/* Add more routes as needed */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//     </>
//   )
// }

// export default App



import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TransactionReferences from './pages/home/TransactionId';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import PaymentsReview from './pages/home/PaymentsReview';
import MakePayment from './pages/home/MakePayment';
import { Toaster } from './components/ui/toaster';
// import ServicePortal from './pages/home/ServicePortal'; // You'll need to create this if it doesn't exist

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <a 
        href="/" 
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Return Home
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
    <Toaster />
      <Routes>
        {/* Main route is now TransactionReferences */}
        <Route path="/" element={<TransactionReferences />} />
        
        {/* Service selection portal */}
        {/* <Route path="/select-service" element={<ServicePortal />} /> */}
        
        {/* Other routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/payment-batch-review" element={<PaymentsReview />} />
        <Route path="/make-payment" element={<MakePayment />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;