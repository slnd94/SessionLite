import Container from "../components/container";
import Plans from "../components/plans";
import api from "../utils/api";

export default function Home({ plans }) {
  return (
    <Container>
      <h1 className="text-2xl font-bold leading-snug tracking-tight text-gray-800 lg:text-2xl lg:leading-tight xl:text-3xl xl:leading-tight dark:text-white">
        Plans and Pricing
      </h1>
      <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
        Pick the plan that works best for your business. All paid plans come
        with a free trial. Change your plan or cancel at any time.
      </p>
      <Plans plans={plans.data} />
    </Container>
  );
}

const fetchPlans = async () => {
  setRequestingPlans(true);
  const response = await api({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/plans?$sort[index]=1`,
  });

  if (response.status >= 200 && response.status < 300) {
    setPlans(
      response.data.data.map((plan) => ({
        ...plan,
        // ...(currentUsage
        //   ? {
        //       eligibility: tenantPlanEligibility({
        //         plan: plan,
        //         usage: currentUsage,
        //       }),
        //     }
        //   : {}),
      }))
    );
    setRequestingPlans(false);
    return { success: true };
  } else {
    setPlans(null);
    setRequestingPlans(false);
    return { success: false };
  }
};

export const getServerSideProps = async ({
  // locale,
  req: {
    cookies: { accessToken },
  },
}) => {
  const response = await api({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/plans?$sort[index]=1`,
  });

  return {
    props: {
      // ...(await serverSideTranslations(locale, ["common"])),
      plans: response.data,
    },
  };
};
