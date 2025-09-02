"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { FileUpload } from "./components/FileUpload";
import BirthdayCard from "./components/GreetingCard";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("home");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          onClick={handleAddFrame}
          className="text-[#0052FF] p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="plus" size="sm" />
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  if (currentScreen === "birthday") {
    return <BirthdayScreen onBack={() => setCurrentScreen("home")} onOpenEditor={() => setCurrentScreen("editor")} />;
  }

  if (currentScreen === "editor") {
    return <GreetingCardEditor onBack={() => setCurrentScreen("birthday")} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <span className="font-medium">09:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
            </div>
            <div className="w-4 h-4 flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">Evrlink</h1>
            <p className="text-sm text-gray-500">by Snow</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {saveFrameButton}
            <button className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Action Buttons */}
      <div className="px-4 py-4">
        <div className="flex justify-between">
          <button className="flex flex-row items-center p-[6px_8px] gap-[6px] w-[108px] h-[44px] bg-[rgba(0,178,199,0.08)] rounded-lg flex-none order-0 flex-grow-0">
            <div className="w-6 h-6 flex-none order-0 flex-grow-0 relative">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.75 6.75003H17.4613C17.4978 6.71909 17.5353 6.68909 17.5709 6.65628C17.8557 6.40332 18.0851 6.09433 18.245 5.74864C18.4049 5.40295 18.4917 5.02799 18.5 4.64721C18.5123 4.23066 18.4394 3.81598 18.2856 3.42864C18.1319 3.0413 17.9006 2.68947 17.606 2.39474C17.3113 2.10002 16.9596 1.86863 16.5723 1.71477C16.185 1.56091 15.7703 1.48784 15.3538 1.50003C14.9728 1.50823 14.5977 1.59498 14.2518 1.75485C13.906 1.91471 13.5968 2.14425 13.3438 2.42909C12.9936 2.83493 12.7089 3.29294 12.5 3.78659C12.2911 3.29294 12.0064 2.83493 11.6562 2.42909C11.4032 2.14425 11.094 1.91471 10.7482 1.75485C10.4023 1.59498 10.0272 1.50823 9.64625 1.50003C9.22969 1.48784 8.81503 1.56091 8.42774 1.71477C8.04044 1.86863 7.68868 2.10002 7.39405 2.39474C7.09941 2.68947 6.86812 3.0413 6.71438 3.42864C6.56064 3.81598 6.48768 4.23066 6.5 4.64721C6.50833 5.02799 6.59514 5.40295 6.755 5.74864C6.91486 6.09433 7.14434 6.40332 7.42906 6.65628C7.46469 6.68721 7.50219 6.71721 7.53875 6.75003H4.25C3.85218 6.75003 3.47064 6.90806 3.18934 7.18937C2.90804 7.47067 2.75 7.8522 2.75 8.25003V11.25C2.75 11.6479 2.90804 12.0294 3.18934 12.3107C3.47064 12.592 3.85218 12.75 4.25 12.75V18.75C4.25 19.1479 4.40804 19.5294 4.68934 19.8107C4.97064 20.092 5.35218 20.25 5.75 20.25H11.375C11.4745 20.25 11.5698 20.2105 11.6402 20.1402C11.7105 20.0699 11.75 19.9745 11.75 19.875V11.25H4.25V8.25003H11.75V11.25H13.25V8.25003H20.75V11.25H13.25V19.875C13.25 19.9745 13.2895 20.0699 13.3598 20.1402C13.4302 20.2105 13.5255 20.25 13.625 20.25H19.25C19.6478 20.25 20.0294 20.092 20.3107 19.8107C20.592 19.5294 20.75 19.1479 20.75 18.75V12.75C21.1478 12.75 21.5294 12.592 21.8107 12.3107C22.092 12.0294 22.25 11.6479 22.25 11.25V8.25003C22.25 7.8522 22.092 7.47067 21.8107 7.18937C21.5294 6.90806 21.1478 6.75003 20.75 6.75003ZM8.42281 5.53128C8.29168 5.41253 8.18651 5.26795 8.11391 5.10661C8.04131 4.94528 8.00285 4.77068 8.00094 4.59378C7.9962 4.3865 8.03287 4.18036 8.10881 3.98743C8.18476 3.79451 8.29844 3.61868 8.4432 3.47025C8.58796 3.32182 8.76089 3.20378 8.95186 3.12304C9.14282 3.04229 9.34798 3.00047 9.55531 3.00003H9.60125C9.77815 3.00194 9.95275 3.0404 10.1141 3.113C10.2754 3.1856 10.42 3.29077 10.5388 3.4219C11.3253 4.31065 11.6028 5.7844 11.7003 6.69565C10.7853 6.59909 9.3125 6.32159 8.42281 5.53128ZM16.5791 5.53128C15.6894 6.31878 14.2128 6.59628 13.2978 6.69378C13.4094 5.70846 13.7188 4.26565 14.4688 3.42284C14.5875 3.2917 14.7321 3.18653 14.8934 3.11393C15.0547 3.04133 15.2293 3.00287 15.4062 3.00096H15.4522C15.6595 3.00226 15.8645 3.04493 16.0552 3.12647C16.2458 3.20801 16.4183 3.32678 16.5624 3.47582C16.7066 3.62487 16.8195 3.80118 16.8947 3.99444C16.9698 4.18769 17.0056 4.394 17 4.60128C16.9969 4.77698 16.9578 4.95019 16.8851 5.11016C16.8124 5.27013 16.7076 5.41347 16.5772 5.53128H16.5791Z" fill="#00B2C7"/>
              </svg>
            </div>
            <span className="w-[62px] h-[20px] font-['Inter'] font-medium text-[14px] leading-[20px] text-center text-[#00B2C7] flex-none order-1 flex-grow-0">Received</span>
          </button>
          <button className="flex flex-row items-center p-[6px_8px] gap-[6px] w-[100px] h-[44px] bg-[rgba(0,178,199,0.08)] rounded-lg flex-none order-0 flex-grow-0">
            <div className="w-6 h-6 flex-none order-0 flex-grow-0 relative">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.1938 2.15687C21.1938 2.15687 21.1938 2.16625 21.1938 2.17094L15.7375 20.1653C15.655 20.4576 15.485 20.7176 15.2504 20.9105C15.0157 21.1034 14.7278 21.2199 14.425 21.2444C14.3819 21.2481 14.3388 21.25 14.2957 21.25C14.012 21.2509 13.734 21.1706 13.4944 21.0186C13.2549 20.8666 13.0638 20.6492 12.9438 20.3922L9.5313 13.3891C9.49715 13.3189 9.48575 13.2398 9.49869 13.1628C9.51163 13.0859 9.54826 13.0148 9.60348 12.9597L15.0335 7.52969C15.1682 7.38789 15.2422 7.19908 15.2397 7.00351C15.2372 6.80794 15.1584 6.62108 15.0201 6.48278C14.8818 6.34448 14.6949 6.26567 14.4993 6.26317C14.3038 6.26067 14.115 6.33466 13.9732 6.46937L8.54036 11.8994C8.4852 11.9546 8.41419 11.9912 8.33722 12.0042C8.26025 12.0171 8.18116 12.0057 8.11098 11.9716L1.1013 8.56C0.827189 8.4285 0.599512 8.2168 0.448436 7.95298C0.29736 7.68915 0.230017 7.38565 0.255332 7.08269C0.280647 6.77972 0.397424 6.4916 0.590188 6.25651C0.782952 6.02141 1.0426 5.85044 1.33473 5.76625L19.3291 0.31H19.3432C19.5994 0.23802 19.8701 0.235496 20.1276 0.302688C20.3851 0.36988 20.6201 0.504368 20.8085 0.692354C20.9968 0.88034 21.1318 1.11506 21.1995 1.37242C21.2672 1.62978 21.2653 1.90053 21.1938 2.15687Z" fill="#00B2C7" />
              </svg>

            </div>
            <span className="w-[50px] h-[20px] font-['Inter'] font-medium text-[14px] leading-[20px] text-left text-[#00B2C7] flex-none order-1 flex-grow-0">Sent</span>
          </button>
        </div>
      </div>

      {/* Earn as a Creator Card */}
      <div className="px-4 mb-6">
        <div className="w-full h-[159px] bg-gradient-to-b from-[#00FFFF] to-[rgba(255,255,255,0.75)] border-b border-[#6B7280] rounded-[16px] flex-none order-1 flex-grow-0 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute w-[14.58px] h-[11.07px] left-[126.04px] top-[108.75px]">
            <div className="absolute w-[3.76px] h-[3.52px] left-[130.7px] top-[114.91px] transform -rotate-[64.87deg]">
              <div className="absolute left-[37.34%] right-[61.78%] top-[72.75%] bottom-[25.34%] border border-[rgba(235,49,150,0.53)] transform matrix-[0.51,-0.86,0.94,0.35,0,0]"></div>
              <div className="absolute left-[37.45%] right-[61.67%] top-[72.55%] bottom-[25.55%] bg-[#EB3196] shadow-[0px_0px_0.8px_rgba(118,0,64,0.46)] transform matrix-[0.51,-0.86,0.94,0.35,0,0]"></div>
              <div className="absolute left-[36.01%] right-[60.49%] top-[68.39%] bottom-[26.48%] bg-[#EB3196] transform matrix-[-0.98,0.21,-0.32,-0.95,0,0]"></div>
            </div>
          </div>
          
          <div className="absolute w-[10.42px] h-[6.46px] left-[246.88px] top-[63.44px] opacity-46">
            <div className="absolute left-[70.54%] right-[26.86%] top-[39.9%] bottom-[56.26%] border border-[#046ECA]"></div>
            <div className="absolute left-[70.91%] right-[26.49%] top-[40.11%] bottom-[56.04%] bg-[#046ECB] shadow-[0px_0px_0.8px_rgba(118,0,64,0.46)]"></div>
          </div>
          
          {/* Content */}
          <div className="absolute w-[320px] h-[122px] left-6 top-[calc(50%-122px/2+0.5px)] flex flex-col items-start gap-6">
            <div className="w-[320px] h-[60px] flex flex-col items-start gap-3 flex-none order-0 self-stretch flex-grow-0">
              <h2 className="w-[320px] h-[28px] font-['Inter'] font-bold text-[24px] leading-[28px] text-[#010206] flex-none order-0 self-stretch flex-grow-0">Earn as a Creator</h2>
              <p className="w-[320px] h-[20px] font-['Inter'] font-medium text-[14px] leading-[20px] text-[#010206] flex-none order-1 self-stretch flex-grow-0">Create your own greeting cards and earn.</p>
            </div>
            
            <div className="flex flex-row justify-center items-center p-[10px] gap-2 w-[99px] h-[38px] bg-[#111827] rounded-lg flex-none order-1 flex-grow-0">
              <span className="w-[79px] h-[18px] font-['Inter'] font-medium text-[12px] leading-[18px] text-center text-white flex-none order-0 flex-grow-0 -mt-1.5">Coming soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-black mb-1">Welcome to Evrlink!</h2>
        <p className="text-gray-500 text-sm">See some of our categories, and create a Meep.</p>
      </div>

      {/* Categories Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {/* Row 1 */}
          <CategoryButton icon="🎁" label="Birthdays" color="orange" onClick={() => setCurrentScreen("birthday")} />
          <CategoryButton icon="🎉" label="Congrats" color="blue" />
          <CategoryButton icon="❤️" label="Love" color="red" />
          
          {/* Row 2 */}
          <CategoryButton icon="💼" label="Work" color="green" />
          <CategoryButton icon="🤝" label="Thank you" color="green" />
          <CategoryButton icon="😔" label="Sorry" color="purple" />
          
          {/* Row 3 */}
          <CategoryButton icon="📍" label="IRL" color="yellow" />
          <CategoryButton icon="👀" label="Situationship" color="orange" />
          <CategoryButton icon="👥" label="Friendship" color="yellow" />
          
          {/* Row 4 */}
          <CategoryButton icon="🌱" label="Degen" color="green" />
          <CategoryButton icon="💪" label="Motivational" color="orange" />
          <CategoryButton icon="🔷" label="Base" color="blue" />
        </div>
      </div>

      {/* Recently Created */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-black mb-1">Recently Created</h2>
        <p className="text-gray-500 text-sm mb-4">Some Meeps created very recently...</p>
        
        <div className="evrlink-card flex items-center space-x-3 p-4 rounded-xl evrlink-shadow">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-black">Birthday Bling</h3>
            <p className="text-gray-500 text-sm">by Evrlink</p>
            <div className="flex space-x-2 mt-1">
              <span className="text-xs text-gray-400">#birthday</span>
              <span className="text-xs text-gray-400">#celebration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Integration (Hidden but available) */}
      <div className="hidden">
        <Wallet className="z-10">
          <ConnectWallet>
            <Name className="text-inherit" />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
}

