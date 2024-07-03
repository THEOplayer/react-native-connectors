import { Entity } from "../entities";

export enum ClusterType {
  Continuation = "continuation",
  Recommendation = "recommendation",
  Featured = "featured",
  Subscription = "subscription",
}

export type ClusterDataProvider = () => Entity[];
