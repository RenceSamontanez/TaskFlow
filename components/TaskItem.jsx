import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TaskItem({ item, onToggle, onDelete }) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={styles.taskRow}>
        <MaterialIcons
          name={item.is_completed ? "check-box" : "check-box-outline-blank"}
          size={20}
          color={item.is_completed ? "#2E5BBA" : "#5A6472"}
        />
        <Text style={[styles.taskText, item.is_completed && styles.taskDone]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskText: { fontSize: 15 },
  taskDone: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
});
