import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";

export function useProjects() {
  return useQuery(api.projects.getProjects);
}

export function useTeamMembers() {
  return useQuery(api.team.getTeamMembers);
}

export function useTransactions() {
  return useQuery(api.finance.getTransactions);
}

export function useEvents() {
  return useQuery(api.schedule.getEvents);
}
