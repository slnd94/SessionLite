import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { Input, Button } from "@rneui/themed";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
        message: "invalid email address",
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
            inputStyle={styles.input}
            label={t("auth.Email")}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />
      {errors.email && (
        <View style={styles.inputValidation}>
          <Text style={styles.inputValidationText}>{errors.email.message}</Text>
        </View>
      )}

      <Controller
        control={control}
        rules={formRules.password}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={styles.input}
            label={t("auth.Password")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
          />
        )}
        name="password"
      />
      {errors.password && (
        <View style={styles.inputValidation}>
          <Text style={styles.inputValidationText}>{errors.password.message}</Text>
        </View>
      )}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default SignInForm;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    // borderWidth: 4,
    // borderColor: "#7033f4",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    // margin: 30
    // justifyContent: "flex-end"
  },
  input: {
    flex: 1,
    // width: 500,
    // borderWidth: 4,
    // borderColor: "#f43333",
    // alignSelf: "stretch"
  },
  inputValidation: {
    marginBottom: 30
  },
  inputValidationText: {
    color: "#f43333"
  }
});
