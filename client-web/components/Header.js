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

function Header({ brandName, requestLogout, openLogin, openSignup }) {
  const [isOpen, setIsOpen] = useState(false)
  const {state: { user: authUser }} = useContext(AuthContext);

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
      {/* <Navbar className="fixed-top navbar-dark bg-dark" color="faded" light expand="xs">
        <div className="container-fluid">
          <Link href="/" passHref>
            <NavbarBrand>{brandName}</NavbarBrand>
          </Link>
          <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <FontAwesomeIcon icon={icons.search} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>
                  <div className="input-group" style={{ minWidth: '250px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      aria-label={t('Search')}
                      aria-describedby="basic-addon2"                        
                    />
                    <div className="input-group-append">
                      <Button color="light">
                        <IconText
                          icon={'search'}
                          text={t('Search')}
                        />
                      </Button>
                    </div>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {authUser
              ? <UncontrolledDropdown nav>
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
                      text={t('auth.Log Out')}
                    />
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              : <div>
                <Link href="/signup" passHref>
                  <Button
                    color="secondary">
                    {t('auth.Sign Up')}
                  </Button>
                </Link>
                <Link href="/signin" passHref>
                  <Button
                    color="light">
                    {t('auth.Sign In')}
                  </Button>
                </Link>
              </div>
            }
          </Nav>
          </Collapse>
        </div>
      </Navbar> */}
      <Navbar className="fixed-top navbar-dark bg-dark" color="faded" light expand="xs">
        <Link href="/" passHref>
          <NavbarBrand>{brandName}</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar right>
          <Nav className="ml-auto" navbar>
            <Link href="/signin" passHref>              
              <NavItem>
                <Button
                  color="secondary">
                  {t('auth.Sign In')}
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
                      text={t('auth.Log Out')}
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
