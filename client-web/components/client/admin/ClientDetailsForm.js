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

function ClientDetailsForm({
  onSubmit,
  processing,
  defaults: { name },
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name
    },
  });

  const { t } = useTranslation("common");

  const formRules = {
    name: { required: t("client.admin.details.Name is required") }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>{t("client.admin.details.Name")}</Label>
        <Controller
          name="name"
          control={control}
          rules={formRules.name}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="text"
              innerRef={ref}
              invalid={!!errors?.name}
            />
          )}
        />
        <FormFeedback>
          {errors?.name?.message && errors.name.message}
        </FormFeedback>
      </FormGroup>

      {processing ? (
        <Loader />
      ) : (
        <Button className={"btn-block-md-down"} color="primary" type="submit">
          {t("user.Save")}
        </Button>
      )}
    </Form>
  );
}

ClientDetailsForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default ClientDetailsForm;
