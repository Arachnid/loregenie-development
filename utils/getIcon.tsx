import {
  MdClass,
  MdFolder,
  MdHistoryEdu,
  MdHome,
  MdLocationOn,
  MdPerson,
  MdQuestionMark,
} from "react-icons/md";

export const getIcon = (category: string, className: string): JSX.Element => {
  switch (category) {
    case "Location":
      return <MdLocationOn className={className} />;
    case "NPC":
      return <MdPerson className={className} />;
    case "Lore":
      return <MdHistoryEdu className={className} />;
    case "Journal":
      return <MdClass className={className} />;
    case "Campaign":
      return <MdFolder className={className} />;
    case "Home":
      return <MdHome className={className} />;
    default:
      return <MdQuestionMark className={className} />;
  }
};
