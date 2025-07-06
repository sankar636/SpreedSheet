
import { Button } from "../../../Components/Button"
import type { JSX } from 'react';

export const NavBar = (): JSX.Element => {

  
    const handleButtonClick = (action: string, data?: unknown) => {
      console.log(`Navigation button clicked: ${action}`, data);
    };
  
    return (
      <header className="flex items-center justify-between px-4 py-2 relative self-stretch w-full flex-[0_0_auto] z-[3] bg-white border-b [border-bottom-style:solid] border-[#eeeeee]">
        <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-0 h-6 w-6"
            onClick={() => handleButtonClick("panel")}
          >
            <img
              className="w-6 h-6"
              alt="Panel"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/panel.svg"
            />
          </Button>
        </div>
      </header>
    );
  };