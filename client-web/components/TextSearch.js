import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  InputGroup,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "next-i18next";
import IconText from "./IconText";

function TextSearch({ placeholder, onSubmit, className }) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const { t } = useTranslation("common");

  const formRules = {
    search: {},
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={`my-2 ${className}`}>
      <InputGroup className="">
        <Controller
          name="search"
          control={control}
          rules={formRules.search}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="text"
              id="search"
              name="search"
              className="form-control"
              placeholder={placeholder || t("Search")}
              aria-label={t('Search')}
              aria-describedby="basic-addon2"
              bsSize="sm"
              innerRef={ref}
              invalid={!!errors?.search}
            />
          )}
        />
        <div className="input-group-append">
          <Button type="submit" color="light" size="sm">
            <IconText icon={"search"} />
          </Button>
        </div>
        <div className="input-group-append ms-2">
          <Button
          color="light"
          size="sm"
          onClick={() => {
            setValue("search", "");
            handleSubmit(onSubmit)();
          }}
          >
            Clear
          </Button>
        </div>
        <FormFeedback>
          {errors?.search?.message && errors.search.message}
        </FormFeedback>
      </InputGroup>
    </Form>
  );
}

TextSearch.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

TextSearch.defaultProps = {
  className: ""
}

export default TextSearch;
