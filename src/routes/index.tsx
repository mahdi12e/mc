import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/cad/app-shell";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <AppShell />;
}