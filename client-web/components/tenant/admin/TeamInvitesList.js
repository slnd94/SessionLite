import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
// import Plan from "./Plan";
import { PlaceholderButton } from "reactstrap";
import api from "../../../utils/api";
import PaginatedList from "../../PaginatedList";
import InviteListItem from "../../user/InviteListItem";

const TeamInvitesList = ({ tenant, onSelectInvite, itemsPerPage, invites, fetchInvites, resetPaginationSignal, t }) => {

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
        // itemNavRoute={"/invites"}
        itemOnClick={invite => {
          onSelectInvite(invite)
        }}
        showLink={true}
        resetPaginationSignal={resetPaginationSignal}
        t={t}
        // onRef={ref => (this.paginatedList = ref)}
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
