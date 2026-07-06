import { useAuth } from "@clerk/expo";
import { useSignUp } from "@clerk/expo/legacy";
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

const SignUp = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
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

  const handleCreateAccount = async () => {
    const nextEmailError = validateEmail(emailAddress);
    const nextPasswordError = validatePassword(password);

    if (nextEmailError || nextPasswordError) {
      setErrorMessage(nextEmailError || nextPasswordError);
      return;
    }

    if (!signUp) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signUp.create({
        emailAddress: emailAddress.trim().toLowerCase(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (error) {
      setErrorMessage(
        authErrorMessage(error, "Sign-up failed. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!signUp) {
      return;
    }

    if (code.trim().length < 6) {
      setErrorMessage("Enter the 6-digit code we sent to your email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setErrorMessage("We could not verify that code. Please try again.");
    } catch (error) {
      setErrorMessage(
        authErrorMessage(error, "Verification failed. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!signUp) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setErrorMessage("A new code was sent to your email.");
    } catch (error) {
      setErrorMessage(authErrorMessage(error, "We could not resend the code."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "verify") {
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
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">ReactNativeFirst</Text>
              </View>
            </View>

            <Text className="auth-title">Verify your email</Text>
            <Text className="auth-subtitle">
              We sent a code to {emailAddress.trim().toLowerCase()}.
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Verification code</Text>
                <TextInput
                  className="auth-input"
                  keyboardType="number-pad"
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#7c7c7c"
                  value={code}
                  onChangeText={setCode}
                />
              </View>

              {errorMessage ? (
                <Text className="auth-error">{errorMessage}</Text>
              ) : null}

              <Pressable
                className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
                disabled={isSubmitting}
                onPress={handleVerify}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Verify and continue</Text>
                )}
              </Pressable>

              <Pressable
                className="auth-secondary-button"
                onPress={handleResend}
              >
                <Text className="auth-secondary-button-text">
                  Send a new code
                </Text>
              </Pressable>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Wrong email?</Text>
                <Pressable onPress={() => setStep("form")}>
                  <Text className="auth-link">Edit details</Text>
                </Pressable>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Already have an account?</Text>
                <Link href="/(auth)/sign-in" asChild>
                  <Pressable>
                    <Text className="auth-link">Sign in</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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

          <Text className="auth-title">Create your account</Text>
          <Text className="auth-subtitle">
            Start tracking subscriptions, renewal dates, and balances in one
            polished place.
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
                placeholder="Create a secure password"
                placeholderTextColor="#7c7c7c"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                textContentType="newPassword"
              />
              {passwordError ? (
                <Text className="auth-error">{passwordError}</Text>
              ) : null}
            </View>

            <Text className="auth-helper">
              Use at least 8 characters with a mix of letters and numbers.
            </Text>

            {errorMessage ? (
              <Text className="auth-error">{errorMessage}</Text>
            ) : null}

            <Pressable
              className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
              disabled={isSubmitting}
              onPress={handleCreateAccount}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#081126" />
              ) : (
                <Text className="auth-button-text">Continue</Text>
              )}
            </Pressable>

            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">secure setup</Text>
              <View className="auth-divider-line" />
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
