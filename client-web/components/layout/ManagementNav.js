import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  Nav,
  NavItem
} from 'reactstrap';
import IconText from '../IconText';

export default function Layout({ prefix, subRoutes }) {
  const { t } = useTranslation('common');

  const router = useRouter()
  const currentPath = router.pathname;

  return (
    <>
      <Nav className="d-md-none">
        {subRoutes.map(subRoute => (
          <NavItem key={subRoute.slug}>
            <Link href={`/${prefix}/${subRoute.slug}`} passHref> 
              <a className={`nav-link ${currentPath === ('/' + prefix + '/' + subRoute.slug) ? 'active' : ''}`}>
                <IconText
                  icon={subRoute.icon}
                  text={t(`${prefix}.${subRoute.label}`)}
                />
              </a>
            </Link>
          </NavItem>
        ))}
      </Nav>

      <Nav vertical pills className="d-none d-md-block">
        {subRoutes.map(subRoute => (
          <NavItem key={subRoute.slug}>
            <Link href={`/${prefix}/${subRoute.slug}`} passHref> 
              <a className={`nav-link ${currentPath === ('/' + prefix + '/' + subRoute.slug) ? 'active' : ''}`}>
                <IconText
                  icon={subRoute.icon}
                  text={t(`${prefix}.${subRoute.label}`)}
                />
              </a>
            </Link>
          </NavItem>
        ))}
      </Nav>
    </>
  )
}