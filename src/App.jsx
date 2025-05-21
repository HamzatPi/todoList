import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InboxOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import dayjs from "dayjs";
import Modal from "./components/Modal/Modal";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [tasks, setTasks] = useState([]);
  const [activeProject, setActiveProject] = useState("Inbox");
  const [modalVisible, setModalVisible] = useState(false);

  // Загрузка задач и активного проекта из localStorage
  useEffect(() => {
    try {
      if (typeof localStorage === "undefined") {
        console.error("localStorage is not available");
        setTasks([]);
        return;
      }
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks).map((task) => {
          return {
            ...task,
            dueDate: task.dueDate ? dayjs(task.dueDate) : null, // Преобразуем строку в dayjs
          };
        });
        setTasks(parsed);
      } else {
        setTasks([]);
      }

      const savedProject = localStorage.getItem("activeProject");
      setActiveProject(savedProject || "Inbox");
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      setTasks([]); // Сбрасываем в пустой массив при ошибке
    }
  }, []);

  // Сохранение задач в localStorage
  useEffect(() => {
    try {
      if (typeof localStorage === "undefined") {
        console.error("localStorage is not available");
        return;
      }
      const currentTasks =
        tasks.length > 0
          ? tasks
          : JSON.parse(localStorage.getItem("tasks") || "[]");

      const serializedTasks = currentTasks.map((task) => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.format("YYYY-MM-DD HH:mm") : null,
      }));
      localStorage.setItem("tasks", JSON.stringify(serializedTasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      if (typeof localStorage === "undefined") {
        console.error("localStorage is not available");
        return;
      }
      if (typeof activeProject === "string") {
        localStorage.setItem("activeProject", activeProject);
      }
    } catch (error) {
      console.error("Error saving activeProject to localStorage:", error);
    }
  }, [activeProject]);

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const sidebarItems = [
    {
      key: "inbox",
      icon: <InboxOutlined style={{ color: "#3e63dd" }} />,
      label: "Inbox",
      onClick: () => setActiveProject("Inbox"),
    },
    {
      key: "today",
      icon: <CalendarOutlined style={{ color: "#22a06b" }} />,
      label: "Today",
      onClick: () => setActiveProject(null),
    },
    {
      key: "projects",
      icon: <FolderOpenOutlined style={{ color: "#a26ff2" }} />,
      label: "Projects",
      children: [
        {
          key: `project-1`,
          label: "Inbox",
          onClick: () => setActiveProject("Inbox"),
        },
      ],
    },
  ];

  // Фильтрация задач для отображения
  const filteredTasks = tasks.filter((task) => {
    const matchesProject = activeProject
      ? task.project === activeProject
      : true;
    console.log("Filtering task:", task, "Matches project:", matchesProject); // Лог для отладки
    return matchesProject;
  });

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={["inbox"]}
          style={{ borderRight: 0 }}
          items={sidebarItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Button type="primary" onClick={() => setModalVisible(true)}>
            + New Task
          </Button>

          <ul style={{ marginTop: 24, listStyle: "none", padding: 0 }}>
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {task.description}
                    </div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      {task.dueDate && `📅 ${task.dueDate}`} • {task.priority}
                    </div>
                  </div>
                </div>
                <Button
                  danger
                  size="small"
                  onClick={() => handleDelete(task.id)}
                >
                  Удалить
                </Button>
              </li>
            ))}
          </ul>
        </Content>
      </Layout>
      <Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        tasks={tasks}
        activeProject={activeProject}
        setTasks={setTasks}
      />
    </Layout>
  );
};

export default App;
