import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import * as UserSaga from "../../../redux/User";
import globalStyle from "../../../style";
import type { DefaultNavigationProps } from "../../../models/Navigation";
import Divider from "../../../components/divider";
import * as Google from "expo-auth-session/providers/google";
import { SocialIcon } from "@rneui/themed";
import env from "../../../env";
import * as UserRedux from "../../../redux/User";

export default function Login({ navigation }: DefaultNavigationProps) {
  const [form, setForm] = useState({
    email: "",
    emailError: false,
    password: "",
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: env.expoClientId,
    iosClientId: env.iosClientId,
    androidClientId: env.androidClientId,
    scopes: [
      "openid",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication) {
        dispatch({
          type: UserSaga.sagaActions.LOGIN_WITH_GOOGLE.type,
          payload: {
            authToken: authentication.accessToken,
          },
        });
      }
    }
  }, [response]);

  function validEmail(): boolean {
    const { email } = form;
    const regexp = new RegExp("\\S+@\\S+\\.\\S+");
    return email.length > 0 && email.length < 255 && regexp.test(email);
  }

  function handleLogin() {
    dispatch({
      type: UserSaga.sagaActions.LOGIN.type,
      payload: { email: form.email, password: form.password, authToken: null },
    });
  }

  useEffect(() => {
    if (user.registerGoogleData != null) {
      navigation.navigate("Register");
    }
  }, [user.registerGoogleData]);

  function navigateToRegister() {
    dispatch(UserRedux.setInitialState());
    navigation.navigate("Register");
  }

  return (
    <View style={styles.container}>
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
      <TouchableOpacity
        style={[styles.buttonBase, styles.loginButton]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Divider
        text={"or"}
        containerStyle={{ paddingTop: 20 }}
        lineStyle={{ backgroundColor: "#808080" }}
      />

      <SocialIcon
        title="Sign In With Google"
        button
        type="google"
        style={styles.buttonBase}
        onPress={() => promptAsync()}
      />

      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={{ color: "blue", paddingTop: 20 }}>
          Sign Up For An Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ...globalStyle,
  buttonBase: {
    alignItems: "center",
    marginTop: 20,
    width: "90%",
    padding: 20,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#0085FF",
  },
  googleButton: {},
  buttonText: {
    color: "white",
  },
});
