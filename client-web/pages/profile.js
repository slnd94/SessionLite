import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../context/AuthContext';
import styles from '../styles/Profile.module.scss'
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
import IconText from '../components/IconText';

export default function SignedIn() {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);

  return (
    <>
      <h1 className="title">
        {t('profile.Profile')}  
      </h1>

      <p>
        {auth?.status === 'SIGNED_IN'
          ? <div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Nav className="d-md-none">
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'user'}
                            text={t('profile.Profile')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'account'}
                            text={t('profile.Account')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'account'}
                            text={t('profile.Account')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                  </Nav>

                  <Nav vertical pills className="d-none d-md-block">
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'user'}
                            text={t('profile.Profile')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'account'}
                            text={t('profile.Account')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'account'}
                            text={t('profile.Account')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                  </Nav>
                </div>
                <div className="col-md-9">
                  content here
                </div>
              </div>
              {/* <div className="row">
                <div className="col-md-3 mb-3">
                  <Nav className="">
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'user'}
                            text={t('profile.Profile')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'account'}
                            text={t('profile.Account')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/profile" passHref> 
                        <a className="nav-link">
                          <IconText
                            icon={'cart'}
                            text={t('profile.Cart')}
                          />
                        </a>
                      </Link>
                    </NavItem>
                  </Nav>
                </div>
                <div className="col-md-9">
                  content here
                </div>
              </div> */}
            </div>
          : (auth?.status === 'SIGNED_OUT'
            ? <>
                <Link href="/signin">{t('auth.Sign in')}</Link>
              </>
            : <></>             
          )
        }
      </p>
      
    </>
  )
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
}