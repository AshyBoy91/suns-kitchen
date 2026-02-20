const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- In-memory data store ---

const menu = [
  // Starters
  { id: 1, name: "Spring Rolls", price: 120, category: "Starters", image: "🥟", description: "Crispy vegetable spring rolls" },
  { id: 2, name: "Tom Yum Soup", price: 150, category: "Starters", image: "🍜", description: "Spicy & sour Thai soup" },
  { id: 3, name: "Chicken Satay", price: 180, category: "Starters", image: "🍢", description: "Grilled skewers with peanut sauce" },
  { id: 4, name: "Edamame", price: 90, category: "Starters", image: "🫛", description: "Steamed soybeans with sea salt" },
  // Mains
  { id: 5, name: "Pad Thai", price: 220, category: "Mains", image: "🍝", description: "Stir-fried rice noodles with shrimp" },
  { id: 6, name: "Green Curry", price: 250, category: "Mains", image: "🍛", description: "Thai green curry with chicken" },
  { id: 7, name: "Fried Rice", price: 180, category: "Mains", image: "🍚", description: "Wok-fried rice with vegetables & egg" },
  { id: 8, name: "Grilled Salmon", price: 350, category: "Mains", image: "🐟", description: "Teriyaki glazed salmon fillet" },
  { id: 9, name: "Massaman Curry", price: 270, category: "Mains", image: "🍲", description: "Rich & mild curry with potatoes" },
  { id: 10, name: "Basil Chicken", price: 200, category: "Mains", image: "🐔", description: "Stir-fried chicken with holy basil" },
  // Drinks
  { id: 11, name: "Thai Iced Tea", price: 80, category: "Drinks", image: "🧋", description: "Sweet creamy Thai tea" },
  { id: 12, name: "Coconut Water", price: 60, category: "Drinks", image: "🥥", description: "Fresh young coconut water" },
  { id: 13, name: "Mango Smoothie", price: 100, category: "Drinks", image: "🥭", description: "Fresh mango blended smoothie" },
  { id: 14, name: "Lemonade", price: 70, category: "Drinks", image: "🍋", description: "Freshly squeezed lemonade" },
  // Desserts
  { id: 15, name: "Mango Sticky Rice", price: 130, category: "Desserts", image: "🍚", description: "Sweet sticky rice with fresh mango" },
  { id: 16, name: "Coconut Ice Cream", price: 100, category: "Desserts", image: "🍨", description: "Creamy coconut ice cream" },
  { id: 17, name: "Banana Fritters", price: 90, category: "Desserts", image: "🍌", description: "Crispy fried banana with honey" },
];

let orders = [];
let orderIdCounter = 1;

// SSE clients for kitchen real-time updates
let kitchenClients = [];

function notifyKitchen(data) {
  kitchenClients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// --- API Routes ---

// Get menu
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// Place order
app.post("/api/orders", (req, res) => {
  const { tableNumber, items, notes } = req.body;

  if (!tableNumber || !items || items.length === 0) {
    return res.status(400).json({ error: "Table number and items are required" });
  }

  const order = {
    id: orderIdCounter++,
    tableNumber,
    items: items.map((item) => ({
      menuItemId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    notes: notes || "",
    status: "new",
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  notifyKitchen({ type: "new_order", order });
  res.status(201).json({ success: true, orderId: order.id });
});

// Get all orders
app.get("/api/orders", (req, res) => {
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Update order status
app.patch("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  const order = orders.find((o) => o.id === parseInt(req.params.id));

  if (!order) return res.status(404).json({ error: "Order not found" });

  order.status = status;
  notifyKitchen({ type: "order_updated", order });
  res.json(order);
});

// SSE endpoint for kitchen
app.get("/api/kitchen/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const clientId = Date.now();
  const client = { id: clientId, res };
  kitchenClients.push(client);

  // Send current orders on connect
  res.write(`data: ${JSON.stringify({ type: "init", orders })}\n\n`);

  req.on("close", () => {
    kitchenClients = kitchenClients.filter((c) => c.id !== clientId);
  });
});

// Serve menu page as default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html"));
});

app.get("/kitchen", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "kitchen.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Menu page: http://localhost:${PORT}/`);
  console.log(`Kitchen page: http://localhost:${PORT}/kitchen`);
});
