import { default as add } from "./add/index";
import { default as autoindex } from "./autoindex/index";
import { default as awsid } from "./awsid/index";
import { default as cert } from "./cert/index";
import { default as deploy } from "./deploy/index";
import { default as endpoints } from "./endpoints/index";
import { default as fns } from "./fns/index";
import { default as image } from "./image/index";
import { default as info } from "./info/index";
import { default as install } from "./install/index";
import { default as invoke } from "./invoke/index";
import { default as latest } from "./latest/index";
import { default as layers } from "./layers/index";
import { default as ls } from "./ls/index";
import { default as madge } from "./madge/index";
import { default as outdated } from "./outdated/index";
import { default as pkg } from "./pkg/index";
import { default as scaffold } from "./scaffold/index";
import { default as ssm } from "./ssm/index";
import { default as tree } from "./tree/index";
import { default as upgrade } from "./upgrade/index";
import { default as watch } from "./watch/index";
import { default as why } from "./why/index";

export const commands = {
  add,
  autoindex,
  awsid,
  cert,
  deploy,
  endpoints,
  fns,
  image,
  info,
  install,
  invoke,
  latest,
  layers,
  ls,
  madge,
  outdated,
  pkg,
  scaffold,
  ssm,
  tree,
  upgrade,
  watch,
  why,
};

export type Commands = typeof commands;

export default commands;
