import React, { useState, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler, 
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button } from 'reactstrap';
import { getFullName } from '../helpers/nameHelpers';
import { icons, FontAwesomeIcon } from '../utils/fontAwesome/fontAwesome';
import IconText from './IconText';
import styles from '../styles/Header.module.scss'
import { useTranslation } from 'next-i18next';

function Header({ brandName, requestLogout, openLogin, openSignup }) {
  const [isOpen, setIsOpen] = useState(false)
  const {state: { user: authUser }} = useContext(AuthContext);
  const { t } = useTranslation('common');

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

  // const t = (term) => term;

  return (
    <div>
      <Navbar className="fixed-top navbar-dark bg-dark" color="faded" light expand="xs">
        <Link href="/" passHref>
          <NavbarBrand>{brandName}</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <Link href="/signin" passHref>              
              <NavItem>
                <Button
                  color="secondary">
                  {t('auth.Sign in')}
                </Button>
              </NavItem>
            </Link>
            {authUser
              ? <UncontrolledDropdown nav inNavBar>
                <DropdownToggle nav>
                  <FontAwesomeIcon icon={icons.user} />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} href="/user/profile">
                    <IconText
                      icon={'user'}
                      text={authUser.name
                        ? getFullName(authUser.name)
                        : authUser.email
                      }
                    />
                  </DropdownItem>
                  <DropdownItem tag={Link} href=" " onClick={() => this.logout()}>
                    <IconText
                      icon={'logout'}
                      text={t('auth.Sign out')}
                    />
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              : null
            }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default Header
