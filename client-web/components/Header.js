import React, { useState, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler, 
  Nav,
  NavLink,
  NavItem,
  // NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { getFullName } from '../helpers/nameHelpers';
import { icons, FontAwesomeIcon } from '../utils/fontAwesome/fontAwesome';
import IconText from './IconText';
import styles from '../styles/Header.module.scss'
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

function Header({ brandName, requestLogout, openLogin, openSignup }) {
  const [isOpen, setIsOpen] = useState(false)
  const { state: { user: authUser }, signout } = useContext(AuthContext);
  const { t } = useTranslation('common');
  const router = useRouter();

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
      <Navbar className="fixed-top navbar-dark bg-primary" color="faded" expand="sm">
        <Link href="/" passHref>
          <NavbarBrand>{brandName}</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse className="d-flex" isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {authUser
              ? <UncontrolledDropdown nav>
                <DropdownToggle nav>
                  <IconText
                    icon={'user'}
                    text={t('auth.User')}
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <Link href="/user/profile" passHref> 
                    <DropdownItem>
                      <IconText
                        icon={'user'}
                        text={authUser.name
                          ? getFullName(authUser.name)
                          : authUser.email
                        }
                      />    
                    </DropdownItem>                
                  </Link>
                  <Link href=" "> 
                    <DropdownItem onClick={async () => {
                      await signout();
                      router.push({ pathname: '/signedout' });
                    }}>
                      <IconText
                        icon={'logout'}
                        text={t('auth.Sign out')}
                      />
                    </DropdownItem>                
                  </Link>
                </DropdownMenu>
              </UncontrolledDropdown>
              : <NavItem>
                <Link href="/signin" passHref>  
                  <NavLink>
                    {t('auth.Sign in')}
                  </NavLink>
                </Link>
              </NavItem>
            }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default Header
