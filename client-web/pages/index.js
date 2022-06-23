import { useEffect, useState, useContext } from "react";
import { Context as TenantContext } from "../context/TenantContext";
import { Context as AuthContext } from "../context/AuthContext";
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import PaginatedList from "../components/PaginatedList";
import ProductListItem from "../components/product/ProductListItem";
import api from "../utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home() {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const [products, setProducts] = useState(null);
  const [requestingProducts, setRequestingProducts] = useState(false);
  const productsPerPage = 5;

  const fetchProducts = async ({ skip, limit }) => {
    setRequestingProducts(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/products`,
      params: {
        $skip: skip,
        $limit: limit,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setProducts(response.data);
      setRequestingProducts(false);
      return { success: true };
    } else {
      setProducts(null);
      setRequestingProducts(false);
      return { success: false };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchProducts({ skip: 0, limit: productsPerPage }).catch(console.error);
    return () => (isSubscribed = false);
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <h3 className="title">
          {t("index.Welcome to")}&nbsp;{process.env.NEXT_APP_NAME}
        </h3>

        {auth?.status === "SIGNED_OUT" ? (
          <div>
            <Link href="/auth/signin">{t("auth.Sign in")}</Link>
            <br />
            <Link href="/auth/signup">{t("auth.Sign up")}</Link>
            <br />
            <Link href="/tenant/register/selectplan">
              {t("tenant.Register Your Business")}
            </Link>
            <br />
            <Link href="/plans/checkout">
              {t("tenant.Plan Checkout")}
            </Link>
          </div>
        ) : (
          <></>
        )}
        {products ? (
          <>
            <PaginatedList
              items={products}
              itemComponent={ProductListItem}
              itemPropName={"product"}
              itemsListedName={t("product.products")}
              itemsPerPage={productsPerPage}
              showPaginationTop
              showPaginationBottom
              hidePaginationForSinglePage
              requestItemsFunc={async ({ skip, limit }) => {
                await fetchProducts({ skip, limit });
              }}
              requestingItems={requestingProducts}
              itemNavRoute={"/product"}
              showLink={true}
              t={t}
              // onRef={ref => (this.paginatedList = ref)}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
