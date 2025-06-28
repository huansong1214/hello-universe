import React from "react";
import Header from "../components/Header/Header";

// Prevent Vercel deployment error when page.tsx is empty
export default function Page() {
  return (
    <>
      <Header />
      <main>Under maintenance</main>
    </>
  );
}