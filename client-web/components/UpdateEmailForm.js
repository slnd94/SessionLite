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
import Loader from "./Loader";
import { useTranslation } from "next-i18next";

function UpdateEmailForm({ emailFieldLabel, submitButtonLabel, onSubmit, onCancel, processing, defaults: { email } }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email
    },
  });

  const { t } = useTranslation("common");

  const formRules = {
    email: { required: t("user.Email is required") },
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>{emailFieldLabel || t("user.Email")}</Label>
        <Controller
          name="email"
          control={control}
          rules={formRules.email}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="email"
              innerRef={ref}
              invalid={!!errors?.email}
            />
          )}
        />
        <FormFeedback>
          {errors?.email?.message && errors.email.message}
        </FormFeedback>
      </FormGroup>

      {processing ? (
        <Loader />
      ) : (
        <>
          <Button className={"btn-block"} color="primary" type="submit">
            {submitButtonLabel || t("Save")}
          </Button>
          <Button
            size="md"
            color="default"
            className="btn-block"
            onClick={() => {
              onCancel();
            }}
          >
            {t("Cancel")}
          </Button>
        </>
      )}
    </Form>
  );
}

UpdateEmailForm.propTypes = {
  emailFieldLabel: PropTypes.string,
  submitButtonLabel: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default UpdateEmailForm;
