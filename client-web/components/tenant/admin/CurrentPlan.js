import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Loader from "../../Loader";
import { useTranslation } from "next-i18next";
import Plan from "../../plan/Plan";

function TenantPlanCurrent({ plan, onSelectNew }) {
  const { t } = useTranslation("common");

  return (
    <div>
      <div className="row mt-0">
        <div className="col-12">
          <h3>{t("tenant.admin.plan.Your Current Plan")}</h3>
        </div>
      </div>
      <Plan
        plan={plan}
        className={plan.tag ? "popular" : ""}
      />
      <Button
        className="mt-4 btn-block-md-down"
        size="lg"
        color="secondary"
        onClick={() => {
          onSelectNew();
        }}
      >
        {t("plan.Change selected plan")}
      </Button>
    </div>
  );
}

TenantPlanCurrent.propTypes = {
  plan: PropTypes.object,
  onSelectNew: PropTypes.func,
};

export default TenantPlanCurrent;
