import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Context as ClientContext } from "../../context/ClientContext";
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
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import useClientUserAuth from "../../hooks/useClientUserAuth";
import Loader from "../Loader";
import { getFullName } from "../../helpers/nameHelpers";
import IconText from "../IconText";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ClientLogo from "../client/ClientLogo";
import styles from "../../styles/Header.module.scss";

function Header({ brandName }) {
  const {
    state: { client },
  } = useContext(ClientContext);
  const {
    state: { auth, fileAuth },
  } = useContext(AuthContext);
  const {
    state: { cart },
  } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userClientAdminAuthorized, setUserClientAdminAuthorized] =
    useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    if (client && auth?.status === "SIGNED_IN") {
      const { isAdmin } = useClientUserAuth({ client, auth });
      if (isAdmin) {
        setUserClientAdminAuthorized(true);
      } else {
        setUserClientAdminAuthorized(false);
      }
    } else {
      setUserClientAdminAuthorized(false);
    }
  }, [client, auth]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Navbar className="navbar-dark bg-primary" color="faded" expand="sm">
        <NavbarBrand href="/" className="mr-auto">
          <Image
            src="/images/siteLogoSmall.png"
            alt={brandName}
            width={160}
            height={24}
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        {processing ? (
          <Loader />
        ) : (
          <Collapse isOpen={isOpen} navbar className="justify-content-sm-end">
            <Nav navbar>
              {auth?.status === "SIGNED_IN" ? (
                <>
                  <UncontrolledDropdown nav>
                    <DropdownToggle nav>
                      <IconText className="d-none d-sm-inline" icon={"user"} />
                      <IconText
                        className="d-inline d-sm-none"
                        icon={"user"}
                        text={getFullName(auth.user.name)}
                      />
                    </DropdownToggle>
                    <DropdownMenu>
                      <Link href="/user/profile" passHref>
                        <DropdownItem>
                          {getFullName(auth.user.name)}
                        </DropdownItem>
                      </Link>
                      <DropdownItem divider />
                      <Link href="/user/profile" passHref>
                        <DropdownItem>Your Profile</DropdownItem>
                      </Link>
                      <Link href="/user/cart" passHref>
                        <DropdownItem>Your Cart</DropdownItem>
                      </Link>
                      <Link href="/auth/signout" passHref>
                        <DropdownItem>{t("auth.Sign out")}</DropdownItem>
                      </Link>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <NavItem>
                    <Link href="/user/cart" passHref>
                      <NavLink>
                        {cart?.items?.length > 0 && (
                          <Badge
                            color="info"
                            pill
                            style={{ float: "right", marginTop: "-10px" }}
                          >
                            {cart.items.length}
                          </Badge>
                        )}
                        <IconText
                          className="d-none d-sm-inline"
                          icon={"cart"}
                        />
                        <IconText
                          className="d-inline d-sm-none"
                          icon={"cart"}
                          text={t("user.cart.Your Cart")}
                        />
                      </NavLink>
                    </Link>
                  </NavItem>
                </>
              ) : auth?.status === "SIGNED_OUT" ? (
                <NavItem>
                  <Link href="/auth/signin" passHref>
                    <NavLink>{t("auth.Sign in")}</NavLink>
                  </Link>
                </NavItem>
              ) : (
                <></>
              )}
            </Nav>
          </Collapse>
        )}
      </Navbar>
      {client ? (
        <div className="row m-0 pt-2 client-header">
          <div className="d-flex col-11 justify-content-md-start align-items-center">
            <h5 className="m-0">
              <Link href={`/client/${client._id}`}>
                <span style={{ cursor: "pointer" }}>
                  {client?.logo?.handle && fileAuth?.viewClientLogo ? (
                    <ClientLogo
                      handle={client.logo.handle}
                      size="xs"
                      className="me-3 mb-2"
                      viewFileAuth={fileAuth?.viewClientLogo}
                    />
                  ) : (
                    <></>
                  )}
                  <span className="d-none d-md-inline">{client.name}</span>
                </span>
              </Link>
            </h5>
          </div>
          {userClientAdminAuthorized ? (
            <div className="d-flex col-1 justify-content-end align-items-center">
              <h5 className="m-0">
                <Link href={`/client/${client._id}/admin/details`}>
                  <Button color="default">
                    <IconText icon="clientAdmin" text={t("client.Admin")} />
                  </Button>
                </Link>
              </h5>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

Header.propTypes = {
  brandName: PropTypes.string,
};

export default Header;
