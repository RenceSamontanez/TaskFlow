import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AddTaskModal from "../components/AddTaskModal";
import TaskItem from "../components/TaskItem";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error loading tasks:", error.message);
      return;
    }
    setTasks(data);
  }

  async function toggleTask(item) {
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: !item.is_completed })
      .eq("id", item.id);

    if (error) {
      Toast.show({ type: "error", text1: "Could not update task" });
      return;
    }
    loadTasks();
  }

  async function handleSubmitTask(title) {
    const { error } = await supabase
      .from("tasks")
      .insert([{ title, is_completed: false }]);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not add task",
        text2: error.message,
      });
      return;
    }
    setModalVisible(false);
    loadTasks();
    Toast.show({ type: "success", text1: "Task added!" });
  }

  async function handleDeleteTask(id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      Toast.show({ type: "error", text1: "Could not delete task" });
      return;
    }
    loadTasks();
    Toast.show({ type: "success", text1: "Task deleted" });
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={toggleTask}
            onDelete={handleDeleteTask}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Tap + to add one!</Text>
        }
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitTask}
      />

      <TouchableOpacity
        style={styles.fabCamera}
        onPress={() => router.push("/camera")}
      >
        <MaterialIcons name="camera-alt" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2A44",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#2E5BBA",
    borderRadius: 8,
    padding: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 15,
  },
  fabCamera: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#2E5BBA",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
