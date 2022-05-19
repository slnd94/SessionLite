import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  FormGroup,
  Button,
} from "reactstrap";
import { useForm, Controller, set } from "react-hook-form";
import Loader from "../Loader";
import Amount from "../commerce/Amount";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useTranslation } from "next-i18next";

function UserCheckoutStripeForm({ onSubmit, processing, setProcessing, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // nameOnCard: "",
    },
  });

  const { t } = useTranslation("common");

  const formRules = {
    // nameOnCard: { required: t("user.Name on card is required") },
  };

  const formSubmit = async (data) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    // setProcessing(false)
  };

  return (
    <Form onSubmit={handleSubmit(formSubmit)}>
      {/* <FormGroup>
        <Label>{t("user.Name on Card")}</Label>
        <Controller
          name="nameOnCard"
          control={control}
          rules={formRules.nameOnCard}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="text"
              innerRef={ref}
              invalid={!!errors?.nameOnCard}
            />
          )}
        />
        <FormFeedback>
          {errors?.nameOnCard?.message && errors.nameOnCard.message}
        </FormFeedback>
      </FormGroup> */}
      <FormGroup>
        <PaymentElement
          style={{
            base: {
              fontSize: "18px",
              color: "#495057",
              fontFamily:
                '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
              "::placeholder": {
                color: "#868e96",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          }}
        />
      </FormGroup>

      {processing ? (
        <><Loader /> Processing...</>
        
      ) : (
        <>
          {total ? (
            <Button
              className={"btn-block-md-down"}
              size="lg"
              color="success"
              type="submit"
            >
              {t("checkout.Pay")} <Amount amount={total} />
            </Button>
          ) : (
            <></>
          )}
        </>
      )}
    </Form>
  );
}

UserCheckoutStripeForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default UserCheckoutStripeForm;