// Category Button Component
function CategoryButton({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick?: () => void }) {
  const colorClasses = {
    orange: "bg-orange-50 border-orange-100 text-orange-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600", 
    green: "bg-green-50 border-green-100 text-green-600",
    red: "bg-red-50 border-red-100 text-red-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
    yellow: "bg-yellow-50 border-yellow-100 text-yellow-600"
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]} hover:opacity-80 transition-opacity`}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
}

// Birthday Screen Component
function BirthdayScreen({ onBack, onOpenEditor }: { onBack: () => void; onOpenEditor: () => void }) {
  console.log('BirthdayScreen rendered');
  return (
    <div className="min-h-screen bg-white font-sans overflow-y-auto">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <span className="font-medium">09:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={onBack} className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-4 h-4 flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">Evrlink</h1>
            <p className="text-sm text-gray-500">by Snow</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Action Buttons */}
      <div className="px-4 py-4">
        <div className="flex space-x-3">
          <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-500 py-3 px-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-medium">Received</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-500 py-3 px-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-medium">Sent</span>
          </button>
          <button 
            onClick={onOpenEditor}
            className="flex-1 flex items-center justify-center space-x-2 bg-teal-500 text-white py-3 px-4 rounded-xl hover:bg-teal-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Create a Meep</span>
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-black mb-1">Welcome to Evrlink!</h2>
        <p className="text-gray-500 text-sm">See some of our categories, and create a Meep.</p>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          <button className="flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl border border-orange-100 whitespace-nowrap">
            <span className="text-lg">🎁</span>
            <span className="font-medium">Birthdays</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-xl border border-gray-100 whitespace-nowrap">
            <span className="text-lg">🎉</span>
            <span className="font-medium">Congratulations</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-xl border border-gray-100 whitespace-nowrap">
            <span className="text-lg">❤️</span>
            <span className="font-medium">The Feels</span>
          </button>
        </div>
      </div>

      {/* Greeting Card */}
      <div className="px-4 mb-6">
        <BirthdayCard 
          title="Birthday Bling"
          byline="by Evrlink"
          tags={["#birthday", "#celebration"]}
          likes={74}
          cta="Mint for 0.02 ETH"
          onClick={() => console.log('Mint clicked')}
        />
      </div>

      {/* Second Card (showing scroll) */}
      <div className="px-4 mb-6">
        <div className="evrlink-card rounded-xl p-4 evrlink-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black">Birthday Bling</h3>
              <p className="text-gray-500 text-sm">by Evrlink</p>
              <div className="flex space-x-2 mt-1">
                <span className="text-xs text-gray-400">#birthday</span>
                <span className="text-xs text-gray-400">#celebration</span>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 py-8">
            <p>More birthday cards...</p>
          </div>
        </div>
      </div>
      
      {/* Bottom padding to ensure scrolling */}
      <div className="h-20"></div>
    </div>
  );
}

// Greeting Card Editor Component
function GreetingCardEditor({ onBack }: { onBack: () => void }) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ hash: string; url: string } | null>(null);

  const handleUploadSuccess = (result: { hash: string; url: string }) => {
    setUploadedImage(result);
    setActiveTool(null);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // You could show a toast notification here
  };
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <span className="font-medium">09:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
            </div>
            <div className="w-4 h-4 flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">Evrlink</h1>
            <p className="text-sm text-gray-500">by Snow</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Editor Header */}
      <div className="px-4 py-3 bg-gray-50 border-b-2 border-dashed border-blue-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-black">Greeting Card Editor</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="px-4 py-4 bg-gray-50">
        <div className="flex justify-between">
          <ToolbarButton 
            icon="✏️" 
            label="Draw" 
            isActive={activeTool === 'draw'}
            onClick={() => setActiveTool(activeTool === 'draw' ? null : 'draw')}
          />
          <ToolbarButton 
            icon="T" 
            label="Text" 
            isActive={activeTool === 'text'}
            onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
          />
          <ToolbarButton 
            icon="☁️" 
            label="Upload" 
            isActive={activeTool === 'upload'}
            onClick={() => setActiveTool(activeTool === 'upload' ? null : 'upload')}
          />
          <ToolbarButton 
            icon="▦" 
            label="Background" 
            isActive={activeTool === 'background'}
            onClick={() => setActiveTool(activeTool === 'background' ? null : 'background')}
          />
          <ToolbarButton 
            icon="◯" 
            label="Elements" 
            isActive={activeTool === 'elements'}
            onClick={() => setActiveTool(activeTool === 'elements' ? null : 'elements')}
          />
          <ToolbarButton 
            icon="📄" 
            label="Templates" 
            isActive={activeTool === 'templates'}
            onClick={() => setActiveTool(activeTool === 'templates' ? null : 'templates')}
          />
        </div>
      </div>

      {/* Tool Panels */}
      {activeTool === 'upload' && (
        <div className="px-4 py-4 bg-white border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Image</h3>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            multiple={false}
            accept="image/png"
            maxSize={10}
          />
        </div>
      )}

      {activeTool === 'text' && (
        <div className="px-4 py-4 bg-white border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Text</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Add Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card Editor Canvas */}
      <div className="px-4 py-6">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 min-h-96 flex items-center justify-center relative overflow-hidden">
          {uploadedImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={uploadedImage.url} 
                alt="Uploaded greeting card" 
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                IPFS: {uploadedImage.hash.slice(0, 8)}...
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-lg">Write your message</p>
              <p className="text-sm mt-2">Use the toolbar above to add content</p>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Preview Area */}
      <div className="px-4 py-4">
        <div className="flex space-x-4 mb-4">
          {/* Left Card Preview */}
          <div className="flex-1 bg-amber-50 border-2 border-amber-200 rounded-xl p-4 relative overflow-hidden">
            {/* Balloon decorations */}
            <div className="absolute top-1 left-2 w-4 h-6 bg-amber-800 rounded-full opacity-60"></div>
            <div className="absolute top-2 right-3 w-3 h-5 bg-black rounded-full opacity-40"></div>
            <div className="absolute top-1 right-6 w-2 h-4 bg-amber-900 rounded-full opacity-50"></div>
            <div className="absolute top-3 left-4 w-2 h-3 bg-red-500 rounded-full"></div>
            <div className="absolute top-2 left-6 w-1 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute top-3 left-8 w-1 h-2 bg-yellow-500 rounded-full"></div>
            
            {/* Main card content */}
            <div className="bg-white rounded-lg p-3 text-center relative z-10 mt-4">
              <div className="text-sm font-bold text-black mb-1">HAPPY</div>
              <div className="text-sm font-bold text-black bg-yellow-200 px-2 py-1 rounded">BIRTHDAY!!</div>
            </div>
          </div>

          {/* Right Card Preview */}
          <div className="flex-1 bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-sm">Write your message</p>
            </div>
          </div>
        </div>
        
        {/* Dimensions annotation */}
        <div className="text-center text-blue-600 text-xs mb-4">
          <span className="bg-blue-100 px-2 py-1 rounded">350 Fill x 638.93 Hug</span>
        </div>
      </div>

      {/* Generate Meep Button */}
      <div className="px-4 pb-6">
        <button className="w-full bg-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-600 transition-colors">
          Generate Meep
        </button>
      </div>
    </div>
  );
}

// Toolbar Button Component
function ToolbarButton({ 
  icon, 
  label, 
  isActive = false, 
  onClick 
}: { 
  icon: string; 
  label: string; 
  isActive?: boolean; 
  onClick?: () => void; 
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-600' 
          : 'hover:bg-gray-100 text-black'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
