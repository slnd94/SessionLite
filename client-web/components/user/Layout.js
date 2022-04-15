import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../../context/AuthContext';
import styles from '../../styles/User.module.scss'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
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
import IconText from '../IconText';

export default function Layout({ children, activeTab}) {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);

  const router = useRouter()
  const currentPath = router.pathname;

  const subRoutes = [
    {
      slug: 'profile',
      icon: 'profile',
      label: 'Profile'
    },
    {
      slug: 'account',
      icon: 'account',
      label: 'Account'
    }
  ];

  return (
    <>
      {auth?.status === 'SIGNED_IN'
        ? <>
            <h1 className="title">
              {auth.user.name.given}
            </h1>
            <div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Nav className="d-md-none">
                    {subRoutes.map(subRoute => (
                      <NavItem key={subRoute.slug}>
                        <Link href={`/user/${subRoute.slug}`} passHref> 
                          <a className={`nav-link ${currentPath === ('/user/' + subRoute.slug) ? 'active' : ''}`}>
                            <IconText
                              icon={subRoute.icon}
                              text={t(`user.${subRoute.label}`)}
                            />
                          </a>
                        </Link>
                      </NavItem>
                    ))}
                  </Nav>

                  <Nav vertical pills className="d-none d-md-block">
                    {subRoutes.map(subRoute => (
                      <NavItem key={subRoute.slug}>
                        <Link href={`/user/${subRoute.slug}`} passHref> 
                          <a className={`nav-link ${currentPath === ('/user/' + subRoute.slug) ? 'active' : ''}`}>
                            <IconText
                              icon={subRoute.icon}
                              text={t(`user.${subRoute.label}`)}
                            />
                          </a>
                        </Link>
                      </NavItem>
                    ))}
                  </Nav>
                </div>
                <div className="col-md-9">
                  {children}
                </div>
              </div>
            </div>
          </>
        : (auth?.status === 'SIGNED_OUT'
          ? <>
              <Link href="/signin">{t('auth.Sign in')}</Link>
            </>
          : <></>             
        )
      }
      
      
    </>
  )
}