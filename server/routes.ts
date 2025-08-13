import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { 
  insertOrganizationSchema,
  insertProductSchema,
  insertRfqSchema,
  insertRfqResponseSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertMessageSchema,
  insertReviewSchema,
  insertCategorySchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "No user ID found" });
      }
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Object Storage routes
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Organization routes
  app.get("/api/organizations", async (req, res) => {
    try {
      const { status, search, limit = 20, offset = 0 } = req.query;
      const organizations = await storage.getOrganizations({
        status: status as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.get("/api/organizations/:id", async (req, res) => {
    try {
      const organization = await storage.getOrganization(req.params.id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  app.post("/api/organizations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOrganizationSchema.parse({ ...req.body, userId });
      const organization = await storage.createOrganization(validatedData);
      res.status(201).json(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.put("/api/organizations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const organization = await storage.getOrganization(req.params.id);
      
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      if (organization.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const validatedData = insertOrganizationSchema.partial().parse(req.body);
      const updated = await storage.updateOrganization(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating organization:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update organization" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const { parentId } = req.query;
      const categories = await storage.getCategories(parentId as string);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { organizationId, categoryId, search, isActive = true, limit = 20, offset = 0 } = req.query;
      const products = await storage.getProducts({
        organizationId: organizationId as string,
        categoryId: categoryId as string,
        search: search as string,
        isActive: isActive === 'true',
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Verify user owns the organization
      if (req.body.organizationId) {
        const organization = await storage.getOrganization(req.body.organizationId);
        if (!organization || organization.userId !== userId) {
          return res.status(403).json({ message: "Unauthorized" });
        }
      }

      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // RFQ routes
  app.get("/api/rfqs", async (req, res) => {
    try {
      const { userId, status, categoryId, limit = 20, offset = 0 } = req.query;
      const rfqs = await storage.getRfqs({
        userId: userId as string,
        status: status as string,
        categoryId: categoryId as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(rfqs);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
      res.status(500).json({ message: "Failed to fetch RFQs" });
    }
  });

  app.get("/api/rfqs/:id", async (req, res) => {
    try {
      const rfq = await storage.getRfq(req.params.id);
      if (!rfq) {
        return res.status(404).json({ message: "RFQ not found" });
      }
      res.json(rfq);
    } catch (error) {
      console.error("Error fetching RFQ:", error);
      res.status(500).json({ message: "Failed to fetch RFQ" });
    }
  });

  app.post("/api/rfqs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRfqSchema.parse({ ...req.body, userId });
      const rfq = await storage.createRfq(validatedData);
      res.status(201).json(rfq);
    } catch (error) {
      console.error("Error creating RFQ:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create RFQ" });
    }
  });

  // RFQ Response routes
  app.get("/api/rfqs/:rfqId/responses", async (req, res) => {
    try {
      const responses = await storage.getRfqResponses(req.params.rfqId);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching RFQ responses:", error);
      res.status(500).json({ message: "Failed to fetch RFQ responses" });
    }
  });

  app.post("/api/rfqs/:rfqId/responses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Verify user has an organization
      const organizations = await storage.getOrganizations({});
      const userOrg = organizations.find((org: any) => org.userId === userId);
      if (!userOrg) {
        return res.status(403).json({ message: "Vendor organization required" });
      }

      const validatedData = insertRfqResponseSchema.parse({
        ...req.body,
        rfqId: req.params.rfqId,
        organizationId: userOrg.id
      });
      
      const response = await storage.createRfqResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating RFQ response:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create RFQ response" });
    }
  });

  // Order routes
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId, status, limit = 20, offset = 0 } = req.query;
      
      const filters: any = { limit: parseInt(limit as string), offset: parseInt(offset as string) };
      
      if (organizationId) {
        // Verify user owns the organization
        const organization = await storage.getOrganization(organizationId as string);
        if (!organization || organization.userId !== userId) {
          return res.status(403).json({ message: "Unauthorized" });
        }
        filters.organizationId = organizationId;
      } else {
        filters.userId = userId;
      }
      
      if (status) filters.status = status;
      
      const orders = await storage.getOrders(filters);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOrderSchema.parse({ ...req.body, userId });
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Message routes
  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { orderId, rfqId, limit = 50, offset = 0 } = req.query;
      
      const messages = await storage.getMessages({
        userId,
        orderId: orderId as string,
        rfqId: rfqId as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertMessageSchema.parse({ ...req.body, senderId: userId });
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.put("/api/messages/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      await storage.markMessageAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { organizationId, productId, userId, limit = 20, offset = 0 } = req.query;
      const reviews = await storage.getReviews({
        organizationId: organizationId as string,
        productId: productId as string,
        userId: userId as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // File upload endpoint for logo/images
  app.put("/api/upload/logo", isAuthenticated, async (req: any, res) => {
    if (!req.body.logoUrl) {
      return res.status(400).json({ error: "logoUrl is required" });
    }

    const userId = req.user.claims.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.logoUrl,
        {
          owner: userId,
          visibility: "public",
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting logo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
