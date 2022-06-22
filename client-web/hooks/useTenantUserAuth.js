const useTenantUserAuth = ({ tenant, auth }) => {
  return {
      isMember: auth?.status && tenant && auth?.user?.tenant?._id === tenant._id,
      isAdmin: auth?.status && tenant && auth?.user?.tenant?._id === tenant._id && auth?.user?.isTenantAdmin
  };
};

export default useTenantUserAuth;