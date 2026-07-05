import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Go to Onboarding</Text>
      </Link>

      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Go to Sign In</Text>
      </Link>

      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Go to Sign Up</Text>
      </Link>

      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "spotify" } }}
        className="mt-4 rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Spotify Subscription</Text>
      </Link>

      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }}
        className="mt-4 rounded-full bg-primary text-white p-4"
      >
        <Text className="text-background">Claude Max Subscription</Text>
      </Link>
    </View>
  );
}
