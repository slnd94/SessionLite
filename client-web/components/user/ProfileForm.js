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
import Loader from "../Loader";
import { useTranslation } from "next-i18next";

function ProfileForm({
  onSubmit,
  processing,
  defaults: { email, firstName, lastName },
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName,
      lastName,
      email,
    },
  });

  const { t } = useTranslation("common");

  const formRules = {
    firstName: { required: t("user.First name is required") },
    lastName: { required: t("user.Last name is required") },
    email: { required: t("user.Email is required") },
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>{t("user.Email")}</Label>
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
              disabled
            />
          )}
        />
        <FormFeedback>
          {errors?.email?.message && errors.email.message}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>{t("user.First Name")}</Label>
        <Controller
          name="firstName"
          control={control}
          rules={formRules.firstName}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="text"
              innerRef={ref}
              invalid={!!errors?.firstName}
            />
          )}
        />
        <FormFeedback>
          {errors?.firstName?.message && errors.firstName.message}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>{t("user.Last Name")}</Label>
        <Controller
          name="lastName"
          control={control}
          rules={formRules.lastName}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="text"
              innerRef={ref}
              invalid={!!errors?.lastName}
            />
          )}
        />
        <FormFeedback>
          {errors?.lastName?.message && errors.lastName.message}
        </FormFeedback>
      </FormGroup>

      {processing ? (
        <Loader />
      ) : (
        <Button className={"btn-block"} type="submit">
          {t("user.Save")}
        </Button>
      )}
    </Form>
  );
}

ProfileForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default ProfileForm;
