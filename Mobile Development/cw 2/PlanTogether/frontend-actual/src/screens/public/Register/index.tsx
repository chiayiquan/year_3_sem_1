import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import * as UserSaga from "../../../redux/sagas/User";
import globalStyle from "../../../style";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    emailError: false,
    password: "",
    confirmPassword: "",
    passwordError: false,
    name: "",
    nameError: false,
  });
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);
  console.log(user);
  function validEmail(): boolean {
    const { email } = form;
    const regexp = new RegExp("\\S+@\\S+\\.\\S+");
    return email.length > 0 && email.length < 255 && regexp.test(email);
  }

  function handleRegister() {
    dispatch({
      type: UserSaga.sagaActions.REGISTER.type,
      payload: { email: form.email, password: form.password, name: form.name },
    });
  }

  return (
    <View style={styles.container}>
      <Text>Register</Text>
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
          setForm((state) => ({ ...state, password: text }))
        }
        value={form.password}
        secureTextEntry={true}
        placeholder="Password"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setForm((state) => ({ ...state, confirmPassword: text }))
        }
        value={form.confirmPassword}
        secureTextEntry={true}
        placeholder="Confirm Password"
        onBlur={() =>
          setForm((state) => ({
            ...state,
            passwordError: state.password !== state.confirmPassword,
          }))
        }
        onFocus={() => setForm((state) => ({ ...state, passwordError: false }))}
      />
      {form.passwordError ? (
        <Text style={styles.errorText}>Password does not match.</Text>
      ) : null}
      {user.user == null && user.error.create.message != null ? (
        <Text style={styles.errorText}>{user.error.create.message}</Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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
  buttonText: {
    color: "white",
  },
});
