const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// ─── In-memory Data Store ───

let menuItems = [
  // Starters
  { id: 1, name: "Steamed Shrimp with Seafood Sauce", nameTh: "กุ้งนึ่งน้ำจิ้มซีฟู้ด", nameZh: "蒸虾配海鲜酱", nameRu: "Креветки на пару с соусом", nameKo: "찐 새우와 해산물 소스", nameJa: "蒸しエビのシーフードソース", price: 280, category: "starters", description: "Fresh prawns steamed to perfection, served with spicy seafood sauce", image: "/images/1.jpg", available: true },
  { id: 2, name: "Steamed Blue Crab", nameTh: "ปูม้านึ่ง", nameZh: "清蒸蓝蟹", nameRu: "Голубой краб на пару", nameKo: "찐 꽃게", nameJa: "蒸しワタリガニ", price: 350, category: "starters", description: "Whole blue crab steamed with Thai herbs", image: "/images/14.jpg", available: true },
  { id: 3, name: "Tom Yum Kung", nameTh: "ต้มยำกุ้ง", nameZh: "冬阴功汤", nameRu: "Том Ям Кунг", nameKo: "똠양꿍", nameJa: "トムヤムクン", price: 220, category: "starters", description: "Spicy & sour Thai soup with fresh prawns", image: "", available: true },
  { id: 4, name: "Fresh Squid Stir-Fry", nameTh: "ปลาหมึกผัด", nameZh: "炒鱿鱼", nameRu: "Жареные кальмары", nameKo: "오징어 볶음", nameJa: "イカ炒め", price: 200, category: "starters", description: "Tender squid stir-fried with garlic and pepper", image: "/images/73.jpg", available: true },
  // Mains
  { id: 5, name: "Grilled Seafood Platter", nameTh: "ซีฟู้ดย่างรวม", nameZh: "烤海鲜拼盘", nameRu: "Гриль из морепродуктов", nameKo: "모듬 해산물 구이", nameJa: "シーフードグリル盛り合わせ", price: 590, category: "mains", description: "Chef's selection of grilled prawns, squid, fish & crab", image: "/images/21.jpg", available: true },
  { id: 6, name: "Pad Thai Kung Sod", nameTh: "ผัดไทยกุ้งสด", nameZh: "鲜虾泰式炒河粉", nameRu: "Пад Тай с креветками", nameKo: "새우 팟타이", nameJa: "パッタイ（海老）", price: 180, category: "mains", description: "Classic stir-fried rice noodles with fresh prawns", image: "", available: true },
  { id: 7, name: "Green Curry with Chicken", nameTh: "แกงเขียวหวานไก่", nameZh: "绿咖喱鸡", nameRu: "Зелёный карри с курицей", nameKo: "그린커리 치킨", nameJa: "グリーンカレーチキン", price: 180, category: "mains", description: "Aromatic Thai green curry with tender chicken", image: "", available: true },
  { id: 8, name: "Massaman Curry Beef", nameTh: "แกงมัสมั่นเนื้อ", nameZh: "玛莎曼咖喱牛肉", nameRu: "Массаман с говядиной", nameKo: "마사만 커리 소고기", nameJa: "マッサマンカレービーフ", price: 220, category: "mains", description: "Rich & mild Thai curry with slow-cooked beef and potatoes", image: "", available: true },
  { id: 9, name: "Steamed Sea Bass with Lime", nameTh: "ปลากะพงนึ่งมะนาว", nameZh: "柠檬蒸鲈鱼", nameRu: "Сибас на пару с лаймом", nameKo: "라임 찐 농어", nameJa: "蒸しスズキのライム風味", price: 320, category: "mains", description: "Whole sea bass steamed with lime, chili & garlic", image: "", available: true },
  { id: 10, name: "Fried Rice with Crab Meat", nameTh: "ข้าวผัดปู", nameZh: "蟹肉炒饭", nameRu: "Жареный рис с крабом", nameKo: "게살 볶음밥", nameJa: "カニチャーハン", price: 220, category: "mains", description: "Wok-fried jasmine rice with fresh crab meat & egg", image: "", available: true },
  { id: 11, name: "Basil Pork Stir-Fry", nameTh: "กะเพราหมูสับ", nameZh: "打抛猪肉", nameRu: "Свинина с базиликом", nameKo: "바질 돼지고기 볶음", nameJa: "ガパオムーサップ", price: 150, category: "mains", description: "Minced pork stir-fried with holy basil, served with fried egg", image: "", available: true },
  // Drinks
  { id: 12, name: "Thai Iced Tea", nameTh: "ชาเย็น", nameZh: "泰式奶茶", nameRu: "Тайский чай со льдом", nameKo: "태국 아이스 티", nameJa: "タイアイスティー", price: 60, category: "drinks", description: "Sweet creamy Thai tea served cold", image: "", available: true },
  { id: 13, name: "Fresh Coconut", nameTh: "มะพร้าวน้ำหอม", nameZh: "鲜椰子", nameRu: "Свежий кокос", nameKo: "코코넛 워터", nameJa: "フレッシュココナッツ", price: 50, category: "drinks", description: "Young coconut water, straight from the shell", image: "", available: true },
  { id: 14, name: "Mango Smoothie", nameTh: "มะม่วงปั่น", nameZh: "芒果冰沙", nameRu: "Манго смузи", nameKo: "망고 스무디", nameJa: "マンゴースムージー", price: 80, category: "drinks", description: "Blended fresh Thai mango with ice", image: "", available: true },
  { id: 15, name: "Chang Beer", nameTh: "เบียร์ช้าง", nameZh: "象牌啤酒", nameRu: "Пиво Чанг", nameKo: "창 맥주", nameJa: "チャーンビール", price: 80, category: "drinks", description: "Thai lager beer, ice cold", image: "", available: true },
  { id: 16, name: "Singha Beer", nameTh: "เบียร์สิงห์", nameZh: "胜狮啤酒", nameRu: "Пиво Сингха", nameKo: "싱하 맥주", nameJa: "シンハービール", price: 90, category: "drinks", description: "Premium Thai beer", image: "", available: true },
  // Desserts
  { id: 17, name: "Mango Sticky Rice", nameTh: "ข้าวเหนียวมะม่วง", nameZh: "芒果糯米饭", nameRu: "Манго с рисом", nameKo: "망고 찹쌀밥", nameJa: "マンゴーもち米", price: 120, category: "desserts", description: "Sweet sticky rice with fresh mango and coconut cream", image: "", available: true },
  { id: 18, name: "Coconut Ice Cream", nameTh: "ไอศกรีมมะพร้าว", nameZh: "椰子冰淇淋", nameRu: "Кокосовое мороженое", nameKo: "코코넛 아이스크림", nameJa: "ココナッツアイス", price: 80, category: "desserts", description: "Homemade coconut ice cream with peanuts & corn", image: "", available: true },
];

