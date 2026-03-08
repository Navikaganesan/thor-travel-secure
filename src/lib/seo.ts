import { useEffect } from "react";

const updateTitle = () => {
  document.title = "THOR — Guard of Tourism";
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", "Tourism Helper and Organizer with Risk Guard. Global tourism safety platform for travelers and authorities.");
};

export default updateTitle;
