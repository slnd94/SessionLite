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

function TeamUserForm({ onSubmit, processing, defaults: { active }, ownUser }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      active,
    },
  });
  console.log("🚀 ~ file: TeamUserForm.js ~ line 20 ~ defaults", active);

  const { t } = useTranslation("common");

  const formRules = {
    active: {},
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-2">
        <FormGroup className="">
          <Label style={{ minWidth: "200px" }} for="active">
            {t("tenant.admin.team.Active user")}
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

TeamUserForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
  ownUser: PropTypes.bool,
};

export default TeamUserForm;
