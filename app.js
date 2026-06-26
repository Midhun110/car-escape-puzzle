// Car Escape Puzzle - Premium Game Logic & Solver
// Built by Antigravity

(function () {
  // --- SEED-BASED RANDOM GENERATOR ---
  class SeededRandom {
    constructor(seed) {
      this.seed = seed;
    }
    next() {
      this.seed = (this.seed * 9301 + 49297) % 233280;
      return this.seed / 233280;
    }
    nextInt(min, max) {
      return Math.floor(min + this.next() * (max - min));
    }
    choice(arr) {
      return arr[this.nextInt(0, arr.length)];
    }
  }

  // --- VEHICLE MODELS (SVG GENERATORS) ---
  // Adding wheel-rect classes and spokes to support realistic rotation
  const VEHICLE_DESIGNS = {
    player_sports_1: {
      name: "Veneno Red",
      class: "S Class",
      baseColor: "#ff0844",
      strokeColor: "#800020",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <defs>
            <linearGradient id="bodyGrad_ps1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${bodyFill}" />
              <stop offset="60%" stop-color="${adjustColor(bodyFill, 30)}" />
              <stop offset="100%" stop-color="${adjustColor(bodyFill, -30)}" />
            </linearGradient>
            <linearGradient id="cabinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e2030" />
              <stop offset="100%" stop-color="#090a10" />
            </linearGradient>
            <pattern id="spokePattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="3" y1="0" x2="3" y2="6" stroke="#555" stroke-width="1.2"/>
              <line x1="0" y1="3" x2="6" y2="3" stroke="#555" stroke-width="1.2"/>
            </pattern>
          </defs>
          <rect x="20" y="15" width="160" height="70" rx="35" fill="none" stroke="${glowFill}" stroke-width="4" opacity="0.3" filter="blur(6px)"/>
          <rect x="8" y="12" width="184" height="76" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(3px)"/>
          <path d="M 12 50 C 12 25, 30 14, 70 14 L 175 16 C 185 16, 192 30, 192 50 C 192 70, 185 84, 175 84 L 70 86 C 30 86, 12 75, 12 50 Z" fill="url(#bodyGrad_ps1)" stroke="${adjustColor(bodyFill, -50)}" stroke-width="1.5"/>
          <path d="M 25 46 L 120 46 L 122 36 L 25 36 Z" fill="rgba(255,255,255,0.15)"/>
          <path d="M 25 54 L 120 54 L 122 64 L 25 64 Z" fill="rgba(255,255,255,0.15)"/>
          <path d="M 68 50 C 68 25, 80 20, 115 20 L 148 22 C 158 22, 164 35, 164 50 C 164 65, 158 78, 148 78 L 115 80 C 80 80, 68 75, 68 50 Z" fill="url(#cabinGrad)" stroke="rgba(255,255,255,0.15)"/>
          <path d="M 125 24 C 132 24, 148 30, 148 50 C 148 70, 132 76, 125 76 C 120 76, 118 60, 118 50 C 118 40, 120 24, 125 24 Z" fill="rgba(0, 242, 254, 0.35)"/>
          <path d="M 60 16 L 80 24 L 76 30 Z" fill="#0c0d12"/>
          <path d="M 60 84 L 80 76 L 76 70 Z" fill="#0c0d12"/>
          <ellipse cx="184" cy="26" rx="6" ry="3" fill="#ffffff" class="headlight" filter="drop-shadow(0 0 4px #ffd700)"/>
          <ellipse cx="184" cy="74" rx="6" ry="3" fill="#ffffff" class="headlight" filter="drop-shadow(0 0 4px #ffd700)"/>
          <rect x="14" y="26" width="4" height="12" rx="1" fill="#ff0000" filter="drop-shadow(0 0 3px #ff0000)"/>
          <rect x="14" y="62" width="4" height="12" rx="1" fill="#ff0000" filter="drop-shadow(0 0 3px #ff0000)"/>
          <!-- Rotatable Wheels with spoke patterns -->
          <rect x="42" y="6" width="32" height="8" rx="2" fill="#15151b" class="wheel-rect"/>
          <circle cx="58" cy="10" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="42" y="86" width="32" height="8" rx="2" fill="#15151b" class="wheel-rect"/>
          <circle cx="58" cy="90" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="142" y="6" width="32" height="8" rx="2" fill="#15151b" class="wheel-rect"/>
          <circle cx="158" cy="10" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="142" y="86" width="32" height="8" rx="2" fill="#15151b" class="wheel-rect"/>
          <circle cx="158" cy="90" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
        </svg>
      `
    },
    player_sports_2: {
      name: "McLaren Orange",
      class: "S Class",
      baseColor: "#ff6400",
      strokeColor: "#803200",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <defs>
            <linearGradient id="bodyGrad_ps2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${bodyFill}" />
              <stop offset="70%" stop-color="${adjustColor(bodyFill, 40)}" />
              <stop offset="100%" stop-color="${adjustColor(bodyFill, -40)}" />
            </linearGradient>
            <pattern id="spokePattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="3" y1="0" x2="3" y2="6" stroke="#555" stroke-width="1.2"/>
              <line x1="0" y1="3" x2="6" y2="3" stroke="#555" stroke-width="1.2"/>
            </pattern>
          </defs>
          <rect x="20" y="15" width="160" height="70" rx="35" fill="none" stroke="${glowFill}" stroke-width="4" opacity="0.3" filter="blur(6px)"/>
          <rect x="8" y="12" width="184" height="76" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(3px)"/>
          <path d="M 15 50 C 15 28, 45 16, 85 16 L 170 18 C 182 18, 190 32, 190 50 C 190 68, 182 82, 170 82 L 85 84 C 45 84, 15 72, 15 50 Z" fill="url(#bodyGrad_ps2)" stroke="${adjustColor(bodyFill, -40)}" stroke-width="1.5"/>
          <path d="M 75 50 C 75 22, 95 18, 130 18 C 155 18, 160 32, 160 50 C 160 68, 155 82, 130 82 C 95 82, 75 78, 75 50 Z" fill="#12131a" stroke="rgba(255,255,255,0.15)"/>
          <path d="M 120 22 C 130 22, 145 28, 145 50 C 145 72, 130 78, 120 78 Z" fill="rgba(0, 242, 254, 0.25)"/>
          <rect x="18" y="24" width="6" height="52" rx="2" fill="#000"/>
          <path d="M 182 24 C 185 30, 180 34, 175 32 Z" fill="#fff" class="headlight" filter="drop-shadow(0 0 4px #00f2fe)"/>
          <path d="M 182 76 C 185 70, 180 66, 175 68 Z" fill="#fff" class="headlight" filter="drop-shadow(0 0 4px #00f2fe)"/>
          <rect x="40" y="7" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="55" cy="11" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="40" y="85" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="55" cy="89" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="135" y="7" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="150" cy="11" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="135" y="85" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="150" cy="89" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
        </svg>
      `
    },
    player_sports_3: {
      name: "Modena Blue",
      class: "S Class",
      baseColor: "#00f2fe",
      strokeColor: "#007a80",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <defs>
            <pattern id="spokePattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="3" y1="0" x2="3" y2="6" stroke="#555" stroke-width="1.2"/>
              <line x1="0" y1="3" x2="6" y2="3" stroke="#555" stroke-width="1.2"/>
            </pattern>
          </defs>
          <rect x="20" y="15" width="160" height="70" rx="35" fill="none" stroke="${glowFill}" stroke-width="4" opacity="0.3" filter="blur(6px)"/>
          <rect x="8" y="12" width="184" height="76" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(3px)"/>
          <path d="M 18 50 C 18 26, 38 15, 80 15 L 180 18 C 188 18, 192 32, 192 50 C 192 68, 188 82, 180 82 L 80 85 C 38 85, 18 74, 18 50 Z" fill="${bodyFill}" stroke="${adjustColor(bodyFill, -50)}" stroke-width="1.5"/>
          <path d="M 90 20 C 90 20, 110 22, 140 22 C 160 22, 165 32, 165 50 C 165 68, 160 78, 140 78 C 110 78, 90 80, 90 80 Z" fill="#151722" stroke="rgba(255,255,255,0.1)"/>
          <ellipse cx="180" cy="28" rx="8" ry="4" fill="#ffffff" class="headlight" filter="drop-shadow(0 0 4px #00f2fe)"/>
          <ellipse cx="180" cy="72" rx="8" ry="4" fill="#ffffff" class="headlight" filter="drop-shadow(0 0 4px #00f2fe)"/>
          <circle cx="26" cy="28" r="5" fill="#ff0844" filter="drop-shadow(0 0 3px #ff0844)"/>
          <circle cx="26" cy="72" r="5" fill="#ff0844" filter="drop-shadow(0 0 3px #ff0844)"/>
          <rect x="42" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="58" cy="10" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="42" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="58" cy="90" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="142" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="158" cy="10" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="142" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="158" cy="90" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
        </svg>
      `
    },
    player_sports_4: {
      name: "Stuttgart Gold",
      class: "S Class",
      baseColor: "#ffd700",
      strokeColor: "#7f6b00",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <defs>
            <pattern id="spokePattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="3" y1="0" x2="3" y2="6" stroke="#555" stroke-width="1.2"/>
              <line x1="0" y1="3" x2="6" y2="3" stroke="#555" stroke-width="1.2"/>
            </pattern>
          </defs>
          <rect x="20" y="15" width="160" height="70" rx="35" fill="none" stroke="${glowFill}" stroke-width="4" opacity="0.3" filter="blur(6px)"/>
          <rect x="8" y="12" width="184" height="76" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(3px)"/>
          <path d="M 12 50 C 12 28, 35 17, 75 17 L 172 17 C 182 17, 192 30, 192 50 C 192 70, 182 83, 172 83 L 75 83 C 35 83, 12 72, 12 50 Z" fill="${bodyFill}" stroke="${adjustColor(bodyFill, -60)}" stroke-width="1.5"/>
          <path d="M 75 50 C 75 25, 95 21, 130 21 C 158 21, 162 33, 162 50 C 162 67, 158 79, 130 79 C 95 79, 75 75, 75 50 Z" fill="#191924" stroke="rgba(255,255,255,0.15)"/>
          <circle cx="180" cy="26" r="6" fill="#fff" class="headlight" filter="drop-shadow(0 0 4px #fff)"/>
          <circle cx="180" cy="74" r="6" fill="#fff" class="headlight" filter="drop-shadow(0 0 4px #fff)"/>
          <rect x="42" y="7" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="57" cy="11" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="42" y="85" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="57" cy="89" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="138" y="7" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="153" cy="11" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
          <rect x="138" y="85" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="153" cy="89" r="3" fill="url(#spokePattern)" class="wheel-rect"/>
        </svg>
      `
    },
    player_police: {
      name: "Interceptor Police",
      class: "A Class",
      baseColor: "#090d16",
      strokeColor: "#ffffff",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="14" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="16" fill="#090d16" stroke="#fff" stroke-width="2"/>
          <rect x="70" y="14" width="60" height="72" fill="#ffffff"/>
          <rect x="75" y="20" width="50" height="60" rx="10" fill="#151722" stroke="rgba(0,0,0,0.2)"/>
          <rect x="94" y="28" width="8" height="20" rx="1" fill="#ef4444" filter="drop-shadow(0 0 8px #ef4444)"/>
          <rect x="94" y="52" width="8" height="20" rx="1" fill="#3b82f6" filter="drop-shadow(0 0 8px #3b82f6)"/>
          <ellipse cx="178" cy="28" rx="6" ry="3" fill="#fff" filter="drop-shadow(0 0 4px #fff)"/>
          <ellipse cx="178" cy="72" rx="6" ry="3" fill="#fff" filter="drop-shadow(0 0 4px #fff)"/>
          <text x="100" y="18" font-family="'Outfit'" font-size="8" font-weight="900" fill="#1e3a8a" text-anchor="middle" transform="rotate(-90 100 50)">POLICE</text>
          <rect x="42" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="42" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },
    player_taxi: {
      name: "Metro Yellow Cab",
      class: "B Class",
      baseColor: "#ffd700",
      strokeColor: "#b89b00",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="14" fill="#ffd700" stroke="#b89b00" stroke-width="2"/>
          <rect x="30" y="14" width="120" height="5" fill="repeating-linear-gradient(90deg, #000, #000 8px, #ffd700 8px, #ffd700 16px)"/>
          <rect x="30" y="81" width="120" height="5" fill="repeating-linear-gradient(90deg, #000, #000 8px, #ffd700 8px, #ffd700 16px)"/>
          <rect x="65" y="20" width="75" height="60" rx="10" fill="#1c1d24" stroke="rgba(255,255,255,0.1)"/>
          <rect x="94" y="38" width="12" height="24" rx="2" fill="#fff" stroke="#000" stroke-width="1.5"/>
          <text x="100" y="54" font-family="'Outfit'" font-size="8" font-weight="900" fill="#ff6400" text-anchor="middle" transform="rotate(-90 100 50)">TAXI</text>
          <rect x="42" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="42" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },
    player_classic: {
      name: "Vintage Roadster",
      class: "A Class",
      baseColor: "#1b4332",
      strokeColor: "#081c15",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="16" width="176" height="68" rx="25" fill="#1b4332" stroke="#081c15" stroke-width="2"/>
          <rect x="70" y="24" width="70" height="52" rx="12" fill="#15161c" stroke="#d1d5db" stroke-width="1.5"/>
          <ellipse cx="180" cy="28" rx="5" ry="5" fill="#fef08a" stroke="#d1d5db"/>
          <ellipse cx="180" cy="72" rx="5" ry="5" fill="#fef08a" stroke="#d1d5db"/>
          <rect x="42" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="42" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },
    player_electric: {
      name: "Cyber Volt EV",
      class: "S Class",
      baseColor: "#059669",
      strokeColor: "#047857",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="14" fill="#022c22" stroke="#10b981" stroke-width="2"/>
          <rect x="65" y="20" width="75" height="60" rx="10" fill="#020617" stroke="#10b981" stroke-width="1"/>
          <path d="M 100 35 L 94 48 L 102 48 L 98 65 L 106 48 L 98 48 Z" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)"/>
          <ellipse cx="178" cy="28" rx="6" ry="3" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)"/>
          <ellipse cx="178" cy="72" rx="6" ry="3" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)"/>
          <rect x="42" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="42" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },
    player_monster: {
      name: "Trophy Monster",
      class: "X Class",
      baseColor: "#4c1d95",
      strokeColor: "#ff007f",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="10" y="8" width="180" height="84" rx="20" fill="rgba(0,0,0,0.45)" filter="blur(4px)"/>
          <rect x="25" y="15" width="150" height="70" rx="18" fill="${bodyFill}" stroke="#ff007f" stroke-width="2.5"/>
          <rect x="65" y="22" width="70" height="56" rx="8" fill="#111" stroke="#ff007f" stroke-width="1.5"/>
          <rect x="30" y="2" width="38" height="14" rx="3" fill="#09090b" class="wheel-rect"/>
          <circle cx="49" cy="9" r="4" fill="#ffd700" class="wheel-rect"/>
          <rect x="30" y="84" width="38" height="14" rx="3" fill="#09090b" class="wheel-rect"/>
          <circle cx="49" cy="91" r="4" fill="#ffd700" class="wheel-rect"/>
          <rect x="130" y="2" width="38" height="14" rx="3" fill="#09090b" class="wheel-rect"/>
          <circle cx="148" cy="9" r="4" fill="#ffd700" class="wheel-rect"/>
          <rect x="130" y="84" width="38" height="14" rx="3" fill="#09090b" class="wheel-rect"/>
          <circle cx="148" cy="91" r="4" fill="#ffd700" class="wheel-rect"/>
        </svg>
      `
    },
    player_vintage: {
      name: "Liquid Vintage",
      class: "X Class",
      baseColor: "#7c2d12",
      strokeColor: "#ffd700",
      svg: (bodyFill, glowFill) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <path d="M 15 50 C 15 25, 40 18, 90 18 L 165 24 C 175 24, 185 35, 185 50 C 185 65, 175 76, 165 76 L 90 82 C 40 82, 15 75, 15 50 Z" fill="${bodyFill}" stroke="#ffd700" stroke-width="2"/>
          <circle cx="178" cy="30" r="4" fill="#fef08a" stroke="#ffd700"/>
          <circle cx="178" cy="70" r="4" fill="#fef08a" stroke="#ffd700"/>
          <rect x="42" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="42" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="6" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="142" y="86" width="32" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },

    // Blocker Cars
    tow_truck: {
      h: (color) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="14" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
          <rect x="18" y="24" width="60" height="8" rx="1" fill="#7f1d1d"/>
          <line x1="75" y1="28" x2="110" y2="28" stroke="#111" stroke-width="3"/>
          <rect x="106" y="22" width="10" height="12" fill="#7f1d1d"/>
          <rect x="14" y="38" width="6" height="24" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)"/>
          <rect x="38" y="6" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="38" y="86" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="134" y="6" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="134" y="86" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
        </svg>
      `,
      v: (color) => `
        <svg viewBox="0 0 100 200" width="100%" height="100%">
          <rect x="12" y="8" width="76" height="184" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="14" y="12" width="72" height="176" rx="14" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
          <rect x="24" y="18" width="8" height="60" rx="1" fill="#7f1d1d"/>
          <line x1="28" y1="75" x2="28" y2="110" stroke="#111" stroke-width="3"/>
          <rect x="22" y="106" width="12" height="10" fill="#7f1d1d"/>
          <rect x="38" y="14" width="24" height="6" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)"/>
          <rect x="6" y="38" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="86" y="38" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="6" y="134" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="86" y="134" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
        </svg>
      `
    },
    luxury_sedan: {
      h: (color) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="14" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="16" fill="${color}" stroke="${adjustColor(color, -40)}" stroke-width="2"/>
          <rect x="62" y="20" width="84" height="60" rx="10" fill="#15161c" stroke="rgba(255,255,255,0.1)"/>
          <path d="M 68 25 L 85 25 L 85 75 L 68 75 Z" fill="rgba(0, 242, 254, 0.15)"/>
          <path d="M 132 25 L 140 25 L 140 75 L 132 75 Z" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="180" y="20" width="4" height="10" rx="1" fill="#fffef0" filter="drop-shadow(0 0 2px #fff)"/>
          <rect x="180" y="70" width="4" height="10" rx="1" fill="#fffef0" filter="drop-shadow(0 0 2px #fff)"/>
          <rect x="36" y="5" width="28" height="8" rx="1" fill="#222" class="wheel-rect"/>
          <rect x="36" y="87" width="28" height="8" rx="1" fill="#222" class="wheel-rect"/>
          <rect x="136" y="5" width="28" height="8" rx="1" fill="#222" class="wheel-rect"/>
          <rect x="136" y="87" width="28" height="8" rx="1" fill="#222" class="wheel-rect"/>
        </svg>
      `,
      v: (color) => `
        <svg viewBox="0 0 100 200" width="100%" height="100%">
          <rect x="12" y="8" width="76" height="184" rx="14" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="14" y="12" width="72" height="176" rx="16" fill="${color}" stroke="${adjustColor(color, -40)}" stroke-width="2"/>
          <rect x="20" y="62" width="60" height="84" rx="10" fill="#15161c" stroke="rgba(255,255,255,0.1)"/>
          <rect x="20" y="180" width="10" height="4" rx="1" fill="#fffef0" filter="drop-shadow(0 0 2px #fff)"/>
          <rect x="70" y="180" width="10" height="4" rx="1" fill="#fffef0" filter="drop-shadow(0 0 2px #fff)"/>
          <rect x="5" y="36" width="8" height="28" rx="1" fill="#222" class="wheel-rect"/>
          <rect x="87" y="36" width="8" height="28" rx="1" fill="#222" class="wheel-rect"/>
          <rect x="5" y="136" width="8" height="28" rx="1" fill="#222" class="wheel-rect"/>
          <rect x="87" y="136" width="8" height="28" rx="1" fill="#222" class="wheel-rect"/>
        </svg>
      `
    },
    suv: {
      h: (color) => `
        <svg viewBox="0 0 300 100" width="100%" height="100%">
          <rect x="8" y="10" width="284" height="80" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(4px)"/>
          <rect x="12" y="12" width="276" height="76" rx="18" fill="${color}" stroke="${adjustColor(color, -35)}" stroke-width="2"/>
          <rect x="80" y="18" width="130" height="64" rx="8" fill="#1e2029" stroke="rgba(255,255,255,0.08)"/>
          <rect x="110" y="24" width="70" height="52" fill="none" stroke="#2c303f" stroke-width="2" rx="4"/>
          <line x1="130" y1="24" x2="130" y2="76" stroke="#2c303f" stroke-width="2"/>
          <line x1="160" y1="24" x2="160" y2="76" stroke="#2c303f" stroke-width="2"/>
          <ellipse cx="282" cy="24" rx="4" ry="8" fill="#fff" filter="drop-shadow(0 0 3px #fff)"/>
          <ellipse cx="282" cy="76" rx="4" ry="8" fill="#fff" filter="drop-shadow(0 0 3px #fff)"/>
          <rect x="40" y="4" width="36" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="40" y="88" width="36" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="210" y="4" width="36" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="210" y="88" width="36" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `,
      v: (color) => `
        <svg viewBox="0 0 100 300" width="100%" height="100%">
          <rect x="10" y="8" width="80" height="284" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(4px)"/>
          <rect x="12" y="12" width="76" height="276" rx="18" fill="${color}" stroke="${adjustColor(color, -35)}" stroke-width="2"/>
          <rect x="18" y="80" width="64" height="130" rx="8" fill="#1e2029" stroke="rgba(255,255,255,0.08)"/>
          <rect x="24" y="110" width="52" height="70" fill="none" stroke="#2c303f" stroke-width="2" rx="4"/>
          <line x1="24" y1="130" x2="76" y2="130" stroke="#2c303f" stroke-width="2"/>
          <line x1="24" y1="160" x2="76" y2="160" stroke="#2c303f" stroke-width="2"/>
          <ellipse cx="24" cy="282" rx="8" ry="4" fill="#fff" filter="drop-shadow(0 0 3px #fff)"/>
          <ellipse cx="76" cy="282" rx="8" ry="4" fill="#fff" filter="drop-shadow(0 0 3px #fff)"/>
          <rect x="4" y="40" width="8" height="36" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="88" y="40" width="8" height="36" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="4" y="210" width="8" height="36" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="88" y="210" width="8" height="36" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },
    pickup_truck: {
      h: (color) => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="14" fill="${color}" stroke="${adjustColor(color, -40)}" stroke-width="2"/>
          <rect x="70" y="20" width="60" height="60" rx="8" fill="#15161c" stroke="rgba(255,255,255,0.1)"/>
          <rect x="18" y="20" width="45" height="60" fill="${adjustColor(color, -25)}" stroke="rgba(0,0,0,0.2)"/>
          <line x1="22" y1="26" x2="22" y2="74" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
          <rect x="38" y="6" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="38" y="86" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="134" y="6" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="134" y="86" width="30" height="8" rx="2" fill="#151515" class="wheel-rect"/>
        </svg>
      `,
      v: (color) => `
        <svg viewBox="0 0 100 200" width="100%" height="100%">
          <rect x="12" y="8" width="76" height="184" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="14" y="12" width="72" height="176" rx="14" fill="${color}" stroke="${adjustColor(color, -40)}" stroke-width="2"/>
          <rect x="20" y="70" width="60" height="60" rx="8" fill="#15161c" stroke="rgba(255,255,255,0.1)"/>
          <rect x="20" y="18" width="60" height="45" fill="${adjustColor(color, -25)}" stroke="rgba(0,0,0,0.2)"/>
          <line x1="26" y1="22" x2="74" y2="22" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
          <rect x="6" y="38" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="86" y="38" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="6" y="134" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="86" y="134" width="8" height="30" rx="2" fill="#151515" class="wheel-rect"/>
        </svg>
      `
    },
    mini_van: {
      h: (color) => `
        <svg viewBox="0 0 300 100" width="100%" height="100%">
          <rect x="8" y="10" width="284" height="80" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(4px)"/>
          <rect x="12" y="12" width="276" height="76" rx="18" fill="${color}" stroke="${adjustColor(color, -30)}" stroke-width="2"/>
          <rect x="60" y="18" width="180" height="64" rx="12" fill="#191b24" stroke="rgba(255,255,255,0.08)"/>
          <rect x="80" y="22" width="50" height="4" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="80" y="74" width="50" height="4" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="140" y="22" width="50" height="4" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="140" y="74" width="50" height="4" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="42" y="4" width="34" height="8" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="42" y="88" width="34" height="8" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="214" y="4" width="34" height="8" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="214" y="88" width="34" height="8" rx="2" fill="#222" class="wheel-rect"/>
        </svg>
      `,
      v: (color) => `
        <svg viewBox="0 0 100 300" width="100%" height="100%">
          <rect x="10" y="8" width="80" height="284" rx="16" fill="rgba(0,0,0,0.35)" filter="blur(4px)"/>
          <rect x="12" y="12" width="76" height="276" rx="18" fill="${color}" stroke="${adjustColor(color, -30)}" stroke-width="2"/>
          <rect x="18" y="60" width="64" height="180" rx="12" fill="#191b24" stroke="rgba(255,255,255,0.08)"/>
          <rect x="22" y="80" width="4" height="50" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="74" y="80" width="4" height="50" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="22" y="140" width="4" height="50" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="74" y="140" width="4" height="50" rx="1" fill="rgba(0, 242, 254, 0.15)"/>
          <rect x="4" y="42" width="8" height="34" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="88" y="42" width="8" height="34" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="4" y="214" width="8" height="34" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="88" y="214" width="8" height="34" rx="2" fill="#222" class="wheel-rect"/>
        </svg>
      `
    },
    taxi: {
      h: () => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="14" fill="#ffd700" stroke="#b89b00" stroke-width="2"/>
          <rect x="30" y="14" width="120" height="5" fill="repeating-linear-gradient(90deg, #000, #000 8px, #ffd700 8px, #ffd700 16px)"/>
          <rect x="30" y="81" width="120" height="5" fill="repeating-linear-gradient(90deg, #000, #000 8px, #ffd700 8px, #ffd700 16px)"/>
          <rect x="65" y="20" width="75" height="60" rx="10" fill="#1c1d24" stroke="rgba(255,255,255,0.1)"/>
          <rect x="94" y="40" width="12" height="20" rx="2" fill="#fff" stroke="#000" stroke-width="1.5"/>
          <text x="100" y="54" font-family="'Outfit'" font-size="8" font-weight="900" fill="#ff6400" text-anchor="middle" transform="rotate(-90 100 50)">TAXI</text>
          <rect x="38" y="6" width="30" height="8" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="38" y="86" width="30" height="8" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="134" y="6" width="30" height="8" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="134" y="86" width="30" height="8" rx="2" fill="#222" class="wheel-rect"/>
        </svg>
      `,
      v: () => `
        <svg viewBox="0 0 100 200" width="100%" height="100%">
          <rect x="12" y="8" width="76" height="184" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="14" y="12" width="72" height="176" rx="14" fill="#ffd700" stroke="#b89b00" stroke-width="2"/>
          <rect x="14" y="30" width="5" height="120" fill="repeating-linear-gradient(180deg, #000, #000 8px, #ffd700 8px, #ffd700 16px)"/>
          <rect x="81" y="30" width="5" height="120" fill="repeating-linear-gradient(180deg, #000, #000 8px, #ffd700 8px, #ffd700 16px)"/>
          <rect x="20" y="65" width="60" height="75" rx="10" fill="#1c1d24" stroke="rgba(255,255,255,0.1)"/>
          <rect x="40" y="94" width="20" height="12" rx="2" fill="#fff" stroke="#000" stroke-width="1.5"/>
          <text x="50" y="103" font-family="'Outfit'" font-size="8" font-weight="900" fill="#ff6400" text-anchor="middle">TAXI</text>
          <rect x="6" y="38" width="8" height="30" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="86" y="38" width="8" height="30" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="6" y="134" width="8" height="30" rx="2" fill="#222" class="wheel-rect"/>
          <rect x="86" y="134" width="8" height="30" rx="2" fill="#222" class="wheel-rect"/>
        </svg>
      `
    },
    police_car: {
      h: () => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="14" fill="#090d16" stroke="#000" stroke-width="2"/>
          <rect x="60" y="14" width="70" height="72" fill="#ffffff"/>
          <rect x="65" y="20" width="70" height="60" rx="10" fill="#151722" stroke="rgba(0,0,0,0.2)"/>
          <text x="95" y="55" font-family="'Outfit'" font-size="12" font-weight="900" fill="#1e3a8a" text-anchor="middle" transform="rotate(-90 95 50)">POLICE</text>
          <rect x="94" y="36" width="6" height="14" rx="1" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)"/>
          <rect x="94" y="50" width="6" height="14" rx="1" fill="#3b82f6" filter="drop-shadow(0 0 6px #3b82f6)"/>
          <rect x="38" y="6" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="38" y="86" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="134" y="6" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="134" y="86" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `,
      v: () => `
        <svg viewBox="0 0 100 200" width="100%" height="100%">
          <rect x="12" y="8" width="76" height="184" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="14" y="12" width="72" height="176" rx="14" fill="#090d16" stroke="#000" stroke-width="2"/>
          <rect x="14" y="60" width="72" height="70" fill="#ffffff"/>
          <rect x="20" y="65" width="60" height="70" rx="10" fill="#151722" stroke="rgba(0,0,0,0.2)"/>
          <text x="50" y="104" font-family="'Outfit'" font-size="12" font-weight="900" fill="#1e3a8a" text-anchor="middle">POLICE</text>
          <rect x="36" y="94" width="14" height="6" rx="1" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)"/>
          <rect x="50" y="94" width="14" height="6" rx="1" fill="#3b82f6" filter="drop-shadow(0 0 6px #3b82f6)"/>
          <rect x="6" y="38" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="86" y="38" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="6" y="134" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="86" y="134" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },
    electric_vehicle: {
      h: () => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="14" width="176" height="72" rx="14" fill="#000" stroke="#22c55e" stroke-width="1.5"/>
          <rect x="65" y="20" width="75" height="60" rx="10" fill="#0a0a0f" stroke="#22c55e" stroke-width="0.5"/>
          <path d="M 100 35 L 94 48 L 102 48 L 98 65 L 106 48 L 98 48 Z" fill="#22c55e" filter="drop-shadow(0 0 4px #22c55e)"/>
          <line x1="175" y1="18" x2="190" y2="18" stroke="#22c55e" stroke-width="2" filter="drop-shadow(0 0 3px #22c55e)"/>
          <line x1="175" y1="82" x2="190" y2="82" stroke="#22c55e" stroke-width="2" filter="drop-shadow(0 0 3px #22c55e)"/>
          <rect x="38" y="6" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="38" y="86" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="134" y="6" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="134" y="86" width="30" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `,
      v: () => `
        <svg viewBox="0 0 100 200" width="100%" height="100%">
          <rect x="12" y="8" width="76" height="184" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="14" y="12" width="72" height="176" rx="14" fill="#000" stroke="#22c55e" stroke-width="1.5"/>
          <rect x="20" y="65" width="60" height="75" rx="10" fill="#0a0a0f" stroke="#22c55e" stroke-width="0.5"/>
          <path d="M 50 100 L 44 113 L 52 113 L 48 130 L 56 113 L 48 113 Z" fill="#22c55e" filter="drop-shadow(0 0 4px #22c55e)"/>
          <line x1="18" y1="175" x2="18" y2="190" stroke="#22c55e" stroke-width="2" filter="drop-shadow(0 0 3px #22c55e)"/>
          <line x1="82" y1="175" x2="82" y2="190" stroke="#22c55e" stroke-width="2" filter="drop-shadow(0 0 3px #22c55e)"/>
          <rect x="6" y="38" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="86" y="38" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
          <circle cx="10" cy="53" r="3" fill="#111" />
          <rect x="6" y="134" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="86" y="134" width="8" height="30" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    },
    classic_car: {
      h: () => `
        <svg viewBox="0 0 200 100" width="100%" height="100%">
          <rect x="8" y="12" width="184" height="76" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="16" width="176" height="68" rx="25" fill="#3f6212" stroke="#1c2d09" stroke-width="2"/>
          <rect x="70" y="24" width="70" height="52" rx="12" fill="#15161c" stroke="#d1d5db" stroke-width="1.5"/>
          <rect x="186" y="25" width="4" height="50" rx="2" fill="#e5e7eb" stroke="#9ca3af"/>
          <rect x="10" y="25" width="4" height="50" rx="2" fill="#e5e7eb" stroke="#9ca3af"/>
          <circle cx="180" cy="28" r="5" fill="#fef08a" stroke="#d1d5db"/>
          <circle cx="180" cy="72" r="5" fill="#fef08a" stroke="#d1d5db"/>
          <rect x="36" y="8" width="28" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="36" y="84" width="28" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="136" y="8" width="28" height="8" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="136" y="84" width="28" height="8" rx="2" fill="#151515" class="wheel-rect"/>
        </svg>
      `,
      v: () => `
        <svg viewBox="0 0 100 200" width="100%" height="100%">
          <rect x="12" y="8" width="76" height="184" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="16" y="12" width="68" height="176" rx="25" fill="#3f6212" stroke="#1c2d09" stroke-width="2"/>
          <rect x="24" y="70" width="52" height="70" rx="12" fill="#15161c" stroke="#d1d5db" stroke-width="1.5"/>
          <rect x="25" y="186" width="50" height="4" rx="2" fill="#e5e7eb" stroke="#9ca3af"/>
          <rect x="25" y="10" width="50" height="4" rx="2" fill="#e5e7eb" stroke="#9ca3af"/>
          <circle cx="28" cy="180" r="5" fill="#fef08a" stroke="#d1d5db"/>
          <circle cx="72" cy="180" r="5" fill="#fef08a" stroke="#d1d5db"/>
          <rect x="8" y="36" width="8" height="28" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="84" y="36" width="8" height="28" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="8" y="136" width="8" height="28" rx="2" fill="#151515" class="wheel-rect"/>
          <rect x="84" y="136" width="8" height="28" rx="2" fill="#151515" class="wheel-rect"/>
        </svg>
      `
    },
    delivery_van: {
      h: () => `
        <svg viewBox="0 0 300 100" width="100%" height="100%">
          <rect x="8" y="10" width="284" height="80" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="12" width="276" height="76" rx="10" fill="#f3f4f6" stroke="#9ca3af" stroke-width="2.5"/>
          <path d="M 245 18 L 280 18 L 270 82 L 245 82 Z" fill="#1a1c23"/>
          <path d="M 252 22 L 270 22 L 265 78 L 252 78 Z" fill="rgba(0,242,254,0.15)"/>
          <rect x="30" y="36" width="190" height="28" fill="#3b82f6" opacity="0.85"/>
          <text x="120" y="55" font-family="'Outfit'" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">EXPRESS</text>
          <rect x="44" y="4" width="34" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="44" y="88" width="34" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="206" y="4" width="34" height="8" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="206" y="88" width="34" height="8" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `,
      v: () => `
        <svg viewBox="0 0 100 300" width="100%" height="100%">
          <rect x="10" y="8" width="80" height="284" rx="12" fill="rgba(0,0,0,0.3)" filter="blur(3px)"/>
          <rect x="12" y="12" width="76" height="276" rx="10" fill="#f3f4f6" stroke="#9ca3af" stroke-width="2.5"/>
          <path d="M 18 245 L 18 280 L 82 270 L 82 245 Z" fill="#1a1c23"/>
          <path d="M 22 252 L 22 270 L 78 265 L 78 252 Z" fill="rgba(0,242,254,0.15)"/>
          <rect x="36" y="30" width="28" height="190" fill="#3b82f6" opacity="0.85"/>
          <text x="50" y="120" font-family="'Outfit'" font-size="16" font-weight="900" fill="#fff" text-anchor="middle" transform="rotate(-90 50 120)">EXPRESS</text>
          <rect x="4" y="44" width="8" height="34" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="88" y="44" width="8" height="34" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="4" y="206" width="8" height="34" rx="2" fill="#111" class="wheel-rect"/>
          <rect x="88" y="206" width="8" height="34" rx="2" fill="#111" class="wheel-rect"/>
        </svg>
      `
    }
  };

  // Helper: Shift colors (lighten/darken) for SVG gradients
  function adjustColor(hex, percent) {
    let num = parseInt(hex.replace("#",""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
  }

  // Helper: Check if level belongs to a specific world
  function isLevelInWorld(level, world) {
    const worldIdx = WORLDS.findIndex(w => w.key === world.key);
    const nextWorld = WORLDS[worldIdx + 1];
    const endLvl = nextWorld ? nextWorld.levelStart - 1 : 999;
    return level >= world.levelStart && level <= endLvl;
  }

  // Helper: Get Rank Title
  function getRankName(level) {
    if (level >= 5) return "Legend Racer";
    if (level === 4) return "Asphalt King";
    if (level === 3) return "Speed Master";
    if (level === 2) return "Pro Drifter";
    return "Rookie";
  }

  // Helper: Apply accessibility classes and attributes to DOM
  function applyAccessibilitySettings() {
    // 1. Colorblind mode
    document.body.classList.remove("colorblind-deuteranopia", "colorblind-protanopia", "colorblind-tritanopia");
    if (state.colorblindMode && state.colorblindMode !== "none") {
      document.body.classList.add(`colorblind-${state.colorblindMode}`);
    }
    
    // 2. Layout, scale, and motion
    const app = document.getElementById("app-container");
    if (app) {
      app.setAttribute("data-layout", state.leftHanded ? "left-handed" : "standard");
      app.setAttribute("data-scale", state.uiScaling || "standard");
      app.setAttribute("data-motion", state.reduceMotion ? "reduce" : "standard");
    }
  }

  // Helper: Reset daily challenges if day changed
  function checkDailyChallengesReset() {
    const today = new Date().toDateString();
    if (state.dailyChallenges.lastChallengeDate !== today) {
      state.dailyChallenges.solvedCount = 0;
      state.dailyChallenges.under15Solved = false;
      state.dailyChallenges.noHintsSolved = false;
      state.dailyChallenges.hardSolved = false;
      state.dailyChallenges.lastChallengeDate = today;
      state.dailyChallenges.claimed = { 0: false, 1: false, 2: false, 3: false };
    }
  }

  // Helper: Check and unlock achievements
  function checkAchievements() {
    if (state.currentLevel > 1) {
      state.achievements.firstEscape = true;
    }
    if (state.coins >= 1000) {
      state.achievements.goldHoarder = true;
    }
    if (state.currentLevel >= 31) {
      state.achievements.worldExplorer = true;
    }
    if (state.currentLevel >= 66) {
      state.achievements.parkingLegend = true;
    }
  }

  // Helper: Render achievements cards on list
  function renderAchievements() {
    const achievementsList = document.getElementById("achievements-list");
    if (!achievementsList) return;
    
    achievementsList.innerHTML = "";
    
    const list = [
      { key: "firstEscape", title: "🏆 First Escape", desc: "Successfully clear Level 1" },
      { key: "noHintsMaster", title: "🏆 Master Driver", desc: "Clear any level without using hints" },
      { key: "goldHoarder", title: "🏆 Gold Hoarder", desc: "Reach 1,000 gold coins balance" },
      { key: "worldExplorer", title: "🏆 World Explorer", desc: "Reach Airport World (Level 31+)" },
      { key: "parkingLegend", title: "🏆 Parking Legend", desc: "Reach Cyber Neon City (Level 66+)" }
    ];
    
    list.forEach(item => {
      const unlocked = state.achievements[item.key] === true;
      const card = document.createElement("div");
      card.className = `achievement-card ${unlocked ? "unlocked" : ""}`;
      
      card.innerHTML = `
        <div class="icon-box">${unlocked ? "⭐" : "🔒"}</div>
        <div class="details">
          <span class="title">${item.title}</span>
          <span class="desc">${item.desc}</span>
        </div>
        <span class="status">${unlocked ? "UNLOCKED" : "LOCKED"}</span>
      `;
      achievementsList.appendChild(card);
    });
  }

  // Helper: Render daily challenges cards on list
  function renderDailyChallenges() {
    const list = document.getElementById("challenges-list");
    if (!list) return;
    list.innerHTML = "";
    
    const challenges = [
      {
        id: 0,
        title: "Finish 5 Levels",
        desc: `Clear 5 levels in any world. Progress: ${state.dailyChallenges.solvedCount}/5`,
        completed: state.dailyChallenges.solvedCount >= 5,
        reward: 150
      },
      {
        id: 1,
        title: "Speedy Escape",
        desc: "Complete any level in under 15 moves.",
        completed: state.dailyChallenges.under15Solved === true,
        reward: 100
      },
      {
        id: 2,
        title: "Master Mind",
        desc: "Solve a level without using hints.",
        completed: state.dailyChallenges.noHintsSolved === true,
        reward: 120
      },
      {
        id: 3,
        title: "Hard Challenger",
        desc: "Finish a level of Hard difficulty or higher (Level 16+).",
        completed: state.dailyChallenges.hardSolved === true,
        reward: 200
      }
    ];
    
    challenges.forEach(c => {
      const claimed = state.dailyChallenges.claimed[c.id] === true;
      const card = document.createElement("div");
      card.className = `challenge-card ${c.completed ? "completed" : ""}`;
      
      let actionBtn = "";
      if (claimed) {
        actionBtn = `<button class="btn-claim" disabled>CLAIMED</button>`;
      } else if (c.completed) {
        actionBtn = `<button class="btn-claim" data-id="${c.id}">CLAIM 🪙${c.reward}</button>`;
      } else {
        actionBtn = `<button class="btn-claim" disabled>IN PROGRESS</button>`;
      }
      
      card.innerHTML = `
        <div class="details">
          <span class="title">${c.title}</span>
          <span class="progress-text">${c.desc}</span>
        </div>
        ${actionBtn}
      `;
      
      const btn = card.querySelector(".btn-claim:not(:disabled)");
      if (btn) {
        btn.onclick = () => {
          state.coins += c.reward;
          state.dailyChallenges.claimed[c.id] = true;
          updateCoinsHUD();
          renderDailyChallenges();
          saveProgress();
          if (window.gameAudio) window.gameAudio.playVictory();
          alert(`Challenge Claimed: +${c.reward} Coins!`);
        };
      }
      
      list.appendChild(card);
    });
  }

  // Helper: Story Narratives Dialogues
  const WORLD_DIALOGUES = {
    1: {
      character: "Chief Dispatcher",
      text: "Rookie, Downtown is a parking nightmare. Free the sports car and show us what you've got!"
    },
    6: {
      character: "Sandy (Beach Warden)",
      text: "Hey! The sunset beach parking lot is completely jammed with tourists. Clear the traffic so everyone can watch the sunset!"
    },
    16: {
      character: "Ski Patrol Jack",
      text: "Brrr! A sudden blizzard hit the mountain resort lot, and the grid tiles are freezing cold and icy. Be careful, cars will slide on the ice!"
    },
    31: {
      character: "Hangar Chief Sarah",
      text: "Heavy rain is backing up airport departures! Clear the terminal exit lanes so travelers can catch their flights."
    },
    46: {
      character: "Mall Security Officer",
      text: "Attention! The underground shopping mall parking garage has a massive gridlock. Let's get these shoppers moving."
    },
    56: {
      character: "Factory Foreman Mike",
      text: "Welcome to the Industrial Zone. Broken-down trucks are blocking the lanes! You can pay 15 coins to call a Tow Truck to remove them instantly."
    },
    66: {
      character: "Cyberpunk DJ",
      text: "Welcome to Neon Cyber City. The gridlock here is impossible! Let's hack the traffic and make the ultimate escape."
    }
  };

  function showStoryDialogue(level, onComplete) {
    const dialogue = WORLD_DIALOGUES[level];
    if (!dialogue) {
      onComplete();
      return;
    }
    
    let dialogueDiv = document.getElementById("modal-story-dialogue");
    if (!dialogueDiv) {
      dialogueDiv = document.createElement("div");
      dialogueDiv.id = "modal-story-dialogue";
      dialogueDiv.className = "modal-overlay";
      dialogueDiv.innerHTML = `
        <div class="modal-content glassmorphism small-modal" style="padding: 24px; text-align: center; gap: 16px;">
          <h3 style="color: var(--accent-neon); font-size: 16px; font-weight: 900; letter-spacing: 0.5px;" id="story-char-name">DISPATCH</h3>
          <p style="font-size: 12px; line-height: 1.5; color: white;" id="story-text-content"></p>
          <button class="btn btn-primary" id="btn-story-continue" style="width: 100%; height: 44px; margin-top: 10px;">ACCEPT MISSION</button>
        </div>
      `;
      document.getElementById("app-container").appendChild(dialogueDiv);
    }
    
    document.getElementById("story-char-name").innerText = dialogue.character.toUpperCase();
    document.getElementById("story-text-content").innerText = `"${dialogue.text}"`;
    
    dialogueDiv.classList.add("active");
    if (window.gameAudio) window.gameAudio.playHint();
    
    document.getElementById("btn-story-continue").onclick = () => {
      dialogueDiv.classList.remove("active");
      if (window.gameAudio) window.gameAudio.playClick();
      onComplete();
    };
  }

  // --- GARAGE CONFIG OPTIONS ---
  const GARAGE_PAINTS = {
    paint_red: { name: "Gloss Red", color: "#ff0844", price: 0 },
    paint_orange: { name: "McLaren Orange", color: "#ff6400", price: 0 },
    paint_blue: { name: "Electric Blue", color: "#00f2fe", price: 100 },
    paint_yellow: { name: "Porsche Yellow", color: "#ffd700", price: 150 },
    paint_gold: { name: "Liquid Gold", color: "#ffd700", price: 300 },
    paint_neon: { name: "Cyber Pink", color: "#ff007f", price: 200 },
    paint_matte: { name: "Carbon Gray", color: "#3a3a4c", price: 250 }
  };

  const GARAGE_UNDERGLOWS = {
    glow_cyan: { name: "Cyber Cyan", color: "rgba(0, 242, 254, 0.7)", price: 0 },
    glow_pink: { name: "Shock Pink", color: "rgba(255, 8, 68, 0.7)", price: 100 },
    glow_green: { name: "Acid Green", color: "rgba(57, 255, 20, 0.7)", price: 150 },
    glow_gold: { name: "Amber Gold", color: "rgba(255, 215, 0, 0.7)", price: 200 },
    glow_none: { name: "Off", color: "transparent", price: 0 }
  };

  const THEME_DEFS = {
    day: { name: "Daylight Lot", price: 0 },
    night: { name: "Cyber Neon Night", price: 0 },
    rain: { name: "Cyber Rain", price: 250 },
    snow: { name: "Neon Blizzard", price: 350 }
  };

  // --- WORLD LOCATIONS CONFIG (CAROUSEL AND VISUAL THEMES) ---
  const WORLDS = [
    {
      key: "downtown",
      title: "Downtown Lot",
      icon: "🏙️",
      desc: "Daylight parking lot. Perfect to warm up your engines.",
      stats: "Easy | Target ~8 Moves | Day Theme",
      colorClass: "easy-card",
      theme: "day",
      levelStart: 1,
      preview: [
        { row: 2, col: 1, p: true }, { row: 2, col: 2, p: true },
        { row: 0, col: 3, b: true }, { row: 1, col: 3, b: true }, { row: 2, col: 3, b: true },
        { row: 4, col: 3, o: true }, { row: 4, col: 4, o: true }
      ]
    },
    {
      key: "beach",
      title: "Beach Parking",
      icon: "🏖️",
      desc: "Sunset beachfront lot. Watch out for warm asphalt glare.",
      stats: "Medium | Target ~12 Moves | Sunset Theme",
      colorClass: "medium-card",
      theme: "sunset",
      levelStart: 6,
      preview: [
        { row: 2, col: 1, p: true }, { row: 2, col: 2, p: true },
        { row: 0, col: 3, b: true }, { row: 1, col: 3, b: true }, { row: 2, col: 3, b: true },
        { row: 3, col: 3, o: true }, { row: 3, col: 4, o: true },
        { row: 4, col: 2, b: true }, { row: 5, col: 2, b: true }
      ]
    },
    {
      key: "mountain",
      title: "Mountain Resort",
      icon: "🏔️",
      desc: "Neon blizzard ski lot. Danger! Ice grid tiles active.",
      stats: "Hard | Target ~16 Moves | Blizzard Theme",
      colorClass: "hard-card",
      theme: "snow",
      levelStart: 16,
      preview: [
        { row: 2, col: 1, p: true }, { row: 2, col: 2, p: true },
        { row: 0, col: 3, b: true }, { row: 1, col: 3, b: true }, { row: 2, col: 3, b: true },
        { row: 4, col: 3, o: true }, { row: 4, col: 4, o: true },
        { row: 3, col: 2, b: true }, { row: 4, col: 2, b: true },
        { row: 0, col: 0, o: true }, { row: 0, col: 1, o: true }
      ]
    },
    {
      key: "airport",
      title: "Airport Hangar",
      icon: "✈️",
      desc: "Rainy airport hangar. Dense blocks locking exit lanes.",
      stats: "Expert | Target ~20 Moves | Cyber Rain Theme",
      colorClass: "expert-card",
      theme: "rain",
      levelStart: 31,
      preview: [
        { row: 2, col: 1, p: true }, { row: 2, col: 2, p: true },
        { row: 0, col: 3, b: true }, { row: 1, col: 3, b: true }, { row: 2, col: 3, b: true },
        { row: 3, col: 3, o: true }, { row: 3, col: 4, o: true },
        { row: 1, col: 5, b: true }, { row: 2, col: 5, b: true }, { row: 3, col: 5, b: true },
        { row: 4, col: 4, b: true }, { row: 5, col: 4, b: true }
      ]
    },
    {
      key: "shopping_mall",
      title: "Underground Mall",
      icon: "🛍️",
      desc: "Neon underground mall space. Tight coordinate bends.",
      stats: "Hard | Target ~16 Moves | Night Theme",
      colorClass: "medium-card",
      theme: "night",
      levelStart: 46,
      preview: [
        { row: 2, col: 1, p: true }, { row: 2, col: 2, p: true },
        { row: 0, col: 2, b: true }, { row: 1, col: 2, b: true },
        { row: 3, col: 3, o: true }, { row: 3, col: 4, o: true }
      ]
    },
    {
      key: "industrial_area",
      title: "Industrial Area",
      icon: "🏭",
      desc: "Factory slots. Tow Trucks blocking lanes.",
      stats: "Expert | Target ~22 Moves | Day Theme",
      colorClass: "expert-card",
      theme: "day",
      levelStart: 56,
      preview: [
        { row: 2, col: 1, p: true }, { row: 2, col: 2, p: true },
        { row: 0, col: 3, b: true }, { row: 1, col: 3, b: true }, { row: 2, col: 3, b: true }
      ]
    },
    {
      key: "neon_city",
      title: "Neon Cyber City",
      icon: "🌃",
      desc: "Cyber locked town grid. Pure impossible jam.",
      stats: "Impossible | 25+ Moves | Cyber Theme",
      colorClass: "impossible-card",
      theme: "night",
      levelStart: 66,
      preview: [
        { row: 2, col: 1, p: true }, { row: 2, col: 2, p: true },
        { row: 0, col: 3, b: true }, { row: 1, col: 3, b: true }, { row: 2, col: 3, b: true },
        { row: 3, col: 3, o: true }, { row: 3, col: 4, o: true },
        { row: 1, col: 5, b: true }, { row: 2, col: 5, b: true }, { row: 3, col: 5, b: true },
        { row: 4, col: 4, b: true }, { row: 5, col: 4, b: true },
        { row: 0, col: 0, o: true }, { row: 0, col: 1, o: true },
        { row: 4, col: 1, o: true }, { row: 4, col: 2, o: true }
      ]
    }
  ];

  // Gameplay Tips Pool
  const LOADING_TIPS = [
    "Tip: Look ahead! Some moves require backing up blocker cars first.",
    "Tip: Unlock neon underglows in the Garage to highlight your sports car!",
    "Tip: Horizontal cars slide left/right. Vertical cars slide up/down.",
    "Tip: Stuck? Hit the Hint button to find the next optimal move!",
    "Tip: Achieve Target Moves to earn a 3-star Perfect rating!",
    "Tip: Complete Daily Login check-ins to receive free Gold Coins!",
    "Tip: Watch ads in the Shop to receive 1,000 free coins instantly.",
    "Tip: Use themes like Cyber Rain to see dynamic weather and reflections!"
  ];

  // --- 25 MATHEMATICALLY SOLVABLE PUZZLE TEMPLATES (5 per difficulty) ---
  const PUZZLE_TEMPLATES = {
    easy: [
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 4, col: 3, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 1, col: 3, size: 2, orientation: "v" },
        { id: 2, row: 3, col: 4, size: 2, orientation: "v" },
        { id: 3, row: 0, col: 0, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 1, col: 3, size: 2, orientation: "v" },
        { id: 2, row: 2, col: 4, size: 2, orientation: "v" },
        { id: 3, row: 4, col: 1, size: 3, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 2, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 4, size: 3, orientation: "v" },
        { id: 2, row: 4, col: 2, size: 2, orientation: "v" },
        { id: 3, row: 5, col: 0, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 0, size: 2, orientation: "h" },
        { id: 1, row: 1, col: 2, size: 2, orientation: "v" },
        { id: 2, row: 0, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 3, col: 3, size: 3, orientation: "v" }
      ]
    ],
    medium: [
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 2, size: 2, orientation: "v" },
        { id: 4, row: 0, col: 0, size: 2, orientation: "h" },
        { id: 5, row: 1, col: 2, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 1, col: 3, size: 2, orientation: "v" },
        { id: 2, row: 1, col: 4, size: 2, orientation: "v" },
        { id: 3, row: 0, col: 2, size: 2, orientation: "h" },
        { id: 4, row: 3, col: 2, size: 2, orientation: "h" },
        { id: 5, row: 3, col: 1, size: 3, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 2, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "v" },
        { id: 3, row: 0, col: 4, size: 2, orientation: "h" },
        { id: 4, row: 5, col: 1, size: 3, orientation: "h" },
        { id: 5, row: 2, col: 0, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 2, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 4, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 1, size: 2, orientation: "v" },
        { id: 3, row: 1, col: 1, size: 2, orientation: "h" },
        { id: 4, row: 4, col: 2, size: 3, orientation: "h" },
        { id: 5, row: 0, col: 0, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 1, size: 2, orientation: "v" },
        { id: 4, row: 5, col: 3, size: 3, orientation: "h" },
        { id: 5, row: 0, col: 1, size: 2, orientation: "h" }
      ]
    ],
    hard: [
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 4, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 3, col: 2, size: 2, orientation: "v" },
        { id: 4, row: 0, col: 0, size: 2, orientation: "h" },
        { id: 5, row: 1, col: 2, size: 2, orientation: "v" },
        { id: 6, row: 1, col: 4, size: 2, orientation: "h" },
        { id: 7, row: 3, col: 5, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 4, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 1, size: 2, orientation: "h" },
        { id: 4, row: 1, col: 0, size: 2, orientation: "v" },
        { id: 5, row: 0, col: 1, size: 2, orientation: "h" },
        { id: 6, row: 4, col: 4, size: 2, orientation: "h" },
        { id: 7, row: 5, col: 4, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 2, orientation: "v" },
        { id: 2, row: 2, col: 4, size: 3, orientation: "v" },
        { id: 3, row: 5, col: 2, size: 3, orientation: "h" },
        { id: 4, row: 0, col: 0, size: 2, orientation: "h" },
        { id: 5, row: 0, col: 2, size: 2, orientation: "v" },
        { id: 6, row: 3, col: 0, size: 2, orientation: "h" },
        { id: 7, row: 4, col: 2, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 2, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 4, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "v" },
        { id: 3, row: 5, col: 1, size: 3, orientation: "h" },
        { id: 4, row: 0, col: 1, size: 2, orientation: "v" },
        { id: 5, row: 1, col: 2, size: 2, orientation: "h" },
        { id: 6, row: 3, col: 0, size: 2, orientation: "h" },
        { id: 7, row: 4, col: 2, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 2, size: 2, orientation: "v" },
        { id: 4, row: 0, col: 1, size: 2, orientation: "h" },
        { id: 5, row: 1, col: 0, size: 2, orientation: "v" },
        { id: 6, row: 5, col: 0, size: 3, orientation: "h" },
        { id: 7, row: 1, col: 5, size: 2, orientation: "v" }
      ]
    ],
    expert: [
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 1, col: 5, size: 3, orientation: "v" },
        { id: 4, row: 4, col: 4, size: 2, orientation: "v" },
        { id: 5, row: 0, col: 0, size: 2, orientation: "h" },
        { id: 6, row: 0, col: 2, size: 2, orientation: "v" },
        { id: 7, row: 4, col: 1, size: 3, orientation: "h" },
        { id: 8, row: 5, col: 4, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 4, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 1, size: 2, orientation: "h" },
        { id: 4, row: 1, col: 0, size: 2, orientation: "v" },
        { id: 5, row: 0, col: 1, size: 2, orientation: "h" },
        { id: 6, row: 5, col: 0, size: 3, orientation: "h" },
        { id: 7, row: 0, col: 2, size: 2, orientation: "v" },
        { id: 8, row: 3, col: 0, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 2, orientation: "v" },
        { id: 2, row: 2, col: 4, size: 3, orientation: "v" },
        { id: 3, row: 5, col: 2, size: 3, orientation: "h" },
        { id: 4, row: 0, col: 0, size: 2, orientation: "h" },
        { id: 5, row: 0, col: 2, size: 2, orientation: "v" },
        { id: 6, row: 3, col: 0, size: 2, orientation: "h" },
        { id: 7, row: 4, col: 0, size: 2, orientation: "v" },
        { id: 8, row: 3, col: 1, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 2, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 4, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "v" },
        { id: 3, row: 5, col: 1, size: 3, orientation: "h" },
        { id: 4, row: 0, col: 1, size: 2, orientation: "v" },
        { id: 5, row: 1, col: 2, size: 2, orientation: "h" },
        { id: 6, row: 3, col: 0, size: 2, orientation: "h" },
        { id: 7, row: 4, col: 0, size: 2, orientation: "v" },
        { id: 8, row: 4, col: 1, size: 2, orientation: "h" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 2, size: 2, orientation: "v" },
        { id: 4, row: 0, col: 1, size: 2, orientation: "h" },
        { id: 5, row: 1, col: 0, size: 2, orientation: "v" },
        { id: 6, row: 5, col: 0, size: 3, orientation: "h" },
        { id: 7, row: 1, col: 5, size: 2, orientation: "v" },
        { id: 8, row: 0, col: 4, size: 2, orientation: "h" }
      ]
    ],
    impossible: [
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 1, col: 5, size: 3, orientation: "v" },
        { id: 4, row: 4, col: 4, size: 2, orientation: "v" },
        { id: 5, row: 0, col: 0, size: 2, orientation: "h" },
        { id: 6, row: 0, col: 2, size: 2, orientation: "v" },
        { id: 7, row: 4, col: 1, size: 3, orientation: "h" },
        { id: 8, row: 5, col: 4, size: 2, orientation: "h" },
        { id: 9, row: 0, col: 4, size: 2, orientation: "h" },
        { id: 10, row: 3, col: 0, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 4, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 1, size: 2, orientation: "h" },
        { id: 4, row: 1, col: 0, size: 2, orientation: "v" },
        { id: 5, row: 0, col: 1, size: 2, orientation: "h" },
        { id: 6, row: 5, col: 0, size: 3, orientation: "h" },
        { id: 7, row: 0, col: 2, size: 2, orientation: "v" },
        { id: 8, row: 3, col: 0, size: 2, orientation: "h" },
        { id: 9, row: 1, col: 4, size: 2, orientation: "h" },
        { id: 10, row: 4, col: 1, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 2, orientation: "v" },
        { id: 2, row: 2, col: 4, size: 3, orientation: "v" },
        { id: 3, row: 5, col: 2, size: 3, orientation: "h" },
        { id: 4, row: 0, col: 0, size: 2, orientation: "h" },
        { id: 5, row: 0, col: 2, size: 2, orientation: "v" },
        { id: 6, row: 3, col: 0, size: 2, orientation: "h" },
        { id: 7, row: 4, col: 0, size: 2, orientation: "v" },
        { id: 8, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 9, row: 0, col: 4, size: 2, orientation: "h" },
        { id: 10, row: 1, col: 5, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 2, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 4, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "v" },
        { id: 3, row: 5, col: 1, size: 3, orientation: "h" },
        { id: 4, row: 0, col: 1, size: 2, orientation: "v" },
        { id: 5, row: 1, col: 2, size: 2, orientation: "h" },
        { id: 6, row: 3, col: 0, size: 2, orientation: "h" },
        { id: 7, row: 4, col: 0, size: 2, orientation: "v" },
        { id: 8, row: 4, col: 2, size: 2, orientation: "h" },
        { id: 9, row: 0, col: 2, size: 2, orientation: "h" },
        { id: 10, row: 1, col: 0, size: 2, orientation: "v" }
      ],
      [
        { id: 0, row: 2, col: 1, size: 2, orientation: "h" },
        { id: 1, row: 0, col: 3, size: 3, orientation: "v" },
        { id: 2, row: 3, col: 3, size: 2, orientation: "h" },
        { id: 3, row: 4, col: 2, size: 2, orientation: "v" },
        { id: 4, row: 0, col: 1, size: 2, orientation: "h" },
        { id: 5, row: 1, col: 0, size: 2, orientation: "v" },
        { id: 6, row: 5, col: 0, size: 3, orientation: "h" },
        { id: 7, row: 1, col: 5, size: 2, orientation: "v" },
        { id: 8, row: 0, col: 4, size: 2, orientation: "h" },
        { id: 9, row: 3, col: 1, size: 2, orientation: "h" },
        { id: 10, row: 4, col: 0, size: 2, orientation: "h" }
      ]
    ]
  };

  // --- GAME SYSTEM STATE ---
  const state = {
    playerName: "",
    currentLevel: 1,
    maxUnlockedLevel: 1,
    coins: 500,
    bestScores: {},
    unlockedVehicles: ["player_sports_1"],
    unlockedPaints: ["paint_red", "paint_orange"],
    unlockedUnderglows: ["glow_cyan", "glow_none"],
    unlockedThemes: ["day", "night"],
    equippedVehicle: "player_sports_1",
    equippedPaint: "paint_red",
    equippedUnderglow: "glow_cyan",
    equippedTheme: "night",
    
    // Sliders & settings
    musicVolume: 0.5,
    sfxVolume: 0.6,
    vibrationEnabled: true,
    
    lastClaimedDaily: null,
    claimedDailyDays: 0,
    
    // Carousel selection
    currentDiffIndex: 0,
    
    // Runtime stage variables
    vehicles: [],
    moveCount: 0,
    targetMoves: 0,
    optimalPath: [],
    undoStack: [],
    redoStack: [],
    isLevelCompleted: false,
    
    // Drag tracking parameters
    draggedVehicleId: null,
    dragStartPos: { x: 0, y: 0 },
    dragStartVal: 0,
    dragMin: 0,
    dragMax: 0,
    isDragging: false,
    hasCollidedThisDrag: false,
    lastDragPos: 0,
    lastDragTime: 0,
    dragVelocity: 0,
    
    // Home parallax luxury car
    homeCarX: -150,
    homeCarY: 0,
    
    // Particle arrays
    particles: [],
    canvas: null,
    ctx: null,
    animFrame: null,

    // --- NEW PROGRESS & ACCESSIBILITY VARIABLES ---
    xp: 0,
    rankLevel: 1,
    colorblindMode: "none",
    reduceMotion: false,
    leftHanded: false,
    uiScaling: "standard",
    timerMode: false,
    equippedWorld: "downtown",
    dailyChallenges: {
      solvedCount: 0,
      under15Solved: false,
      noHintsSolved: false,
      hardSolved: false,
      lastChallengeDate: null,
      claimed: { 0: false, 1: false, 2: false, 3: false }
    },
    achievements: {
      firstEscape: false,
      noHintsMaster: false,
      goldHoarder: false,
      worldExplorer: false,
      parkingLegend: false
    }
  };

  // Load progress profiles
  function loadProgress() {
    const saved = localStorage.getItem("car_escape_puzzle_save");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
          if (state[key] !== undefined) state[key] = data[key];
        });
        
        // Defensively sanitize and validate loaded state variables
        if (!VEHICLE_DESIGNS[state.equippedVehicle]) {
          state.equippedVehicle = "player_sports_1";
        }
        if (!GARAGE_PAINTS[state.equippedPaint]) {
          state.equippedPaint = "paint_red";
        }
        if (!GARAGE_UNDERGLOWS[state.equippedUnderglow]) {
          state.equippedUnderglow = "glow_cyan";
        }
        if (!THEME_DEFS[state.equippedTheme]) {
          state.equippedTheme = "day";
        }
        if (!state.unlockedVehicles || !Array.isArray(state.unlockedVehicles) || state.unlockedVehicles.length === 0) {
          state.unlockedVehicles = ["player_sports_1"];
        }
        if (!state.unlockedPaints || !Array.isArray(state.unlockedPaints) || state.unlockedPaints.length === 0) {
          state.unlockedPaints = ["paint_red", "paint_orange"];
        }
        if (!state.unlockedUnderglows || !Array.isArray(state.unlockedUnderglows) || state.unlockedUnderglows.length === 0) {
          state.unlockedUnderglows = ["glow_cyan", "glow_none"];
        }
        if (!state.unlockedThemes || !Array.isArray(state.unlockedThemes) || state.unlockedThemes.length === 0) {
          state.unlockedThemes = ["day", "night"];
        }
        if (typeof state.dailyChallenges !== "object" || state.dailyChallenges === null) {
          state.dailyChallenges = {
            solvedCount: 0,
            under15Solved: false,
            noHintsSolved: false,
            hardSolved: false,
            lastChallengeDate: null,
            claimed: { 0: false, 1: false, 2: false, 3: false }
          };
        }
        if (typeof state.achievements !== "object" || state.achievements === null) {
          state.achievements = {
            firstEscape: false,
            noHintsMaster: false,
            goldHoarder: false,
            worldExplorer: false,
            parkingLegend: false
          };
        }
        
        if (typeof state.maxUnlockedLevel !== "number" || isNaN(state.maxUnlockedLevel) || state.maxUnlockedLevel < 1) {
          state.maxUnlockedLevel = 1;
        }
        
        applyAccessibilitySettings();
        checkDailyChallengesReset();
      } catch (e) {
        console.error("Failed to load progress profile", e);
      }
    }
  }

  // Save progress profiles
  function saveProgress() {
    const dataToSave = {
      playerName: state.playerName,
      currentLevel: state.currentLevel,
      maxUnlockedLevel: state.maxUnlockedLevel,
      coins: state.coins,
      bestScores: state.bestScores,
      unlockedVehicles: state.unlockedVehicles,
      unlockedPaints: state.unlockedPaints,
      unlockedUnderglows: state.unlockedUnderglows,
      unlockedThemes: state.unlockedThemes,
      equippedVehicle: state.equippedVehicle,
      equippedPaint: state.equippedPaint,
      equippedUnderglow: state.equippedUnderglow,
      equippedTheme: state.equippedTheme,
      musicVolume: state.musicVolume,
      sfxVolume: state.sfxVolume,
      vibrationEnabled: state.vibrationEnabled,
      lastClaimedDaily: state.lastClaimedDaily,
      claimedDailyDays: state.claimedDailyDays,
      // Save premium attributes
      xp: state.xp,
      rankLevel: state.rankLevel,
      colorblindMode: state.colorblindMode,
      reduceMotion: state.reduceMotion,
      leftHanded: state.leftHanded,
      uiScaling: state.uiScaling,
      equippedWorld: state.equippedWorld,
      dailyChallenges: state.dailyChallenges,
      achievements: state.achievements
    };
    localStorage.setItem("car_escape_puzzle_save", JSON.stringify(dataToSave));
  }

  // --- BFS SOLVER ENGINE ---
  function copyVehicles(list) {
    return list.map(v => ({ id: v.id, row: v.row, col: v.col, size: v.size, orientation: v.orientation }));
  }

  function getStateKey(list) {
    return list.map(v => `${v.row},${v.col}`).join(";");
  }

  function buildGrid(list) {
    const grid = Array(6).fill(null).map(() => Array(6).fill(-1));
    list.forEach(v => {
      for (let i = 0; i < v.size; i++) {
        if (v.orientation === "h") {
          grid[v.row][v.col + i] = v.id;
        } else {
          grid[v.row + i][v.col] = v.id;
        }
      }
    });
    return grid;
  }

  function getValidMoves(list) {
    const grid = buildGrid(list);
    const moves = [];

    list.forEach(v => {
      if (v.orientation === "h") {
        for (let c = v.col - 1; c >= 0; c--) {
          if (grid[v.row][c] === -1) {
            moves.push({ id: v.id, row: v.row, col: c });
          } else {
            break;
          }
        }
        for (let c = v.col + v.size; c < 6; c++) {
          if (grid[v.row][c] === -1) {
            moves.push({ id: v.id, row: v.row, col: c - v.size + 1 });
          } else {
            break;
          }
        }
      } else {
        for (let r = v.row - 1; r >= 0; r--) {
          if (grid[r][v.col] === -1) {
            moves.push({ id: v.id, row: r, col: v.col });
          } else {
            break;
          }
        }
        for (let r = v.row + v.size; r < 6; r++) {
          if (grid[r][v.col] === -1) {
            moves.push({ id: v.id, row: r - v.size + 1, col: v.col });
          } else {
            break;
          }
        }
      }
    });

    return moves;
  }

  function applyMove(list, move) {
    return list.map(v => {
      if (v.id === move.id) {
        return { ...v, row: move.row, col: move.col };
      }
      return v;
    });
  }

  function solvePuzzle(startVehicles) {
    const queue = [{ list: copyVehicles(startVehicles), path: [] }];
    const visited = new Set();
    visited.add(getStateKey(startVehicles));

    let iterations = 0;
    const maxIterations = 8000;

    while (queue.length > 0) {
      iterations++;
      if (iterations > maxIterations) return null;

      const { list, path } = queue.shift();

      const player = list.find(v => v.id === 0);
      if (player.col === 4) {
        return path;
      }

      const moves = getValidMoves(list);
      for (const m of moves) {
        const nextList = applyMove(list, m);
        const key = getStateKey(nextList);
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({
            list: nextList,
            path: [...path, m]
          });
        }
      }
    }
    return null;
  }

  // --- STAGE GENERATOR ---
  function getDifficultyType(level) {
    if (level <= 5) return "easy";
    if (level <= 15) return "medium";
    if (level <= 30) return "hard";
    if (level <= 45) return "expert";
    if (level <= 55) return "medium";
    if (level <= 65) return "expert";
    return "impossible";
  }

  function getWorldFromLevel(level) {
    if (level <= 5) return WORLDS[0]; // downtown
    if (level <= 15) return WORLDS[1]; // beach
    if (level <= 30) return WORLDS[2]; // mountain
    if (level <= 45) return WORLDS[3]; // airport
    if (level <= 55) return WORLDS[4]; // shopping_mall
    if (level <= 65) return WORLDS[5]; // industrial_area
    return WORLDS[6]; // neon_city
  }

  function generateLevelLayout(levelIndex) {
    const type = getDifficultyType(levelIndex);
    const templatesList = PUZZLE_TEMPLATES[type] || PUZZLE_TEMPLATES.easy;
    
    const templateIdx = (levelIndex - 1) % templatesList.length;
    const vehicles = copyVehicles(templatesList[templateIdx]);
    
    // Random decoration configurations using seeded LCG
    let rnd = new SeededRandom(levelIndex * 9999);
    
    // Mirror vertically (50% chance)
    const shouldMirror = rnd.next() > 0.5;
    if (shouldMirror) {
      vehicles.forEach(v => {
        if (v.orientation === "h") {
          v.row = 5 - v.row;
        } else {
          v.row = 5 - v.row - v.size + 1;
        }
      });
    }

    // Set colors & types on blocker cars
    vehicles.forEach(v => {
      if (v.id === 0) {
        v.type = state.equippedVehicle;
      } else {
        if (v.size === 3) {
          v.type = rnd.choice(["suv", "mini_van", "delivery_van"]);
        } else {
          const activeW = getWorldFromLevel(levelIndex);
          // 30% chance for tow truck blocker in Industrial Area world
          if (activeW && activeW.key === "industrial_area" && rnd.next() > 0.70) {
            v.type = "tow_truck";
            v.isTowTruck = true;
          } else {
            v.type = rnd.choice(["luxury_sedan", "pickup_truck", "taxi", "police_car", "electric_vehicle", "classic_car"]);
          }
        }
        v.color = rnd.choice(["#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#6b7280", "#ec4899", "#14b8a6"]);
      }
    });

    const solution = solvePuzzle(vehicles);
    const steps = solution ? solution.length : 10;
    
    return {
      vehicles,
      targetMoves: Math.round(steps * 1.4) + 1,
      optimalPath: solution || []
    };
  }

  // --- VISUAL RENDERING ---
  function renderGameBoard() {
    const layer = document.getElementById("vehicles-layer");
    layer.innerHTML = "";
    
    const cellSize = 16.666;
    
    state.vehicles.forEach(v => {
      const container = document.createElement("div");
      // Add idle-engine-breath class for small breathing vibration
      container.className = `vehicle-container ${v.id === 0 ? "player-car pulse-glow" : ""} idle-engine-breath`;
      container.dataset.id = v.id;
      
      container.style.width = `${v.orientation === "h" ? v.size * cellSize : cellSize}%`;
      container.style.height = `${v.orientation === "v" ? v.size * cellSize : cellSize}%`;
      container.style.left = `${v.col * cellSize}%`;
      container.style.top = `${v.row * cellSize}%`;
      
      if (v.id === 0) {
        const activePaint = GARAGE_PAINTS[state.equippedPaint].color;
        const activeUnderglow = GARAGE_UNDERGLOWS[state.equippedUnderglow].color;
        container.style.setProperty("--neon-underglow", activeUnderglow);
        container.style.setProperty("--body-color", activePaint);
      } else {
        container.style.setProperty("--body-color", v.color);
      }

      const model = document.createElement("div");
      model.className = "vehicle-model";
      
      if (v.id === 0) {
        const activePaint = GARAGE_PAINTS[state.equippedPaint].color;
        const activeUnderglow = GARAGE_UNDERGLOWS[state.equippedUnderglow].color;
        model.innerHTML = VEHICLE_DESIGNS[state.equippedVehicle].svg(activePaint, activeUnderglow);
      } else {
        const designer = VEHICLE_DESIGNS[v.type];
        model.innerHTML = designer ? designer[v.orientation](v.color) : VEHICLE_DESIGNS.luxury_sedan[v.orientation](v.color);
      }
      
      container.appendChild(model);

      // Interactive Tow Truck clears on pay coins (Double click / double tap)
      if (v.isTowTruck) {
        container.style.cursor = "help";
        const towBadge = document.createElement("div");
        towBadge.className = "hint-count-badge";
        towBadge.style.background = "var(--accent-gold)";
        towBadge.style.color = "black";
        towBadge.style.border = "none";
        towBadge.style.top = "1px";
        towBadge.style.right = "1px";
        towBadge.style.fontSize = "7.5px";
        towBadge.innerText = "TOW 🪙15";
        container.appendChild(towBadge);
        
        const triggerTowAction = () => {
          if (state.coins >= 15) {
            if (confirm("Pay 15 coins to tow this blocker out of the lot?")) {
              state.coins -= 15;
              updateCoinsHUD();
              state.vehicles = state.vehicles.filter(item => item.id !== v.id);
              if (window.gameAudio) window.gameAudio.playTowTruck();
              renderGameBoard();
              saveProgress();
            }
          } else {
            alert("Not enough coins to tow this vehicle!");
          }
        };

        container.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          triggerTowAction();
        });

        let lastTap = 0;
        container.addEventListener("touchend", (e) => {
          const currentTime = new Date().getTime();
          const tapLength = currentTime - lastTap;
          if (tapLength < 300 && tapLength > 0) {
            e.stopPropagation();
            triggerTowAction();
          }
          lastTap = currentTime;
        });
      }

      layer.appendChild(container);
      
      container.addEventListener("mousedown", dragStart);
      container.addEventListener("touchstart", dragStart, { passive: false });
    });

    // Highlight the exit row tiles and position exit gate dynamically
    const playerVehicle = state.vehicles.find(v => v.id === 0);
    const exitGate = document.querySelector(".exit-gate-anchor");
    if (playerVehicle) {
      if (exitGate) {
        exitGate.style.top = `calc(12px + ${playerVehicle.row * 16.666}%)`;
        exitGate.style.height = `calc((100% - 24px) / 6)`;
      }
      const tiles = document.querySelectorAll("#game-board .grid-markings .grid-tile");
      if (tiles.length === 36) {
        tiles.forEach((tile, index) => {
          const tileRow = Math.floor(index / 6);
          if (tileRow === playerVehicle.row) {
            tile.classList.add("exit-lane-highlight");
          } else {
            tile.classList.remove("exit-lane-highlight");
          }
        });
      }
    }

    document.getElementById("gate-barrier-arm").classList.remove("open");
  }

  // --- DRAG INTERACTION PHYSICS & COLLISION ---
  function dragStart(e) {
    if (state.isLevelCompleted) return;
    e.preventDefault();
    
    if (window.gameAudio) window.gameAudio.resumeContext();

    const target = e.currentTarget;
    const vehicleId = parseInt(target.dataset.id);
    const vehicle = state.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    // Remove starting guide pulse glow on first drag interaction
    const playerCar = document.querySelector(".vehicle-container.player-car");
    if (playerCar) {
      playerCar.classList.remove("pulse-glow");
    }

    state.isDragging = true;
    state.draggedVehicleId = vehicleId;
    state.hasCollidedThisDrag = false;
    
    target.classList.add("dragging");
    document.querySelectorAll(".vehicle-container").forEach(c => c.classList.remove("selected"));
    target.classList.add("selected");

    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
    
    state.dragStartPos = { x: clientX, y: clientY };
    state.dragStartVal = vehicle.orientation === "h" ? vehicle.col : vehicle.row;
    
    state.lastDragPos = state.dragStartVal;
    state.lastDragTime = performance.now();
    state.dragVelocity = 0;

    // Bounds grid mapping
    const grid = buildGrid(state.vehicles);
    for (let s = 0; s < vehicle.size; s++) {
      if (vehicle.orientation === "h") grid[vehicle.row][vehicle.col + s] = -1;
      else grid[vehicle.row + s][vehicle.col] = -1;
    }

    if (vehicle.orientation === "h") {
      let minC = vehicle.col;
      while (minC > 0 && grid[vehicle.row][minC - 1] === -1) minC--;
      state.dragMin = minC;

      let maxC = vehicle.col;
      const pathLimit = (vehicle.id === 0) ? 6 : (6 - vehicle.size);
      while (maxC < pathLimit && (maxC + vehicle.size >= 6 || grid[vehicle.row][maxC + vehicle.size] === -1)) maxC++;
      state.dragMax = maxC;
    } else {
      let minR = vehicle.row;
      while (minR > 0 && grid[minR - 1][vehicle.col] === -1) minR--;
      state.dragMin = minR;

      let maxR = vehicle.row;
      while (maxR < (6 - vehicle.size) && grid[maxR + vehicle.size][vehicle.col] === -1) maxR++;
      state.dragMax = maxR;
    }

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("touchmove", dragMove, { passive: false });
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);
  }

  function dragMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();

    const vehicle = state.vehicles.find(v => v.id === state.draggedVehicleId);
    const containerEl = document.querySelector(`.vehicle-container[data-id="${state.draggedVehicleId}"]`);
    const modelEl = containerEl.querySelector(".vehicle-model");
    if (!vehicle || !containerEl) return;

    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

    const board = document.getElementById("game-board");
    const boardRect = board.getBoundingClientRect();
    const cellSizePx = boardRect.width / 6;

    const deltaX = clientX - state.dragStartPos.x;
    const deltaY = clientY - state.dragStartPos.y;

    const now = performance.now();
    const dT = now - state.lastDragTime;

    if (vehicle.orientation === "h") {
      const deltaCells = deltaX / cellSizePx;
      let newCol = state.dragStartVal + deltaCells;
      
      // Calculate velocity
      if (dT > 0) {
        state.dragVelocity = (newCol - state.lastDragPos) / (dT / 100);
      }

      // Play soft sliding sound synchronized with grid crossings
      const prevGrid = Math.round(state.lastDragPos);
      const nextGrid = Math.round(newCol);
      if (prevGrid !== nextGrid && Math.abs(state.dragVelocity) > 0.05) {
        if (window.gameAudio) window.gameAudio.playSlide();
      }

      state.lastDragPos = newCol;
      state.lastDragTime = now;

      // Real-time skew tilt & motion blur with shadow shifting
      const skew = Math.max(-7, Math.min(7, state.dragVelocity * 14));
      const blur = Math.max(0, Math.min(2.5, Math.abs(state.dragVelocity) * 3));
      modelEl.style.transform = `skewX(${skew}deg) scaleY(0.98)`;
      const shadowOffsetX = -skew * 0.8;
      const shadowOffsetY = 4 + Math.abs(skew) * 0.2;
      modelEl.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px 6px rgba(0,0,0,0.45)) blur(${blur}px)`;
      
      // Rotate spokes of wheels based on displacement
      const wheels = containerEl.querySelectorAll(".wheel-rect");
      wheels.forEach(w => {
        w.style.transform = `rotate(${newCol * 240}deg)`;
        w.style.transformOrigin = "center";
      });

      // Spawn dust trail
      if (Math.random() < 0.25 && Math.abs(state.dragVelocity) > 0.04) {
        const vRect = containerEl.getBoundingClientRect();
        state.particles.push(new Particle(vRect.left + vRect.width * Math.random(), vRect.top + vRect.height * Math.random(), "dust"));
      }

      // Camera follow drag
      const boardFrame = document.querySelector(".board-frame");
      if (boardFrame) {
        boardFrame.style.transition = "none";
        boardFrame.style.transform = `translate(${deltaX * 0.04}px, ${deltaY * 0.04}px)`;
      }

      // Boundary Collision check
      if (newCol <= state.dragMin || newCol >= state.dragMax) {
        if (!state.hasCollidedThisDrag) {
          triggerCollisionEffect(vehicle, newCol <= state.dragMin ? "left" : "right", containerEl);
          state.hasCollidedThisDrag = true;
        }
      } else {
        state.hasCollidedThisDrag = false;
      }

      newCol = Math.max(state.dragMin, Math.min(state.dragMax, newCol));
      containerEl.style.left = `${newCol * 16.666}%`;
      containerEl.dataset.proposedCol = newCol;
    } else {
      const deltaCells = deltaY / cellSizePx;
      let newRow = state.dragStartVal + deltaCells;
      
      if (dT > 0) {
        state.dragVelocity = (newRow - state.lastDragPos) / (dT / 100);
      }

      // Play soft sliding sound synchronized with grid crossings
      const prevGrid = Math.round(state.lastDragPos);
      const nextGrid = Math.round(newRow);
      if (prevGrid !== nextGrid && Math.abs(state.dragVelocity) > 0.05) {
        if (window.gameAudio) window.gameAudio.playSlide();
      }

      state.lastDragPos = newRow;
      state.lastDragTime = now;

      // Real-time skew tilt & motion blur with shadow shifting
      const skew = Math.max(-7, Math.min(7, state.dragVelocity * 14));
      const blur = Math.max(0, Math.min(2.5, Math.abs(state.dragVelocity) * 3));
      modelEl.style.transform = `skewY(${skew}deg) scaleX(0.98)`;
      const shadowOffsetY = -skew * 0.8;
      const shadowOffsetX = 4 + Math.abs(skew) * 0.2;
      modelEl.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px 6px rgba(0,0,0,0.45)) blur(${blur}px)`;

      const wheels = containerEl.querySelectorAll(".wheel-rect");
      wheels.forEach(w => {
        w.style.transform = `rotate(${newRow * 240}deg)`;
        w.style.transformOrigin = "center";
      });

      // Spawn dust trail
      if (Math.random() < 0.25 && Math.abs(state.dragVelocity) > 0.04) {
        const vRect = containerEl.getBoundingClientRect();
        state.particles.push(new Particle(vRect.left + vRect.width * Math.random(), vRect.top + vRect.height * Math.random(), "dust"));
      }

      // Camera follow drag
      const boardFrame = document.querySelector(".board-frame");
      if (boardFrame) {
        boardFrame.style.transition = "none";
        boardFrame.style.transform = `translate(${deltaX * 0.04}px, ${deltaY * 0.04}px)`;
      }

      if (newRow <= state.dragMin || newRow >= state.dragMax) {
        if (!state.hasCollidedThisDrag) {
          triggerCollisionEffect(vehicle, newRow <= state.dragMin ? "up" : "down", containerEl);
          state.hasCollidedThisDrag = true;
        }
      } else {
        state.hasCollidedThisDrag = false;
      }

      newRow = Math.max(state.dragMin, Math.min(state.dragMax, newRow));
      containerEl.style.top = `${newRow * 16.666}%`;
      containerEl.dataset.proposedRow = newRow;
    }
  }

  function dragEnd(e) {
    if (!state.isDragging) return;
    
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
    document.removeEventListener("touchend", dragEnd);

    state.isDragging = false;
    const vehicleId = state.draggedVehicleId;
    const vehicle = state.vehicles.find(v => v.id === vehicleId);
    const containerEl = document.querySelector(`.vehicle-container[data-id="${vehicleId}"]`);
    const modelEl = containerEl.querySelector(".vehicle-model");
    
    containerEl.classList.remove("dragging");
    
    // Reset easing transforms
    modelEl.style.transform = "";
    modelEl.style.filter = "";

    // Reset camera translate
    const boardFrame = document.querySelector(".board-frame");
    if (boardFrame) {
      boardFrame.style.transition = "";
      boardFrame.style.transform = "";
    }

    if (!vehicle || !containerEl) return;

    let finalPos = 0;
    let oldPos = 0;
    
    if (vehicle.orientation === "h") {
      const proposed = parseFloat(containerEl.dataset.proposedCol);
      finalPos = isNaN(proposed) ? vehicle.col : Math.round(proposed);
      oldPos = vehicle.col;
      
      // Ice sliding
      const activeWorld = getWorldFromLevel(state.currentLevel);
      if (activeWorld && activeWorld.key === "mountain" && vehicle.row === 3 && finalPos !== oldPos) {
        finalPos = finalPos > oldPos ? state.dragMax : state.dragMin;
      }

      finalPos = Math.max(state.dragMin, Math.min(state.dragMax, finalPos));
      
      if (vehicle.id === 0 && finalPos >= 4) {
        vehicle.col = finalPos;
        containerEl.style.left = `${finalPos * 16.666}%`;
        triggerVictoryEscape();
        return;
      }
      
      vehicle.col = finalPos;
      containerEl.style.left = `${finalPos * 16.666}%`;
    } else {
      const proposed = parseFloat(containerEl.dataset.proposedRow);
      finalPos = isNaN(proposed) ? vehicle.row : Math.round(proposed);
      oldPos = vehicle.row;
      
      // Ice sliding
      const activeWorld = getWorldFromLevel(state.currentLevel);
      if (activeWorld && activeWorld.key === "mountain" && (vehicle.row <= 3 && vehicle.row + vehicle.size > 3) && finalPos !== oldPos) {
        finalPos = finalPos > oldPos ? state.dragMax : state.dragMin;
      }

      finalPos = Math.max(state.dragMin, Math.min(state.dragMax, finalPos));
      vehicle.row = finalPos;
      containerEl.style.top = `${finalPos * 16.666}%`;
    }

    if (finalPos !== oldPos) {
      saveUndoState({ id: vehicleId, orientation: vehicle.orientation, from: oldPos, to: finalPos });
      state.moveCount++;
      updateHUD();
      
      if (window.gameAudio) window.gameAudio.playSlide();

      // Snap suspension bounce animation
      containerEl.classList.add("snap-bounce");
      setTimeout(() => containerEl.classList.remove("snap-bounce"), 220);

      // Spawn dust puff at wheels
      const vRect = containerEl.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        state.particles.push(new Particle(vRect.left + vRect.width * Math.random(), vRect.top + vRect.height * Math.random(), "dust"));
      }
    } else {
      // Small snap back animation if no move
      containerEl.classList.add("snap-bounce");
      setTimeout(() => containerEl.classList.remove("snap-bounce"), 220);
    }
    
    delete containerEl.dataset.proposedCol;
    delete containerEl.dataset.proposedRow;
  }

  // --- COLLISION LOGIC BUMPS ---
  function triggerCollisionEffect(vehicle, direction, element) {
    // 1. Synthesize thud bump audio
    if (window.gameAudio) {
      window.gameAudio.playCollision();
    }
    
    // 2. Shake element using css animation
    const shakeClass = vehicle.orientation === "h" ? "collision-shake-h" : "collision-shake-v";
    element.classList.add(shakeClass);
    setTimeout(() => element.classList.remove(shakeClass), 150);

    // Shake board frame
    const boardFrame = document.querySelector(".board-frame");
    if (boardFrame) {
      boardFrame.classList.add("camera-shake");
      setTimeout(() => boardFrame.classList.remove("camera-shake"), 350);
    }

    // Wobble wheels
    element.classList.add("wheel-wobble");
    setTimeout(() => element.classList.remove("wheel-wobble"), 300);

    // 3. Highlight/Flash outline contact point
    const model = element.querySelector(".vehicle-model");
    model.style.outline = "2px solid rgba(255,255,255,0.7)";
    setTimeout(() => model.style.outline = "", 150);

    // 4. Spawn dust particles at the contact grid boundary
    const board = document.getElementById("game-board");
    const boardRect = board.getBoundingClientRect();
    const cellSize = boardRect.width / 6;
    
    let contactX = 0;
    let contactY = 0;
    
    if (direction === "left") {
      contactX = boardRect.left + vehicle.col * cellSize;
      contactY = boardRect.top + (vehicle.row + 0.5) * cellSize;
    } else if (direction === "right") {
      contactX = boardRect.left + (vehicle.col + vehicle.size) * cellSize;
      contactY = boardRect.top + (vehicle.row + 0.5) * cellSize;
    } else if (direction === "up") {
      contactX = boardRect.left + (vehicle.col + 0.5) * cellSize;
      contactY = boardRect.top + vehicle.row * cellSize;
    } else if (direction === "down") {
      contactX = boardRect.left + (vehicle.col + 0.5) * cellSize;
      contactY = boardRect.top + (vehicle.row + vehicle.size) * cellSize;
    }

    // Push dust particles and flash highlight
    for (let i = 0; i < 8; i++) {
      state.particles.push(new Particle(contactX, contactY, "dust"));
    }
    state.particles.push(new Particle(contactX, contactY, "flash"));
  }

  // --- UNDO / REDO MANAGEMENTS ---
  function saveUndoState(move) {
    state.undoStack.push(move);
    state.redoStack = [];
  }

  function applyUndo() {
    if (state.undoStack.length === 0 || state.isLevelCompleted) return;
    
    const move = state.undoStack.pop();
    const vehicle = state.vehicles.find(v => v.id === move.id);
    if (!vehicle) return;
    
    state.redoStack.push(move);
    
    const element = document.querySelector(`.vehicle-container[data-id="${move.id}"]`);
    if (move.orientation === "h") {
      vehicle.col = move.from;
      if (element) element.style.left = `${move.from * 16.666}%`;
    } else {
      vehicle.row = move.from;
      if (element) element.style.top = `${move.from * 16.666}%`;
    }
    
    state.moveCount--;
    updateHUD();
    if (window.gameAudio) window.gameAudio.playSlide();
  }

  function applyRedo() {
    if (state.redoStack.length === 0 || state.isLevelCompleted) return;
    
    const move = state.redoStack.pop();
    const vehicle = state.vehicles.find(v => v.id === move.id);
    if (!vehicle) return;
    
    state.undoStack.push(move);
    
    const element = document.querySelector(`.vehicle-container[data-id="${move.id}"]`);
    if (move.orientation === "h") {
      vehicle.col = move.to;
      if (element) element.style.left = `${move.to * 16.666}%`;
    } else {
      vehicle.row = move.to;
      if (element) element.style.top = `${move.to * 16.666}%`;
    }
    
    state.moveCount++;
    updateHUD();
    if (window.gameAudio) window.gameAudio.playSlide();
  }

  // --- VICTORY CELEBRATION FLOW ---
  function triggerVictoryEscape() {
    state.isLevelCompleted = true;
    
    const playerEl = document.querySelector(`.vehicle-container[data-id="0"]`);
    const barrierEl = document.getElementById("gate-barrier-arm");
    const boardEl = document.querySelector(".board-frame");

    if (boardEl) {
      boardEl.classList.add("camera-zoom");
    }
    barrierEl.classList.add("open");
    playerEl.classList.add("exit-flash");
    
    if (window.gameAudio) {
      window.gameAudio.playEngineStart();
    }
    
    spawnSmokeParticles();

    setTimeout(() => {
      boardEl.classList.add("camera-shake");
      setTimeout(() => boardEl.classList.remove("camera-shake"), 400);

      playerEl.style.left = "130%"; // drive out off board
      
      // Confetti and spark splash
      spawnConfettiParticles();
      spawnSparkParticles();

      // Spawn flying coin particles on canvas
      setTimeout(() => {
        spawnFlyingCoins();
      }, 300);

      setTimeout(() => {
        if (window.gameAudio) {
          window.gameAudio.playEngineStop();
          window.gameAudio.playVictory();
        }
        showVictoryScreen();
      }, 1200);

    }, 600);
  }

  function showVictoryScreen() {
    const modal = document.getElementById("modal-victory");
    
    let stars = 1;
    if (state.moveCount <= state.targetMoves) stars = 3;
    else if (state.moveCount <= state.targetMoves + 4) stars = 2;
    
    const starBox = document.getElementById("victory-stars-box");
    starBox.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const star = document.createElement("span");
      star.innerText = "⭐";
      if (i >= stars) star.style.opacity = "0.15";
      starBox.appendChild(star);
    }
    
    document.getElementById("victory-moves").innerText = state.moveCount;
    
    const bestKey = `level_${state.currentLevel}`;
    const previousBest = state.bestScores[bestKey] || 999;
    if (state.moveCount < previousBest) {
      state.bestScores[bestKey] = state.moveCount;
    }
    document.getElementById("victory-best").innerText = state.bestScores[bestKey];

    let coinReward = 30;
    if (stars === 3) coinReward += 20;
    
    document.getElementById("victory-coins").innerText = `+${coinReward} Coins`;
    
    state.coins += coinReward;
    updateCoinsHUD();

    // --- ACCUMULATE XP AND RANKS ---
    const oldXp = state.xp;
    const earnedXp = 100;
    state.xp += earnedXp;
    
    let leveledUp = false;
    if (state.xp >= 500) {
      state.xp -= 500;
      state.rankLevel++;
      leveledUp = true;
    }
    
    document.getElementById("victory-xp-text").innerText = `+${earnedXp} XP ${leveledUp ? "(LEVEL UP!)" : ""}`;
    const xpFill = document.getElementById("victory-xp-fill");
    const startPercent = (oldXp / 500) * 100;
    xpFill.style.width = `${startPercent}%`;
    
    setTimeout(() => {
      if (leveledUp) {
        xpFill.style.transition = "width 0.4s ease-out";
        xpFill.style.width = "100%";
        setTimeout(() => {
          xpFill.style.transition = "none";
          xpFill.style.width = "0%";
          xpFill.offsetHeight; // reflow
          xpFill.style.transition = "width 0.4s ease-out";
          xpFill.style.width = `${(state.xp / 500) * 100}%`;
        }, 450);
      } else {
        xpFill.style.transition = "width 0.6s ease-out";
        xpFill.style.width = `${(state.xp / 500) * 100}%`;
      }
    }, 150);

    // --- PERFECT ESCAPE BADGE ---
    const perfectBadge = document.getElementById("victory-perfect-badge");
    if (state.moveCount <= state.targetMoves) {
      perfectBadge.style.opacity = "1";
      perfectBadge.style.transform = "scale(1)";
      perfectBadge.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s";
    } else {
      perfectBadge.style.opacity = "0";
      perfectBadge.style.transform = "scale(0.5)";
      perfectBadge.style.transition = "none";
    }

    // --- NEXT STAGE MINI PREVIEW ---
    const nextLvlIndex = state.currentLevel + 1;
    if (nextLvlIndex > state.maxUnlockedLevel) {
      state.maxUnlockedLevel = nextLvlIndex;
    }
    const nextLayout = generateLevelLayout(nextLvlIndex);
    const nextVehicles = nextLayout.vehicles;
    
    const previewGrid = Array(6).fill(null).map(() => Array(6).fill(-1));
    nextVehicles.forEach(v => {
      for (let i = 0; i < v.size; i++) {
        if (v.orientation === "h") {
          previewGrid[v.row][v.col + i] = v.id;
        } else {
          previewGrid[v.row + i][v.col] = v.id;
        }
      }
    });
    
    let previewHtml = "";
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const val = previewGrid[r][c];
        let cellClass = "mini-tile";
        if (val === 0) {
          cellClass += " p-car";
        } else if (val > 0) {
          const v = nextVehicles.find(item => item.id === val);
          if (v && v.size === 3) {
            cellClass += " o-car";
          } else {
            cellClass += " b-car";
          }
        }
        previewHtml += `<div class="${cellClass}"></div>`;
      }
    }
    document.getElementById("victory-next-preview").innerHTML = previewHtml;

    // --- DAILY CHALLENGES & ACHIEVEMENTS PROGRESS ---
    checkDailyChallengesReset();
    state.dailyChallenges.solvedCount++;
    
    if (state.moveCount < 15) {
      state.dailyChallenges.under15Solved = true;
    }
    
    if (!state.hintUsedThisLevel) {
      state.dailyChallenges.noHintsSolved = true;
      state.achievements.noHintsMaster = true;
    }
    
    const diffType = getDifficultyType(state.currentLevel);
    if (diffType === "hard" || diffType === "expert" || diffType === "impossible") {
      state.dailyChallenges.hardSolved = true;
    }
    
    checkAchievements();
    syncPlayerNameHUD();
    saveProgress();

    document.getElementById("btn-victory-double").onclick = () => {
      document.getElementById("btn-victory-double").disabled = true;
      document.getElementById("btn-victory-double").innerText = "🎥 Claiming...";
      
      setTimeout(() => {
        state.coins += coinReward;
        updateCoinsHUD();
        saveProgress();
        
        document.getElementById("btn-victory-double").innerText = "✓ Claimed!";
        if (window.gameAudio) window.gameAudio.playClick();
      }, 1000);
    };

    modal.classList.add("active");
  }

  // --- HINT SYSTEM ---
  function showHint() {
    if (state.isLevelCompleted) return;

    const solution = solvePuzzle(state.vehicles);
    if (!solution || solution.length === 0) {
      alert("No solution possible! Try resetting the stage.");
      return;
    }

    state.hintUsedThisLevel = true;

    if (state.coins >= 50) {
      state.coins -= 50;
      updateCoinsHUD();
      saveProgress();
    } else {
      alert("Watching ad for a free Hint...");
    }

    if (window.gameAudio) window.gameAudio.playHint();

    const nextMove = solution[0];
    const targetCar = document.querySelector(`.vehicle-container[data-id="${nextMove.id}"]`);
    if (!targetCar) return;

    targetCar.classList.add("selected");
    targetCar.style.outline = "3px solid #ffd700";
    targetCar.style.boxShadow = "0 0 25px #ffd700";
    
    setTimeout(() => {
      targetCar.style.outline = "";
      targetCar.style.boxShadow = "";
    }, 2000);
  }

  // --- PARTICLE PHYSICS SYSTEM (CANVAS OVERLAY) ---
  class Particle {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type; // 'rain', 'snow', 'light', 'confetti', 'smoke', 'dust', 'coin'
      this.vx = 0;
      this.vy = 0;
      this.alpha = 1;
      this.size = 2;
      this.color = "#fff";
      this.rotation = 0;
      this.vRot = 0;
      
      this.init();
    }
    
    init() {
      if (this.type === "rain") {
        this.vy = 8 + Math.random() * 6;
        this.vx = -1.5 - Math.random() * 2;
        this.size = 1 + Math.random() * 2;
        this.alpha = 0.4 + Math.random() * 0.3;
        this.color = "rgba(156, 163, 175, " + this.alpha + ")";
      } else if (this.type === "snow") {
        this.vy = 1 + Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.size = 2 + Math.random() * 3;
        this.alpha = 0.5 + Math.random() * 0.4;
        this.color = "rgba(240, 246, 252, " + this.alpha + ")";
        this.wobble = Math.random() * 100;
      } else if (this.type === "light") {
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -0.3 - Math.random() * 0.5;
        this.size = 5 + Math.random() * 15;
        this.alpha = 0.1 + Math.random() * 0.25;
        this.color = Math.random() > 0.5 ? `rgba(0, 242, 254, ${this.alpha})` : `rgba(255, 8, 68, ${this.alpha})`;
      } else if (this.type === "confetti") {
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = -5 - Math.random() * 10;
        this.size = 6 + Math.random() * 6;
        this.rotation = Math.random() * 360;
        this.vRot = (Math.random() - 0.5) * 8;
        this.color = ["#ff0844", "#00f2fe", "#ffd700", "#39ff14", "#ff6400", "#a855f7"][Math.floor(Math.random() * 6)];
      } else if (this.type === "smoke") {
        this.vx = -3 - Math.random() * 3;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = 8 + Math.random() * 10;
        this.alpha = 0.5;
        this.color = `rgba(220, 220, 230, ${this.alpha})`;
      } else if (this.type === "dust") {
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = 2 + Math.random() * 3;
        this.alpha = 0.6;
        this.color = "rgba(200, 200, 200, 0.4)";
      } else if (this.type === "coin") {
        // Accelerates towards top-right coin HUD counter: ~ x = window.innerWidth - 60, y = 35
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = -3 - Math.random() * 7;
        this.size = 8 + Math.random() * 4;
        this.alpha = 1;
        this.color = "#ffd700";
      } else if (this.type === "flash") {
        this.size = 6;
        this.alpha = 1;
        this.color = "rgba(255, 255, 255, 0.9)";
      } else if (this.type === "spark") {
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = -4 - Math.random() * 8;
        this.size = 3 + Math.random() * 3;
        this.alpha = 1;
        this.color = Math.random() > 0.5 ? "#00f2fe" : "#ffd700";
      }
    }
    
    update() {
      if (this.type === "coin") {
        const targetX = window.innerWidth - 65;
        const targetY = 35;
        
        // Attraction vector
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 18) {
          this.alpha = 0; // Reach target!
          if (window.gameAudio) window.gameAudio.playCoinCollect();
          return;
        }
        
        // Accelerate towards target
        const force = 0.5;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
        
        // Speed cap
        const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        if (speed > 16) {
          this.vx = (this.vx / speed) * 16;
          this.vy = (this.vy / speed) * 16;
        }
        
        this.x += this.vx;
        this.y += this.vy;
      } else {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.type === "rain") {
          if (this.y > window.innerHeight) {
            this.y = -10;
            this.x = Math.random() * window.innerWidth;
          }
        } else if (this.type === "snow") {
          this.wobble += 0.02;
          this.x += Math.sin(this.wobble) * 0.5;
          if (this.y > window.innerHeight) {
            this.y = -10;
            this.x = Math.random() * window.innerWidth;
          }
        } else if (this.type === "light") {
          this.alpha -= 0.001;
          if (this.alpha <= 0 || this.y < -20) {
            this.y = window.innerHeight + 10;
            this.x = Math.random() * window.innerWidth;
            this.alpha = 0.1 + Math.random() * 0.25;
          }
        } else if (this.type === "confetti") {
          this.vy += 0.35;
          this.rotation += this.vRot;
          this.alpha -= 0.01;
        } else if (this.type === "smoke") {
          this.size += 0.3;
          this.alpha -= 0.015;
        } else if (this.type === "dust") {
          this.vx *= 0.95;
          this.vy *= 0.95;
          this.alpha -= 0.03;
        } else if (this.type === "flash") {
          this.size += 2.5;
          this.alpha -= 0.1;
        } else if (this.type === "spark") {
          this.vy += 0.22;
          this.size *= 0.95;
          this.alpha -= 0.025;
        }
      }
    }
    
    draw(ctx) {
      ctx.save();
      if (this.type === "rain") {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vx * 1.5, this.y + this.vy * 1.5);
        ctx.stroke();
      } else if (this.type === "snow" || this.type === "light" || this.type === "smoke" || this.type === "dust") {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (this.type === "light") {
          const rad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          const cleanCol = this.color.substring(0, this.color.lastIndexOf(",")) + `, ${this.alpha})`;
          rad.addColorStop(0, cleanCol);
          rad.addColorStop(1, "transparent");
          ctx.fillStyle = rad;
        } else if (this.type === "smoke") {
          ctx.fillStyle = `rgba(220, 220, 230, ${this.alpha})`;
        } else if (this.type === "dust") {
          ctx.fillStyle = `rgba(220, 220, 220, ${this.alpha})`;
        }
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "confetti") {
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      } else if (this.type === "coin") {
        // Gold glowing flying coins
        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#b59800";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size - 3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.type === "flash") {
        ctx.globalAlpha = Math.max(0, this.alpha);
        const rad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        rad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        rad.addColorStop(0.3, "rgba(255, 255, 220, 0.8)");
        rad.addColorStop(1, "transparent");
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "spark") {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }
  }

  function initParticlesCanvas() {
    state.canvas = document.getElementById("effects-canvas");
    state.ctx = state.canvas.getContext("2d");
    
    const resize = () => {
      state.canvas.width = window.innerWidth;
      state.canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    
    state.particles = [];
    for (let i = 0; i < 40; i++) {
      state.particles.push(new Particle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, "light"));
    }
    
    // Parallax background car driving
    state.homeCarX = -180;
    
    const render = () => {
      state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
      
      // 1. Update parallax home screen background car (only visible on splash screen)
      const splashScreen = document.getElementById("screen-splash");
      if (splashScreen && splashScreen.classList.contains("active")) {
        state.homeCarX += 0.8;
        if (state.homeCarX > window.innerWidth + 200) {
          state.homeCarX = -200;
        }
        drawParallaxHomeCar(state.ctx, state.homeCarX);
      }

      // 2. Update particles
      state.particles.forEach((p, index) => {
        p.update();
        p.draw(state.ctx);
        
        if ((p.type === "confetti" || p.type === "smoke" || p.type === "dust" || p.type === "coin" || p.type === "flash" || p.type === "spark") && p.alpha <= 0) {
          state.particles.splice(index, 1);
        }
      });
      
      state.animFrame = requestAnimationFrame(render);
    };
    render();
  }

  function drawParallaxHomeCar(ctx, x) {
    ctx.save();
    const y = window.innerHeight * 0.83;
    
    // 1. Headlight beam projection cone (shining forward)
    ctx.fillStyle = ctx.createLinearGradient(x + 150, y + 10, x + 280, y + 15);
    ctx.fillStyle.addColorStop(0, "rgba(0, 242, 254, 0.35)");
    ctx.fillStyle.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.moveTo(x + 145, y + 15);
    ctx.lineTo(x + 280, y - 10);
    ctx.lineTo(x + 280, y + 35);
    ctx.closePath();
    ctx.fill();
    
    // 2. Underglow shadow
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(x + 75, y + 22, 85, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Neon underglow bloom
    const glowGrad = ctx.createRadialGradient(x + 75, y + 20, 0, x + 75, y + 20, 50);
    glowGrad.addColorStop(0, "rgba(255, 8, 68, 0.75)");
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.ellipse(x + 75, y + 22, 65, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 3. Detailed sports car body
    ctx.fillStyle = "#1e1b4b"; // Deep midnight paint
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x + 15, y + 8);
    ctx.quadraticCurveTo(x + 55, y - 8, x + 85, y - 8); // Cabin roof
    ctx.lineTo(x + 120, y + 3);
    ctx.lineTo(x + 150, y + 12); // Front hood
    ctx.lineTo(x + 152, y + 18);
    ctx.lineTo(x + 130, y + 21);
    ctx.lineTo(x + 20, y + 21);
    ctx.closePath();
    ctx.fill();
    
    // Highlights & trim lines
    ctx.strokeStyle = "rgba(255, 8, 68, 0.8)"; // Hot pink accent lines
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 20);
    ctx.lineTo(x + 130, y + 20);
    ctx.stroke();
    
    ctx.strokeStyle = "rgba(0, 242, 254, 0.85)"; // Neon cyan details
    ctx.beginPath();
    ctx.moveTo(x + 15, y + 8);
    ctx.lineTo(x + 40, y + 8);
    ctx.stroke();
    
    // Windshield glass
    ctx.fillStyle = "rgba(0, 242, 254, 0.35)";
    ctx.beginPath();
    ctx.moveTo(x + 50, y - 4);
    ctx.lineTo(x + 75, y - 4);
    ctx.lineTo(x + 95, y + 3);
    ctx.lineTo(x + 65, y + 3);
    ctx.closePath();
    ctx.fill();
    
    // 4. Rotating Wheels
    const drawWheel = (wX, wY) => {
      ctx.save();
      ctx.translate(wX, wY);
      // Spin angle proportional to travel distance x
      const angle = (x / 14) % (Math.PI * 2);
      ctx.rotate(angle);
      
      // Tire outer ring
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Rim spokes
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(0, 9);
        ctx.stroke();
        ctx.rotate(Math.PI / 4);
      }
      ctx.restore();
    };
    
    drawWheel(x + 35, y + 19);
    drawWheel(x + 115, y + 19);
    
    ctx.restore();
  }

  function setWeatherTheme(theme) {
    state.particles = state.particles.filter(p => p.type === "light");
    
    if (theme === "rain") {
      for (let i = 0; i < 75; i++) {
        state.particles.push(new Particle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, "rain"));
      }
    } else if (theme === "snow") {
      for (let i = 0; i < 45; i++) {
        state.particles.push(new Particle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, "snow"));
      }
    }
    
    const container = document.getElementById("app-container");
    container.setAttribute("data-theme", theme);
  }

  function spawnSmokeParticles() {
    const board = document.getElementById("game-board");
    const boardRect = board.getBoundingClientRect();
    const startX = boardRect.left + boardRect.width * (0.28);
    const startY = boardRect.top + boardRect.height * (0.42);

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        state.particles.push(new Particle(startX, startY, "smoke"));
      }, i * 25);
    }
  }

  function spawnConfettiParticles() {
    for (let i = 0; i < 140; i++) {
      state.particles.push(new Particle(
        window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8,
        window.innerHeight * 0.35 + Math.random() * window.innerHeight * 0.1,
        "confetti"
      ));
    }
  }

  function spawnSparkParticles() {
    const board = document.getElementById("game-board");
    if (!board) return;
    const boardRect = board.getBoundingClientRect();
    const exitX = boardRect.left + boardRect.width;
    const exitY = boardRect.top + boardRect.height * 0.42;

    for (let i = 0; i < 50; i++) {
      state.particles.push(new Particle(exitX, exitY, "spark"));
    }
  }

  function spawnFlyingCoins() {
    const board = document.getElementById("game-board");
    const boardRect = board.getBoundingClientRect();
    const centerX = boardRect.left + boardRect.width / 2;
    const centerY = boardRect.top + boardRect.height / 2;

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        state.particles.push(new Particle(centerX, centerY, "coin"));
      }, i * 80);
    }
  }

  // --- DIFFICULTY CAROUSEL SYSTEM ---
  function initDifficultyCarousel() {
    const track = document.getElementById("difficulty-track");
    track.innerHTML = "";
    
    WORLDS.forEach((d, idx) => {
      const card = document.createElement("div");
      const isWorldLocked = d.levelStart > state.maxUnlockedLevel;
      
      card.className = `difficulty-card ${d.colorClass} ${idx === state.currentDiffIndex ? "active" : ""} ${isWorldLocked ? "locked" : ""}`;
      
      // Render mini 6x6 pixel grid preview cells
      let previewGridHtml = "";
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          // Check preview layout matches
          const match = d.preview.find(item => item.row === r && item.col === c);
          let cellClass = "mini-tile";
          if (match) {
            if (match.p) cellClass += " p-car";
            else if (match.b) cellClass += " b-car";
            else if (match.o) cellClass += " o-car";
          }
          previewGridHtml += `<div class="${cellClass}"></div>`;
        }
      }

      let lockOverlay = "";
      if (isWorldLocked) {
        lockOverlay = `<div class="world-lock-overlay"><span class="lock-icon">🔒</span></div>`;
      }

      card.innerHTML = `
        ${lockOverlay}
        <div class="card-details">
          <div class="card-header-row">
            <span class="card-icon anim-icon-${d.key}">${d.icon}</span>
            <span class="card-title">${d.title}</span>
          </div>
          <p class="card-desc">${d.desc}</p>
          <span class="card-stats">${d.stats}</span>
        </div>
        <div class="mini-board-preview">${previewGridHtml}</div>
      `;
      
      if (isWorldLocked) {
        card.onclick = (e) => {
          e.stopPropagation();
          showLockedPopup(d.levelStart, d.title);
        };
      }
      
      track.appendChild(card);
    });
    
    updateCarouselView(false);

    // Prev/Next Nav triggers
    document.getElementById("btn-prev-diff").onclick = () => {
      if (state.currentDiffIndex > 0) {
        state.currentDiffIndex--;
        updateCarouselView(true);
      }
    };

    document.getElementById("btn-next-diff").onclick = () => {
      if (state.currentDiffIndex < WORLDS.length - 1) {
        state.currentDiffIndex++;
        updateCarouselView(true);
      }
    };

    // Viewport swipe touch support
    const viewport = document.querySelector(".difficulty-carousel-viewport");
    let touchStartX = 0;
    
    viewport.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX > 45 && state.currentDiffIndex > 0) {
        state.currentDiffIndex--;
        updateCarouselView(true);
      } else if (deltaX < -45 && state.currentDiffIndex < WORLDS.length - 1) {
        state.currentDiffIndex++;
        updateCarouselView(true);
      }
    }, { passive: true });
  }

  function updateCarouselView(triggerEffects = true) {
    const track = document.getElementById("difficulty-track");
    const cards = track.querySelectorAll(".difficulty-card");
    
    cards.forEach((c, idx) => {
      c.classList.toggle("active", idx === state.currentDiffIndex);
    });
    
    // Slide transition
    track.style.transform = `translateX(${-state.currentDiffIndex * 100}%)`;

    // Visual updates and audio clicks
    if (triggerEffects) {
      if (window.gameAudio) {
        window.gameAudio.playClick();
        window.gameAudio.triggerHaptic(15);
      }
      
      // Update showcase model to reflect theme selections
      const showPlatform = document.querySelector(".showcase-platform");
      const diffColors = ["#39ff14", "#ffd700", "#ff6400", "#ff0844", "#e11d48", "#f59e0b", "#a855f7"];
      showPlatform.style.borderColor = diffColors[state.currentDiffIndex];
      showPlatform.style.boxShadow = `0 0 25px ${diffColors[state.currentDiffIndex]}`;
      
      const showcaseModel = document.getElementById("showcase-car-model");
      if (showcaseModel) {
        const activeCar = VEHICLE_DESIGNS[state.equippedVehicle];
        const activePaint = GARAGE_PAINTS[state.equippedPaint].color;
        showcaseModel.innerHTML = activeCar.svg(activePaint, diffColors[state.currentDiffIndex]);
      }
    }
  }

  // --- LOADING SCREEN SYSTEM ---
  function showLoadingScreen(onComplete) {
    navigateToScreen("screen-loading");
    
    // Prefill random tip
    const randomTip = LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];
    document.getElementById("loading-tip-text").innerText = randomTip;
    
    const bar = document.getElementById("loading-bar-fill");
    const carSprite = document.getElementById("loading-car-sprite");
    
    bar.style.width = "0%";
    
    if (carSprite) {
      const activeCar = VEHICLE_DESIGNS[state.equippedVehicle];
      const activePaint = GARAGE_PAINTS[state.equippedPaint].color;
      const activeUnderglow = GARAGE_UNDERGLOWS[state.equippedUnderglow].color;
      carSprite.innerHTML = activeCar.svg(activePaint, activeUnderglow);
      carSprite.style.width = "54px";
      carSprite.style.height = "27px";
      carSprite.style.left = "0%";
    }
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 250);
      }
      bar.style.width = `${progress}%`;
      if (carSprite) {
        carSprite.style.left = `${progress}%`;
      }
    }, 60);
  }

  // --- GARAGE CUSTOMIZER WIRING ---
  function populateGarageOptions() {
    const carList = document.getElementById("garage-car-list");
    carList.innerHTML = "";
    
    Object.keys(VEHICLE_DESIGNS).forEach(key => {
      if (!key.startsWith("player_sports_")) return;
      
      const details = VEHICLE_DESIGNS[key];
      const card = document.createElement("div");
      const isUnlocked = state.unlockedVehicles.includes(key);
      const isActive = state.equippedVehicle === key;
      
      card.className = `garage-item-card ${isUnlocked ? "" : "locked"} ${isActive ? "active" : ""}`;
      
      let purchaseButtonHtml = "";
      if (!isUnlocked) {
        const prices = { player_sports_2: 200, player_sports_3: 500, player_sports_4: 1000 };
        purchaseButtonHtml = `<span class="price">🪙 ${prices[key]}</span>`;
      } else {
        purchaseButtonHtml = isActive ? `<span class="equipped-text">EQUIPPED</span>` : `<span class="price" style="background:#4b5563;color:#fff">EQUIP</span>`;
      }

      card.innerHTML = `
        <div class="car-icon-box">${details.svg(details.baseColor, "rgba(0,242,254,0.3)")}</div>
        <span class="name">${details.name}</span>
        ${purchaseButtonHtml}
      `;
      
      card.onclick = () => {
        if (isUnlocked) {
          state.equippedVehicle = key;
          populateGarageOptions();
          updateGaragePreview();
          renderGameBoard();
          saveProgress();
          if (window.gameAudio) window.gameAudio.playClick();
        } else {
          const prices = { player_sports_2: 200, player_sports_3: 500, player_sports_4: 1000 };
          const price = prices[key];
          if (state.coins >= price) {
            state.coins -= price;
            state.unlockedVehicles.push(key);
            state.equippedVehicle = key;
            updateCoinsHUD();
            populateGarageOptions();
            updateGaragePreview();
            renderGameBoard();
            saveProgress();
            if (window.gameAudio) window.gameAudio.playClick();
          } else {
            alert("Not enough coins!");
          }
        }
      };
      carList.appendChild(card);
    });

    const paintList = document.getElementById("garage-paint-list");
    paintList.innerHTML = "";
    
    Object.keys(GARAGE_PAINTS).forEach(key => {
      const details = GARAGE_PAINTS[key];
      const isUnlocked = state.unlockedPaints.includes(key);
      const isActive = state.equippedPaint === key;
      const card = document.createElement("div");
      
      card.className = `paint-card ${isActive ? "active" : ""}`;
      card.style.background = details.color;
      
      let tagHtml = "";
      if (!isUnlocked) {
        tagHtml = `<span class="color-name">🪙 ${details.price}</span>`;
      } else {
        tagHtml = isActive ? `<span class="color-name">ACTIVE</span>` : `<span class="color-name">${details.name}</span>`;
      }
      
      card.innerHTML = tagHtml;
      
      card.onclick = () => {
        if (isUnlocked) {
          state.equippedPaint = key;
          populateGarageOptions();
          updateGaragePreview();
          renderGameBoard();
          saveProgress();
          if (window.gameAudio) window.gameAudio.playClick();
        } else {
          if (state.coins >= details.price) {
            state.coins -= details.price;
            state.unlockedPaints.push(key);
            state.equippedPaint = key;
            updateCoinsHUD();
            populateGarageOptions();
            updateGaragePreview();
            renderGameBoard();
            saveProgress();
            if (window.gameAudio) window.gameAudio.playClick();
          } else {
            alert("Not enough coins!");
          }
        }
      };
      
      paintList.appendChild(card);
    });

    const glowList = document.getElementById("garage-underglow-list");
    glowList.innerHTML = "";
    
    Object.keys(GARAGE_UNDERGLOWS).forEach(key => {
      const details = GARAGE_UNDERGLOWS[key];
      const isUnlocked = state.unlockedUnderglows.includes(key);
      const isActive = state.equippedUnderglow === key;
      const card = document.createElement("div");
      
      card.className = `paint-card ${isActive ? "active" : ""}`;
      card.style.background = key === "glow_none" ? "rgba(255,255,255,0.05)" : details.color;
      if (key !== "glow_none") {
        card.style.boxShadow = `inset 0 0 10px ${details.color}, 0 0 10px ${details.color}`;
      }
      
      let tagHtml = "";
      if (!isUnlocked) {
        tagHtml = `<span class="color-name">🪙 ${details.price}</span>`;
      } else {
        tagHtml = isActive ? `<span class="color-name">ACTIVE</span>` : `<span class="color-name">${details.name}</span>`;
      }
      
      card.innerHTML = tagHtml;
      
      card.onclick = () => {
        if (isUnlocked) {
          state.equippedUnderglow = key;
          populateGarageOptions();
          updateGaragePreview();
          renderGameBoard();
          saveProgress();
          if (window.gameAudio) window.gameAudio.playClick();
        } else {
          if (state.coins >= details.price) {
            state.coins -= details.price;
            state.unlockedUnderglows.push(key);
            state.equippedUnderglow = key;
            updateCoinsHUD();
            populateGarageOptions();
            updateGaragePreview();
            renderGameBoard();
            saveProgress();
            if (window.gameAudio) window.gameAudio.playClick();
          } else {
            alert("Not enough coins!");
          }
        }
      };
      
      glowList.appendChild(card);
    });
  }

  function updateGaragePreview() {
    const previewBox = document.getElementById("garage-car-preview");
    const previewUnderglow = document.getElementById("garage-preview-underglow");
    
    const activeCar = VEHICLE_DESIGNS[state.equippedVehicle];
    const activePaint = GARAGE_PAINTS[state.equippedPaint].color;
    const activeUnderglow = GARAGE_UNDERGLOWS[state.equippedUnderglow].color;
    
    previewBox.innerHTML = activeCar.svg(activePaint, activeUnderglow);
    previewUnderglow.style.background = activeUnderglow;
    
    document.getElementById("preview-car-name").innerText = activeCar.name;
    document.getElementById("preview-car-class").innerText = activeCar.class;

    // Update splash showcase car model
    const showcaseModel = document.getElementById("showcase-car-model");
    if (showcaseModel) {
      const diffColors = ["#39ff14", "#ffd700", "#ff6400", "#ff0844", "#e11d48", "#f59e0b", "#a855f7"];
      const currentGlow = diffColors[state.currentDiffIndex] || "rgba(0, 242, 254, 0.4)";
      showcaseModel.innerHTML = activeCar.svg(activePaint, currentGlow);
    }
  }

  // --- THEME SHOP ---
  function populateShopThemes() {
    const list = document.getElementById("shop-themes-list");
    list.innerHTML = "";
    
    Object.keys(THEME_DEFS).forEach(key => {
      const details = THEME_DEFS[key];
      const isUnlocked = state.unlockedThemes.includes(key);
      const isActive = state.equippedTheme === key;
      const card = document.createElement("div");
      
      card.className = `theme-card ${isActive ? "active" : ""}`;
      
      let previewBg = "#111";
      if (key === "day") previewBg = "linear-gradient(to bottom, #7dd3fc, #cbd5e1)";
      if (key === "night") previewBg = "linear-gradient(to bottom, #0f172a, #1e1b4b)";
      if (key === "rain") previewBg = "linear-gradient(to bottom, #0f1c2d, #020617)";
      if (key === "snow") previewBg = "linear-gradient(to bottom, #1c3044, #0f172a)";

      let actionHtml = "";
      if (!isUnlocked) {
        actionHtml = `<span class="theme-price">🪙 ${details.price}</span>`;
      } else {
        actionHtml = isActive ? `<span class="theme-price" style="background:#10b981;color:#fff">ACTIVE</span>` : `<span class="theme-price" style="background:#4b5563;color:#fff">EQUIP</span>`;
      }

      card.innerHTML = `
        <div class="theme-preview" style="background:${previewBg}"></div>
        <span class="theme-name">${details.name}</span>
        ${actionHtml}
      `;
      
      card.onclick = () => {
        if (isUnlocked) {
          state.equippedTheme = key;
          setWeatherTheme(key);
          populateShopThemes();
          saveProgress();
          if (window.gameAudio) window.gameAudio.playClick();
        } else {
          if (state.coins >= details.price) {
            state.coins -= details.price;
            state.unlockedThemes.push(key);
            state.equippedTheme = key;
            setWeatherTheme(key);
            updateCoinsHUD();
            populateShopThemes();
            saveProgress();
            if (window.gameAudio) window.gameAudio.playClick();
          } else {
            alert("Not enough coins!");
          }
        }
      };
      
      list.appendChild(card);
    });
  }

  // --- LEADERBOARD ---
  function populateLeaderboardRanks() {
    const list = document.getElementById("ranks-list");
    list.innerHTML = "";
    
    const mockRanks = [
      { name: "SpeedDemon", level: 256, avatar: "👑" },
      { name: "ApexDrifter", level: 142, avatar: "🏎️" },
      { name: "NeonSkid", level: 98, avatar: "🚓" },
      { name: "TurboSlide", level: 75, avatar: "🚕" },
      { name: "GearCruncher", level: 44, avatar: "🚜" },
      { name: `${state.playerName} (You)`, level: state.currentLevel, avatar: "🏎️", self: true },
      { name: "EcoRider", level: 15, avatar: "🔋" }
    ];
    
    mockRanks.sort((a, b) => b.level - a.level);
    
    mockRanks.forEach((r, idx) => {
      const row = document.createElement("div");
      row.className = `rank-row ${r.self ? "self" : ""}`;
      
      row.innerHTML = `
        <div class="left">
          <span class="rank-num">${idx + 1}</span>
          <div class="avatar-box">${r.avatar}</div>
          <span class="name">${r.name}</span>
        </div>
        <span class="level">Level ${r.level}</span>
      `;
      list.appendChild(row);
    });
  }

  // --- DAILY LOGIN REWARDS ---
  function populateDailyGrid() {
    const grid = document.getElementById("daily-days-grid");
    grid.innerHTML = "";
    
    const dayRewards = [50, 100, 150, 200, 300, 400, 800];
    const dailyEmojis = ["🪙", "🪙", "🪙", "🪙", "🪙", "🪙", "🎁"];

    for (let i = 0; i < 7; i++) {
      const card = document.createElement("div");
      const dayNum = i + 1;
      
      let statusClass = "";
      if (dayNum <= state.claimedDailyDays) {
        statusClass = "claimed";
      } else if (dayNum === state.claimedDailyDays + 1 && canClaimDaily()) {
        statusClass = "active-day";
      }
      
      card.className = `daily-day-card ${statusClass}`;
      
      card.innerHTML = `
        <span class="day">Day ${dayNum}</span>
        <span class="icon">${dailyEmojis[i]}</span>
        <span class="reward">${dayRewards[i]}${i === 6 ? " + Gold Paint" : " Coins"}</span>
      `;
      grid.appendChild(card);
    }
    
    const claimBtn = document.getElementById("btn-claim-daily");
    if (canClaimDaily()) {
      claimBtn.disabled = false;
      claimBtn.innerText = "CLAIM BONUS";
    } else {
      claimBtn.disabled = true;
      claimBtn.innerText = "COME BACK TOMORROW";
    }
  }

  function canClaimDaily() {
    if (!state.lastClaimedDaily) return true;
    const now = Date.now();
    const diff = now - state.lastClaimedDaily;
    return diff >= 24 * 60 * 60 * 1000;
  }

  function claimDailyReward() {
    if (!canClaimDaily()) return;
    
    const dayRewards = [50, 100, 150, 200, 300, 400, 800];
    const index = state.claimedDailyDays % 7;
    const reward = dayRewards[index];
    
    state.coins += reward;
    state.claimedDailyDays++;
    
    if (index === 6) {
      if (!state.unlockedPaints.includes("paint_gold")) {
        state.unlockedPaints.push("paint_gold");
      }
    }
    
    state.lastClaimedDaily = Date.now();
    updateCoinsHUD();
    populateDailyGrid();
    saveProgress();
    
    if (window.gameAudio) window.gameAudio.playVictory();
    
    alert(`Claimed Day ${index + 1} Reward: +${reward} Coins!`);
    closeModal("modal-daily");
  }

  // --- STAGE INITIALIZATION ---
  function startStage(level) {
    state.currentLevel = level;
    state.isLevelCompleted = false;
    state.hintUsedThisLevel = false;
    
    const boardEl = document.querySelector(".board-frame");
    if (boardEl) {
      boardEl.classList.remove("camera-zoom");
    }
    
    showStoryDialogue(level, () => {
      // Re-verify theme match & set active world sound profile
      const activeW = getWorldFromLevel(level);
      if (activeW && window.gameAudio) {
        window.gameAudio.setActiveWorld(activeW.key);
      }
      
      const layout = generateLevelLayout(level);
      state.vehicles = layout.vehicles;
      state.targetMoves = layout.targetMoves;
      state.moveCount = 0;
      
      state.undoStack = [];
      state.redoStack = [];

      renderGameBoard();
      updateHUD();
      
      // Slide welcome/splash screens into loading screen transition
      showLoadingScreen(() => {
        navigateToScreen("screen-gameplay");
        setWeatherTheme(state.equippedTheme);
        
        // Level entrance camera pan and zoom effect
        if (boardEl) {
          boardEl.classList.add("camera-pan-intro");
          setTimeout(() => {
            boardEl.classList.remove("camera-pan-intro");
          }, 1500);
        }
      });
      
      saveProgress();
    });
  }

  function updateHUD() {
    document.getElementById("hud-level-title").innerText = `Level ${state.currentLevel}`;
    document.getElementById("hud-move-count").innerText = state.moveCount;
    document.getElementById("hud-target-moves").innerText = `/ Target: ${state.targetMoves}`;
    
    const difficultyBadge = document.getElementById("hud-level-difficulty");
    const diffType = getDifficultyType(state.currentLevel);
    difficultyBadge.innerText = diffType;
    difficultyBadge.className = `badge ${diffType}`;
    
    const progressFill = document.getElementById("game-progress-bar");
    let remainingMoves = state.targetMoves - state.moveCount;
    let percentage = Math.max(0, Math.min(100, (remainingMoves / state.targetMoves) * 100));
    progressFill.style.width = `${percentage}%`;
    
    const star1 = document.getElementById("star-hud-1");
    const star2 = document.getElementById("star-hud-2");
    const star3 = document.getElementById("star-hud-3");
    
    star1.classList.toggle("active", state.moveCount <= state.targetMoves + 4);
    star2.classList.toggle("active", state.moveCount <= state.targetMoves + 2);
    star3.classList.toggle("active", state.moveCount <= state.targetMoves);
  }

  function updateCoinsHUD() {
    document.getElementById("coin-count").innerText = state.coins;
  }

  function syncPlayerNameHUD() {
    const name = state.playerName || "Racer Pro";
    document.getElementById("hud-player-name").innerText = name;
    
    const banner = document.getElementById("splash-player-name");
    if (banner) banner.innerText = name;

    const rank = getRankName(state.rankLevel);
    
    const rankEl = document.getElementById("hud-player-rank");
    if (rankEl) rankEl.innerText = `Rank: ${rank} (Lv.${state.rankLevel})`;
  }

  function navigateToScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => {
      s.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
    
    // Hide global header on Welcome or Loading screen
    const header = document.getElementById("game-global-header");
    if (screenId === "screen-welcome" || screenId === "screen-loading") {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }
  }

  function openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
    if (window.gameAudio) window.gameAudio.playClick();
  }

  // Sync values on settings modal close
  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
    if (window.gameAudio) window.gameAudio.playClick();
    
    if (modalId === "modal-settings") {
      // Save name edit
      const editInput = document.getElementById("setting-player-name");
      const name = editInput.value.trim();
      if (name && name !== state.playerName) {
        state.playerName = name;
        syncPlayerNameHUD();
        saveProgress();
      }
    }
  }

  // --- BUTTON EVENT BINDINGS ---
  function initEventBindings() {
    // 0. Welcome save
    document.getElementById("btn-save-name").onclick = () => {
      const input = document.getElementById("input-player-name");
      const name = input.value.trim();
      if (name.length < 1) {
        alert("Please enter a valid name!");
        return;
      }
      state.playerName = name;
      syncPlayerNameHUD();
      saveProgress();
      
      if (window.gameAudio) {
        window.gameAudio.init();
        window.gameAudio.playClick();
      }
      
      navigateToScreen("screen-splash");
    };

    // 1. Splash screen actions
    document.getElementById("btn-play-game").onclick = () => {
      const diffConfig = WORLDS[state.currentDiffIndex];
      const isWorldLocked = diffConfig.levelStart > state.maxUnlockedLevel;
      
      if (isWorldLocked) {
        showLockedPopup(diffConfig.levelStart, diffConfig.title);
        return;
      }

      if (window.gameAudio) {
        window.gameAudio.init();
        window.gameAudio.toggleMusic(state.musicVolume > 0);
      }
      
      // Resumes level progress of selected world
      let resumeLvl = diffConfig.levelStart;
      
      if (isLevelInWorld(state.currentLevel, diffConfig)) {
        resumeLvl = state.currentLevel;
      }
      
      startStage(resumeLvl);
    };
    
    document.getElementById("btn-open-garage").onclick = () => {
      populateGarageOptions();
      updateGaragePreview();
      openModal("modal-garage");
    };
    document.getElementById("btn-close-garage").onclick = () => closeModal("modal-garage");
    
    document.getElementById("btn-open-shop").onclick = () => {
      populateShopThemes();
      openModal("modal-shop");
    };
    document.getElementById("btn-close-shop").onclick = () => closeModal("modal-shop");
    
    document.getElementById("btn-open-leaderboard").onclick = () => {
      document.getElementById("tab-btn-ranks").classList.add("active");
      document.getElementById("tab-btn-achievements").classList.remove("active");
      document.getElementById("leaderboard-ranks-view").style.display = "block";
      document.getElementById("leaderboard-achievements-view").style.display = "none";
      populateLeaderboardRanks();
      openModal("modal-leaderboard");
    };
    document.getElementById("btn-close-leaderboard").onclick = () => closeModal("modal-leaderboard");
    
    document.getElementById("btn-open-settings").onclick = () => {
      // Prefill Settings fields
      document.getElementById("setting-player-name").value = state.playerName;
      
      // Sync Range volume sliders
      document.getElementById("slider-music").value = state.musicVolume * 100;
      document.getElementById("label-music-val").innerText = `${Math.round(state.musicVolume * 100)}%`;
      
      document.getElementById("slider-sfx").value = state.sfxVolume * 100;
      document.getElementById("label-sfx-val").innerText = `${Math.round(state.sfxVolume * 100)}%`;
      
      document.getElementById("toggle-vibration").checked = state.vibrationEnabled;
      document.getElementById("select-weather-theme").value = state.equippedTheme;
      document.getElementById("select-colorblind").value = state.colorblindMode;
      document.getElementById("toggle-reduce-motion").checked = state.reduceMotion;
      document.getElementById("toggle-left-handed").checked = state.leftHanded;
      document.getElementById("select-ui-scaling").value = state.uiScaling;
      openModal("modal-settings");
    };
    document.getElementById("btn-close-settings").onclick = () => closeModal("modal-settings");
    
    document.getElementById("btn-daily-reward").onclick = () => {
      document.getElementById("tab-btn-daily-rewards").classList.add("active");
      document.getElementById("tab-btn-daily-challenges").classList.remove("active");
      document.getElementById("daily-rewards-tab-view").style.display = "flex";
      document.getElementById("daily-challenges-tab-view").style.display = "none";
      populateDailyGrid();
      openModal("modal-daily");
    };
    
    document.getElementById("btn-claim-daily").onclick = claimDailyReward;
    
    document.getElementById("modal-daily").onclick = (e) => {
      if (e.target.id === "modal-daily") closeModal("modal-daily");
    };

    // 2. Gameplay HUD actions
    document.getElementById("btn-game-back").onclick = () => {
      if (window.gameAudio) window.gameAudio.playClick();
      navigateToScreen("screen-splash");
    };
    
    const gameSettingsBtn = document.getElementById("btn-game-settings");
    if (gameSettingsBtn) {
      gameSettingsBtn.onclick = () => {
        document.getElementById("setting-player-name").value = state.playerName;
        document.getElementById("slider-music").value = state.musicVolume * 100;
        document.getElementById("label-music-val").innerText = `${Math.round(state.musicVolume * 100)}%`;
        document.getElementById("slider-sfx").value = state.sfxVolume * 100;
        document.getElementById("label-sfx-val").innerText = `${Math.round(state.sfxVolume * 100)}%`;
        document.getElementById("toggle-vibration").checked = state.vibrationEnabled;
        document.getElementById("select-weather-theme").value = state.equippedTheme;
        document.getElementById("select-colorblind").value = state.colorblindMode;
        document.getElementById("toggle-reduce-motion").checked = state.reduceMotion;
        document.getElementById("toggle-left-handed").checked = state.leftHanded;
        document.getElementById("select-ui-scaling").value = state.uiScaling;
        openModal("modal-settings");
      };
    }

    // 2b. Pause Modal Actions
    document.getElementById("btn-game-pause").onclick = () => {
      openModal("modal-pause");
    };
    document.getElementById("btn-close-pause").onclick = () => closeModal("modal-pause");
    document.getElementById("btn-pause-resume").onclick = () => closeModal("modal-pause");
    
    document.getElementById("btn-pause-restart").onclick = () => {
      closeModal("modal-pause");
      if (window.gameAudio) window.gameAudio.playGameOver();
      startStage(state.currentLevel);
    };
    
    document.getElementById("btn-pause-settings").onclick = () => {
      closeModal("modal-pause");
      document.getElementById("setting-player-name").value = state.playerName;
      document.getElementById("slider-music").value = state.musicVolume * 100;
      document.getElementById("label-music-val").innerText = `${Math.round(state.musicVolume * 100)}%`;
      document.getElementById("slider-sfx").value = state.sfxVolume * 100;
      document.getElementById("label-sfx-val").innerText = `${Math.round(state.sfxVolume * 100)}%`;
      document.getElementById("toggle-vibration").checked = state.vibrationEnabled;
      document.getElementById("select-weather-theme").value = state.equippedTheme;
      document.getElementById("select-colorblind").value = state.colorblindMode;
      document.getElementById("toggle-reduce-motion").checked = state.reduceMotion;
      document.getElementById("toggle-left-handed").checked = state.leftHanded;
      document.getElementById("select-ui-scaling").value = state.uiScaling;
      openModal("modal-settings");
    };
    
    document.getElementById("btn-pause-quit").onclick = () => {
      closeModal("modal-pause");
      navigateToScreen("screen-splash");
    };

    // 3. Gameplay control overlay actions
    document.getElementById("btn-undo").onclick = applyUndo;
    document.getElementById("btn-redo").onclick = applyRedo;
    document.getElementById("btn-restart").onclick = () => {
      if (window.gameAudio) window.gameAudio.playGameOver();
      startStage(state.currentLevel);
    };
    
    document.getElementById("btn-hint").onclick = showHint;

    // 4. Custom settings range sliders & switches
    document.getElementById("slider-music").oninput = (e) => {
      const vol = parseFloat(e.target.value) / 100;
      state.musicVolume = vol;
      document.getElementById("label-music-val").innerText = `${Math.round(vol * 100)}%`;
      if (window.gameAudio) window.gameAudio.setMusicVolume(vol);
      saveProgress();
    };

    document.getElementById("slider-sfx").oninput = (e) => {
      const vol = parseFloat(e.target.value) / 100;
      state.sfxVolume = vol;
      document.getElementById("label-sfx-val").innerText = `${Math.round(vol * 100)}%`;
      if (window.gameAudio) window.gameAudio.setSFXVolume(vol);
      saveProgress();
    };

    document.getElementById("toggle-vibration").onchange = (e) => {
      state.vibrationEnabled = e.target.checked;
      if (window.gameAudio) window.gameAudio.setVibrationEnabled(state.vibrationEnabled);
      saveProgress();
    };

    document.getElementById("select-weather-theme").onchange = (e) => {
      const theme = e.target.value;
      state.equippedTheme = theme;
      setWeatherTheme(theme);
      saveProgress();
      if (window.gameAudio) window.gameAudio.playClick();
    };

    // Accessibility Selectors
    document.getElementById("select-colorblind").onchange = (e) => {
      state.colorblindMode = e.target.value;
      applyAccessibilitySettings();
      saveProgress();
      if (window.gameAudio) window.gameAudio.playClick();
    };

    document.getElementById("toggle-reduce-motion").onchange = (e) => {
      state.reduceMotion = e.target.checked;
      applyAccessibilitySettings();
      saveProgress();
      if (window.gameAudio) window.gameAudio.playClick();
    };

    document.getElementById("toggle-left-handed").onchange = (e) => {
      state.leftHanded = e.target.checked;
      applyAccessibilitySettings();
      saveProgress();
      if (window.gameAudio) window.gameAudio.playClick();
    };

    document.getElementById("select-ui-scaling").onchange = (e) => {
      state.uiScaling = e.target.value;
      applyAccessibilitySettings();
      saveProgress();
      if (window.gameAudio) window.gameAudio.playClick();
    };

    // Leaderboard Tabs Swapping
    document.getElementById("tab-btn-ranks").onclick = () => {
      document.getElementById("tab-btn-ranks").classList.add("active");
      document.getElementById("tab-btn-achievements").classList.remove("active");
      document.getElementById("leaderboard-ranks-view").style.display = "block";
      document.getElementById("leaderboard-achievements-view").style.display = "none";
      if (window.gameAudio) window.gameAudio.playClick();
    };
    
    document.getElementById("tab-btn-achievements").onclick = () => {
      document.getElementById("tab-btn-achievements").classList.add("active");
      document.getElementById("tab-btn-ranks").classList.remove("active");
      document.getElementById("leaderboard-ranks-view").style.display = "none";
      document.getElementById("leaderboard-achievements-view").style.display = "block";
      renderAchievements();
      if (window.gameAudio) window.gameAudio.playClick();
    };

    // Daily Tabs Swapping
    document.getElementById("tab-btn-daily-rewards").onclick = () => {
      document.getElementById("tab-btn-daily-rewards").classList.add("active");
      document.getElementById("tab-btn-daily-challenges").classList.remove("active");
      document.getElementById("daily-rewards-tab-view").style.display = "flex";
      document.getElementById("daily-challenges-tab-view").style.display = "none";
      if (window.gameAudio) window.gameAudio.playClick();
    };
    
    document.getElementById("tab-btn-daily-challenges").onclick = () => {
      document.getElementById("tab-btn-daily-challenges").classList.add("active");
      document.getElementById("tab-btn-daily-rewards").classList.remove("active");
      document.getElementById("daily-rewards-tab-view").style.display = "none";
      document.getElementById("daily-challenges-tab-view").style.display = "flex";
      renderDailyChallenges();
      if (window.gameAudio) window.gameAudio.playClick();
    };
    
    document.getElementById("btn-reset-game-data").onclick = () => {
      if (confirm("Are you sure you want to reset all game progress? This cannot be undone.")) {
        localStorage.removeItem("car_escape_puzzle_save");
        window.location.reload();
      }
    };

    // 5. Victory Screen actions
    document.getElementById("btn-victory-next").onclick = () => {
      closeModal("modal-victory");
      
      // Determine if next level switches world
      const nextLvlIndex = state.currentLevel + 1;
      const currentWorld = getWorldFromLevel(state.currentLevel);
      const nextWorld = getWorldFromLevel(nextLvlIndex);
      
      if (currentWorld && nextWorld && currentWorld.key !== nextWorld.key) {
        // Increment selector carousel world
        const idx = WORLDS.findIndex(w => w.key === nextWorld.key);
        if (idx !== -1) {
          state.currentDiffIndex = idx;
          updateCarouselView(false);
        }
      }
      
      startStage(nextLvlIndex);
    };

    // 6. Garage tabs switcher
    document.querySelectorAll(".garage-customizer-tabs .tab-btn").forEach(btn => {
      btn.onclick = (e) => {
        document.querySelectorAll(".garage-customizer-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".garage-container .tab-content").forEach(tc => tc.classList.remove("active"));
        
        btn.classList.add("active");
        const targetId = btn.dataset.tab;
        document.getElementById(targetId).classList.add("active");
        if (window.gameAudio) window.gameAudio.playClick();
      };
    });

    // 7. Watch coin ad bundle in shop
    document.querySelectorAll(".buy-coins").forEach(btn => {
      btn.onclick = (e) => {
        const coinsEarned = parseInt(btn.dataset.coins);
        btn.disabled = true;
        btn.innerText = "Watching...";
        setTimeout(() => {
          state.coins += coinsEarned;
          updateCoinsHUD();
          saveProgress();
          btn.disabled = false;
          btn.innerText = btn.dataset.price === "0" ? "Watch Ad" : `Buy $${btn.dataset.price}`;
          if (window.gameAudio) window.gameAudio.playVictory();
        }, 1200);
      };
    });

    document.querySelectorAll(".buy-item").forEach(btn => {
      btn.onclick = () => {
        btn.disabled = true;
        btn.innerText = "Purchasing...";
        setTimeout(() => {
          state.coins += 2000;
          if (!state.unlockedVehicles.includes("player_sports_2")) {
            state.unlockedVehicles.push("player_sports_2");
          }
          updateCoinsHUD();
          saveProgress();
          btn.disabled = false;
          btn.innerText = "Owned";
          if (window.gameAudio) window.gameAudio.playVictory();
          alert("Neon Escape Pack Unlocked! +2,000 Coins + McLaren Sports Car!");
        }, 1200);
      };
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.onclick = (e) => {
        if (e.target.className === "modal-overlay active") {
          closeModal(overlay.id);
        }
      };
    });

    // 8. Level Selection Screen / Select Stage triggers
    document.getElementById("btn-open-levels").onclick = () => {
      initLevelSelectModal();
      openModal("modal-levels");
    };
    document.getElementById("btn-close-levels").onclick = () => closeModal("modal-levels");

    document.getElementById("btn-locked-ok").onclick = () => closeModal("modal-locked-popup");
    document.getElementById("btn-locked-go-next").onclick = () => {
      closeModal("modal-locked-popup");
      closeModal("modal-levels");
      
      // Navigate to world representing max playable level on carousel
      const targetW = getWorldFromLevel(state.maxUnlockedLevel);
      if (targetW) {
        const idx = WORLDS.findIndex(w => w.key === targetW.key);
        if (idx !== -1) {
          state.currentDiffIndex = idx;
          updateCarouselView(false);
        }
      }
      startStage(state.maxUnlockedLevel);
    };

    // Close locked popup on overlay click
    document.getElementById("modal-locked-popup").onclick = (e) => {
      if (e.target.id === "modal-locked-popup") {
        closeModal("modal-locked-popup");
      }
    };
  }

  function showWelcomeScreenSetup() {
    navigateToScreen("screen-welcome");
    const titleEl = document.querySelector("#screen-welcome h2");
    const subtitleEl = document.querySelector("#screen-welcome .subtitle");
    const inputEl = document.getElementById("input-player-name");
    
    if (state.playerName) {
      titleEl.innerText = `Welcome, ${state.playerName}!`;
      subtitleEl.innerText = "Ready to start your engine? Adjust name below if desired:";
      inputEl.value = state.playerName;
    } else {
      titleEl.innerText = "DRIVER REGISTRATION";
      subtitleEl.innerText = "Enter your racer name to start the engine";
      inputEl.value = "";
    }
  }

  // --- INITIALIZATION ---
  window.addEventListener("DOMContentLoaded", () => {
    loadProgress();
    updateCoinsHUD();
    initParticlesCanvas();
    
    syncPlayerNameHUD();
    showWelcomeScreenSetup();
    
    // Sync slider coefficients with Synthesizer object
    if (window.gameAudio) {
      window.gameAudio.musicVolume = state.musicVolume;
      window.gameAudio.sfxVolume = state.sfxVolume;
      window.gameAudio.vibrationEnabled = state.vibrationEnabled;
    }

    initDifficultyCarousel();
    initEventBindings();

    // Injects static splash platform model
    const showcaseModel = document.getElementById("showcase-car-model");
    if (showcaseModel) {
      const activeCar = VEHICLE_DESIGNS[state.equippedVehicle];
      const activePaint = GARAGE_PAINTS[state.equippedPaint].color;
      const diffColors = ["#39ff14", "#ffd700", "#ff6400", "#ff0844", "#e11d48", "#f59e0b", "#a855f7"];
      const currentGlow = diffColors[state.currentDiffIndex] || "rgba(0, 242, 254, 0.4)";
      showcaseModel.innerHTML = activeCar.svg(activePaint, currentGlow);
    }
  });

  // --- LEVEL SELECT SYSTEM ---
  let selectedWorldSelectTab = "downtown";

  function getLevelStars(level) {
    const score = state.bestScores[`level_${level}`];
    if (score === undefined) return 0;
    const layout = generateLevelLayout(level);
    const target = layout.targetMoves;
    if (score <= target) return 3;
    if (score <= target + 2) return 2;
    return 1;
  }

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    
    const toast = document.createElement("div");
    toast.className = "toast-message glassmorphism";
    toast.style.padding = "10px 18px";
    toast.style.borderRadius = "12px";
    toast.style.background = "rgba(15, 15, 25, 0.85)";
    toast.style.border = "1px solid rgba(255, 255, 255, 0.08)";
    toast.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
    toast.style.color = "white";
    toast.style.fontSize = "11px";
    toast.style.fontWeight = "600";
    toast.style.textAlign = "center";
    toast.style.whiteSpace = "nowrap";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.95)";
    toast.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    toast.innerText = message;
    
    container.appendChild(toast);
    toast.offsetHeight; // reflow
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0) scale(1)";
    
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px) scale(0.95)";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2200);
  }

  function showLockedPopup(level, worldTitle = "") {
    const messageEl = document.getElementById("locked-popup-message");
    if (worldTitle) {
      messageEl.innerText = `You must complete all previous levels before unlocking ${worldTitle}!`;
    } else {
      messageEl.innerText = `You must complete all previous levels before unlocking Level ${level}.`;
    }
    
    // Play lock sound
    if (window.gameAudio && window.gameAudio.playLocked) {
      window.gameAudio.playLocked();
    }
    
    // Shake lock icon in popup
    const lockIcon = document.querySelector(".locked-popup-content .lock-graphic-container");
    if (lockIcon) {
      lockIcon.classList.add("lock-wiggle-active");
      setTimeout(() => lockIcon.classList.remove("lock-wiggle-active"), 400);
    }

    openModal("modal-locked-popup");
  }

  function initLevelSelectModal() {
    const tabsContainer = document.getElementById("levels-world-tabs");
    tabsContainer.innerHTML = "";

    // Determine active tab based on unlocked progress if not set
    const currentWorld = getWorldFromLevel(state.maxUnlockedLevel);
    if (currentWorld) {
      selectedWorldSelectTab = currentWorld.key;
    }

    WORLDS.forEach(w => {
      const tab = document.createElement("button");
      const isLocked = w.levelStart > state.maxUnlockedLevel;
      tab.className = `world-tab-btn ${w.key === selectedWorldSelectTab ? "active" : ""} ${isLocked ? "tab-locked" : ""}`;
      
      const lockIcon = isLocked ? " 🔒" : "";
      tab.innerHTML = `${w.icon} ${w.title}${lockIcon}`;
      
      tab.onclick = (e) => {
        if (isLocked) {
          if (window.gameAudio && window.gameAudio.playLocked) {
            window.gameAudio.playLocked();
          }
          // Shake tab
          tab.classList.add("lock-wiggle-active");
          setTimeout(() => tab.classList.remove("lock-wiggle-active"), 400);
          showToast("Complete previous levels to unlock this level.");
          showLockedPopup(w.levelStart, w.title);
        } else {
          selectedWorldSelectTab = w.key;
          initLevelSelectModal(); // refresh tabs state
          if (window.gameAudio) window.gameAudio.playClick();
        }
      };
      
      tabsContainer.appendChild(tab);
    });

    renderGridForWorld();
  }

  function renderGridForWorld() {
    const grid = document.getElementById("levels-grid");
    grid.innerHTML = "";

    const activeW = WORLDS.find(w => w.key === selectedWorldSelectTab);
    if (!activeW) return;

    // Determine level range
    const worldIdx = WORLDS.findIndex(w => w.key === selectedWorldSelectTab);
    const nextW = WORLDS[worldIdx + 1];
    const maxLevel = nextW ? nextW.levelStart - 1 : 75; // Cap at 75 for stage selection list

    for (let L = activeW.levelStart; L <= maxLevel; L++) {
      const btn = document.createElement("button");
      const isLocked = L > state.maxUnlockedLevel;
      const isCompleted = state.bestScores[`level_${L}`] !== undefined;

      if (isLocked) {
        btn.className = "level-btn locked";
        btn.innerHTML = `${L}<span class="lock-symbol">🔒</span>`;
        btn.onclick = () => {
          btn.classList.add("lock-wiggle-active");
          setTimeout(() => btn.classList.remove("lock-wiggle-active"), 400);
          showToast("Complete previous levels to unlock this level.");
          showLockedPopup(L);
        };
      } else {
        const isNextPlayable = L === state.maxUnlockedLevel;
        btn.className = `level-btn unlocked ${isCompleted ? "completed" : ""} ${isNextPlayable ? "next-playable" : ""}`;
        
        let contentHtml = `${L}`;
        if (isCompleted) {
          const stars = getLevelStars(L);
          let starsHtml = '<div class="level-btn-stars">';
          for (let s = 0; s < 3; s++) {
            starsHtml += s < stars ? "★" : "☆";
          }
          starsHtml += '</div>';
          contentHtml = `<span class="completed-checkmark">✓</span>` + contentHtml + starsHtml;
        } else if (isNextPlayable) {
          contentHtml += '<div class="level-btn-stars" style="color:var(--accent-neon);font-size:7px;">PLAY</div>';
        }
        
        btn.innerHTML = contentHtml;
        
        btn.onclick = () => {
          closeModal("modal-levels");
          // Sync carousel world view if starting from list
          const targetWorld = getWorldFromLevel(L);
          if (targetWorld) {
            const worldIdx = WORLDS.findIndex(w => w.key === targetWorld.key);
            if (worldIdx !== -1) {
              state.currentDiffIndex = worldIdx;
              updateCarouselView(false);
            }
          }
          startStage(L);
        };
      }
      grid.appendChild(btn);
    }
  }

})();
