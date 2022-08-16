import React from "react";
import Container from "./container";
import Head from "next/head";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PopupWidget from "../components/popupWidget";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Traverston Jumpstart - Jumpstart Your SaaS Project</title>
        <meta
          name="description"
          content="Nextly is a free landing page template built with next.js & Tailwind CSS"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <>{children}</>
      <Footer />
      <PopupWidget />
    </>
  );
}
