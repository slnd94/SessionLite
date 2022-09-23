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

function TemplateDetailsForm({
  onSubmit,
  processing,
  defaults: { name, description },
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name,
      description
    },
  });

  const { t } = useTranslation("common");

  const formRules = {
    name: { required: t("tenant.admin.templates.Name is required") }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>{t("tenant.admin.templates.Name")}</Label>
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

      <FormGroup>
        <Label>{t("tenant.admin.templates.Description")}</Label>
        <Controller
          name="description"
          control={control}
          rules={formRules.description}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="text"
              innerRef={ref}
              invalid={!!errors?.description}
            />
          )}
        />
        <FormFeedback>
          {errors?.description?.message && errors.description.message}
        </FormFeedback>
      </FormGroup>

      {processing ? (
        <Loader />
      ) : (
        <Button className={"btn-block"} color="primary" type="submit">
          {t("user.Save")}
        </Button>
      )}
    </Form>
  );
}

TemplateDetailsForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default TemplateDetailsForm;
