import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaginatedList from "../../PaginatedList";
import UserListItem from "../../user/UserListItem";

const TeamUserList = ({
  onSelectUser,
  itemsPerPage,
  users,
  fetchUsers,
  requestItemsSignal,
  t,
}) => {
  return (
    <>
      <PaginatedList
        items={users?.data?.length ? users : []}
        itemComponent={UserListItem}
        itemComponentCustomProps={{}}
        itemPropName={"user"}
        itemsListedName={t("tenant.users")}
        itemsPerPage={itemsPerPage}
        requestItemsFunc={async ({ skip, limit, search }) => {
          await fetchUsers({ skip, limit, search });
        }}
        showPaginationBottom
        hidePaginationForSinglePage
        itemOnClick={(user) => {
          onSelectUser(user);
        }}
        showLink={true}
        requestItemsSignal={requestItemsSignal}
        showSearch={true}
        searchPlaceholder={t("tenant.admin.team.Name Search")}
        t={t}
      />
    </>
  );
};

TeamUserList.propTypes = {
  users: PropTypes.object,
  onSelectUser: PropTypes.func,
  fetchUsers: PropTypes.func,
  searcFunc: PropTypes.func,
};

TeamUserList.defaultProps = {};

export default TeamUserList;
