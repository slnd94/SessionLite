import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import Link from "next/link";
import Image from "next/image";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavLink,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import Loader from "../Loader";
import { getFullName } from "../../helpers/nameHelpers";
import IconText from "../IconText";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../styles/Header.module.scss";
import TenantLogo from "../tenant/TenantLogo";

function Header({ brandName, tenantAdmin }) {
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth, fileAuth },
  } = useContext(AuthContext);
  const {
    state: { cart },
  } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [router.asPath]);

  return (
    <div
      className={`header-bar px-md-4 ${
        auth?.status === "SIGNED_OUT" ? "" : ""
      }`}
    >
      <Navbar className={`navbar-light bg-white`} color="faded" expand="sm">
        <NavbarBrand href={`${process.env.NEXT_PUBLIC_LANDING_URL}`} className="mr-auto">
          <Image
            src="/images/siteLogo.svg"
            alt={brandName}
            width={214}
            height={60}
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        {processing ? (
          <Loader />
        ) : (
          <Collapse isOpen={isOpen} navbar className="justify-content-sm-end">
            <Nav navbar>
              <div className="d-none d-sm-flex">
                {auth?.status === "SIGNED_IN" ? (
                  <>
                    {tenant ? (
                      <UncontrolledDropdown nav>
                        <DropdownToggle nav caret>
                          <span style={{ cursor: "pointer" }}>
                            {tenant?.logo?.handle &&
                            fileAuth?.viewTenantLogo ? (
                              <TenantLogo
                                handle={tenant.logo.handle}
                                size="xs"
                                className="me-3"
                                viewFileAuth={fileAuth?.viewTenantLogo}
                              />
                            ) : null}
                            <h6 className={`${tenant?.logo?.handle ? "d-none d-md-inline-block" : "d-inline-block"} pt-2`}>
                              {tenant.name}
                            </h6>
                          </span>
                        </DropdownToggle>
                        <DropdownMenu
                          style={{
                            zIndex: 10000,
                            paddingLeft: "10px",
                            paddingRight: "10px",
                          }}
                        >
                          <Link href={`/tenant/${tenant._id}`} passHref>
                            <DropdownItem>
                              <IconText icon="home" text={t("tenant.Home")} />
                            </DropdownItem>
                          </Link>
                          <Link href="/user/profile" passHref>
                            <DropdownItem>
                              <IconText
                                icon="user"
                                text={t("user.Your Profile")}
                              />
                            </DropdownItem>
                          </Link>
                          {tenantAdmin ? (
                            <>
                              <DropdownItem divider />
                              <Link
                                href={`/tenant/${tenant._id}/admin/dashboard`}
                                passHref
                              >
                                <DropdownItem>
                                  <IconText
                                    icon="dashboard"
                                    text={t("tenant.admin.Dashboard")}
                                  />
                                </DropdownItem>
                              </Link>
                              <Link
                                href={`/tenant/${tenant._id}/admin/clients`}
                                passHref
                              >
                                <DropdownItem>
                                  <IconText
                                    icon="client"
                                    text={t("tenant.admin.Clients")}
                                  />
                                </DropdownItem>
                              </Link>
                              <Link
                                href={`/tenant/${tenant._id}/admin/team`}
                                passHref
                              >
                                <DropdownItem>
                                  <IconText
                                    icon="team"
                                    text={t("tenant.admin.Team")}
                                  />
                                </DropdownItem>
                              </Link>
                              <Link
                                href={`/tenant/${tenant._id}/admin/plan`}
                                passHref
                              >
                                <DropdownItem>
                                  <IconText
                                    icon="plan"
                                    text={t("tenant.admin.Plan")}
                                  />
                                </DropdownItem>
                              </Link>
                              <DropdownItem divider />
                              <Link
                                href={`/tenant/${tenant._id}/admin/settings`}
                                passHref
                              >
                                <DropdownItem>
                                  <IconText
                                    icon="settings"
                                    text={t("tenant.admin.Settings")}
                                  />
                                </DropdownItem>
                              </Link>
                            </>
                          ) : null}
                          <DropdownItem divider />
                          <Link href="/auth/signout" passHref>
                            <DropdownItem>
                              <IconText
                                icon="signout"
                                text={t("auth.Sign out")}
                              />
                            </DropdownItem>
                          </Link>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    ) : (
                      <UncontrolledDropdown nav>
                        <DropdownToggle nav>
                          <IconText
                            className="d-none d-sm-inline"
                            icon={"user"}
                          />
                          <IconText
                            className="d-inline d-sm-none"
                            icon={"user"}
                            text={getFullName(auth.user.name)}
                          />
                        </DropdownToggle>
                        <DropdownMenu style={{ zIndex: 10000 }}>
                          <Link href="/user/profile" passHref>
                            <DropdownItem>
                              <IconText
                                icon="user"
                                text={t("user.Your Profile")}
                              />
                            </DropdownItem>
                          </Link>
                          <DropdownItem divider />
                          <Link href="/auth/signout" passHref>
                            <DropdownItem>
                              <IconText
                                icon="signout"
                                text={t("auth.Sign out")}
                              />
                            </DropdownItem>
                          </Link>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    )}
                  </>
                ) : null}
                {auth?.status === "SIGNED_OUT" ? (
                  <>
                  <NavItem className="d-flex align-items-center me-1">
                    <Link href="/pricing" passHref>
                      <NavLink>
                        {t("plan.Pricing")}
                      </NavLink>
                    </Link>
                  </NavItem>
                    <NavItem className="d-flex align-items-center me-1">
                      <Link href="/auth/signin" passHref>
                        <NavLink>
                          {t("auth.Sign in")}
                        </NavLink>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/tenant/register" passHref>
                        <NavLink>
                          <Button size="lg" color="secondary">
                            {t("tenant.Start for free")}
                          </Button>
                        </NavLink>
                      </Link>
                    </NavItem>
                  </>
                ) : null}
              </div>

              <div className="d-inline d-sm-none mt-3">
                {auth?.status === "SIGNED_IN" ? (
                  <>
                    {tenant ? (
                      <>
                        <NavItem className=" my-3">
                          <Link href={`/tenant/${tenant._id}`} passHref>
                            <span style={{ cursor: "pointer" }}>
                              {tenant?.logo?.handle &&
                              fileAuth?.viewTenantLogo ? (
                                <TenantLogo
                                  handle={tenant.logo.handle}
                                  size="xs"
                                  className="me-3"
                                  viewFileAuth={fileAuth?.viewTenantLogo}
                                />
                              ) : null}
                              <h6 className="d-inline pt-2">{tenant.name}</h6>
                            </span>
                          </Link>
                        </NavItem>
                        <DropdownItem divider />
                        <NavItem>
                          <Link href={`/tenant/${tenant._id}`} passHref>
                            <NavLink>
                              <IconText icon="home" text={t("tenant.Home")} />
                            </NavLink>
                          </Link>
                        </NavItem>
                        <NavItem>
                          <Link href="/user/profile" passHref>
                            <NavLink>
                              <IconText
                                icon="user"
                                text={t("user.Your Profile")}
                              />
                            </NavLink>
                          </Link>
                        </NavItem>
                        {tenantAdmin ? (
                          <>
                            <DropdownItem divider />
                            <NavItem>
                              <Link
                                href={`/tenant/${tenant._id}/admin/dashboard`}
                                passHref
                              >
                                <NavLink>
                                  <IconText
                                    icon="dashboard"
                                    text={t("tenant.admin.Dashboard")}
                                  />
                                </NavLink>
                              </Link>
                            </NavItem>
                            <NavItem>
                              <Link
                                href={`/tenant/${tenant._id}/admin/clients`}
                                passHref
                              >
                                <NavLink>
                                  <IconText
                                    icon="client"
                                    text={t("tenant.admin.Clients")}
                                  />
                                </NavLink>
                              </Link>
                            </NavItem>
                            <NavItem>
                              <Link
                                href={`/tenant/${tenant._id}/admin/team`}
                                passHref
                              >
                                <NavLink>
                                  <IconText
                                    icon="team"
                                    text={t("tenant.admin.Team")}
                                  />
                                </NavLink>
                              </Link>
                            </NavItem>
                            <NavItem>
                              <Link
                                href={`/tenant/${tenant._id}/admin/plan`}
                                passHref
                              >
                                <NavLink>
                                  <IconText
                                    icon="plan"
                                    text={t("tenant.admin.Plan")}
                                  />
                                </NavLink>
                              </Link>
                            </NavItem>
                            <DropdownItem divider />
                            <NavItem>
                              <Link
                                href={`/tenant/${tenant._id}/admin/settings`}
                                passHref
                              >
                                <NavLink>
                                  <IconText
                                    icon="settings"
                                    text={t("tenant.admin.Settings")}
                                  />
                                </NavLink>
                              </Link>
                            </NavItem>
                          </>
                        ) : null}
                        <DropdownItem divider />
                        <NavItem>
                          <Link href="/auth/signout" passHref>
                            <NavLink>
                              <IconText
                                icon="signout"
                                text={t("auth.Sign out")}
                              />
                            </NavLink>
                          </Link>
                        </NavItem>
                      </>
                    ) : (
                      <UncontrolledDropdown nav>
                        <DropdownToggle nav>
                          <IconText
                            className="d-none d-sm-inline"
                            icon={"user"}
                          />
                          <IconText
                            className="d-inline d-sm-none"
                            icon={"user"}
                            text={getFullName(auth.user.name)}
                          />
                        </DropdownToggle>
                        <DropdownMenu style={{ zIndex: 10000 }}>
                          <Link href="/user/profile" passHref>
                            <DropdownItem>
                              <IconText
                                icon="user"
                                text={t("user.Your Profile")}
                              />
                            </DropdownItem>
                          </Link>
                          <DropdownItem divider />
                          <Link href="/auth/signout" passHref>
                            <DropdownItem>{t("auth.Sign out")}</DropdownItem>
                          </Link>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    )}
                  </>
                ) : null}
                {auth?.status === "SIGNED_OUT" ? (
                  <>
                    <NavItem className="d-flex align-items-center me-3">
                      <Link href="/pricing" passHref>
                        <NavLink>
                          <IconText icon="plan" text={t("plan.Pricing")} />
                        </NavLink>
                      </Link>
                    </NavItem>
                    <NavItem className="d-flex align-items-center me-3">
                      <Link href="/auth/signin" passHref>
                        <NavLink>
                          <IconText icon="signin" text={t("auth.Sign in")} />
                        </NavLink>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/tenant/register" passHref>
                        <NavLink>
                          <Button className="btn-block" size="md" color="secondary">
                            {t("tenant.Start for free")}
                          </Button>
                        </NavLink>
                      </Link>
                    </NavItem>
                  </>
                ) : null}
              </div>
            </Nav>
          </Collapse>
        )}
      </Navbar>
    </div>
  );
}

Header.propTypes = {
  brandName: PropTypes.string,
};

export default Header;
