import {
  users,
  organizations,
  categories,
  products,
  rfqs,
  rfqResponses,
  orders,
  orderItems,
  messages,
  reviews,
  type User,
  type UpsertUser,
  type Organization,
  type InsertOrganization,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Rfq,
  type InsertRfq,
  type RfqResponse,
  type InsertRfqResponse,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, desc, asc, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Organization operations
  getOrganizations(filters?: { status?: string; search?: string; limit?: number; offset?: number }): Promise<Organization[]>;
  getOrganization(id: string): Promise<Organization | undefined>;
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization>;
  
  // Category operations
  getCategories(parentId?: string): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(filters?: { 
    organizationId?: string; 
    categoryId?: string; 
    search?: string; 
    isActive?: boolean;
    limit?: number; 
    offset?: number;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product>;
  
  // RFQ operations
  getRfqs(filters?: { 
    userId?: string; 
    status?: string; 
    categoryId?: string;
    limit?: number; 
    offset?: number;
  }): Promise<Rfq[]>;
  getRfq(id: string): Promise<Rfq | undefined>;
  createRfq(rfq: InsertRfq): Promise<Rfq>;
  updateRfq(id: string, updates: Partial<InsertRfq>): Promise<Rfq>;
  
  // RFQ Response operations
  getRfqResponses(rfqId: string): Promise<RfqResponse[]>;
  createRfqResponse(response: InsertRfqResponse): Promise<RfqResponse>;
  updateRfqResponse(id: string, updates: Partial<InsertRfqResponse>): Promise<RfqResponse>;
  
  // Order operations
  getOrders(filters?: {
    userId?: string;
    organizationId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order>;
  
  // Order Item operations
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Message operations
  getMessages(filters?: {
    userId?: string;
    orderId?: string;
    rfqId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  
  // Review operations
  getReviews(filters?: {
    organizationId?: string;
    productId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Organization operations
  async getOrganizations(filters?: { 
    status?: string; 
    search?: string; 
    limit?: number; 
    offset?: number;
  }): Promise<Organization[]> {
    let query = db.select().from(organizations);
    
    const conditions = [];
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(organizations.status, filters.status as any));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(organizations.legalName, `%${filters.search}%`),
          ilike(organizations.tradeName, `%${filters.search}%`),
          ilike(organizations.description, `%${filters.search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(organizations.rating));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const [organization] = await db.select().from(organizations).where(eq(organizations.id, id));
    return organization;
  }

  async createOrganization(organization: InsertOrganization): Promise<Organization> {
    const [created] = await db.insert(organizations).values(organization).returning();
    return created;
  }

  async updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization> {
    const [updated] = await db
      .update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return updated;
  }

  // Category operations
  async getCategories(parentId?: string): Promise<Category[]> {
    if (parentId) {
      return await db.select().from(categories)
        .where(and(eq(categories.isActive, true), eq(categories.parentId, parentId)))
        .orderBy(asc(categories.sortOrder), asc(categories.name));
    } else {
      return await db.select().from(categories)
        .where(and(eq(categories.isActive, true), sql`${categories.parentId} IS NULL`))
        .orderBy(asc(categories.sortOrder), asc(categories.name));
    }
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  // Product operations
  async getProducts(filters?: {
    organizationId?: string;
    categoryId?: string;
    search?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    let query = db.select().from(products);
    
    const conditions = [];
    if (filters?.organizationId) {
      conditions.push(eq(products.organizationId, filters.organizationId));
    }
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.nameAr, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )
      );
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(products.rating), desc(products.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  // RFQ operations
  async getRfqs(filters?: {
    userId?: string;
    status?: string;
    categoryId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Rfq[]> {
    let query = db.select().from(rfqs);
    
    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(rfqs.userId, filters.userId));
    }
    if (filters?.status) {
      conditions.push(eq(rfqs.status, filters.status as any));
    }
    if (filters?.categoryId) {
      conditions.push(eq(rfqs.categoryId, filters.categoryId));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(rfqs.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getRfq(id: string): Promise<Rfq | undefined> {
    const [rfq] = await db.select().from(rfqs).where(eq(rfqs.id, id));
    return rfq;
  }

  async createRfq(rfq: InsertRfq): Promise<Rfq> {
    const [created] = await db.insert(rfqs).values(rfq).returning();
    return created;
  }

  async updateRfq(id: string, updates: Partial<InsertRfq>): Promise<Rfq> {
    const [updated] = await db
      .update(rfqs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rfqs.id, id))
      .returning();
    return updated;
  }

  // RFQ Response operations
  async getRfqResponses(rfqId: string): Promise<RfqResponse[]> {
    return await db.select().from(rfqResponses)
      .where(eq(rfqResponses.rfqId, rfqId))
      .orderBy(asc(rfqResponses.price));
  }

  async createRfqResponse(response: InsertRfqResponse): Promise<RfqResponse> {
    const [created] = await db.insert(rfqResponses).values(response).returning();
    return created;
  }

  async updateRfqResponse(id: string, updates: Partial<InsertRfqResponse>): Promise<RfqResponse> {
    const [updated] = await db
      .update(rfqResponses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rfqResponses.id, id))
      .returning();
    return updated;
  }

  // Order operations
  async getOrders(filters?: {
    userId?: string;
    organizationId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    let query = db.select().from(orders);
    
    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(orders.userId, filters.userId));
    }
    if (filters?.organizationId) {
      conditions.push(eq(orders.organizationId, filters.organizationId));
    }
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status as any));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(orders.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const [created] = await db.insert(orders).values({ ...order, orderNumber }).returning();
    return created;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order> {
    const [updated] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  // Order Item operations
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [created] = await db.insert(orderItems).values(item).returning();
    return created;
  }

  // Message operations
  async getMessages(filters?: {
    userId?: string;
    orderId?: string;
    rfqId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Message[]> {
    let query = db.select().from(messages);
    
    const conditions = [];
    if (filters?.userId) {
      conditions.push(
        or(
          eq(messages.senderId, filters.userId),
          eq(messages.recipientId, filters.userId)
        )
      );
    }
    if (filters?.orderId) {
      conditions.push(eq(messages.orderId, filters.orderId));
    }
    if (filters?.rfqId) {
      conditions.push(eq(messages.rfqId, filters.rfqId));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(messages.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db
      .update(messages)
      .set({ status: 'read', readAt: new Date() })
      .where(eq(messages.id, id));
  }

  // Review operations
  async getReviews(filters?: {
    organizationId?: string;
    productId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Review[]> {
    let query = db.select().from(reviews);
    
    const conditions = [];
    if (filters?.organizationId) {
      conditions.push(eq(reviews.organizationId, filters.organizationId));
    }
    if (filters?.productId) {
      conditions.push(eq(reviews.productId, filters.productId));
    }
    if (filters?.userId) {
      conditions.push(eq(reviews.userId, filters.userId));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(reviews.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
