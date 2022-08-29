import React, { useRef } from "react";
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { useForm, Controller } from "react-hook-form";
import Loader from '../Loader';
import { useTranslation } from 'next-i18next';

function ResetPasswordForm({ onSubmit, processing }) {
  const { handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const password = useRef({});
  password.current = watch("password", "");

  const { t } = useTranslation('common');

  const formRules = {
    password: {
      required: t('auth.Password is required'),
      minLength: {
        value: 6,
        message: t('auth.Password must have at least <num> characters')
      }
    },
    confirmPassword: {
      required: t('auth.Password is required'),
      minLength: {
        value: 6,
        message: t('auth.Password must have at least <num> characters')
      },
      validate: value => value === password.current || t('auth.Passwords must match')
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>{t('auth.Password')}</Label>
        <Controller
          name="password"
          control={control}
          rules={formRules.password}
          render={({ field: { ref, ...field } }) => 
            <Input
              {...field}
              type="password"
              innerRef={ref}
              invalid={!!errors?.password}
            />
          }
        />
        <FormFeedback>
          {errors?.password?.message && errors.password.message}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>{t('auth.Confirm Password')}</Label>
        <Controller
          name="confirmPassword"
          control={control}
          rules={formRules.confirmPassword}
          render={({ field: { ref, ...field } }) => 
            <Input
              {...field}
              type="password"
              innerRef={ref}
              invalid={!!errors?.confirmPassword}
            />
          }
        />
        <FormFeedback>
          {errors?.confirmPassword?.message && errors.confirmPassword.message}
        </FormFeedback>
      </FormGroup>

      {processing 
        ? <Loader /> 
        : <Button className={'btn-block'} color="primary" type="submit">
            {t('auth.Reset password')}
          </Button>
      }
    </Form>
  );
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool
};

export default ResetPasswordForm