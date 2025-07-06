import { useEffect } from "react";
import type { JSX } from 'react';


import { NavBar } from "../Layouts/Sections/NavBar/NavBar";

export const Spreadsheet = (): JSX.Element => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  return (
    <main
      className="flex w-full items-start relative bg-white"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div
        className="flex flex-col w-full items-start relative bg-slate-50"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        <NavBar />
      </div>
    </main>
  );
};
