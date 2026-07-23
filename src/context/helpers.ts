import type { AuditLogItem, HospitalRole, TimelineEvent } from "./types";

export function generateId(prefix: string): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export function getCurrentTimeFormatted(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getCurrentDateTimeFormatted(): string {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return `${dateStr} ${timeStr}`;
}

export function createAuditLog(
  actorRole: HospitalRole,
  actorName: string,
  action: string,
  entityType: AuditLogItem["entityType"],
  entityId: string,
  description: string
): AuditLogItem {
  return {
    id: generateId("AUD"),
    timestamp: getCurrentDateTimeFormatted(),
    actorRole,
    actorName,
    action,
    entityType,
    entityId,
    description,
  };
}

export function createTimelineEvent(
  patientId: string,
  title: string,
  subtitle: string,
  type: TimelineEvent["type"],
  department?: string
): TimelineEvent {
  return {
    id: generateId("EV"),
    patientId,
    date: `Today, ${getCurrentTimeFormatted()}`,
    time: getCurrentTimeFormatted(),
    title,
    subtitle,
    type,
    department,
  };
}
