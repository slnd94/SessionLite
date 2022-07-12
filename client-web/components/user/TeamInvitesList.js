import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
// import Plan from "./Plan";
import { PlaceholderButton } from "reactstrap";
import api from "../../utils/api";
import PaginatedList from "../PaginatedList";
import InviteListItem from "./InviteListItem";

const TeamInvitesList = ({ tenant, onSelectInvite, itemsPerPage, t }) => {
  const [invites, setInvites] = useState(null);
  const [requestingInvites, setRequestingInvites] = useState(null);

  const fetchInvites = async ({ skip, limit }) => {
    setRequestingInvites(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-team-invites`,
      params: {
        $skip: skip,
        $limit: limit,
        ...(tenant ? { tenant } : {}),
      }
    });

    if (response.status >= 200 && response.status < 300) {
      setInvites(response.data);
      setRequestingInvites(false);
      return { success: true };
    } else {
      setInvites(null);
      setRequestingInvites(false);
      return { success: false };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchInvites({ skip: 0, limit: itemsPerPage }).catch(console.error);
    return () => (isSubscribed = false);
  }, []);

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
        t={t}
        // onRef={ref => (this.paginatedList = ref)}
      />
    </>
  );
};

TeamInvitesList.propTypes = {
  // invites: PropTypes.array,
  onSelectUser: PropTypes.func,
};

TeamInvitesList.defaultProps = {};

export default TeamInvitesList;
