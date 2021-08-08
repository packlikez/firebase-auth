import Boom from "@hapi/boom";
import { ServiceResponse } from "../../app/type";
import taskModel from "./task.model";

type TaskId = string;

interface Task {
  title: string;
  done: boolean;
}

interface CreateTask {
  title: string;
}

interface UpdateTask {
  done: boolean;
  subTasks?: Task[];
}

class TaskService {
  async getTask(taskId: TaskId): ServiceResponse {
    try {
      const doc = await taskModel.findByPk(taskId).get();
      if (!doc) throw Boom.notFound(`There is no task ID ${taskId}`);

      return { data: doc.data() };
    } catch (e) {
      return { error: e };
    }
  }

  async getTasks(): ServiceResponse {
    try {
      const docs = await taskModel.findAll();
      return { data: docs };
    } catch (e) {
      return { error: e };
    }
  }

  async createTask(task: CreateTask): ServiceResponse {
    try {
      const createdTask = await taskModel.create(task);
      if (!createdTask.id) throw Boom.internal("Create task failed");

      const newTask = await this.getTask(createdTask.id);
      if (newTask.error) throw newTask.error;

      return { data: newTask.data };
    } catch (e) {
      return { error: e };
    }
  }

  async updateTask(taskId: TaskId, task: UpdateTask): ServiceResponse {
    try {
      const docRef = taskModel.findByPk(taskId);
      const doc = await docRef.get();

      if (task.done) {
        let subTasks = doc.data()?.subTasks;
        if (Array.isArray(subTasks)) {
          subTasks = subTasks.map((subTask) => ({ ...subTask, done: true }));
        }
        task.subTasks = subTasks;
      }

      await docRef.update(task);

      return { data: doc.data() };
    } catch (e) {
      return { error: e };
    }
  }

  async createSubTask(taskId: TaskId, task: CreateTask): ServiceResponse {
    try {
      const refDoc = taskModel.findByPk(taskId);
      const doc = await refDoc.get();
      if (!doc) throw Boom.notFound(`There is not task ID ${taskId}`);

      const prevSubTasks = doc.data()?.subTasks;
      const subTasks = Array.isArray(prevSubTasks) ? prevSubTasks : [];
      const data = await refDoc.update({ subTasks: [...subTasks, task] });
      return { data };
    } catch (e) {
      return { error: e };
    }
  }

  async updateSubTask(
    taskId: TaskId,
    subTaskId: number,
    task: Task
  ): ServiceResponse {
    try {
      const refDoc = taskModel.findByPk(taskId);

      const doc = await refDoc.get();

      const data = doc.data();
      const subTasks = data?.subTasks;

      subTasks[subTaskId].done = task.done;

      if (!task.done) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.done = false;
      }

      await refDoc.update({ ...data, subTasks });

      return { data: true };
    } catch (e) {
      return { error: e };
    }
  }
}

export default new TaskService();