let orders = [];
let orderIdCounter = 1;

// Staff & Payroll
let staff = [
  { id: 1, name: "Somchai", role: "Head Chef", salary: 25000, status: "active" },
  { id: 2, name: "Narin", role: "Sous Chef", salary: 18000, status: "active" },
  { id: 3, name: "Ploy", role: "Waitress", salary: 12000, status: "active" },
  { id: 4, name: "Tong", role: "Waiter", salary: 12000, status: "active" },
  { id: 5, name: "Kaew", role: "Kitchen Helper", salary: 10000, status: "active" },
  { id: 6, name: "Noi", role: "Waitress", salary: 12000, status: "active" },
  { id: 7, name: "Lek", role: "Bartender", salary: 14000, status: "active" },
  { id: 8, name: "Da", role: "Cashier", salary: 13000, status: "active" },
];
let staffIdCounter = 9;

let payLogs = [];
let payLogIdCounter = 1;

// SSE clients
let kitchenClients = [];
let adminClients = [];

function notifyKitchen(data) {
  kitchenClients.forEach(c => c.res.write(`data: ${JSON.stringify(data)}\n\n`));
}
function notifyAdmin(data) {
  adminClients.forEach(c => c.res.write(`data: ${JSON.stringify(data)}\n\n`));
}
function notifyAll(data) { notifyKitchen(data); notifyAdmin(data); }

// ─── API Routes ───

