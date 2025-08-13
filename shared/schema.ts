import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['buyer', 'vendor', 'admin']);
export const organizationStatusEnum = pgEnum('organization_status', ['pending', 'active', 'suspended', 'rejected']);
export const rfqStatusEnum = pgEnum('rfq_status', ['draft', 'published', 'closed', 'cancelled']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);
export const messageStatusEnum = pgEnum('message_status', ['sent', 'delivered', 'read']);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('buyer'),
  phone: varchar("phone"),
  preferredLanguage: varchar("preferred_language").default('en'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organizations (Vendors)
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  legalName: varchar("legal_name").notNull(),
  tradeName: varchar("trade_name"),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  commercialRegistration: varchar("commercial_registration"),
  taxNumber: varchar("tax_number"),
  website: varchar("website"),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  city: varchar("city"),
  status: organizationStatusEnum("status").default('pending'),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  categories: text("categories").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories  
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  nameAr: varchar("name_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  iconUrl: varchar("icon_url"),
  parentId: varchar("parent_id"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").references(() => organizations.id),
  categoryId: varchar("category_id").references(() => categories.id),
  name: varchar("name").notNull(),
  nameAr: varchar("name_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  sku: varchar("sku"),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency").default('QAR'),
  images: text("images").array(),
  specifications: jsonb("specifications"),
  stockQuantity: integer("stock_quantity"),
  minOrderQuantity: integer("min_order_quantity").default(1),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RFQs (Request for Quotes)
export const rfqs = pgTable("rfqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  categoryId: varchar("category_id").references(() => categories.id),
  projectType: varchar("project_type"),
  budgetMin: decimal("budget_min", { precision: 10, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 10, scale: 2 }),
  currency: varchar("currency").default('QAR'),
  deadline: timestamp("deadline"),
  attachments: text("attachments").array(),
  status: rfqStatusEnum("status").default('draft'),
  requirements: jsonb("requirements"),
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RFQ Responses
export const rfqResponses = pgTable("rfq_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqId: varchar("rfq_id").references(() => rfqs.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency").default('QAR'),
  deliveryTime: varchar("delivery_time"),
  description: text("description"),
  attachments: text("attachments").array(),
  validUntil: timestamp("valid_until"),
  isAccepted: boolean("is_accepted"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  rfqResponseId: varchar("rfq_response_id").references(() => rfqResponses.id),
  orderNumber: varchar("order_number").unique(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  currency: varchar("currency").default('QAR'),
  status: orderStatusEnum("status").default('pending'),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  notes: text("notes"),
  paymentMethod: varchar("payment_method"),
  paymentReference: varchar("payment_reference"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  productId: varchar("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  specifications: jsonb("specifications"),
});

// Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id),
  recipientId: varchar("recipient_id").references(() => users.id),
  orderId: varchar("order_id").references(() => orders.id),
  rfqId: varchar("rfq_id").references(() => rfqs.id),
  subject: varchar("subject"),
  content: text("content").notNull(),
  attachments: text("attachments").array(),
  status: messageStatusEnum("status").default('sent'),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  productId: varchar("product_id").references(() => products.id),
  orderId: varchar("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  title: varchar("title"),
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(organizations),
  rfqs: many(rfqs),
  orders: many(orders),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  reviews: many(reviews),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  user: one(users, { fields: [organizations.userId], references: [users.id] }),
  products: many(products),
  rfqResponses: many(rfqResponses),
  orders: many(orders),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  children: many(categories),
  products: many(products),
  rfqs: many(rfqs),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  organization: one(organizations, { fields: [products.organizationId], references: [organizations.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const rfqsRelations = relations(rfqs, ({ one, many }) => ({
  user: one(users, { fields: [rfqs.userId], references: [users.id] }),
  category: one(categories, { fields: [rfqs.categoryId], references: [categories.id] }),
  responses: many(rfqResponses),
  messages: many(messages),
}));

export const rfqResponsesRelations = relations(rfqResponses, ({ one, many }) => ({
  rfq: one(rfqs, { fields: [rfqResponses.rfqId], references: [rfqs.id] }),
  organization: one(organizations, { fields: [rfqResponses.organizationId], references: [organizations.id] }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  organization: one(organizations, { fields: [orders.organizationId], references: [organizations.id] }),
  rfqResponse: one(rfqResponses, { fields: [orders.rfqResponseId], references: [rfqResponses.id] }),
  items: many(orderItems),
  messages: many(messages),
  reviews: many(reviews),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sentMessages" }),
  recipient: one(users, { fields: [messages.recipientId], references: [users.id], relationName: "receivedMessages" }),
  order: one(orders, { fields: [messages.orderId], references: [orders.id] }),
  rfq: one(rfqs, { fields: [messages.rfqId], references: [rfqs.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  organization: one(organizations, { fields: [reviews.organizationId], references: [organizations.id] }),
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrganizationSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true, updatedAt: true, rating: true, reviewCount: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, updatedAt: true, rating: true, reviewCount: true });
export const insertRfqSchema = createInsertSchema(rfqs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRfqResponseSchema = createInsertSchema(rfqResponses).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, readAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertRfq = z.infer<typeof insertRfqSchema>;
export type Rfq = typeof rfqs.$inferSelect;
export type InsertRfqResponse = z.infer<typeof insertRfqResponseSchema>;
export type RfqResponse = typeof rfqResponses.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
