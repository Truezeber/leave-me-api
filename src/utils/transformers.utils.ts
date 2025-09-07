export const transformer = {
  toString: (...args: any[]): string[] => {
    return args.map(x => x.toString());
  },

  toInt: (...args: any[]): number[] => {
    return args.map(x => parseInt(x));
  }
} 
