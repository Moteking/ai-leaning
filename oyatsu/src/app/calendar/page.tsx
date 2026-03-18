import { prisma } from "@/lib/db";
import CalendarClient from "./CalendarClient";

const DEMO_EMAIL = "demo@oyatsu.jp";

export default async function CalendarPage() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      calendarEvents: { orderBy: { date: "asc" } },
      parents: true,
    },
  });

  const events = user?.calendarEvents || [];
  const parents = user?.parents || [];

  return (
    <CalendarClient
      initialEvents={events.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        type: e.type,
        parentRelation: e.parentRelation,
        reminder: e.reminder,
        reminderDays: e.reminderDays,
        notes: e.notes,
      }))}
      parents={parents.map((p) => ({
        relation: p.relation,
        name: p.name,
      }))}
    />
  );
}
