import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
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
          <Appbar.Content title="1234" subtitle={"Subtitle"} />
          <Appbar.Action icon="magnify" onPress={() => {}} />
          <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
        </Appbar.Header>

        <View style={styles.container}>
          <Text style={styles.title}>hola mundo </Text>
          <Text style={styles.title}>El contador es: </Text>
          <Text style={styles.title}>{count}</Text>

          <Pressable
            onPress={increment}
            onLongPress={reset}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={{ color: "#ffffff" }}> pressable!</Text>
          </Pressable>

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

// const styles = StyleSheet.create({

// container:{
//   // backgroundColor: "green",
//   flex:1
// },

//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
