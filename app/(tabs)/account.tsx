import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Appbar, MD2Colors } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const reset = () => {
    setCount(0);
  };

  const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Menu" subtitle={"Subtitle"} />
          <Appbar.Action icon="magnify" onPress={() => {}} />
          <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
        </Appbar.Header>

        <View style={styles.container}>
      

         
            <Text style={{ color: "#19a92cff", fontSize: 60
             }}> Account!</Text>
        

          <ActivityIndicator animating={true} color={MD2Colors.red800} />

          {/* <Button title="+1">

          </Button>
            <TouchableOpacity  >
          <Text>Press Here</Text>
        </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6d737bff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    color: "#ffffff",
  },

  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#4050cfff",
  },

  primaryButtonPressed: {
    opacity: 0.5,
  },

  header: {
    width: "100%",
    // position: "absolute",
    // bottom: 0
    // top:0,
    // left:0
  },
});

