// src/utils/navigationActions.ts
import useNavigationStore from "@/store/navigationStore";

export const fetchMenuItems = async () => {
  const { fetchMenuItems } = useNavigationStore.getState();
  await fetchMenuItems();
};
