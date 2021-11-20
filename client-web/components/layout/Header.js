import React, { useState, useContext } from 'react';
import { Context as AuthContext } from '../../context/AuthContext';
import Link from 'next/link';
import {
  Collapse,
  Navbar,
  // NavbarBrand,
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
import Loader from '../Loader';
import { getFullName } from '../../helpers/nameHelpers';
import IconText from '../IconText';
import styles from '../../styles/Header.module.scss'
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

function Header({ brandName, requestLogout, openLogin, openSignup }) {
  const { state: { user: authUser }, signout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('common');
  const router = useRouter();

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <Navbar className="fixed-top navbar-dark bg-primary" color="faded" expand="sm">
        <Link href="/" passHref>
          <a className="navbar-brand">
            {brandName}
          </a>
        </Link>
        <NavbarToggler onClick={toggle} />
        {processing
          ? <Loader />
          : <Collapse isOpen={isOpen} navbar>
            <Nav navbar>
              {authUser
                ? <UncontrolledDropdown nav>
                  <DropdownToggle nav>
                    <IconText
                      icon={'user'}
                      text={''}
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link href="/user/profile" passHref> 
                      <DropdownItem>
                        Profile  
                      </DropdownItem>                
                    </Link>
                    <Link href=" " passHref> 
                      <DropdownItem onClick={async () => {
                        setProcessing(true);
                        const request = await signout();
                        if (request.success) {
                          router.push({ pathname: '/signedout' });
                        }
                        setProcessing(false);
                      }}>
                        {t('auth.Sign out')}
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
        }
        
      </Navbar>
    </div>
  )
}

export default Header
