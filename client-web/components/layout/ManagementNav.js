import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Nav, NavItem, Badge } from "reactstrap";
import IconText from "../IconText";

function ManagementNav({ routePrefix, labelPrefix, subRoutes }) {
  const { t } = useTranslation("common");

  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <>
      <Nav className="d-md-none">
        {subRoutes.map((subRoute) => (
          <NavItem key={subRoute.slug}>
            <Link href={`/${routePrefix}/${subRoute.slug}`} passHref>
              <a
                className={`nav-link ${
                  currentPath === "/" + routePrefix + "/" + subRoute.slug
                    ? "active"
                    : ""
                }`}
              >
                <IconText
                  icon={subRoute.icon}
                  text={t(`${labelPrefix}.${subRoute.labelTabs}`)}
                />
                {subRoute.badge ? (
                  <Badge
                    pill
                    color={`${
                      currentPath === "/" + routePrefix + "/" + subRoute.slug
                        ? "secondary"
                        : "light"
                    }`}
                    style={{}}
                  >
                    {subRoute.badge}
                  </Badge>
                ) : (
                  <></>
                )}
              </a>
            </Link>
          </NavItem>
        ))}
      </Nav>

      <Nav
        vertical
        pills
        className="d-none d-md-block"
        style={{ marginTop: "0px" }}
      >
        {subRoutes.map((subRoute) => (
          <NavItem key={subRoute.slug}>
            <Link href={`/${routePrefix}/${subRoute.slug}`} passHref>
              <a
                className={`nav-link ${
                  currentPath === "/" + routePrefix + "/" + subRoute.slug
                    ? "active"
                    : ""
                }`}
              >
                <IconText
                  icon={subRoute.icon}
                  text={t(`${labelPrefix}.${subRoute.labelPills}`)}
                />
                {subRoute.badge ? (
                  <Badge
                    pill
                    color={`${
                      currentPath === "/" + routePrefix + "/" + subRoute.slug
                        ? "secondary"
                        : "light"
                    }`}
                    style={{ float: "right", marginTop: "2px" }}
                  >
                    {subRoute.badge}
                  </Badge>
                ) : (
                  <></>
                )}
              </a>
            </Link>
          </NavItem>
        ))}
      </Nav>
    </>
  );
}

ManagementNav.propTypes = {
  prefix: PropTypes.string,
  subRoutes: PropTypes.array,
};

export default ManagementNav;
