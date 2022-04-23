import React from "react";
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { useForm, Controller } from "react-hook-form";
import Loader from '../Loader';
import { useTranslation } from 'next-i18next';

function SignInForm({ onSubmit, processing }) {
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { t } = useTranslation('common');

  const formRules = {
    email: { required: t('auth.Email is required') },
    password: {
      required: t('auth.Password is required'),
      minLength: {
        value: 6,
        message: t('auth.Password must have at least <num> characters')
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>{t('auth.Emaily')}</Label>
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
      
      {processing ? <Loader /> : <Button color="primary" type="submit">{t('auth.Sign in')}</Button>}
    </Form>
  );
}

export default SignInForm