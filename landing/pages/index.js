import Head from "next/head";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";

import { whoItsFor, benefitOne, benefitTwo } from "../components/data";
// import Video from "../components/video";
// import Benefits from "../components/benefits";
// import Footer from "../components/footer";
// import Testimonials from "../components/testimonials";
// import Cta from "../components/cta";
// import Plans from "../components/plans";
// import Faq from "../components/faq";
// import PopupWidget from "../components/popupWidget";

import dynamic from "next/dynamic";

const Video = dynamic(() => import("../components/video"));

const Benefits = dynamic(() => import("../components/benefits"));
const Footer = dynamic(() => import("../components/footer"));
const Testimonials = dynamic(() => import("../components/testimonials"));
const Cta = dynamic(() => import("../components/cta"));
const Faq = dynamic(() => import("../components/faq"));

const PopupWidget = dynamic(() => import("../components/popupWidget"));

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits data={whoItsFor} />
      <SectionTitle
        pretitle="SessionLite Benefits"
        title="Why should you use SessionLite?">
            <p className="py-3 text-xl leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
              Easily build structured programming you can use again and again with your clients.  You can have recurring sessions, or string multiple sessions together to form a series.
            </p>
            <p className="py-3 text-xl leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
              Sessions can be scheduled or asynchronous. Use SessionLite with single clients or with groups.
            </p>
            {/* <p className="py-3 text-xl leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
              Sessions can be scheduled or asynchronous. Use SessionLite with single clients or with groups.
            </p> */}
      </SectionTitle>
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle
        pretitle="Watch a video"
        title="Learn how to fullfil your needs">
        This section is to highlight a promo or demo video of your product.
        Analysts says a landing page with video has 3% more conversion rate. So,
        don't forget to add one. Just like this.
      </SectionTitle>
      <Video />
      <SectionTitle
        pretitle="Testimonials"
        title="Here's what our customers said">
        Testimonails is a great way to increase the brand trust and awareness.
        Use this section to highlight your popular customers.
      </SectionTitle>
      <Testimonials />
      <SectionTitle pretitle="FAQ" title="Frequently Asked Questions">
        Answer your customers possible questions here, it will increase the
        conversion rate as well as support or chat requests.
      </SectionTitle>
      <Faq />
      <Cta />
    </>
  );
}
