import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import * as UserRedux from "../../../redux/User";
import globalStyle from "../../../style";
import axios from "axios";
import env from "../../../env";
import type { DefaultNavigationProps } from "../../../models/Navigation";

export default function Register({ navigation }: DefaultNavigationProps) {
  const dispatch = useAppDispatch();

  const [googleRegister, setGoogleRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    emailError: false,
    password: "",
    confirmPassword: "",
    passwordError: false,
    name: "",
    nameError: false,
    handler: "",
    handlerError: false,
  });
  const registerButtonDisabled =
    form.emailError ||
    form.passwordError ||
    form.nameError ||
    form.handlerError;

  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    // only first load and when registerGoogleData is empty then trigger this
    if (user.registerGoogleData != null && googleRegister === false) {
      const { email, name } = user.registerGoogleData;
      setGoogleRegister(true);
      setForm((state) => ({ ...state, email, name }));
      navigation.setOptions({ title: "Fill Up Detail" });
    }
  }, [user, googleRegister]);

  function validEmail(): boolean {
    const { email } = form;
    const regexp = new RegExp("\\S+@\\S+\\.\\S+");
    return email.length > 0 && email.length < 255 && regexp.test(email);
  }

  function handleRegister() {
    if (googleRegister) {
      if (form.name.length < 1)
        return setForm((state) => ({ ...state, nameError: true }));
      if (form.email.length < 1 || !validEmail())
        return setForm((state) => ({ ...state, emailError: true }));
      dispatch({
        type: UserRedux.sagaActions.REGISTER_WITH_GOOGLE.type,
        payload: {
          email: form.email,
          name: form.name,
          handler: form.handler,
          authToken: user.registerGoogleData?.authToken,
        },
      });
    } else {
      if (form.name.length < 1)
        return setForm((state) => ({ ...state, nameError: true }));
      if (form.email.length < 1 || !validEmail())
        return setForm((state) => ({ ...state, emailError: true }));

      if (form.password.length < 1 || !checkPasswordIsSame())
        return setForm((state) => ({ ...state, passwordError: true }));

      dispatch({
        type: UserRedux.sagaActions.REGISTER.type,
        payload: {
          email: form.email,
          password: form.password,
          name: form.name,
          handler: form.handler,
        },
      });
    }
  }

  async function checkHandlerExist(): Promise<void> {
    const response = await axios.get(
      `${env.backendUrl}/check-handler/${form.handler}`
    );
    console.log(response.data.data);
    setForm((state) => ({ ...state, handlerError: response.data.data }));
  }

  function checkPasswordIsSame(): boolean {
    return form.password === form.confirmPassword;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setForm((state) => ({ ...state, name: text }))}
        value={form.name}
        placeholder="Name"
        onBlur={() =>
          setForm((state) => ({ ...state, nameError: state.name.length === 0 }))
        }
        onFocus={() => setForm((state) => ({ ...state, nameError: false }))}
      />
      {form.nameError ? (
        <Text style={styles.errorText}>Name cannot be empty.</Text>
      ) : null}
      <TextInput
        style={styles.input}
        onChangeText={(text) => setForm((state) => ({ ...state, email: text }))}
        value={form.email}
        placeholder="Email"
        keyboardType="email-address"
        editable={!googleRegister}
        selectTextOnFocus={!googleRegister}
        onBlur={() =>
          setForm((state) => ({ ...state, emailError: !validEmail() }))
        }
        onFocus={() => setForm((state) => ({ ...state, emailError: false }))}
      />
      {form.emailError ? (
        <Text style={styles.errorText}>Invalid email.</Text>
      ) : null}

      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setForm((state) => ({ ...state, handler: text }))
        }
        value={form.handler}
        placeholder="Handler"
        onBlur={checkHandlerExist}
        onFocus={() => setForm((state) => ({ ...state, handlerError: false }))}
      />
      {form.handlerError ? (
        <Text style={styles.errorText}>Handler is in use.</Text>
      ) : null}

      {googleRegister ? null : (
        <>
          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              setForm((state) => ({ ...state, password: text }))
            }
            value={form.password}
            secureTextEntry={true}
            placeholder="Password"
            onFocus={() =>
              setForm((state) => ({ ...state, passwordError: false }))
            }
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              setForm((state) => ({
                ...state,
                confirmPassword: text,
                passwordError: false,
              }))
            }
            value={form.confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
            onBlur={() =>
              setForm((state) => ({
                ...state,
                passwordError: !checkPasswordIsSame(),
              }))
            }
            onFocus={() =>
              setForm((state) => ({ ...state, passwordError: false }))
            }
          />
          {form.passwordError ? (
            <Text style={styles.errorText}>Password does not match.</Text>
          ) : null}
        </>
      )}

      {user.user == null && user.error.create.message != null ? (
        <Text style={styles.errorText}>{user.error.create.message}</Text>
      ) : null}
      <TouchableOpacity
        style={
          registerButtonDisabled
            ? [styles.button, styles.disabledButton]
            : styles.button
        }
        onPress={handleRegister}
        disabled={registerButtonDisabled}
      >
        <Text style={styles.buttonText}>
          {googleRegister ? "Continue" : "Register"}
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  ...globalStyle,
  button: {
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#0085FF",
    width: "90%",
    padding: 20,
    borderRadius: 30,
  },
  disabledButton: {
    backgroundColor: "#9ed0ff",
  },
  buttonText: {
    color: "white",
  },
});
