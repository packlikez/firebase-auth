import admin from "firebase-admin";
admin.initializeApp();

const db = admin.firestore();

interface CreateTask {
  title: string;
}

class TaskModel {
  model = db.collection("tasks");

  getDoc() {
    return this.model.doc();
  }

  findByPk(id: string) {
    return this.model.doc(id);
  }

  async findAll() {
    const doc = await this.model.get();
    return doc.docs.map((item) => item.data());
  }

  async create(task: CreateTask) {
    const refTask = this.getDoc();
    await refTask.set(task);
    return refTask;
  }
}

export default new TaskModel();
