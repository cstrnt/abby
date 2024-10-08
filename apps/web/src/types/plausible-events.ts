import type { FeatureFlagType } from "@prisma/client";
import type { PlanName } from "server/common/plans";

export type Plan = PlanName | "HOBBY";

export type PlausibleEvents = {
  "Sign Up Clicked": never;
  "Plan Selected": {
    Plan: Plan;
  };
  "Plan Upgrade Clicked": {
    Plan: Plan;
  };
  "Project Created": never;
  "AB-Test Created": {
    "Amount Of Variants": number;
  };
  "Environment Created": never;
  "Feature Flag Created": {
    "Feature Flag Type": FeatureFlagType;
  };
  "Devtools Opened": never;
  "Devtools Interaction": {
    type: "Flag Updated" | "Variant Selected";
  };
  "AB Testing Generator Used": {
    target: string;
    count: number;
  };
  "API Project Data Retrieved": {
    projectId: string;
  };
  "Dashboard Help Clicked": never;
  "Dashboard Code Clicked": never;
};

export type ServerEvents = {
  flag_removal_pr_created: {
    files_changed: number;
  };
};
