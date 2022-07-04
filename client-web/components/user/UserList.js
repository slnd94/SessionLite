import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
// import Plan from "./Plan";
import { PlaceholderButton } from "reactstrap";
import PaginatedList from "../PaginatedList";
import UserListItem from "./UserListItem";

const UserList = ({ users, onSelectUser, itemsPerPage, t }) => {
  return (
    <>
      <PaginatedList
        items={users?.data?.length ? users : []}
        itemComponent={UserListItem}
        itemComponentCustomProps={{}}
        itemPropName={"user"}
        itemsListedName={t("tenant.users")}
        itemsPerPage={itemsPerPage}
        showPaginationTop
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
