import {
  EmojiHappyIcon,
  ChartSquareBarIcon,
  CursorClickIcon,
  DeviceMobileIcon,
  AdjustmentsIcon,
  SunIcon,
  UserIcon,
  UserGroupIcon,
  OfficeBuildingIcon,
  CurrencyDollarIcon,
  PlusCircleIcon
} from "@heroicons/react/outline";

import benefitOneImg from "../public/img/benefit-one.png";
import benefitTwoImg from "../public/img/benefit-two.png";

const featuresIncluded = {
  title: "Highlight your benefits",
  bullets: [
    {
      title: "Users and Permissions",
      desc: "User accounts, authentication and role-based authorization.",
      icon: <UserIcon />,
    },
    {
      title: "Multi-Tenancy",
      desc: "Tenant context and administrative management. Each of your customers has their own walled-off application scope and administrative functions.",
      icon: <OfficeBuildingIcon />,
    },
    {
      title: "Team and Client Management",
      desc: "Your customers can invite their team members and clients to use your SaaS with them.",
      icon: <UserGroupIcon />,
    },
    {
      title: "Subscription Management",
      desc: "Customizable plans and subscriptions, so you can tailor your offering to your customers.",
      icon: <CurrencyDollarIcon />
    },
    {
      title: "Mobile Responsive",
      desc: "Looks great on any device, from desktop to mobile phone.",
      icon: <DeviceMobileIcon />,
    },
    {
      title: "... and Much More",
      desc: "Traverston Jumpstart includes all you need to get rolling.",
      icon: <PlusCircleIcon />
    }
  ],
};

const benefitOne = {
  title: "Highlight your benefits",
  desc: "You can use this space to highlight your first benefit or a feature of your product. It can also contain an image or Illustration like in the example along with some bullet points.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Understand your customers",
      desc: "Then explain the first point breifly in one or two lines.",
      icon: <EmojiHappyIcon />,
    },
    {
      title: "Improve acquisition",
      desc: "Here you can add the next benefit point.",
      icon: <ChartSquareBarIcon />,
    },
    {
      title: "Drive customer retention",
      desc: "This will be your last bullet point in this section.",
      icon: <CursorClickIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Offer more benefits here",
  desc: "You can use this same layout with a flip image to highlight your rest of the benefits of your product. It can also contain an image or Illustration as above section along with some bullet points.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Mobile Responsive Template",
      desc: "Nextly is designed as a mobile first responsive template.",
      icon: <DeviceMobileIcon />,
    },
    {
      title: "Powered by Next.js & TailwindCSS",
      desc: "This template is powered by latest technologies and tools.",
      icon: <AdjustmentsIcon />,
    },
    {
      title: "Dark & Light Mode",
      desc: "Nextly comes with a zero-config light & dark mode. ",
      icon: <SunIcon />,
    },
  ],
};

export { featuresIncluded, benefitOne, benefitTwo };