// Menu
app.get("/api/menu", (req, res) => {
  res.json(menuItems.filter(i => i.available));
});

app.get("/api/menu/all", (req, res) => {
  res.json(menuItems);
});

// Admin: Add menu item
app.post("/api/menu", (req, res) => {
  const item = {
    id: menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1,
    name: req.body.name || "",
    nameTh: req.body.nameTh || "",
    nameZh: req.body.nameZh || "",
    nameRu: req.body.nameRu || "",
    nameKo: req.body.nameKo || "",
    nameJa: req.body.nameJa || "",
    price: req.body.price || 0,
    category: req.body.category || "mains",
    description: req.body.description || "",
    image: req.body.image || "",
    available: true,
  };
  menuItems.push(item);
  notifyAll({ type: "menu_updated", menu: menuItems });
  res.status(201).json(item);
});

// Admin: Update menu item
app.put("/api/menu/:id", (req, res) => {
  const item = menuItems.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Not found" });
  Object.assign(item, req.body, { id: item.id });
  notifyAll({ type: "menu_updated", menu: menuItems });
  res.json(item);
});

// Admin: Delete menu item
app.delete("/api/menu/:id", (req, res) => {
  menuItems = menuItems.filter(i => i.id !== parseInt(req.params.id));
  notifyAll({ type: "menu_updated", menu: menuItems });
  res.json({ success: true });
});

// Orders
app.post("/api/orders", (req, res) => {
  const { tableNumber, items, notes, spicyLevel, allergies } = req.body;
  if (!tableNumber || !items || items.length === 0) {
    return res.status(400).json({ error: "Table number and items required" });
  }
  const order = {
    id: orderIdCounter++,
    tableNumber,
    items: items.map(i => ({ menuItemId: i.id, name: i.name, quantity: i.quantity, price: i.price })),
    notes: notes || "",
    spicyLevel: spicyLevel || 0,
    allergies: allergies || [],
    status: "new",
    total: items.reduce((s, i) => s + i.price * i.quantity, 0),
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  notifyAll({ type: "new_order", order });
  res.status(201).json({ success: true, orderId: order.id });
});

app.get("/api/orders", (req, res) => {
  const { date } = req.query;
  let result = orders;
  if (date) {
    result = result.filter(o => o.createdAt.startsWith(date));
  }
  res.json(result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: "Not found" });
  order.status = status;
  notifyAll({ type: "order_updated", order });
  res.json(order);
});

