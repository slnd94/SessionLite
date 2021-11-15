import React, { useState } from 'react';
import Link from 'next/link';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Badge } from 'reactstrap';
import { getFullName } from '../helpers/nameHelpers';
import { icons, FontAwesomeIcon } from '../utils/fontAwesome/fontAwesome';
import IconText from './IconText';
import styles from '../styles/Footer.module.scss'

function Header({ requestLogout, openLogin, openSignup, authUser }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  const logout = () => {
    return requestLogout()
      .then(() => {
        // this.props.history.push('/');
        // toastr.info(t('auth.Logged Out'), t('auth.You have logged out'));
      });
  }

  const t = (term) => term;

  return (
    <div>
      <Navbar style={{position: 'fixed', top: 0}} color="light" light expand="md">
        <NavbarBrand href="/">reactstrap</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/signin">Sign in</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default Header
