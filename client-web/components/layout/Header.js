import React, { useState, useContext } from 'react';
import { Context as AuthContext } from '../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
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
import Loader from '../Loader';
import { getFullName } from '../../helpers/nameHelpers';
import IconText from '../IconText';
import styles from '../../styles/Header.module.scss';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

function Header({ brandName, requestLogout, openLogin, openSignup }) { 
  const { state: { auth } } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('common');
  const router = useRouter();

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <Navbar className="navbar-dark bg-primary" color="faded" expand="sm">
        <NavbarBrand href="/" className="mr-auto">
          <Image src="/images/siteLogoSmall.png" alt={brandName} width={160} height={20} />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        {processing
          ? <Loader />
          : <Collapse isOpen={isOpen} navbar className="justify-content-sm-end">
            <Nav navbar>
              {auth?.status === 'SIGNED_IN'
                ?  
                <UncontrolledDropdown nav>
                  <DropdownToggle nav>
                    <IconText
                      className="d-none d-sm-inline"
                      icon={'user'}
                    />
                    <IconText
                      className="d-inline d-sm-none"
                      icon={'user'}
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
                      <DropdownItem>
                        Your Profile
                      </DropdownItem>                
                    </Link>
                    <Link href="/user/cart" passHref> 
                      <DropdownItem>
                        Your Cart
                      </DropdownItem>                
                    </Link>
                    <Link href="/auth/signout" passHref> 
                      <DropdownItem>
                      {t('auth.Sign out')}
                      </DropdownItem>                
                    </Link>
                  </DropdownMenu>
                </UncontrolledDropdown>
                : (auth?.status === 'SIGNED_OUT'
                  ? <NavItem>
                      <Link href="/auth/signin" passHref>  
                        <NavLink>
                          {t('auth.Sign in')}
                        </NavLink>
                      </Link>
                    </NavItem>   
                  : <></>             
                )
              }
            </Nav>
          </Collapse>
        }
        
      </Navbar>
    </div>
  )
}

export default Header
