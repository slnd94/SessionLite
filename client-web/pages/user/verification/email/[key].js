import { useState, useEffect, useContext } from "react";
import { Context as TenantContext } from "../../../../context/TenantContext";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as UserContext } from "../../../../context/UserContext";
import useTenantUserAuth from "../../../../hooks/useTenantUserAuth";
import styles from "../../../../styles/User.module.scss";
import Link from "next/link";
import { Alert, Button, Progress } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import IconText from "../../../../components/IconText";

export default function VerifyEmail() {
  const { t } = useTranslation("common");
  const {
    state: { tenant },
    getTenant,
  } = useContext(TenantContext);
  const {
    state: { auth },
    getAuth,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const { verifyUserEmail, setUserEmailVerification } = useContext(UserContext);
  const [verifiedStatus, setVerifiedStatus] = useState("");
  const [verificationResentSuccess, setVerificationResentSuccess] =
    useState(false);
  const [userTenantAdminAuthorized, setUserTenantAdminAuthorized] =
    useState(false);
  const router = useRouter();
  const { key } = router.query;

  useEffect(() => {
    if (auth?.status === "SIGNED_OUT") {
      router.push({
        pathname: "/auth/signin",
        query: {
          redirect: router.asPath,
        },
      });
    }
    if (
      auth?.status === "SIGNED_IN" &&
      !auth?.user?.isVerified &&
      verifiedStatus === ""
    ) {
      setVerifiedStatus("VERIFYING");
      verifyUserEmail({
        id: auth.user._id,
        key,
      }).then((res) => {
        getAuth();
        if (res.verified) {
          setVerifiedStatus("SUCCESS");
        } else {
          setVerifiedStatus("FAILED");
        }
      });
    }
  }, [auth]);

  useEffect(() => {
    if (tenant && auth?.status === "SIGNED_IN") {
      const { isAdmin } = useTenantUserAuth({ tenant, auth });
      if (isAdmin) {
        setUserTenantAdminAuthorized(true);
      } else {
        setUserTenantAdminAuthorized(false);
      }
    } else {
      setUserTenantAdminAuthorized(false);
    }
  }, [auth, tenant]);

  return (
    <>
      <div className="row mt-2 pt-2" style={{ opacity: "90%" }}>
        <div className="col-12">
          <Progress value={40} striped={true} color="secondary" />
        </div>
      </div>
      <div className="row mt-4">
        {auth?.status === "SIGNED_IN" ? (
          <>
            {auth.user.isVerified ? (
              <div className="col-12">
                <h3 className="title">{t("Thank You")}</h3>
                <p>
                  {t(
                    `user.account.verification.Your account has been verified`
                  )}
                </p>
                {tenant ? (
                  <Link href={`/tenant/${tenant._id}`}>
                    <a>
                      <Button size="md" color="secondary" className="m-0 btn-block-md-down">
                        {userTenantAdminAuthorized && !tenant.plan ? (
                          <IconText
                            icon="arrowRight"
                            iconPosition="end"
                            text={t("Continue")}
                          />
                        ) : (
                          t("tenant.Home")
                        )}
                      </Button>
                    </a>
                  </Link>
                ) : (
                  <Link href={"/"}>
                    <a>
                      <Button size="md" color="secondary" className="m-0">
                        {t("Home")}
                      </Button>
                    </a>
                  </Link>
                )}
              </div>
            ) : null}
            {verifiedStatus === "FAILED" ? (
              <div className="col-12">
                <h3 color="danger" fade={false}>
                  {t(
                    `user.account.verification.Your account could not be verified`
                  )}
                </h3>
                <div className="mt-4">
                  {t(
                    "user.account.verification.The link in your email is valid for 24 hours after we send it to you.  If it has been longer than 24 hours, you can request a new email."
                  )}
                </div>
                <Button
                  className={"mt-4"}
                  onClick={() => {
                    setUserEmailVerification({ id: auth.user._id }).then(
                      (res) => {
                        if (res.vertificationSetSuccess) {
                          setVerificationResentSuccess(true);
                          setTimeout(() => {
                            setVerificationResentSuccess(false);
                          }, 10000);
                        }
                      }
                    );
                  }}
                >
                  {t("user.account.verification.Send me a new email")}
                </Button>

                {verificationResentSuccess ? (
                  <Alert className="mt-4" color="success" fade={false}>
                    {t(
                      `user.account.verification.Verification mail re-sent. Check your email for the new link.`
                    )}
                  </Alert>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
