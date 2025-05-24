import { useState } from "react";

const ExpandableText = ({
  text,
  limit = 255,
}: {
  text: string;
  limit?: number;
}) => {
  const [isExpanded, setExpanded] = useState(false);

  if (text.length <= limit) {
    return <article>{text}</article>;
  }

  return (
    <div>
      {isExpanded ? (
        <article>{text}</article>
      ) : (
        <article>{text.substring(0, limit - 30)}...</article>
      )}

      <button className="btn" onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default ExpandableText;
