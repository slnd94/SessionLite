import React, { useRef } from "react";
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
import Loader from "../Loader";
import { useTranslation } from "next-i18next";

function AccountForm({ onSubmit, processing, defaults: {} }) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const password = useRef({});
  password.current = watch("newPassword", "");

  const { t } = useTranslation("common");

  const formRules = {
    currentPassword: { required: t("auth.Password is required") },
    newPassword: {
      required: t("auth.Password is required"),
      minLength: {
        value: 6,
        message: t("auth.Password must have at least <num> characters"),
      },
    },
    confirmNewPassword: {
      required: t("auth.Password is required"),
      minLength: {
        value: 6,
        message: t("auth.Password must have at least <num> characters"),
      },
      validate: (value) =>
        value === password.current || t("auth.Passwords must match"),
    },
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>{t("user.Current Password")}</Label>
        <Controller
          name="currentPassword"
          control={control}
          rules={formRules.currentPassword}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="password"
              innerRef={ref}
              invalid={!!errors?.currentPassword}
            />
          )}
        />
        <FormFeedback>
          {errors?.currentPassword?.message && errors.currentPassword.message}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>{t("user.New Password")}</Label>
        <Controller
          name="newPassword"
          control={control}
          rules={formRules.newPassword}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="password"
              innerRef={ref}
              invalid={!!errors?.newPassword}
            />
          )}
        />
        <FormFeedback>
          {errors?.newPassword?.message && errors.newPassword.message}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>{t("user.Confirm New Password")}</Label>
        <Controller
          name="confirmNewPassword"
          control={control}
          rules={formRules.confirmNewPassword}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="password"
              innerRef={ref}
              invalid={!!errors?.confirmNewPassword}
            />
          )}
        />
        <FormFeedback>
          {errors?.confirmNewPassword?.message &&
            errors.confirmNewPassword.message}
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

AccountForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default AccountForm;
