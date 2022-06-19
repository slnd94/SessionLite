const useClientUserAuth = ({ client, auth }) => {
  return {
      isMember: auth?.status && client && auth?.user?.client?._id === client._id,
      isAdmin: auth?.status && client && auth?.user?.client?._id === client._id && auth?.user?.isClientAdmin
  };
};

export default useClientUserAuth;