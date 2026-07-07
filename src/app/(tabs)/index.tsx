import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "../../../constants/data";
import { icons } from "../../../constants/icons";
import images from "../../../constants/images";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubcriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const { subscriptions, addSubscription } = useSubscriptions();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>

              <Pressable onPress={() => setIsCreateModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <Text className="home-balance-amount">
                ${HOME_BALANCE.amount.toFixed(2)}
              </Text>
              <Text className="home-balance-date">
                {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD/YYYY")}
              </Text>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming"></ListHeading>
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard data={item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty">No upcoming subscriptions</Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions"></ListHeading>
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        extraData={expandedSubcriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        ListEmptyComponent={
          <Text className="home-empty">No subscriptions found</Text>
        }
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubcriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId(
                expandedSubcriptionId === item.id ? null : item.id,
              )
            }
          />
        )}
      ></FlatList>

      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={addSubscription}
      />
    </SafeAreaView>
  );
}
