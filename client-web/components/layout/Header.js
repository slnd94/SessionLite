import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
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
} from "reactstrap";
import Loader from "../Loader";
import { getFullName } from "../../helpers/nameHelpers";
import IconText from "../IconText";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../styles/Header.module.scss";

function Header({ brandName }) {
  const {
    state: { auth },
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

  return (
    <div>
      <Navbar className="navbar-dark bg-primary" color="faded" expand="sm">
        <NavbarBrand href="/" className="mr-auto">
          <Image
            src="/images/siteLogoSmall.png"
            alt={brandName}
            width={160}
            height={20}
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
    </div>
  );
}

Header.propTypes = {
  brandName: PropTypes.string,
};

export default Header;
