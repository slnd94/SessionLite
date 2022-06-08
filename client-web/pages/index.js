import { useEffect, useState, useContext } from "react";
import { Context as ClientContext } from "../context/ClientContext";
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
    state: { client },
  } = useContext(ClientContext);
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
        <h1 className="title">
          {t("index.Welcome to")}&nbsp;{process.env.NEXT_APP_NAME}
        </h1>

        {auth?.status === "SIGNED_OUT" ? (
          <div>
            <Link href="/auth/signin">{t("auth.Sign in")}</Link>
            <br />
            <Link href="/auth/signup">{t("auth.Sign up")}</Link>
            <br />
            <Link href="/client/register">
              {t("client.Register Your Business")}
            </Link>
          </div>
        ) : (
          <div>
            {client ? (
              <Link href={`/client/${client._id}`}>
                {t("client.Client Home")}
              </Link>
            ) : (
              <></>
            )}
          </div>
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
