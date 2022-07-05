import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
// import Plan from "./Plan";
import { PlaceholderButton } from "reactstrap";
import api from "../../utils/api";
import PaginatedList from "../PaginatedList";
import UserListItem from "./UserListItem";

const UserList = ({ tenant, onSelectUser, itemsPerPage, t }) => {
  const [users, setUsers] = useState(null);
  const [requestingUsers, setRequestingUsers] = useState(null);

  const fetchUsers = async ({ skip, limit }) => {
    setRequestingUsers(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-users`,
      params: {
        $skip: skip,
        $limit: limit,
        ...(tenant ? { tenant } : {}),
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setUsers(response.data);
      setRequestingUsers(false);
      return { success: true };
    } else {
      setUsers(null);
      setRequestingUsers(false);
      return { success: false };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchUsers({ skip: 0, limit: itemsPerPage }).catch(console.error);
    return () => (isSubscribed = false);
  }, []);

  return (
    <>
      <PaginatedList
        items={users?.data?.length ? users : []}
        itemComponent={UserListItem}
        itemComponentCustomProps={{}}
        itemPropName={"user"}
        itemsListedName={t("tenant.users")}
        itemsPerPage={itemsPerPage}
        requestItemsFunc={async ({ skip, limit }) => {
          await fetchUsers({ skip, limit });
        }}
        showPaginationBottom
        hidePaginationForSinglePage
        itemNavRoute={"/users"}
        showLink={true}
        t={t}
        // onRef={ref => (this.paginatedList = ref)}
      />
    </>
  );
};

UserList.propTypes = {
  users: PropTypes.array,
  onSelectUser: PropTypes.func,
};

UserList.defaultProps = {};

export default UserList;
