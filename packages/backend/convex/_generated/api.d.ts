/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as budgets from "../budgets.js";
import type * as finance from "../finance.js";
import type * as projects from "../projects.js";
import type * as schedule from "../schedule.js";
import type * as seed from "../seed.js";
import type * as tasks from "../tasks.js";
import type * as team from "../team.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  budgets: typeof budgets;
  finance: typeof finance;
  projects: typeof projects;
  schedule: typeof schedule;
  seed: typeof seed;
  tasks: typeof tasks;
  team: typeof team;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
