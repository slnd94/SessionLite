import { useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import ManagementNav from "../layout/ManagementNav";
import { getFullName } from "../../helpers/nameHelpers";
import styles from "../../styles/User.module.scss";
import IconText from "../IconText";

export default function Layout({ children }) {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { cart },
  } = useContext(UserContext);

  const subRoutes = [
    {
      slug: "profile",
      icon: "profile",
      labelPills: t("Your Profile"),
      labelTabs: t("Profile"),
    },
    {
      slug: "account",
      icon: "account",
      labelPills: t("Your Account"),
      labelTabs: t("Account"),
    },
    {
      slug: "cart",
      icon: "cart",
      labelPills: t("cart.Your Cart"),
      labelTabs: t("cart.Cart"),
      // badge: cart?.items.length || false,
    },
  ];

  return (
    <>
      {auth?.status === "SIGNED_IN" ? (
        <>
          <div className="row ms-md-n5">
            <div className="col-2 col-xl-2 col-lg-3 col-md-3 pe-0 section-nav left-nav-md-up ms-n4 ms-md-n3">
              <h6 className="title d-none d-md-block ms-1">
                <IconText icon="user" iconContainerClass="fs-3 text-primary" text={getFullName(auth.user.name)} />
              </h6>
              <ManagementNav
                routePrefix="user"
                labelPrefix="user"
                subRoutes={subRoutes}
              />
            </div>
            <div className="col-10 col-xl-10 col-lg-9 col-md-9 pt-2 ms-3">
              {children}
            </div>
          </div>
        </>
      ) : auth?.status === "SIGNED_OUT" ? (
        <>
          <Link href="/auth/signin">{t("auth.Sign in")}</Link>
        </>
      ) : null}
    </>
  );
}
