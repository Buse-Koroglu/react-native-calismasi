import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  const { subscriptions: allSubscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return allSubscriptions;
    }

    return allSubscriptions.filter((subscription) => {
      const name = subscription.name.toLowerCase();
      const category = subscription.category?.toLowerCase() ?? "";
      const plan = subscription.plan?.toLowerCase() ?? "";

      return (
        name.includes(query) || category.includes(query) || plan.includes(query)
      );
    });
  }, [searchQuery, allSubscriptions]);

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        style={{ flex: 1 }}
        ListHeaderComponent={
          <View className="mb-5">
            <Text className="text-xl font-bold text-primary mb-4">
              Subscriptions
            </Text>

            <TextInput
              className="search-input"
              placeholder="Search by name, category, or plan"
              placeholderTextColor="#7c7c7c"
              autoCapitalize="none"
              autoCorrect={false}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />

            <View className="mt-5">
              <ListHeading title="All Subscriptions" />
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text className="search-empty">
            {searchQuery
              ? `No subscriptions found matching "${searchQuery}"`
              : "No subscriptions found"}
          </Text>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId(
                expandedSubscriptionId === item.id ? null : item.id,
              )
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default subscriptions;
