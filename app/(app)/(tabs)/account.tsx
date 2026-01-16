import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

export default function AccountScreen() {

const { width, height } = useWindowDimensions();
const router = useRouter();

console.log(width, height)

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (
    <>
      <View style={[styles.container ]}>

        <View style={[styles.box, styles.box1, {width: width * 0.5}]}>
          <Text style={styles.title} >
            
            {width} {height}
          </Text>
        </View>
        {/* <View style={[styles.box, styles.box2]}></View>
        <View style={[styles.box, styles.box3]}></View> */}

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6d737bff",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap" ,
    // alignItems: "center",
    // justifyContent:"space-between"
    width: 300
    // justifyContent: "center",
    // alignItems: "center",
  },

  box:{
    width: "50%",
    height:200,
    backgroundColor: "#3446d0ff",
    borderColor: "#ffffff",
    borderWidth: 5,
    // position: "absolute",
    // right: 0,
    // bottom:0
  },

  box1:{
        backgroundColor: "#354ae9ff",
        // flex:1
  },
  box2:{
        backgroundColor: "#46c84aff",
        // flex:2
  },
  box3:{
        backgroundColor: "#e4e413ff",
        // flex:1
        // alignSelf:"flex-start"
  },

  title:{
    fontSize:30,
    color: "#ffffff"
  },

  logoutButton: {
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },

  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  }
});
