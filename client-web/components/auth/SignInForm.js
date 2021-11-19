import React from "react";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useForm, Controller } from "react-hook-form";
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
        message: t('auth.Password must have at least 8 characters')
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
            />
          }
        />
        {errors?.email ? <span style={{color: 'red'}}>{errors.email.message}</span> : null}
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
            />
          }
        />
        {errors?.password ? <span style={{color: 'red'}}>{errors.password.message}</span> : null}
      </FormGroup>
      
      {processing ? <span>processing...</span> : <Button color="primary" type="submit">{t('auth.Sign in')}</Button>}
    </Form>
  );
}

export default SignInForm