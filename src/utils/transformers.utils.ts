export const transformer = {
  stringify: (...args: any[]): string[] => {
    return args.map(x => x.toString());
  }
} 
