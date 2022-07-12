import React from "react";
import PropTypes from "prop-types";
import PaginatedList from "../../PaginatedList";
import InviteListItem from "../../user/InviteListItem";

const TeamInvitesList = ({ onSelectInvite, itemsPerPage, invites, fetchInvites, resetPaginationSignal, t }) => {

  return (
    <>
      <PaginatedList
        items={invites?.data?.length ? invites : []}
        itemComponent={InviteListItem}
        itemComponentCustomProps={{}}
        itemPropName={"invite"}
        itemsListedName={t("tenant.invites")}
        itemsPerPage={itemsPerPage}
        requestItemsFunc={async ({ skip, limit }) => {
          await fetchInvites({ skip, limit });
        }}
        showPaginationBottom
        hidePaginationForSinglePage
        itemOnClick={invite => {
          onSelectInvite(invite)
        }}
        showLink={true}
        resetPaginationSignal={resetPaginationSignal}
        t={t}
      />
    </>
  );
};

TeamInvitesList.propTypes = {
  invites: PropTypes.object,
  onSelectUser: PropTypes.func,
  fetchInvites: PropTypes.func
};

TeamInvitesList.defaultProps = {};

export default TeamInvitesList;
