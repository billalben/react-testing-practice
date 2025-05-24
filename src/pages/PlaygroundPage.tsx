// import Onboarding from "../components/Onboarding";
// import TermsAndConditions from "../components/TermsAndConditions";
// import ExpandableText from "../components/ExpandableText";

import SearchBox from "../components/SearchBox";

const PlaygroundPage = () => {
  // return <Onboarding />;
  // return <TermsAndConditions />;
  // return <ExpandableText text={"a".repeat(256)} />;
  return <SearchBox onChange={(text) => console.log(text)} />;
};

export default PlaygroundPage;
