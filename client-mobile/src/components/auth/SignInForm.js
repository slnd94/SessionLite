import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { Input, Button } from "@rneui/themed";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { inputs, buttons } from "../../styles/global";
import Spacer from "../Spacer";

const SignInForm = ({ onSubmit, processing }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { t } = useTranslation();

  const formRules = {
    email: {
      required: t("auth.Email is required"),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t("auth.Invalid email address"),
      },
    },
    password: {
      required: t("auth.Password is required"),
      minLength: {
        value: 6,
        message: t("auth.Password must have at least <num> characters"),
      },
    },
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        rules={formRules.email}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
          inputStyle={styles.inputs.input}
            label={t("auth.Email")}
            labelStyle={styles.inputs.inputLabel}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors?.email?.message}
            errorStyle={styles.inputs.inputValidation}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={formRules.password}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            inputStyle={styles.inputs.input}
            label={t("auth.Password")}
            labelStyle={styles.inputs.inputLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            errorMessage={errors?.password?.message}
            errorStyle={styles.inputs.inputValidation}
          />
        )}
        name="password"
      />
      <Spacer />
      <Button
        title="Submit"
        color="secondary"
        style={styles.buttons.primary}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

export default SignInForm;

const styles = StyleSheet.create({
  inputs,
  buttons,
  container: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
});