// Stats
app.get("/api/stats", (req, res) => {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr));

  // Weekly (last 7 days)
  const weeklyRevenue = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const dayOrders = orders.filter(o => o.createdAt.startsWith(ds) && o.status !== "cancelled");
    weeklyRevenue.push({
      date: ds,
      label: d.toLocaleDateString("en", { weekday: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Top items
  const itemCounts = {};
  todayOrders.filter(o => o.status !== "cancelled").forEach(o => {
    o.items.forEach(i => {
      if (!itemCounts[i.name]) itemCounts[i.name] = { name: i.name, qty: 0, revenue: 0 };
      itemCounts[i.name].qty += i.quantity;
      itemCounts[i.name].revenue += i.price * i.quantity;
    });
  });
  const topItems = Object.values(itemCounts).sort((a, b) => b.qty - a.qty).slice(0, 8);

  // Category breakdown
  const catRevenue = {};
  todayOrders.filter(o => o.status !== "cancelled").forEach(o => {
    o.items.forEach(i => {
      const menuItem = menuItems.find(m => m.id === i.menuItemId);
      const cat = menuItem ? menuItem.category : "other";
      catRevenue[cat] = (catRevenue[cat] || 0) + i.price * i.quantity;
    });
  });

  const completedToday = todayOrders.filter(o => o.status === "done" || o.status === "served");
  const todayRevenue = todayOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const allRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  res.json({
    today: {
      orders: todayOrders.length,
      revenue: todayRevenue,
      completed: completedToday.length,
      avgOrderValue: todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0,
    },
    allTime: {
      orders: orders.length,
      revenue: allRevenue,
    },
    weeklyRevenue,
    topItems,
    catRevenue,
  });
});

// ─── Staff & Payroll ───
app.get("/api/staff", (req, res) => res.json(staff));

app.post("/api/staff", (req, res) => {
  const s = { id: staffIdCounter++, name: req.body.name, role: req.body.role, salary: req.body.salary || 0, status: "active" };
  staff.push(s);
  res.status(201).json(s);
});

app.put("/api/staff/:id", (req, res) => {
  const s = staff.find(x => x.id === parseInt(req.params.id));
  if (!s) return res.status(404).json({ error: "Not found" });
  Object.assign(s, req.body, { id: s.id });
  res.json(s);
});

app.delete("/api/staff/:id", (req, res) => {
  staff = staff.filter(x => x.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// Pay logs
app.get("/api/paylogs", (req, res) => {
  const { month } = req.query;
  let result = payLogs;
  if (month) result = result.filter(p => p.date.startsWith(month));
  res.json(result.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

app.post("/api/paylogs", (req, res) => {
  const log = {
    id: payLogIdCounter++,
    staffId: req.body.staffId,
    staffName: req.body.staffName || "",
    amount: req.body.amount || 0,
    type: req.body.type || "salary",
    note: req.body.note || "",
    date: req.body.date || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };
  payLogs.push(log);
  res.status(201).json(log);
});

app.delete("/api/paylogs/:id", (req, res) => {
  payLogs = payLogs.filter(p => p.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// Financial summary
app.get("/api/financials", (req, res) => {
  const { month } = req.query;
  const now = new Date();
  const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthOrders = orders.filter(o => o.createdAt.startsWith(targetMonth) && o.status !== "cancelled");
  const monthPayLogs = payLogs.filter(p => p.date.startsWith(targetMonth));

  const totalRevenue = monthOrders.reduce((s, o) => s + o.total, 0);
  const totalPayroll = monthPayLogs.reduce((s, p) => s + p.amount, 0);
  const monthlyBaseSalary = staff.filter(s => s.status === "active").reduce((s, x) => s + x.salary, 0);
  const totalExpenses = totalPayroll || monthlyBaseSalary;
  const profit = totalRevenue - totalExpenses;

  // Daily breakdown
  const dailyData = {};
  monthOrders.forEach(o => {
    const day = o.createdAt.split("T")[0];
    if (!dailyData[day]) dailyData[day] = { revenue: 0, orders: 0 };
    dailyData[day].revenue += o.total;
    dailyData[day].orders++;
  });

  res.json({
    month: targetMonth,
    revenue: totalRevenue,
    expenses: totalExpenses,
    payroll: totalPayroll || monthlyBaseSalary,
    profit,
    orderCount: monthOrders.length,
    avgOrderValue: monthOrders.length > 0 ? Math.round(totalRevenue / monthOrders.length) : 0,
    dailyData: Object.entries(dailyData).map(([date, d]) => ({ date, ...d })).sort((a, b) => a.date.localeCompare(b.date)),
    staffCount: staff.filter(s => s.status === "active").length,
  });
});

// SSE
app.get("/api/kitchen/stream", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  const clientId = Date.now();
  kitchenClients.push({ id: clientId, res });
  res.write(`data: ${JSON.stringify({ type: "init", orders, menu: menuItems })}\n\n`);
  req.on("close", () => { kitchenClients = kitchenClients.filter(c => c.id !== clientId); });
});

app.get("/api/admin/stream", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  const clientId = Date.now();
  adminClients.push({ id: clientId, res });
  res.write(`data: ${JSON.stringify({ type: "init", orders, menu: menuItems })}\n\n`);
  req.on("close", () => { adminClients = adminClients.filter(c => c.id !== clientId); });
});

// Pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/menu", (req, res) => res.sendFile(path.join(__dirname, "public", "menu.html")));
app.get("/kitchen", (req, res) => res.sendFile(path.join(__dirname, "public", "kitchen.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));

app.listen(PORT, () => {
  console.log(`JaiDee Resort server running on http://localhost:${PORT}`);
  console.log(`Website:  http://localhost:${PORT}/`);
  console.log(`Menu:     http://localhost:${PORT}/menu`);
  console.log(`Kitchen:  http://localhost:${PORT}/kitchen`);
  console.log(`Admin:    http://localhost:${PORT}/admin`);
});
