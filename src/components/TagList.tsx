import delay from "delay";
import { useEffect, useState } from "react";

const TagList = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      await delay(1000);
      setLoading(false);
      setTags(["react", "javascript", "typescript", "web development"]);
    };
    fetchTags();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
};

export default TagList;
