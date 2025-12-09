import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import CarbonCalculator from './carbon-calculator.js';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Initialize Carbon Calculator
const carbonCalc = new CarbonCalculator();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Ensure data directory exists
const dataDir = join(__dirname, 'data');
const uploadsDir = join(__dirname, 'uploads');
const actionsUploadsDir = join(uploadsDir, 'actions');
const logosUploadsDir = join(uploadsDir, 'logos');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}
if (!existsSync(actionsUploadsDir)) {
  mkdirSync(actionsUploadsDir, { recursive: true });
}
if (!existsSync(logosUploadsDir)) {
  mkdirSync(logosUploadsDir, { recursive: true });
}

// Configurar Multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.path.includes('logo') ? logosUploadsDir : actionsUploadsDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Helper functions for file storage
const readData = (filename) => {
  const filepath = join(dataDir, filename);
  if (!existsSync(filepath)) {
    return null;
  }
  const content = readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
};

const writeData = (filename, data) => {
  const filepath = join(dataDir, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
};

// Initialize default data
const initializeData = () => {
  // Inicializar archivo de usuarios
  if (!readData('users.txt')) {
    writeData('users.txt', []);
  }

  // Mantener compatibilidad con usuario antiguo
  if (!readData('user.txt')) {
    writeData('user.txt', {
      name: 'EcoWarrior',
      level: 1,
      xp: 0,
      streak: 0,
      maxStreak: 0,
      totalCO2: 0,
      totalActions: 0,
      achievements: [],
      createdAt: new Date('2025-08-25').toISOString(),
      lastActionDate: null,
    });
  }

  if (!readData('actions.txt')) {
    writeData('actions.txt', []);
  }

  if (!readData('chat_history.txt')) {
    writeData('chat_history.txt', []);
  }
};

initializeData();

// Validation schemas
const actionSchema = z.object({
  category: z.enum(['transport', 'recycle', 'energy', 'water']),
  type: z.string(),
  amount: z.number().positive(),
  co2Saved: z.number().positive(),
  xpGained: z.number().positive(),
});

// Helper function para verificar y resetear racha
// IMPORTANTE: Solo resetea la racha, NO el nivel, XP, CO₂, acciones o logros
const checkAndResetStreak = (user) => {
  if (!user.lastActionDate) return user;
  
  const now = new Date();
  const lastAction = new Date(user.lastActionDate);
  
  // Obtener las fechas sin hora (solo día)
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActionDate = new Date(lastAction.getFullYear(), lastAction.getMonth(), lastAction.getDate());
  
  // Calcular diferencia en días completos
  const daysDifference = Math.floor((nowDate - lastActionDate) / (1000 * 60 * 60 * 24));
  
  // Solo resetear RACHA si han pasado MÁS de 1 día completo (2 o más días)
  // Ejemplo: última acción el lunes, hoy es miércoles = 2 días = resetear SOLO racha
  // Ejemplo: última acción el lunes, hoy es martes = 1 día = mantener racha
  if (daysDifference > 1) {
    // SOLO resetear la racha, mantener todo lo demás
    user.streak = 0;
    console.log(`⚠️ Racha reseteada para ${user.name}. Días sin acción: ${daysDifference}`);
    console.log(`✅ Se mantienen: Nivel ${user.level}, XP ${user.xp}, CO₂ ${user.totalCO2}kg, ${user.totalActions} acciones`);
  }
  
  return user;
};

// Routes

// POST /api/upload/logo - Subir logo principal
app.post('/api/upload/logo', upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    res.json({
      success: true,
      url: logoUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/action - Subir foto de acción
app.post('/api/upload/action', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    
    const photoUrl = `/uploads/actions/${req.file.filename}`;
    res.json({
      success: true,
      url: photoUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user
app.get('/api/user', (req, res) => {
  let user = readData('user.txt');
  
  // NO verificar racha aquí - solo se verifica al registrar acciones
  // La racha se mantiene hasta que pase más de 1 día completo sin acciones
  
  res.json(user);
});

// PUT /api/user
app.put('/api/user', (req, res) => {
  const user = readData('user.txt');
  const updatedUser = { ...user, ...req.body };
  writeData('user.txt', updatedUser);
  res.json(updatedUser);
});

// GET /api/actions
app.get('/api/actions', (req, res) => {
  const actions = readData('actions.txt');
  const { limit = 10, offset = 0, category } = req.query;
  
  let filtered = actions;
  if (category) {
    filtered = actions.filter(a => a.category === category);
  }
  
  const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));
  res.json(paginated);
});

// POST /api/actions
app.post('/api/actions', (req, res) => {
  try {
    const validated = actionSchema.parse(req.body);
    
    const actions = readData('actions.txt');
    const user = readData('user.txt');
    
    const newAction = {
      id: Date.now().toString(),
      ...validated,
      date: new Date().toISOString(),
    };
    
    actions.unshift(newAction);
    writeData('actions.txt', actions);
    
    // Verificar y resetear racha si es necesario (SOLO aquí)
    const userWithStreak = checkAndResetStreak(user);
    
    // Update user stats
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActionDate = userWithStreak.lastActionDate ? new Date(userWithStreak.lastActionDate) : null;
    const lastActionDay = lastActionDate ? new Date(lastActionDate.getFullYear(), lastActionDate.getMonth(), lastActionDate.getDate()) : null;
    
    userWithStreak.totalCO2 += validated.co2Saved;
    userWithStreak.xp += validated.xpGained;
    userWithStreak.level = Math.floor(userWithStreak.xp / 1000) + 1;
    userWithStreak.totalActions += 1;
    
    // Update streak - solo si es un día diferente
    if (!lastActionDay) {
      // Primera acción
      userWithStreak.streak = 1;
      userWithStreak.maxStreak = 1;
      console.log(`🎉 Primera acción de ${userWithStreak.name}! Racha: 1 día`);
    } else {
      const daysDiff = Math.floor((today - lastActionDay) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Mismo día, no cambiar racha
        console.log(`✅ Acción del mismo día para ${userWithStreak.name}. Racha: ${userWithStreak.streak} días`);
      } else if (daysDiff === 1) {
        // Día consecutivo, incrementar racha
        userWithStreak.streak += 1;
        userWithStreak.maxStreak = Math.max(userWithStreak.maxStreak, userWithStreak.streak);
        console.log(`🔥 Racha incrementada para ${userWithStreak.name}! Racha: ${userWithStreak.streak} días`);
      } else {
        // Racha rota (ya fue reseteada por checkAndResetStreak)
        userWithStreak.streak = 1;
        console.log(`🆕 Nueva racha para ${userWithStreak.name}. Racha: 1 día`);
      }
    }
    
    userWithStreak.lastActionDate = now.toISOString();
    writeData('user.txt', userWithStreak);
    
    res.json(newAction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/actions/:id
app.delete('/api/actions/:id', (req, res) => {
  const actions = readData('actions.txt');
  const filtered = actions.filter(a => a.id !== req.params.id);
  writeData('actions.txt', filtered);
  res.json({ success: true });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const actions = readData('actions.txt');
  const user = readData('user.txt');
  
  const byCategory = {
    transport: 0,
    recycle: 0,
    energy: 0,
    water: 0,
  };
  
  actions.forEach(action => {
    byCategory[action.category] += action.co2Saved;
  });
  
  // Last 30 days
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dateStr = date.toISOString().split('T')[0];
    const dayActions = actions.filter(a => a.date.startsWith(dateStr));
    const co2 = dayActions.reduce((sum, a) => sum + a.co2Saved, 0);
    last30Days.push({
      date: dateStr.slice(5),
      co2: Number(co2.toFixed(2)),
      actions: dayActions.length,
    });
  }
  
  const stats = {
    totalActions: user.totalActions,
    totalCO2: user.totalCO2,
    averageDaily: user.totalCO2 / Math.max(1, Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 86400000)),
    maxStreak: user.maxStreak,
    byCategory,
    last30Days,
  };
  
  res.json(stats);
});

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const user = readData('user.txt');
    const chatHistory = readData('chat_history.txt');
    const actions = readData('actions.txt');
    
    // Save user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    chatHistory.push(userMessage);
    
    // Get response from Gemini AI
    let response;
    try {
      response = await getGeminiResponse(message, user, actions, chatHistory);
    } catch (error) {
      console.error('Gemini error:', error);
      // Fallback to predefined responses if Gemini fails
      response = getFallbackResponse(message, user);
    }
    
    // Save assistant message
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };
    chatHistory.push(assistantMessage);
    
    // Keep only last 50 messages to avoid file getting too large
    if (chatHistory.length > 50) {
      chatHistory.splice(0, chatHistory.length - 50);
    }
    
    writeData('chat_history.txt', chatHistory);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error processing chat message' });
  }
});

// Gemini AI Response
const getGeminiResponse = async (message, user, actions, chatHistory) => {
  // Get recent actions for context
  const recentActions = actions.slice(0, 5);
  const actionsByCategory = {
    transport: actions.filter(a => a.category === 'transport').length,
    recycle: actions.filter(a => a.category === 'recycle').length,
    energy: actions.filter(a => a.category === 'energy').length,
    water: actions.filter(a => a.category === 'water').length,
  };
  
  // Build context for Gemini
  const systemContext = `Eres EcoBot 🌱, asistente de Ecobitácora, una app web para reducir tu huella de carbono.

DATOS DEL USUARIO:
${user.name} | Nivel ${user.level} | ${user.streak} días racha | ${user.totalCO2.toFixed(1)}kg CO₂ | ${user.totalActions} acciones

SOBRE ECOBITÁCORA:
- App para registrar acciones ecológicas y reducir huella de carbono
- Sistema de niveles y XP: cada acción suma XP, cada 1000 XP = 1 nivel
- Sistema de racha: registra acciones diarias consecutivas para mantenerla
- Si pasas más de 1 día sin acciones, pierdes la racha (pero NO el nivel, XP o CO₂)
- Categorías: Transporte 🚴, Reciclaje ♻️, Energía 💡, Agua 💧
- Logros desbloqueables por hitos (primera acción, 7 días racha, etc.)
- Calculadora de CO₂ con equivalencias (árboles, km en auto, duchas)
- Chatbot con IA (yo!) para consejos y motivación
- Sistema de donaciones (Yape y PayPal) para apoyar el proyecto
- Páginas: Dashboard, Stats, Analytics, Reports, Community, Challenges, Profile, Donate

FUNCIONALIDADES:
- Registrar acciones ecológicas con foto opcional
- Ver estadísticas y gráficos de progreso
- Comparar con otros usuarios (Community)
- Desafíos semanales/mensuales
- Exportar datos (CSV, JSON)
- Cambiar idioma (ES, EN, PT)
- Editar perfil y subir logo personalizado

REGLAS:
1. Respuestas CORTAS: máximo 2-3 líneas
2. Usa 1-2 emojis por mensaje
3. Sé casual y directo
4. Si preguntan sobre la app, explica brevemente
5. Usa los datos del usuario cuando sea relevante
6. Responde en español natural
10. Enfócate en acciones concretas que el usuario puede hacer

EQUIVALENCIAS ÚTILES:
- 1 kg CO₂ = 0.045 árboles plantados (22kg CO₂ por árbol/año)
- 1 kg CO₂ = 5.2 km en auto evitados (0.192 kg/km)
- 1 kg CO₂ = 8.3 duchas ahorradas (0.12 kg/ducha)
- 1 kg CO₂ = 25 horas de luz LED (0.04 kg/hora)`;

  // Get recent chat context (last 4 messages for brevity)
  const recentChat = chatHistory.slice(-4);
  const conversationHistory = recentChat
    .map(msg => `${msg.role === 'user' ? 'Usuario' : 'EcoBot'}: ${msg.content}`)
    .join('\n');

  const prompt = `${systemContext}

CONVERSACIÓN:
${conversationHistory || 'Primera interacción'}

Usuario: ${message}

EcoBot (responde en máximo 2-3 líneas):`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Limitar la respuesta si es muy larga
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length > 3) {
    text = lines.slice(0, 3).join('\n');
  }
  
  return text;
};

// Intelligent fallback responses (no OpenAI needed)
const getFallbackResponse = (message, user) => {
  const lowerMessage = message.toLowerCase();
  
  // Saludos
  if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
    const greetings = [
      `¡Hola ${user.name}! 👋 Nivel ${user.level}, ${user.streak} días de racha. ¿Qué necesitas?`,
      `¡Hey ${user.name}! 🌱 Llevas ${user.totalCO2.toFixed(1)}kg de CO₂ ahorrado. ¿En qué te ayudo?`,
      `¡Hola! 💚 ${user.streak} días de racha, ¡vas genial! ¿Qué quieres saber?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Estadísticas
  if (lowerMessage.includes('estadística') || lowerMessage.includes('stats') || lowerMessage.includes('progreso') || lowerMessage.includes('avance')) {
    return `¡Claro! 📊 Has ahorrado ${user.totalCO2.toFixed(1)}kg de CO₂, equivalente a ${Math.floor(user.totalCO2 / 22)} árboles plantados 🌳. Llevas ${user.totalActions} acciones registradas y ${user.streak} días de racha. ¡Increíble trabajo! ¿Quieres registrar una nueva acción?`;
  }
  
  // Consejos
  if (lowerMessage.includes('consejo') || lowerMessage.includes('tip') || lowerMessage.includes('ayuda') || lowerMessage.includes('sugerencia')) {
    const tips = [
      'Usa una botella reutilizable en lugar de botellas de plástico. ¡Ahorrarás hasta 156 botellas al año! 💧 ¿Ya tienes la tuya?',
      'Apaga las luces cuando salgas de una habitación. Pequeños gestos, gran impacto 💡 Puedes ahorrar hasta 10% en tu factura eléctrica.',
      'Usa transporte público o bicicleta. Reducirás tu huella de carbono significativamente 🚴 ¡Y harás ejercicio!',
      'Recicla papel, plástico y vidrio. ¡Cada material reciclado cuenta! ♻️ Separa tus residuos en casa.',
      'Lleva tus propias bolsas al supermercado. Una bolsa de tela puede reemplazar hasta 1000 bolsas de plástico 🛍️',
      'Reduce el consumo de carne. Un día sin carne a la semana ahorra 3.6kg de CO₂ 🥗',
      'Desconecta los aparatos que no uses. El modo standby consume hasta 10% de energía 🔌',
      'Toma duchas más cortas. 5 minutos menos ahorran 40 litros de agua 🚿',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
  
  // Equivalencias
  if (lowerMessage.includes('equivalencia') || lowerMessage.includes('equivale') || lowerMessage.includes('cuanto') || lowerMessage.includes('impacto')) {
    return `Tu CO₂ ahorrado (${user.totalCO2.toFixed(1)}kg) equivale a:\n🌳 ${Math.floor(user.totalCO2 / 22)} árboles plantados\n🚗 ${Math.floor(user.totalCO2 / 0.192)} km en auto evitados\n🚿 ${Math.floor(user.totalCO2 / 0.12)} duchas ahorradas\n💡 ${Math.floor(user.totalCO2 / 0.04)} horas de luz\n¡Sigue así! 💚`;
  }
  
  // Motivación
  if (lowerMessage.includes('motiva') || lowerMessage.includes('animo') || lowerMessage.includes('desanima')) {
    if (user.streak >= 7) {
      return `¡${user.name}, eres increíble! 🔥 ${user.streak} días de racha es algo de lo que estar orgulloso. Cada día cuentas para el planeta. ¡No te detengas ahora! 💪`;
    }
    return `¡Tú puedes ${user.name}! 🌟 Cada pequeña acción suma. Ya llevas ${user.totalActions} acciones y has ahorrado ${user.totalCO2.toFixed(1)}kg de CO₂. ¡Eres parte del cambio! 🌍💚`;
  }
  
  // Nivel
  if (lowerMessage.includes('nivel') || lowerMessage.includes('subir') || lowerMessage.includes('xp')) {
    const xpNeeded = 1000 - (user.xp % 1000);
    return `Estás en nivel ${user.level} con ${user.xp} XP total. 📈 Te faltan ${xpNeeded} XP para subir al nivel ${user.level + 1}. ¡Registra más acciones ecológicas para ganar XP! Cada kg de CO₂ = 10 XP 🌱`;
  }
  
  // Racha
  if (lowerMessage.includes('racha') || lowerMessage.includes('días') || lowerMessage.includes('consecutivo')) {
    if (user.streak >= user.maxStreak) {
      return `¡Estás en tu mejor racha! 🔥 ${user.streak} días consecutivos. ¡Sigue así para mantener el récord! Registra al menos una acción diaria para no perderla. 💪`;
    }
    return `Llevas ${user.streak} días de racha 🔥 Tu récord es ${user.maxStreak} días. ¡Puedes superarlo! Registra una acción hoy para mantener la racha. 🌱`;
  }
  
  // Acciones
  if (lowerMessage.includes('acción') || lowerMessage.includes('registrar') || lowerMessage.includes('agregar') || lowerMessage.includes('añadir')) {
    return `¡Perfecto! 📝 Puedes registrar acciones de:\n🚴 Transporte (bici, caminar, transporte público)\n♻️ Reciclaje (plástico, papel, vidrio, metal)\n💡 Energía (apagar luces, desconectar aparatos)\n💧 Agua (duchas cortas, cerrar grifos)\n\n¿Cuál registraste hoy?`;
  }
  
  // Logros
  if (lowerMessage.includes('logro') || lowerMessage.includes('achievement') || lowerMessage.includes('medalla')) {
    return `Tienes ${user.achievements.length} logros desbloqueados 🏆 Sigue registrando acciones para desbloquear más. Algunos logros incluyen: Semana Verde (7 días racha), Guardián del Aire (10kg CO₂), y más. ¡Ve a tu perfil para verlos todos! ✨`;
  }
  
  // Cambio climático
  if (lowerMessage.includes('clima') || lowerMessage.includes('calentamiento') || lowerMessage.includes('temperatura')) {
    return `El cambio climático es real y urgente 🌡️ Pero cada acción cuenta. Tu contribución de ${user.totalCO2.toFixed(1)}kg de CO₂ ahorrado es parte de la solución. Si todos hacemos pequeños cambios, el impacto es enorme. ¿Qué harás hoy por el planeta? 🌍`;
  }
  
  // Reciclaje
  if (lowerMessage.includes('recicla') || lowerMessage.includes('basura') || lowerMessage.includes('residuo')) {
    return `¡El reciclaje es clave! ♻️ Separa: Plástico (botellas, envases), Papel (periódicos, cajas), Vidrio (botellas, frascos), Metal (latas, aluminio). Cada kg reciclado ahorra CO₂ y recursos naturales. ¿Ya reciclas en casa? 🗑️`;
  }
  
  // Transporte
  if (lowerMessage.includes('transporte') || lowerMessage.includes('bici') || lowerMessage.includes('auto') || lowerMessage.includes('coche')) {
    return `El transporte es responsable del 25% de emisiones globales 🚗 Alternativas: Bicicleta (0 emisiones + ejercicio), Transporte público (menos emisiones por persona), Caminar (saludable y ecológico), Carpool (comparte el viaje). ¿Cuál usarás hoy? 🚴`;
  }
  
  // Energía
  if (lowerMessage.includes('energía') || lowerMessage.includes('luz') || lowerMessage.includes('electricidad')) {
    return `Ahorra energía fácilmente 💡 Apaga luces al salir, usa focos LED (75% menos energía), desconecta aparatos en standby, aprovecha luz natural. Cada kWh ahorrado = menos CO₂. ¿Qué harás hoy? ⚡`;
  }
  
  // Agua
  if (lowerMessage.includes('agua') || lowerMessage.includes('ducha') || lowerMessage.includes('grifo')) {
    return `El agua es vida 💧 Consejos: Duchas de 5 min (ahorra 40L), cierra el grifo al cepillarte (12L ahorrados), repara fugas, reutiliza agua. Cada gota cuenta. ¿Ya cuidas tu consumo de agua? 🚿`;
  }
  
  // Preguntas sobre la app
  if (lowerMessage.includes('cómo funciona') || lowerMessage.includes('como funciona') || lowerMessage.includes('qué es') || lowerMessage.includes('que es')) {
    return `Ecobitácora es tu app para reducir tu huella de carbono 🌱 Registra acciones ecológicas, gana XP y niveles, mantén tu racha diaria, y ve tu impacto real en CO₂ ahorrado. ¿Quieres registrar una acción?`;
  }
  
  if (lowerMessage.includes('racha') || lowerMessage.includes('días') || lowerMessage.includes('consecutivo')) {
    return `Tu racha: ${user.streak} días 🔥 Registra al menos 1 acción diaria para mantenerla. Si pasas más de 1 día sin acciones, se resetea (pero NO pierdes nivel, XP o CO₂). Tu récord: ${user.maxStreak} días!`;
  }
  
  if (lowerMessage.includes('nivel') || lowerMessage.includes('xp') || lowerMessage.includes('subir')) {
    return `Nivel ${user.level} con ${user.xp} XP 📈 Cada 1000 XP = 1 nivel. Ganas XP registrando acciones ecológicas. Te faltan ${1000 - (user.xp % 1000)} XP para nivel ${user.level + 1}!`;
  }
  
  if (lowerMessage.includes('donar') || lowerMessage.includes('donación') || lowerMessage.includes('apoyar')) {
    return `¡Gracias por tu interés! 💚 Puedes apoyar Ecobitácora en la página "Donar" (botón ❤️ en el menú). Aceptamos Yape 🇵🇪 y PayPal 🌍. Tu apoyo nos ayuda a seguir mejorando!`;
  }
  
  if (lowerMessage.includes('categoría') || lowerMessage.includes('categoria') || lowerMessage.includes('tipo')) {
    return `Categorías disponibles: 🚴 Transporte (bici, caminar), ♻️ Reciclaje (plástico, papel), 💡 Energía (apagar luces), 💧 Agua (duchas cortas). ¿Cuál registrarás hoy?`;
  }
  
  if (lowerMessage.includes('logro') || lowerMessage.includes('achievement') || lowerMessage.includes('medalla')) {
    return `Tienes ${user.achievements.length} logros 🏆 Desbloquea más con: primera acción, 7 días racha, 10kg CO₂, 50 acciones, etc. Ve a tu Perfil para verlos todos!`;
  }
  
  // Agradecimiento
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thanks')) {
    return `¡De nada ${user.name}! 💚 Estoy aquí para ayudarte. ¿Algo más? 🌱`;
  }
  
  // Despedida
  if (lowerMessage.includes('adiós') || lowerMessage.includes('adios') || lowerMessage.includes('chao') || lowerMessage.includes('bye')) {
    return `¡Hasta pronto ${user.name}! 👋 Registra tus acciones hoy. ¡Cada día cuenta! 🌱`;
  }
  
  // Respuestas conversacionales cortas
  const conversationalResponses = [
    `Hmm, interesante 🤔 Llevas ${user.totalActions} acciones y ${user.totalCO2.toFixed(1)}kg CO₂ ahorrado. ¿Quieres un consejo ecológico?`,
    `¡Buena pregunta! 💚 Nivel ${user.level}, ${user.streak} días racha. ¿En qué más te ayudo?`,
    `Entiendo 😊 Con ${user.totalActions} acciones ya haces la diferencia. ¿Registraste algo hoy? 🌱`,
    `¡Claro! 🙂 Has ahorrado ${Math.floor(user.totalCO2 / 22)} árboles equivalentes 🌳 ¿Qué más quieres saber?`,
    `¡Me gusta! 💭 ${user.streak} días de racha, ¡sigue así! ¿Algo específico sobre ecología? 🌍`,
    `Hmm 🤔 Estás haciendo un gran trabajo. ¿Quieres ver tus logros o un consejo? 💚`,
    `¡Interesante! 😄 Tu CO₂ = ${Math.floor(user.totalCO2 / 0.192)} km en auto evitados 🚗 ¿Qué más?`,
    `Entiendo 🌟 Nivel ${user.level}, vas bien. ¿Registraste una acción hoy? 🌱`,
  ];
  
  // Si el mensaje es muy corto o genérico, dar una respuesta más amigable
  if (message.length < 10) {
    return `¡Hola ${user.name}! 👋 Cuéntame más, ¿en qué puedo ayudarte? Puedo darte consejos ecológicos, mostrarte tus estadísticas, o simplemente charlar. 💚`;
  }
  
  // Respuesta conversacional aleatoria
  return conversationalResponses[Math.floor(Math.random() * conversationalResponses.length)];
};

// GET /api/chat/history
app.get('/api/chat/history', (req, res) => {
  const chatHistory = readData('chat_history.txt');
  res.json(chatHistory);
});

// POST /api/achievements/check
app.post('/api/achievements/check', (req, res) => {
  const user = readData('user.txt');
  const newAchievements = [];
  
  const checks = [
    { id: 'first_action', condition: user.totalActions >= 1 },
    { id: 'week_streak', condition: user.maxStreak >= 7 },
    { id: 'month_streak', condition: user.maxStreak >= 30 },
    { id: 'co2_10kg', condition: user.totalCO2 >= 10 },
    { id: 'co2_50kg', condition: user.totalCO2 >= 50 },
    { id: 'co2_100kg', condition: user.totalCO2 >= 100 },
    { id: 'level_5', condition: user.level >= 5 },
    { id: 'level_10', condition: user.level >= 10 },
    { id: 'actions_50', condition: user.totalActions >= 50 },
    { id: 'actions_100', condition: user.totalActions >= 100 },
  ];
  
  checks.forEach(check => {
    if (check.condition && !user.achievements.includes(check.id)) {
      user.achievements.push(check.id);
      newAchievements.push(check.id);
    }
  });
  
  if (newAchievements.length > 0) {
    writeData('user.txt', user);
  }
  
  res.json({ newAchievements });
});

// GET /api/analytics/trends - Análisis de tendencias
app.get('/api/analytics/trends', (req, res) => {
  const actions = readData('actions.txt');
  const user = readData('user.txt');
  const { period = '30' } = req.query; // días
  
  const days = parseInt(period);
  const now = Date.now();
  const periodStart = now - (days * 86400000);
  
  // Filtrar acciones del período
  const periodActions = actions.filter(a => new Date(a.date).getTime() >= periodStart);
  
  // Agrupar por día
  const dailyData = {};
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    const dateStr = date.toISOString().split('T')[0];
    dailyData[dateStr] = { co2: 0, actions: 0, date: dateStr };
  }
  
  periodActions.forEach(action => {
    const dateStr = action.date.split('T')[0];
    if (dailyData[dateStr]) {
      dailyData[dateStr].co2 += action.co2Saved;
      dailyData[dateStr].actions += 1;
    }
  });
  
  const dailyArray = Object.values(dailyData).map(d => ({
    ...d,
    co2: Math.round(d.co2 * 100) / 100
  }));
  
  // Calcular tendencias
  const halfPoint = Math.floor(days / 2);
  const firstHalf = dailyArray.slice(0, halfPoint);
  const secondHalf = dailyArray.slice(halfPoint);
  
  const firstHalfCO2 = firstHalf.reduce((sum, d) => sum + d.co2, 0);
  const secondHalfCO2 = secondHalf.reduce((sum, d) => sum + d.co2, 0);
  
  const trend = carbonCalc.calculateTrend(secondHalfCO2, firstHalfCO2);
  
  // Promedio móvil
  const co2Values = dailyArray.map(d => d.co2);
  const movingAverage = carbonCalc.calculateMovingAverage(co2Values, 7);
  
  // Proyección anual
  const dailyAvg = periodActions.reduce((sum, a) => sum + a.co2Saved, 0) / days;
  const annualProjection = carbonCalc.projectAnnualImpact(dailyAvg);
  
  // Score ecológico
  const daysActive = new Date(now - new Date(user.createdAt).getTime()).getTime() / 86400000;
  const ecoScore = carbonCalc.calculateEcoScore(user.totalCO2, user.totalActions, user.streak, daysActive);
  
  res.json({
    period: days,
    daily: dailyArray,
    movingAverage,
    trend,
    summary: {
      totalCO2: Math.round(periodActions.reduce((sum, a) => sum + a.co2Saved, 0) * 100) / 100,
      totalActions: periodActions.length,
      dailyAverage: Math.round(dailyAvg * 100) / 100,
      annualProjection,
      ecoScore
    }
  });
});

// GET /api/analytics/comparison - Comparación de períodos
app.get('/api/analytics/comparison', (req, res) => {
  const actions = readData('actions.txt');
  
  const now = Date.now();
  const thisWeekStart = now - (7 * 86400000);
  const lastWeekStart = now - (14 * 86400000);
  const thisMonthStart = now - (30 * 86400000);
  const lastMonthStart = now - (60 * 86400000);
  
  const thisWeek = actions.filter(a => new Date(a.date).getTime() >= thisWeekStart);
  const lastWeek = actions.filter(a => {
    const time = new Date(a.date).getTime();
    return time >= lastWeekStart && time < thisWeekStart;
  });
  
  const thisMonth = actions.filter(a => new Date(a.date).getTime() >= thisMonthStart);
  const lastMonth = actions.filter(a => {
    const time = new Date(a.date).getTime();
    return time >= lastMonthStart && time < thisMonthStart;
  });
  
  const sumCO2 = (arr) => arr.reduce((sum, a) => sum + a.co2Saved, 0);
  
  const thisWeekCO2 = sumCO2(thisWeek);
  const lastWeekCO2 = sumCO2(lastWeek);
  const thisMonthCO2 = sumCO2(thisMonth);
  const lastMonthCO2 = sumCO2(lastMonth);
  
  res.json({
    week: {
      current: { co2: Math.round(thisWeekCO2 * 100) / 100, actions: thisWeek.length },
      previous: { co2: Math.round(lastWeekCO2 * 100) / 100, actions: lastWeek.length },
      trend: carbonCalc.calculateTrend(thisWeekCO2, lastWeekCO2)
    },
    month: {
      current: { co2: Math.round(thisMonthCO2 * 100) / 100, actions: thisMonth.length },
      previous: { co2: Math.round(lastMonthCO2 * 100) / 100, actions: lastMonth.length },
      trend: carbonCalc.calculateTrend(thisMonthCO2, lastMonthCO2)
    }
  });
});

// GET /api/analytics/equivalences - Equivalencias detalladas
app.get('/api/analytics/equivalences', (req, res) => {
  const user = readData('user.txt');
  const equivalences = carbonCalc.getEquivalences(user.totalCO2);
  
  res.json({
    totalCO2: user.totalCO2,
    equivalences: {
      trees: { value: equivalences.trees, label: 'árboles plantados', icon: '🌳' },
      carKm: { value: equivalences.carKm, label: 'km en auto evitados', icon: '🚗' },
      showers: { value: equivalences.showers, label: 'duchas ahorradas', icon: '🚿' },
      ledHours: { value: equivalences.ledHours, label: 'horas de luz LED', icon: '💡' },
      phoneCharges: { value: equivalences.phoneCharges, label: 'cargas de smartphone', icon: '📱' },
      meals: { value: equivalences.meals, label: 'comidas vegetarianas', icon: '🥗' }
    }
  });
});

// GET /api/report/generate - Generar reporte (datos para PDF)
app.get('/api/report/generate', (req, res) => {
  const user = readData('user.txt');
  const actions = readData('actions.txt');
  const { period = '30' } = req.query;
  
  const days = parseInt(period);
  const now = Date.now();
  const periodStart = now - (days * 86400000);
  
  const periodActions = actions.filter(a => new Date(a.date).getTime() >= periodStart);
  
  // Agrupar por categoría
  const byCategory = {
    transport: { co2: 0, actions: 0 },
    recycle: { co2: 0, actions: 0 },
    energy: { co2: 0, actions: 0 },
    water: { co2: 0, actions: 0 }
  };
  
  periodActions.forEach(action => {
    byCategory[action.category].co2 += action.co2Saved;
    byCategory[action.category].actions += 1;
  });
  
  const totalCO2 = periodActions.reduce((sum, a) => sum + a.co2Saved, 0);
  const equivalences = carbonCalc.getEquivalences(totalCO2);
  const daysActive = Math.ceil((now - new Date(user.createdAt).getTime()) / 86400000);
  const ecoScore = carbonCalc.calculateEcoScore(user.totalCO2, user.totalActions, user.streak, daysActive);
  
  res.json({
    user: {
      name: user.name,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      maxStreak: user.maxStreak,
      totalCO2: user.totalCO2,
      totalActions: user.totalActions,
      ecoScore
    },
    period: {
      days,
      startDate: new Date(periodStart).toISOString().split('T')[0],
      endDate: new Date(now).toISOString().split('T')[0],
      totalCO2: Math.round(totalCO2 * 100) / 100,
      totalActions: periodActions.length,
      dailyAverage: Math.round((totalCO2 / days) * 100) / 100
    },
    byCategory,
    equivalences,
    topActions: periodActions
      .sort((a, b) => b.co2Saved - a.co2Saved)
      .slice(0, 10)
      .map(a => ({
        type: a.type,
        category: a.category,
        co2Saved: a.co2Saved,
        date: a.date.split('T')[0]
      })),
    generatedAt: new Date().toISOString()
  });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// POST /api/auth/register - Registro de usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validar datos
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    // Leer usuarios existentes
    let users = readData('users.txt') || [];
    
    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Crear nuevo usuario (sin encriptación por ahora, para simplicidad)
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // En producción, usar bcrypt para encriptar
      name,
      level: 1,
      xp: 0,
      streak: 0,
      maxStreak: 0,
      totalCO2: 0,
      totalActions: 0,
      achievements: [],
      createdAt: new Date().toISOString(),
      lastActionDate: null,
      logoUrl: null
    };
    
    users.push(newUser);
    writeData('users.txt', users);
    
    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ 
      success: true, 
      user: userWithoutPassword,
      message: '¡Registro exitoso! Bienvenido a Ecobitácora 🌱'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login - Inicio de sesión
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    // Leer usuarios
    let users = readData('users.txt') || [];
    
    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    // Verificar contraseña (sin encriptación por ahora)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    // NO verificar racha aquí - solo se verifica al registrar acciones
    // La racha se mantiene hasta que pase más de 1 día completo sin acciones
    
    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      user: userWithoutPassword,
      message: `¡Bienvenido de vuelta ${user.name}! 🌱`
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// GET /api/auth/user/:id - Obtener usuario por ID
app.get('/api/auth/user/:id', (req, res) => {
  try {
    const users = readData('users.txt') || [];
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // NO verificar racha aquí - solo se verifica al registrar acciones
    
    // Retornar sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// PUT /api/auth/user/:id - Actualizar usuario
app.put('/api/auth/user/:id', (req, res) => {
  try {
    let users = readData('users.txt') || [];
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar solo campos permitidos
    const allowedFields = ['name', 'logoUrl', 'xp', 'level', 'streak', 'maxStreak', 'totalCO2', 'totalActions', 'achievements', 'lastActionDate'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    users[userIndex] = { ...users[userIndex], ...updates };
    writeData('users.txt', users);
    
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌱 Ecobitacora Backend running on http://localhost:${PORT}`);
  console.log(`📱 Network: http://192.168.1.36:${PORT}`);
});
