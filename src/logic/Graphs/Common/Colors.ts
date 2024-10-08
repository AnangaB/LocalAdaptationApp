//using from https://sashamaps.net/docs/resources/20-colors/
const colors = [
'#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
  ];

  export const getNColors = (n: number): string[] => {
    return colors.slice(0, n);
  };