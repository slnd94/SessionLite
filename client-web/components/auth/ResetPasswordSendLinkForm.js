import React from "react";
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { useForm, Controller } from "react-hook-form";
import Loader from '../Loader';
import { useTranslation } from 'next-i18next';

function ResetPasswordSendLinkForm({ onSubmit, processing }) {
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const { t } = useTranslation('common');

  const formRules = {
    email: { required: t('auth.Email is required') }
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
              invalid={!!errors?.email}
            />
          }
        />
        <FormFeedback>
          {errors?.email?.message && errors.email.message}
        </FormFeedback>
      </FormGroup>
      
      {processing 
        ? <Loader />
        : <Button className={'btn-block'} color="primary" type="submit">
            {t('auth.Send link to email')}
          </Button>
      }
    </Form>
  );
}

ResetPasswordSendLinkForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool
};

export default ResetPasswordSendLinkForm