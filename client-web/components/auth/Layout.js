import { useState, useEffect, useContext } from "react";
import styles from "../../styles/Signin.module.scss";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import TenantLogo from "../../components/tenant/TenantLogo";

export default function Layout({ children }) {
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth, fileAuth, errorMessage },
    signin,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    clearAuthErrorMessage();
  }, []);

  return (
    <>
      <div className="row mt-4">
        <div className="col-12 col-md-6">{children}</div>
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-start" style={{paddingTop: 'min(100px, 5%)'}}>
          {/* <div style={{ position: 'fixed' }}> */}
          {tenant?.logo?.handle && fileAuth?.viewTenantLogo ? (
            <TenantLogo
              handle={tenant.logo.handle}
              size="lg"
              viewFileAuth={fileAuth?.viewTenantLogo}
            />
          ) : (
            <img src="/images/siteLogo.svg" style={{width: "75%"}} />
          )}
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
