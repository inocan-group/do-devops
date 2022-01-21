const myDefault: string = "hey ho";

const greeting: (name: string) => string = (name: string) => `Hi ${name}`;

export default myDefault;
export {greeting};