// "use client"
// import AuthWarp from '../../components/auth';
// const Page = () => {

//   return (
//     <AuthWarp>
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground mb-2">Service portal</h1>
//         <p className="text-muted-foreground">Select the service you want to make payment for</p>
//       </div>

//       {/* Service Selection */}
//       <Card className="mb-8 max-w-2xl mx-auto">
//         <div className='flex flex-col space-y-1.5 p-6'>
//           <div className="text- text-2xl font-semibold leading-none tracking-tight">Choose a service</div>
//         </div>
//         <CardContent>
//           <RadioGroup value={selectedService} onValueChange={setSelectedService}>
//             <div className="space-y-4">
//               {services.map((service) => {
//                 const IconComponent = service.icon;
//                 return (
//                   <div key={service.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
//                     <RadioGroupItem value={service.id} id={service.id} />
//                     <Label htmlFor={service.id} className="flex items-center space-x-3 cursor-pointer flex-1">
//                       <div className="p-2 bg-primary/10 rounded-lg">
//                         <IconComponent className="h-6 w-6 text-primary" />
//                       </div>
//                       <span className="text-lg font-medium">{service.name}</span>
//                     </Label>
//                   </div>
//                 );
//               })}
//             </div>
//           </RadioGroup>
//         </CardContent>
//       </Card>
//     </AuthWarp>
//   )
// }

// export default Page


// "use client"
// import AuthWarp from '../../components/auth';
// const Page = () => {

//   return (
//     <AuthWarp>
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground mb-2">Service portal</h1>
//         <p className="text-muted-foreground">Select the service you want to make payment for</p>
//       </div>

//       {/* Service Selection */}
//       <Card className="mb-8 max-w-2xl mx-auto">
//         <div className='flex flex-col space-y-1.5 p-6'>
//           <div className="text- text-2xl font-semibold leading-none tracking-tight">Choose a service</div>
//         </div>
//         <CardContent>
//           <RadioGroup value={selectedService} onValueChange={setSelectedService}>
//             <div className="space-y-4">
//               {services.map((service) => {
//                 const IconComponent = service.icon;
//                 return (
//                   <div key={service.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
//                     <RadioGroupItem value={service.id} id={service.id} />
//                     <Label htmlFor={service.id} className="flex items-center space-x-3 cursor-pointer flex-1">
//                       <div className="p-2 bg-primary/10 rounded-lg">
//                         <IconComponent className="h-6 w-6 text-primary" />
//                       </div>
//                       <span className="text-lg font-medium">{service.name}</span>
//                     </Label>
//                   </div>
//                 );
//               })}
//             </div>
//           </RadioGroup>
//         </CardContent>
//       </Card>
//     </AuthWarp>
//   )
// }

// export default Page


"use client";
import React, { useState } from "react";
import { Circle, ArrowLeft, ArrowRight } from "lucide-react";
import AuthWarp from "../../components/auth";
import { services } from "../../constants/services";
import { useNavigate } from "react-router-dom";

export default function ServicePortal() {
  const [selectedService, setSelectedService] = useState("");
  const navigate = useNavigate();

  // const handleGetStarted = () => {
  //   if (selectedService) {
  //     console.log("Proceeding with service:", selectedService);
  //   }
  // };
   const handleGetStarted = () => {
    if (selectedService) {
      // navigate("/transaction-references", { 
      navigate(`/${selectedService}`, { 
        state: { selectedService } 
      });
    }
  };
  console.log(selectedService, 'selectedService')

  return (
    <AuthWarp>
      <div className="grid sm:grid-cols-2 gap-4 flex-1">
      { <>
      <div className="w-full mx-auto p-6">
        {/* Header - updated to match your styling */}
        <div className="text-start mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Service portal</h1>
          <p className="text-[#474D66] text-xs leading-4 font-normal tracking-[-0.5px]">
            Select the service portal you wish to complete payment for
          </p>
        </div>

        {/* Card implementation */}
        <div className="mb-8 mx-auto">
          
          {/* Card content - radio group */}
          <div className="px-1 pb-6a">
            <div className="space-y-4">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div 
                    key={service.id} 
                    className={`flex items-center space-x-3 p-2 rounded-lg border transition-colors ${
                      selectedService === service.id 
                        ? "border-[#A73636] bg-[#A73636]/10" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    
                    <label 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="p-2 bg-[#A73636]/0 rounded-lg">
                        <IconComponent className="h-6 w-6 text-[#A73636]" />
                      </div>
                      <span className="text-base font-medium text-gray-900">{service.name}</span>
                    </label>

                    {/* Custom radio button */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedService === service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`flex-shrink-0 aspect-square h-4 w-4 rounded-full border ${
                        selectedService === service.id 
                          ? "border-[#A73636] bg-[#A73636] text-white" 
                          : "border-gray-300 hover:border-[#A73636]"
                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A73636]/50`}
                    >
                      {selectedService === service.id && (
                        <div className="flex items-center justify-center">
                          <Circle className="h-2.5 w-2.5 fill-current text-current" />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between w-full mx-auto mt-20">
          <button 
            className="flex items-center space-x-2 px-4 py-3.5 border border-gray-300 rounded-[4px] text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white transition-colors ${
              selectedService 
                ? 'bg-[#A73636] hover:bg-[#A73636]/90' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!selectedService}
            onClick={handleGetStarted}
          >
            <span>Get started</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="w-full mx-auto p-6"></div>
      </>}

      </div>
    </AuthWarp>
  );
}