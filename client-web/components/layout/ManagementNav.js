import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Nav, NavItem, Badge } from "reactstrap";
import IconText from "../IconText";
import { icons, FontAwesomeIcon } from "../../utils/fontAwesome/fontAwesome";

function ManagementNav({ routePrefix, labelPrefix, subRoutes, className }) {
  const { t } = useTranslation("common");

  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <div className={className}>
      <Nav
        vertical
        pills
        style={{ marginTop: "0px" }}
      >
        {subRoutes.map((subRoute) => (
          <NavItem key={subRoute.slug}>
            <Link href={`/${routePrefix}/${subRoute.slug}`} passHref>
              <a
                className={`nav-link d-flex justify-content-center justify-content-md-start ${
                  currentPath === "/" + routePrefix + "/" + subRoute.slug
                    ? "active"
                    : ""
                }`}
              >
                <FontAwesomeIcon style={{minHeight: "1rem", maxHeight: "2rem"}} className="d-block d-md-none" icon={icons[subRoute.icon]} />
                <IconText
                  className="d-none d-md-block"
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
    </div>
  );
}

ManagementNav.propTypes = {
  prefix: PropTypes.string,
  subRoutes: PropTypes.array,
};

export default ManagementNav;
