export const getIcon = (category: string, className: string): JSX.Element => {
  switch (category) {
    case 'Location':
      return <span className={className}>location_on</span>;
    case 'NPC':
      return <span className={className}>person</span>;
    case 'Lore':
      return <span className={className}>history_edu</span>;
    case 'Journal':
      return <span className={className}>class</span>;
    case 'Campaign':
      return <span className={className}>folder</span>;
    case 'Home':
      return <span className={className}>home</span>;
    default:
      return <span className={className}>question_mark</span>;
  }
};
