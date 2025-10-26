import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.SESSION_SECRET || "motivodo-secret-key";
const TOKEN_COOKIE = "motivodo_token";

interface JWTPayload {
  userId: string;
}

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const token = req.cookies?.[TOKEN_COOKIE];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Login schema without password complexity requirements for better UX
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(422).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }

      const { username, password } = validationResult.data;

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie
      res.cookie(TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(422).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }

      const { username, password } = validationResult.data;

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie
      res.cookie(TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie(TOKEN_COOKIE);
    res.json({ message: "Logged out successfully" });
  });

  // Task endpoints
  app.get("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const tasks = await storage.getTasksByUserId(req.userId);
      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Failed to get tasks" });
    }
  });

  app.post("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const validationResult = insertTaskSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(422).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }

      const task = await storage.createTask({
        ...validationResult.data,
        userId: req.userId,
      });
      res.json(task);
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validationResult = insertTaskSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(422).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }

      // Verify task belongs to user
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.userId !== req.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedTask = await storage.updateTask(id, validationResult.data);
      res.json(updatedTask);
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;

      // Verify task belongs to user
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.userId !== req.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteTask(id);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Motivational quotes endpoint
  const quotes = [
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    {
      text: "It always seems impossible until it's done.",
      author: "Nelson Mandela",
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      text: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Your limitation—it's only your imagination.",
      author: "Unknown",
    },
    {
      text: "Push yourself, because no one else is going to do it for you.",
      author: "Unknown",
    },
    {
      text: "Great things never come from comfort zones.",
      author: "Unknown",
    },
    {
      text: "Dream it. Wish it. Do it.",
      author: "Unknown",
    },
    {
      text: "Success doesn't just find you. You have to go out and get it.",
      author: "Unknown",
    },
    {
      text: "The harder you work for something, the greater you'll feel when you achieve it.",
      author: "Unknown",
    },
    {
      text: "Dream bigger. Do bigger.",
      author: "Unknown",
    },
    {
      text: "Don't stop when you're tired. Stop when you're done.",
      author: "Unknown",
    },
    {
      text: "Wake up with determination. Go to bed with satisfaction.",
      author: "Unknown",
    },
    {
      text: "Do something today that your future self will thank you for.",
      author: "Sean Patrick Flanery",
    },
    {
      text: "Little things make big days.",
      author: "Unknown",
    },
    {
      text: "It's going to be hard, but hard does not mean impossible.",
      author: "Unknown",
    },
    {
      text: "Don't wait for opportunity. Create it.",
      author: "Unknown",
    },
  ];

  // Simple quote caching (returns same quote for the day)
  let cachedQuote: { text: string; author: string; date: string } | null = null;

  app.get("/api/quotes/daily/:refresh?", (req, res) => {
    const today = new Date().toDateString();

    if (!cachedQuote || cachedQuote.date !== today) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      cachedQuote = {
        ...randomQuote,
        date: today,
      };
    }

    res.json({ text: cachedQuote.text, author: cachedQuote.author });
  });

  const httpServer = createServer(app);

  return httpServer;
}
