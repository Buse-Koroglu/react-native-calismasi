import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const settings = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsSigningOut(true);
    setErrorMessage(null);

    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch {
      setErrorMessage("Çıkış yapılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <RNSafeAreaView
        style={{ flex: 1, backgroundColor: "transparent" }}
        className="p-5"
      >
        <View className="flex-1 items-center justify-center">
          <View className="w-full max-w-105 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <View className="gap-3">
              <Text className="text-3xl font-sans-bold text-primary text-center">
                Settings
              </Text>
              <Text className="text-base font-sans-medium text-muted-foreground text-center">
                Manage your account settings.
              </Text>
            </View>

            <View className="mt-7 rounded-2xl bg-background/80 p-4">
              <Text className="text-sm font-sans-semibold uppercase tracking-[1px] text-muted-foreground text-center">
                Session
              </Text>

              <Pressable
                className={`mt-4 items-center rounded-2xl bg-destructive py-4 ${
                  isSigningOut ? "opacity-80" : ""
                }`}
                disabled={isSigningOut}
                onPress={handleLogout}
              >
                {isSigningOut ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-base font-sans-bold text-white">
                    Log out
                  </Text>
                )}
              </Pressable>

              {errorMessage ? (
                <Text className="mt-3 text-sm font-sans-medium text-destructive text-center">
                  {errorMessage}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </RNSafeAreaView>
    </View>
  );
};

export default settings;
