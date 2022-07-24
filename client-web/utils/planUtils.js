export const tenantPlanEligibility = ({ plan, usage }) => {
  const eligibility = {
    usageOverEligibility: [],
    eligible: true,
  };

  if (
    plan.allowances?.users?.team?.active > -1 &&
    usage.users.team.active > plan.allowances.users.team.active
  ) {
    eligibility.usageOverEligibility.push("users.team.active");
  }

  if (
    plan.allowances?.users?.team?.invites > -1 &&
    usage.users.team.invites > plan.allowances.users.team.invites
  ) {
    eligibility.usageOverEligibility.push("users.team.invites");
  }

  if (
    plan.allowances?.users?.team?.total > -1 &&
    usage.users.team.total > plan.allowances.users.team.total
  ) {
    eligibility.usageOverEligibility.push("users.team.total");
  }

  if (
    plan.allowances?.users?.client?.active > -1 &&
    usage.users.client.active > plan.allowances.users.client.active
  ) {
    eligibility.usageOverEligibility.push("users.client.active");
  }

  if (
    plan.allowances?.users?.client?.invites > -1 &&
    usage.users.client.invites > plan.allowances.users.client.invites
  ) {
    eligibility.usageOverEligibility.push("users.client.invites");
  }

  if (
    plan.allowances?.users?.client?.total > -1 &&
    usage.users.client.total > plan.allowances.users.client.total
  ) {
    eligibility.usageOverEligibility.push("users.client.total");
  }

  if (
    plan.allowances?.users?.total?.active > -1 &&
    usage.users.total.active > plan.allowances.users.total.active
  ) {
    eligibility.usageOverEligibility.push("users.total.active");
  }

  if (
    plan.allowances?.users?.total?.invites > -1 &&
    usage.users.total.invites > plan.allowances.users.total.invites
  ) {
    eligibility.usageOverEligibility.push("users.total.invites");
  }

  if (
    plan.allowances?.users?.total?.total > -1 &&
    usage.users.total.total > plan.allowances.users.total.total
  ) {
    eligibility.usageOverEligibility.push("users.total.total");
  }

  if(eligibility.usageOverEligibility.length) {
    eligibility.eligible = false;
  }

  return eligibility;
};
