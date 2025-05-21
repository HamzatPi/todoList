import { useState } from "react";
import { Input, Select, DatePicker, Modal as AntdModal } from "antd";

const { TextArea } = Input;
const Modal = ({
  setModalVisible,
  modalVisible,
  tasks,
  setTasks,
  activeProject,
}) => {

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: null,
    priority: "Low",
    project: "Inbox",
  });
  const handleAddTask = () => {
    if (!form.title.trim()) return;

    const newTask = {
      id: Date.now(),
      ...form,
      dueDate: form.dueDate ? form.dueDate.format("YYYY-MM-DD HH:mm") : null,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setModalVisible(false);
    setForm({
      title: "",
      description: "",
      dueDate: null,
      priority: "Low",
      project: activeProject || "Inbox",
    });
  };

  return (
    <AntdModal
      title="New Task"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      onOk={handleAddTask}
      okText="Add Task"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Title:
          <Input
            placeholder="Enter task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>

        <label>
          Description:
          <TextArea
            rows={3}
            placeholder="Enter description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <label>
          Due Date:
          <DatePicker
            showTime
            style={{ width: "100%" }}
            value={form.dueDate}
            onChange={(val) => setForm({ ...form, dueDate: val })}
          />
        </label>

        <label>
          Priority:
          <Select
            value={form.priority}
            onChange={(val) => setForm({ ...form, priority: val })}
            style={{ width: "100%" }}
            options={[
              { value: "Low", label: "Low" },
              { value: "Medium", label: "Medium" },
              { value: "High", label: "High" },
            ]}
          />
        </label>

        <label>
          Project:
          <Select
            value={form.project}
            onChange={(val) => setForm({ ...form, project: val })}
            style={{ width: "100%" }}
            options={[
              {
                value: "Inbox",
                label: "Inbox",
              },
            ]}
          />
        </label>
      </div>
    </AntdModal>
  );
};

export default Modal;
