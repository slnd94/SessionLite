import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { useTranslation } from 'next-i18next';

function SigninForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation('common');

  const submitForm = () => {
    console.log({email, password})
  }

  return (
    <Form>
      <FormGroup>
        <Label for="email">
          {t('auth.Email')}
        </Label>
        <Input
          id="email"
          name="email"
          placeholder={t('auth.Email')}
          type="email"
          onChange={(e) => {setEmail(e.target.value)}}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">
          {t('auth.Password')}
        </Label>
        <Input
          id="password"
          name="password"
          placeholder={t('auth.Password')}
          type="password"
          onChange={(e) => {setPassword(e.target.value)}}
        />
      </FormGroup>
      <Button onClick={(e) => {
        e.preventDefault;
        onSubmit({email, password});
      }}>
        {t('auth.Sign in')}
      </Button>
    </Form>
  )
}

export default SigninForm
