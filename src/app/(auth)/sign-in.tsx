import { useAuth } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import { Link, Redirect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { authErrorMessage, validateEmail, validatePassword } from "@/lib/auth";

const SignIn = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = useMemo(() => validateEmail(emailAddress), [emailAddress]);
  const passwordError = useMemo(() => validatePassword(password), [password]);

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSubmit = async () => {
    const nextEmailError = validateEmail(emailAddress);
    const nextPasswordError = validatePassword(password);

    if (nextEmailError || nextPasswordError) {
      setErrorMessage(nextEmailError || nextPasswordError);
      return;
    }

    if (!signIn) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const attempt = await signIn.create({
        identifier: emailAddress.trim().toLowerCase(),
        password,
      });

      if (attempt.status === "complete") {
        await setActive?.({ session: attempt.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setErrorMessage("We could not sign you in with those details.");
    } catch (error) {
      setErrorMessage(
        authErrorMessage(error, "Sign-in failed. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="auth-safe-area"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="auth-content"
        className="auth-scroll"
      >
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">S</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Smart Subscriptions</Text>
            </View>
          </View>

          <Text className="auth-title">Welcome back</Text>
          <Text className="auth-subtitle">
            Sign in to keep tracking what matters and get back to your
            subscriptions in a tap.
          </Text>
        </View>

        <View className="auth-card">
          <View className="auth-form">
            <View className="auth-field">
              <Text className="auth-label">Email address</Text>
              <TextInput
                className={`auth-input ${emailError ? "auth-input-error" : ""}`}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="name@example.com"
                placeholderTextColor="#7c7c7c"
                value={emailAddress}
                onChangeText={setEmailAddress}
                textContentType="emailAddress"
              />
              {emailError ? (
                <Text className="auth-error">{emailError}</Text>
              ) : null}
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                className={`auth-input ${passwordError ? "auth-input-error" : ""}`}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your password"
                placeholderTextColor="#7c7c7c"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                textContentType="password"
              />
              {passwordError ? (
                <Text className="auth-error">{passwordError}</Text>
              ) : null}
            </View>

            {errorMessage ? (
              <Text className="auth-error">{errorMessage}</Text>
            ) : null}

            <Pressable
              className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
              disabled={isSubmitting}
              onPress={handleSubmit}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#081126" />
              ) : (
                <Text className="auth-button-text">Continue</Text>
              )}
            </Pressable>

            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">or</Text>
              <View className="auth-divider-line" />
            </View>

            <Link href="/(auth)/sign-up" asChild>
              <Pressable className="auth-secondary-button">
                <Text className="auth-secondary-button-text">
                  Create account
                </Text>
              </Pressable>
            </Link>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Need to start over?</Text>
              <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
                <Text className="auth-link">Sign up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
