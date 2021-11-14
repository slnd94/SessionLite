import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

function SigninForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = () => {
    console.log({email, password})
  }

  return (
    <Form>
      <FormGroup>
        <Label for="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          onChange={(e) => {setEmail(e.target.value)}}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">
          Email
        </Label>
        <Input
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          onChange={(e) => {setPassword(e.target.value)}}
        />
      </FormGroup>
      <Button onClick={(e) => {
        e.preventDefault;
        onSubmit({email, password});
      }}>
        Submit
      </Button>

      <div>hi there</div>
      <div>{email}</div>
      <div>{password}</div>
    </Form>
  )
}

export default SigninForm
