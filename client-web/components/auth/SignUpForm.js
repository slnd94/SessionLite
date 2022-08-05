import React, { useRef } from "react";
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { useForm, Controller } from "react-hook-form";
import Loader from '../Loader';
import { useTranslation } from 'next-i18next';

function SignUpForm({ onSubmit, processing }) {
  const { handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = useRef({});
  password.current = watch("password", "");

  const { t } = useTranslation('common');

  const formRules = {
    firstName: { required: t('auth.First name is required') },
    lastName: { required: t('auth.Last name is required') },
    email: { required: t('auth.Email is required') },
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
        <Label>{t('auth.First Name')}</Label>
        <Controller
          name="firstName"
          control={control}
          rules={formRules.firstName}
          render={({ field: { ref, ...field } }) => 
            <Input
              {...field}
              type="text"
              innerRef={ref}
              invalid={!!errors?.firstName}
            />
          }
        />
        <FormFeedback> 
          {errors?.firstName?.message && errors.firstName.message}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>{t('auth.Last Name')}</Label>
        <Controller
          name="lastName"
          control={control}
          rules={formRules.lastName}
          render={({ field: { ref, ...field } }) => 
            <Input
              {...field}
              type="text"
              innerRef={ref}
              invalid={!!errors?.lastName}
            />
          }
        />
        <FormFeedback>
          {errors?.lastName?.message && errors.lastName.message}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>{t('auth.Email')}</Label>
        <Controller
          name="email"
          control={control}
          rules={formRules.email}
          render={({ field: { ref, ...field } }) => 
            <Input
              {...field}
              type="email"
              innerRef={ref}
              invalid={!!errors?.email}
            />
          }
        />
        <FormFeedback>
          {errors?.email?.message && errors.email.message}
        </FormFeedback>
      </FormGroup>
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
        : <Button className={'btn-block'} type="submit">
            {t('auth.Sign up')}
          </Button>
      }
    </Form>
  );
}

SignUpForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool
};

export default SignUpForm