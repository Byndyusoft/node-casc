import {flags as baseFlags} from "@oclif/command";

import {boolableString} from "./boolableString";

export const flags = {...baseFlags, boolableString};
