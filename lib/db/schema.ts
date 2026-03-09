import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const watches = sqliteTable("watches", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  reference: text("reference"),
  launchDate: text("launch_date"),
  msrp: integer("msrp"),
  currency: text("currency").default("USD"),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const priceEntries = sqliteTable("price_entries", {
  id: text("id").primaryKey(),
  watchId: text("watch_id")
    .notNull()
    .references(() => watches.id, { onDelete: "cascade" }),
  source: text("source").notNull(),
  retailerName: text("retailer_name"),
  price: integer("price").notNull(),
  currency: text("currency").default("USD"),
  recordedAt: text("recorded_at").notNull(),
  url: text("url"),
  createdAt: text("created_at").notNull(),
});

export const launchEvents = sqliteTable("launch_events", {
  id: text("id").primaryKey(),
  watchId: text("watch_id")
    .notNull()
    .references(() => watches.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  date: text("date").notNull(),
  note: text("note"),
  createdAt: text("created_at").notNull(),
});

export type Watch = typeof watches.$inferSelect;
export type NewWatch = typeof watches.$inferInsert;
export type PriceEntry = typeof priceEntries.$inferSelect;
export type NewPriceEntry = typeof priceEntries.$inferInsert;
export type LaunchEvent = typeof launchEvents.$inferSelect;
export type NewLaunchEvent = typeof launchEvents.$inferInsert;
