"use client";
import { useState } from "react";
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

  // curl -X POST
  //  https://4b2e-102-89-83-38.ngrok-free.app/api/v1/transaction/multipay/initializepaymulti -H "Content-Type: application/json" -d "{\"email\": \"joyyy2@example.com\", \"amount\": 124, \"metadata\": [{\"payment\": \"passport fee\"}], \"business_id\": 17, \"callback_url\": \"https://webhook.site/b1af3913-6b7f-49d7-ab94-da3e87ea647e\", \"currency\": \"NGN\", \"is_live\": false, \"bearer\": \"test\", \"channels\": [\"card\"], \"remember_card\": false, \"status\": \"unpaid\"}"
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