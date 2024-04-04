export const projectUrl = (userEmail: string) => {
  return `https://project-management-tool-2dcae-default-rtdb.firebaseio.com/users/${userEmail}/projects.json`;
};
