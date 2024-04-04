import React, { useState, useEffect } from "react";
import { TaskData } from "../../pages/Project";
import { PriorityIconMap } from "../../pages/Project";
import { Droppable, Draggable } from "react-beautiful-dnd";
import SubTaskModal from "./SubTaskModal";
import { ProjectDetails } from "../projectForm/ProjectCreationForm";
import { useParams } from "react-router-dom";

interface TaskListProps {
  taskData: TaskData[];
  progressData: TaskData[];
  completedData: TaskData[];
  priorityIconMap: PriorityIconMap;
  taskListRef: React.RefObject<HTMLDivElement>;
}

const TaskList: React.FC<TaskListProps> = ({
  taskData,
  progressData,
  completedData,
  priorityIconMap,
  taskListRef,
}) => {
  const { projectName } = useParams<{ projectName: string }>();
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isInProgressModalOpen, setIsInProgressModalOpen] = useState(false);
  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);
  const projectDetailsString = localStorage.getItem("projectDetails");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    const storedComments = localStorage.getItem(`comments_${selectedTask?.id}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [selectedTask]);

  const handleAddComment = () => {
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    if (selectedTask) {
      localStorage.setItem(
        `comments_${selectedTask.id}`,
        JSON.stringify(updatedComments)
      );
    }

    setNewComment("");
  };

  const handleDeleteComment = (selectedTask: any, commentIndex: number) => {
    let commentsString = localStorage.getItem(`comments_${selectedTask.id}`);
    if (!commentsString) return;
    let comments = JSON.parse(commentsString) || [];

    // Remove the comment at the specified index
    comments.splice(commentIndex, 1);

    localStorage.setItem(
      `comments_${selectedTask.id}`,
      JSON.stringify(comments)
    );
    setComments([...comments]);
  };

  let projectDetails: ProjectDetails | null = null;

  if (projectDetailsString) {
    projectDetails = JSON.parse(projectDetailsString);
  }

  const openTodoModal = (task: TaskData) => {
    setSelectedTask(task);
    setIsTodoModalOpen(true);
  };

  const openInProgressModal = (task: TaskData) => {
    setSelectedTask(task);
    setIsInProgressModalOpen(true);
  };

  const openDoneModal = (task: TaskData) => {
    setSelectedTask(task);
    setIsDoneModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsTodoModalOpen(false);
    setIsInProgressModalOpen(false);
    setIsDoneModalOpen(false);
  };
  return (
    <div className="grid grid-cols-3 h-screen mt-4 gap-4 mx-6 rounded-md">
      <Droppable droppableId="todo">
        {(provided) => (
          <div
            className="col-span-1"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div
              className="bg-gray-100 py-4 px-6"
              style={{
                maxHeight: "50vh",
                overflowY: "auto",
                width: "100%",
                height: "100%",
              }}
              ref={taskListRef}
            >
              <h2 className="text-lg text-blue-900 font-semibold mb-4 border-b-2 border-gray-300 pb-2">
                To Do:
              </h2>
              {taskData
                .slice()
                .sort((a, b) => {
                  const priorityOrder: Record<string, number> = {
                    low: 0,
                    medium: 1,
                    high: 2,
                  };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((task, index) => (
                  <div key={index}>
                    <Draggable
                      key={task.id}
                      draggableId={`${task.id}-todo`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => openTodoModal(task)}
                        >
                          <div className="bg-white shadow-md rounded-md p-4 mb-4 relative">
                            <p className="font-semibold text-blue-900">
                              Task Name: {task.taskName}
                            </p>
                            <p>Description: {task.description}</p>
                            {/* <p>Priority: {task.priority}</p> */}
                            <p>Duration: {task.duration} days</p>
                            <div className="absolute right-2 bottom-2">
                              {
                                priorityIconMap[
                                  task.priority as keyof PriorityIconMap
                                ]
                              }
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                    <SubTaskModal
                      key={`${task.id}-todo-modal`}
                      isOpen={isTodoModalOpen}
                      onClose={closeModal}
                    >
                      {/* Apply padding to the modal content */}
                      <div className="grid grid-cols-2 gap-x-16 ">
                        {/* Left side */}
                        <div>
                          <h1 className="text-xl font-bold text-blue-900 mb-4">
                            {selectedTask?.taskName}
                          </h1>
                          <p className="text-sm text-gray-800 mb-4">
                            {selectedTask?.description}
                          </p>
                          <p className="text-sm text-blue-900 mt-4 mb-8">
                            Activity
                          </p>
                          {/* Comment section */}
                          <div className="mt-4">
                            <h3 className="text-lg text-blue-900 font-bold mb-4">
                              Comments
                            </h3>
                            {/* Render comments here */}
                            <div
                              style={{
                                maxHeight: "300px",
                                overflowY: "auto",
                              }}
                            >
                              {comments.map((comment, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-100 rounded-md p-3 mb-2 flex items-center justify-between"
                                >
                                  <p className="text-gray-700">{comment}</p>
                                  <button
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                    onClick={() =>
                                      handleDeleteComment(selectedTask, index)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                            {/* Add an input box for new comments */}
                            <div className="mt-4">
                              <input
                                type="text"
                                className="border border-gray-100 hover:border-blue-900 rounded-md p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddComment();
                                  }
                                }}
                              />
                              <button
                                onClick={handleAddComment}
                                className="mt-2 bg-blue-900 text-white hover:bg-gray-100 hover:text-blue-900 border hover:border-blue-900 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                              >
                                Add Comment
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Right side */}
                        <div>
                          <h2 className="text-lg font-bold text-blue-900 mb-4">
                            Details
                          </h2>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="text-blue-900">Reporter:</span>
                            <span className="ml-2">
                              {projectDetails?.projectOwner}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="text-blue-900">Assignee:</span>
                            <span className="ml-2">
                              {selectedTask?.assignee}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="text-blue-900">Priority:</span>
                            <span className="ml-2">
                              {selectedTask?.priority}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="text-blue-900">Duration:</span>
                            <span className="ml-2">
                              {selectedTask?.duration} days
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="text-blue-900">
                              Project status:
                            </span>
                            <span className="ml-2">{selectedTask?.status}</span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="text-blue-900">Parent:</span>
                            <span className="ml-2">{projectName}</span>
                          </p>
                        </div>
                      </div>
                    </SubTaskModal>
                  </div>
                ))}

              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      <Droppable droppableId="inProgress">
        {(provided) => (
          <div
            className="col-span-1"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div
              className="bg-gray-100 py-4 px-6"
              style={{
                maxHeight: "50vh",
                overflowY: "auto",
                width: "100%",
                height: "100%",
              }}
            >
              <h2 className="text-lg text-blue-900 font-semibold mb-4 border-b-2 border-gray-300 pb-2">
                In Progress:
              </h2>
              {progressData &&
                progressData
                  .slice()
                  .sort((a, b) => {
                    const priorityOrder: Record<string, number> = {
                      low: 0,
                      medium: 1,
                      high: 2,
                    };
                    return (
                      priorityOrder[b.priority] - priorityOrder[a.priority]
                    );
                  })
                  .map((task, index) => (
                    <div key={index}>
                      <Draggable
                        key={task.id}
                        draggableId={`${task.id}-inProgress`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => openInProgressModal(task)}
                          >
                            <div className="bg-white shadow-md rounded-md p-4 mb-4 relative">
                              <p className="font-semibold text-blue-900">
                                Task Name: {task.taskName}
                              </p>
                              <p>Description: {task.description}</p>
                              <p>Duration: {task.duration} days</p>
                              <div className="absolute bottom-1 right-2">
                                {
                                  priorityIconMap[
                                    task.priority as keyof PriorityIconMap
                                  ]
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                      <SubTaskModal
                        key={`${task.id}-progress-modal`}
                        isOpen={isInProgressModalOpen}
                        onClose={closeModal}
                      >
                        {/* Left side */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h1 className="text-xl font-bold text-blue-900">
                              {selectedTask?.taskName}
                            </h1>
                            <p className="text-sm text-gray-800">
                              {selectedTask?.description}
                            </p>
                            <p className="text-sm text-blue-900 mt-4">
                              Activity
                            </p>

                            {/* Comment section */}
                            <div className="mt-4">
                              <h3 className="text-lg text-blue-900 font-bold text-gray-800">
                                Comments
                              </h3>
                              {/* Render comments here */}
                              <div
                                className="mt-2"
                                style={{
                                  maxHeight: "calc(80vh - 250px)",
                                  overflowY: "auto",
                                }}
                              >
                                {comments.map((comment, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-100 rounded-md p-3 mb-2 flex items-center justify-between"
                                  >
                                    <p className="text-gray-700">{comment}</p>
                                    <button
                                      className="text-red-500 hover:text-red-700 focus:outline-none focus:text-red-700"
                                      onClick={() =>
                                        handleDeleteComment(selectedTask, index)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                              {/* Add an input box for new comments */}
                              <div className="mt-4">
                                <input
                                  type="text"
                                  className="border border-gray-100 hover:border-blue-900 rounded-md p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                                  placeholder="Add a comment..."
                                  value={newComment}
                                  onChange={(e) =>
                                    setNewComment(e.target.value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddComment();
                                    }
                                  }}
                                />
                                <button
                                  onClick={handleAddComment}
                                  className="mt-2 bg-blue-900 hover:bg-gray-100 text-gray-100 hover:text-blue-900 border hover:border-blue-900 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                >
                                  Add Comment
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Right side */}
                          <div>
                            <h2 className="text-lg font-bold text-blue-900">
                              Details
                            </h2>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="text-blue-900">Reporter:</span>
                              <span className="ml-2">
                                {projectDetails?.projectOwner}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Assignee:</span>
                              <span className="ml-2">
                                {selectedTask?.assignee}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Priority:</span>
                              <span className="ml-2">
                                {selectedTask?.priority}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Duration:</span>
                              <span className="ml-2">
                                {selectedTask?.duration} days
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">
                                Project status
                              </span>
                              <span className="ml-2">
                                {selectedTask?.status}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Parent:</span>
                              <span className="ml-2">{projectName}</span>
                            </p>
                          </div>
                        </div>
                      </SubTaskModal>
                    </div>
                  ))}

              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      <Droppable droppableId="done">
        {(provided) => (
          <div
            className="col-span-1"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div
              className="bg-gray-100 py-4 px-6"
              style={{
                maxHeight: "50vh",
                overflowY: "auto",
                width: "100%",
                height: "100%",
              }}
            >
              <h2 className="text-lg text-blue-900 font-semibold mb-4 border-b-2 border-gray-300 pb-2">
                Done:
              </h2>
              {completedData &&
                completedData
                  .slice()
                  .sort((a, b) => {
                    const priorityOrder: Record<string, number> = {
                      low: 0,
                      medium: 1,
                      high: 2,
                    };
                    return (
                      priorityOrder[b.priority] - priorityOrder[a.priority]
                    );
                  })
                  .map((task, index) => (
                    <div key={index}>
                      <Draggable
                        key={task.id}
                        draggableId={`${task.id}-done`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => openDoneModal(task)}
                          >
                            <div className="bg-white shadow-md rounded-md p-4 mb-4 relative">
                              <p className="font-semibold text-blue-900">
                                Task Name: {task.taskName}
                              </p>
                              <p>Description: {task.description}</p>
                              <p>Duration: {task.duration} days</p>
                              <div className="absolute bottom-1 right-2">
                                {
                                  priorityIconMap[
                                    task.priority as keyof PriorityIconMap
                                  ]
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                      <SubTaskModal
                        key={`${task.id}-done-modal`}
                        isOpen={isDoneModalOpen}
                        onClose={closeModal}
                      >
                        {/* Left side */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h1 className="text-xl font-bold text-blue-900">
                              {selectedTask?.taskName}
                            </h1>
                            <p className="text-sm text-gray-800">
                              {selectedTask?.description}
                            </p>
                            <p className="text-sm text-blue-900 mt-4">
                              Activity
                            </p>

                            {/* Comment section */}
                            <div className="mt-4">
                              <h3 className="text-lg text-blue-900 font-bold text-gray-800">
                                Comments
                              </h3>
                              {/* Render comments here */}
                              <div
                                className="mt-2"
                                style={{
                                  maxHeight: "calc(80vh - 250px)",
                                  overflowY: "auto",
                                }}
                              >
                                {comments.map((comment, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-100 rounded-md p-3 mb-2 flex items-center justify-between"
                                  >
                                    <p className="text-gray-700">{comment}</p>
                                    <button
                                      className="text-red-500 hover:text-red-700 focus:outline-none focus:text-red-700"
                                      onClick={() =>
                                        handleDeleteComment(selectedTask, index)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                              {/* Add an input box for new comments */}
                              <div className="mt-4">
                                <input
                                  type="text"
                                  className="border border-gray-100 hover:border-blue-900 rounded-md p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                                  placeholder="Add a comment..."
                                  value={newComment}
                                  onChange={(e) =>
                                    setNewComment(e.target.value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddComment();
                                    }
                                  }}
                                />
                                <button
                                  onClick={handleAddComment}
                                  className="mt-2 bg-blue-900 hover:bg-gray-100 text-gray-100 hover:text-blue-900 border hover:border-blue-900 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                >
                                  Add Comment
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Right side */}
                          <div>
                            <h2 className="text-lg font-bold text-blue-900">
                              Details
                            </h2>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="text-blue-900">Reporter:</span>
                              <span className="ml-2">
                                {projectDetails?.projectOwner}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Assignee:</span>
                              <span className="ml-2">
                                {selectedTask?.assignee}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Priority:</span>
                              <span className="ml-2">
                                {selectedTask?.priority}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Duration:</span>
                              <span className="ml-2">
                                {selectedTask?.duration} days
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">
                                Project status
                              </span>
                              <span className="ml-2">
                                {selectedTask?.status}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-900">Parent:</span>
                              <span className="ml-2">{projectName}</span>
                            </p>
                          </div>
                        </div>
                      </SubTaskModal>
                    </div>
                  ))}

              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList;
