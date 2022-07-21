import React from "react";
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

function ManageTeamUserForm({ onSubmit, processing, defaults: { active, tenantAdmin }, ownUser }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      active,
      tenantAdmin
    },
  });

  const { t } = useTranslation("common");

  const formRules = {
    active: {},
    tenantAdmin: {}
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-2">
        <FormGroup className="">
          <Label style={{ minWidth: "200px" }} for="active">
            {t("tenant.admin.users.Active user")}
          </Label>
          <Controller
            name="active"
            control={control}
            rules={formRules.active}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                type="checkbox"
                innerRef={ref}
                invalid={!!errors?.active}
                defaultChecked={active}
                disabled={ownUser}
              />
            )}
          />
          <FormFeedback>
            {errors?.active?.message && errors.active.message}
          </FormFeedback>
        </FormGroup>
        <FormGroup className="">
          <Label style={{ minWidth: "200px" }} for="tenantAdmin">
            {t("tenant.admin.team.Administrator")}
          </Label>
          <Controller
            name="tenantAdmin"
            control={control}
            rules={formRules.tenantAdmin}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                type="checkbox"
                innerRef={ref}
                invalid={!!errors?.tenantAdmin}
                defaultChecked={tenantAdmin}
                disabled={ownUser}
              />
            )}
          />
          <FormFeedback>
            {errors?.tenantAdmin?.message && errors.tenantAdmin.message}
          </FormFeedback>
        </FormGroup>
      </div>
      {processing ? (
        <Loader />
      ) : (
        <Button className={"btn-block"} type="submit" disabled={ownUser}>
          {t("user.Save")}
        </Button>
      )}
    </Form>
  );
}

ManageTeamUserForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
  ownUser: PropTypes.bool,
};

export default ManageTeamUserForm;
