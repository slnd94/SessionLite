import React from "react";
import PropTypes from "prop-types";
import PaginatedList from "../../PaginatedList";
import InviteListItem from "../../user/InviteListItem";

const UserInvitesList = ({
  onSelectInvite,
  itemsPerPage,
  invites,
  fetchInvites,
  requestItemsSignal,
  t,
}) => {
  return (
    <>
      <PaginatedList
        items={invites?.data?.length ? invites : []}
        itemComponent={InviteListItem}
        itemComponentCustomProps={{}}
        itemPropName={"invite"}
        itemsListedName={t("tenant.invites")}
        itemsPerPage={itemsPerPage}
        requestItemsFunc={async ({ skip, limit, search }) => {
          await fetchInvites({ skip, limit, search });
        }}
        showPaginationBottom
        hidePaginationForSinglePage
        itemOnClick={(invite) => {
          onSelectInvite(invite);
        }}
        showLink={true}
        requestItemsSignal={requestItemsSignal}
        showSearch={true}
        searchPlaceholder={t("tenant.admin.users.Search Email")}
        t={t}
      />
    </>
  );
};

UserInvitesList.propTypes = {
  invites: PropTypes.object,
  onSelectUser: PropTypes.func,
  fetchInvites: PropTypes.func,
};

UserInvitesList.defaultProps = {};

export default UserInvitesList;
