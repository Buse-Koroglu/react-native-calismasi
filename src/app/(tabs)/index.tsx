import { Link } from "expo-router";

import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-sans-extrabold text-primary">Home</Text>
      <Link
        href="/onboarding"
        className="mt-4 font-sans-bold rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Go to Onboarding</Text>
      </Link>

      <Link
        href="/(auth)/sign-in"
        className="mt-4 font-sans-bold  rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Go to Sign In</Text>
      </Link>

      <Link
        href="/(auth)/sign-up"
        className="mt-4 font-sans-bold rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Go to Sign Up</Text>
      </Link>
    </SafeAreaView>
  );
}
