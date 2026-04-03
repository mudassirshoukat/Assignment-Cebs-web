
export enum TaskStatusEnum {
  Todo = 0,        // Task is created but not yet started
  InProgress = 1,  // Work on the task has started
  Review = 2,      // Task is completed, awaiting review/approval
  Done = 3,        // Task is completed and approved
  Cancelled = 4,   // Task is terminated and will not be completed
  Blocked = 5,     // Task is blocked due to dependency or issue
}
