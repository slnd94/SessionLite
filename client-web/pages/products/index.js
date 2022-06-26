import { useEffect, useState, useContext } from "react";
import PaginatedList from "../../components/PaginatedList";
import ProductListItem from "../../components/products/ProductListItem";
import api from "../../utils/api";
import styles from "../../styles/Products.module.scss";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home() {
  const { t } = useTranslation("common");
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
          {t("products.Products")}
        </h3>
        {products ? (
          <>
            <PaginatedList
              items={products}
              itemComponent={ProductListItem}
              itemPropName={"product"}
              itemsListedName={t("products.products")}
              itemsPerPage={productsPerPage}
              showPaginationTop
              showPaginationBottom
              hidePaginationForSinglePage
              requestItemsFunc={async ({ skip, limit }) => {
                await fetchProducts({ skip, limit });
              }}
              requestingItems={requestingProducts}
              itemNavRoute={"/products"}
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
