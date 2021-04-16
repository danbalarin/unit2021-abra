import User from "./models/user";

interface Locals {
  user?: User;
}

declare module 'express' {
  export interface Response  {
    locals: Locals;
  }
}