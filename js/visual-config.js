// ===========================
// CONJUGO QUEST - CONFIGURATION VISUELLE
// Configuration des effets visuels par niveau
// ===========================

const VISUAL_CONFIG = 
{
  "levels": {
    "1": {
      "name": "Présent",
      "projectile": {
        "size": 30,
        "shape": "circle",
        "colors": [
          "#4169e1",
          "#1e90ff"
        ],
        "glowColor": "#4169e1",
        "glowIntensity": 40,
        "speed": 1,
        "count": 1,
        "layout": "single",
        "spacing": 10
      },
      "circle": {
        "size": 450,
        "ringCount": 3,
        "ringSpacing": 25,
        "ringStyle": "dashed",
        "rotationSpeed": 8,
        "particleCount": 3,
        "particleShape": "circle",
        "colors": [
          "rgba(100, 149, 237, 0.9)",
          "rgba(65, 105, 225, 0.85)",
          "rgba(135, 206, 250, 0.8)"
        ],
        "particleColor": "rgba(100, 149, 237, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 22,
          "shape": "square",
          "colors": [
            "#fd7412",
            "#7d300c"
          ],
          "glowColor": "#050200",
          "glowIntensity": 10,
          "speed": 1,
          "count": 1,
          "layout": "vertical",
          "spacing": 25
        }
      }
    },
    "2": {
      "name": "Passé Composé",
      "projectile": {
        "size": 32,
        "shape": "circle",
        "colors": [
          "#065eb7",
          "#00bfff"
        ],
        "glowColor": "#1e90ff",
        "glowIntensity": 31,
        "speed": 1,
        "count": 1,
        "layout": "single",
        "spacing": 20
      },
      "circle": {
        "size": 460,
        "ringCount": 3,
        "ringSpacing": 26,
        "ringStyle": "dashed",
        "rotationSpeed": 8,
        "particleCount": 3,
        "particleShape": "circle",
        "colors": [
          "rgba(30, 144, 255, 0.9)",
          "rgba(0, 191, 255, 0.85)",
          "rgba(70, 130, 180, 0.8)"
        ],
        "particleColor": "rgba(30, 144, 255, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 23,
          "shape": "square",
          "colors": [
            "#a0522d",
            "#512701"
          ],
          "glowColor": "#080808",
          "glowIntensity": 10,
          "speed": 1.2,
          "count": 2,
          "layout": "vertical",
          "spacing": 10
        }
      }
    },
    "3": {
      "name": "Imparfait",
      "projectile": {
        "size": 37,
        "shape": "circle",
        "colors": [
          "#0941ec",
          "#0ca2ed"
        ],
        "glowColor": "#dcdcf9",
        "glowIntensity": 41,
        "speed": 1,
        "count": 1,
        "layout": "single",
        "spacing": 20
      },
      "circle": {
        "size": 470,
        "ringCount": 4,
        "ringSpacing": 27,
        "ringStyle": "dashed",
        "rotationSpeed": 8,
        "particleCount": 4,
        "particleShape": "circle",
        "colors": [
          "rgba(0, 0, 205, 0.9)",
          "rgba(65, 105, 225, 0.85)",
          "rgba(100, 149, 237, 0.8)",
          "rgba(70, 130, 180, 0.75)"
        ],
        "particleColor": "rgba(0, 0, 205, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 24,
          "shape": "square",
          "colors": [
            "#ac5606",
            "#3c1c01"
          ],
          "glowColor": "#0d0d0c",
          "glowIntensity": 10,
          "speed": 1.1,
          "count": 3,
          "layout": "vertical",
          "spacing": 10
        }
      }
    },
    "4": {
      "name": "Futur",
      "projectile": {
        "size": 42,
        "shape": "circle",
        "colors": [
          "#87ceeb",
          "#10d0ea"
        ],
        "glowColor": "#87ceeb",
        "glowIntensity": 46,
        "speed": 1.2,
        "count": 1,
        "layout": "single",
        "spacing": 20
      },
      "circle": {
        "size": 480,
        "ringCount": 4,
        "ringSpacing": 28,
        "ringStyle": "dashed",
        "rotationSpeed": 7,
        "particleCount": 4,
        "particleShape": "circle",
        "colors": [
          "rgba(135, 206, 235, 0.9)",
          "rgba(176, 224, 230, 0.85)",
          "rgba(173, 216, 230, 0.8)",
          "rgba(100, 149, 237, 0.75)"
        ],
        "particleColor": "rgba(135, 206, 235, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 35,
          "shape": "square",
          "colors": [
            "#fd8208",
            "#2f1904"
          ],
          "glowColor": "#0b0a0a",
          "glowIntensity": 100,
          "speed": 1.8,
          "count": 3,
          "layout": "vertical",
          "spacing": 27
        }
      }
    },
    "5": {
      "name": "Plus-que-Parfait",
      "projectile": {
        "size": 46,
        "shape": "circle",
        "colors": [
          "#00d5ff",
          "#0669cb"
        ],
        "glowColor": "#f1f3f8",
        "glowIntensity": 54,
        "speed": 1.1,
        "count": 1,
        "layout": "horizontal",
        "spacing": 22
      },
      "circle": {
        "size": 490,
        "ringCount": 4,
        "ringSpacing": 29,
        "ringStyle": "dashed",
        "rotationSpeed": 7,
        "particleCount": 5,
        "particleShape": "circle",
        "colors": [
          "rgba(65, 105, 225, 0.9)",
          "rgba(30, 144, 255, 0.85)",
          "rgba(100, 149, 237, 0.8)",
          "rgba(70, 130, 180, 0.75)"
        ],
        "particleColor": "rgba(65, 105, 225, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 38,
          "shape": "square",
          "colors": [
            "#4b4a49",
            "#212121"
          ],
          "glowColor": "#050505",
          "glowIntensity": 100,
          "speed": 1.4,
          "count": 3,
          "layout": "vertical",
          "spacing": 29
        }
      }
    },
    "6": {
      "name": "Futur Antérieur",
      "projectile": {
        "size": 50,
        "shape": "circle",
        "colors": [
          "#07cbf2",
          "#0a1bff"
        ],
        "glowColor": "#f0f5f9",
        "glowIntensity": 55,
        "speed": 1.1,
        "count": 1,
        "layout": "horizontal",
        "spacing": 23
      },
      "circle": {
        "size": 500,
        "ringCount": 5,
        "ringSpacing": 30,
        "ringStyle": "dashed",
        "rotationSpeed": 7,
        "particleCount": 5,
        "particleShape": "circle",
        "colors": [
          "rgba(70, 130, 180, 0.9)",
          "rgba(95, 158, 160, 0.85)",
          "rgba(100, 149, 237, 0.8)",
          "rgba(65, 105, 225, 0.75)",
          "rgba(30, 144, 255, 0.7)"
        ],
        "particleColor": "rgba(70, 130, 180, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 38,
          "shape": "square",
          "colors": [
            "#9e9c9a",
            "#313030"
          ],
          "glowColor": "#0a0a0a",
          "glowIntensity": 10,
          "speed": 1.2,
          "count": 4,
          "layout": "vertical",
          "spacing": 31
        }
      }
    },
    "7": {
      "name": "Passé Simple",
      "projectile": {
        "size": 57,
        "shape": "circle",
        "colors": [
          "#0945fb",
          "#02e9ed"
        ],
        "glowColor": "#94f3f4",
        "glowIntensity": 59,
        "speed": 1.3,
        "count": 1,
        "layout": "horizontal",
        "spacing": 24
      },
      "circle": {
        "size": 510,
        "ringCount": 5,
        "ringSpacing": 31,
        "ringStyle": "dashed",
        "rotationSpeed": 7,
        "particleCount": 6,
        "particleShape": "circle",
        "colors": [
          "rgba(25, 25, 112, 0.9)",
          "rgba(0, 0, 128, 0.85)",
          "rgba(65, 105, 225, 0.8)",
          "rgba(70, 130, 180, 0.75)",
          "rgba(100, 149, 237, 0.7)"
        ],
        "particleColor": "rgba(25, 25, 112, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 47,
          "shape": "square",
          "colors": [
            "#b0b0b0",
            "#2e2e2d"
          ],
          "glowColor": "#050505",
          "glowIntensity": 10,
          "speed": 1.3,
          "count": 4,
          "layout": "vertical",
          "spacing": 31
        }
      }
    },
    "8": {
      "name": "Passé Antérieur",
      "projectile": {
        "size": 64,
        "shape": "circle",
        "colors": [
          "#09cff6",
          "#0d67f8"
        ],
        "glowColor": "#74e4fb",
        "glowIntensity": 63,
        "speed": 1.2,
        "count": 1,
        "layout": "horizontal",
        "spacing": 10
      },
      "circle": {
        "size": 520,
        "ringCount": 5,
        "ringSpacing": 32,
        "ringStyle": "dashed",
        "rotationSpeed": 7,
        "particleCount": 6,
        "particleShape": "circle",
        "colors": [
          "rgba(70, 130, 180, 0.9)",
          "rgba(90, 158, 160, 0.85)",
          "rgba(100, 149, 237, 0.8)",
          "rgba(65, 105, 225, 0.75)",
          "rgba(30, 144, 255, 0.7)"
        ],
        "particleColor": "rgba(70, 130, 180, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 51,
          "shape": "square",
          "colors": [
            "#969696",
            "#343232"
          ],
          "glowColor": "#000000",
          "glowIntensity": 10,
          "speed": 1.3,
          "count": 5,
          "layout": "vertical",
          "spacing": 32
        }
      }
    },
    "9": {
      "name": "BOSS Indicatif",
      "projectile": {
        "size": 78,
        "shape": "circle",
        "colors": [
          "#f1f3f8",
          "#00bbfa"
        ],
        "glowColor": "#66eef0",
        "glowIntensity": 82,
        "speed": 1.8,
        "count": 1,
        "layout": "circle",
        "spacing": 10
      },
      "circle": {
        "size": 550,
        "ringCount": 6,
        "ringSpacing": 35,
        "ringStyle": "double",
        "rotationSpeed": 5,
        "particleCount": 10,
        "particleShape": "star",
        "colors": [
          "rgba(65, 105, 225, 0.9)",
          "rgba(0, 191, 255, 0.85)",
          "rgba(100, 149, 237, 0.8)",
          "rgba(70, 130, 180, 0.75)",
          "rgba(30, 144, 255, 0.7)",
          "rgba(135, 206, 235, 0.65)"
        ],
        "particleColor": "rgba(65, 105, 225, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 53,
          "shape": "square",
          "colors": [
            "#f5e284",
            "#e4b611"
          ],
          "glowColor": "#f9ec5d",
          "glowIntensity": 45,
          "speed": 1.5,
          "count": 5,
          "layout": "vertical",
          "spacing": 35
        }
      }
    },
    "10": {
      "name": "Impératif Présent",
      "projectile": {
        "size": 35,
        "shape": "flame",
        "colors": [
          "#f5e000",
          "#e77f08"
        ],
        "glowColor": "#ffea00",
        "glowIntensity": 55,
        "speed": 1.2,
        "count": 1,
        "layout": "single",
        "spacing": 25
      },
      "circle": {
        "size": 500,
        "ringCount": 4,
        "ringSpacing": 28,
        "ringStyle": "solid",
        "rotationSpeed": 7,
        "particleCount": 6,
        "particleShape": "circle",
        "colors": [
          "rgba(255, 140, 0, 0.9)",
          "rgba(255, 165, 0, 0.85)",
          "rgba(255, 200, 0, 0.8)",
          "rgba(255, 100, 0, 0.75)"
        ],
        "particleColor": "rgba(255, 140, 0, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 24,
          "shape": "triangle-left",
          "colors": [
            "#fcba03",
            "#a34900"
          ],
          "glowColor": "#f2e12c",
          "glowIntensity": 50,
          "speed": 1.4,
          "count": 3,
          "layout": "circle",
          "spacing": 10
        }
      }
    },
    "11": {
      "name": "Impératif Passé",
      "projectile": {
        "size": 48,
        "shape": "flame",
        "colors": [
          "#ff4500",
          "#eef202"
        ],
        "glowColor": "#ffbb00",
        "glowIntensity": 69,
        "speed": 1.3,
        "count": 1,
        "layout": "single",
        "spacing": 10
      },
      "circle": {
        "size": 520,
        "ringCount": 5,
        "ringSpacing": 30,
        "ringStyle": "solid",
        "rotationSpeed": 6,
        "particleCount": 8,
        "particleShape": "circle",
        "colors": [
          "rgba(255, 69, 0, 0.9)",
          "rgba(255, 99, 71, 0.85)",
          "rgba(255, 140, 0, 0.8)",
          "rgba(255, 165, 0, 0.75)",
          "rgba(255, 200, 0, 0.7)"
        ],
        "particleColor": "rgba(255, 69, 0, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 34,
          "shape": "triangle-left",
          "colors": [
            "#f3eb12",
            "#c20505"
          ],
          "glowColor": "#d4ed1d",
          "glowIntensity": 70,
          "speed": 1.7,
          "count": 4,
          "layout": "circle",
          "spacing": 13
        }
      }
    },
    "12": {
      "name": "BOSS Impératif",
      "projectile": {
        "size": 52,
        "shape": "flame",
        "colors": [
          "#fbff00",
          "#ff4500"
        ],
        "glowColor": "#d9f505",
        "glowIntensity": 80,
        "speed": 1.4,
        "count": 3,
        "layout": "circle",
        "spacing": 10
      },
      "circle": {
        "size": 550,
        "ringCount": 6,
        "ringSpacing": 32,
        "ringStyle": "double",
        "rotationSpeed": 5,
        "particleCount": 12,
        "particleShape": "circle",
        "colors": [
          "rgba(255, 0, 0, 0.9)",
          "rgba(255, 69, 0, 0.85)",
          "rgba(255, 140, 0, 0.8)",
          "rgba(255, 165, 0, 0.75)",
          "rgba(255, 200, 0, 0.7)",
          "rgba(255, 100, 0, 0.65)"
        ],
        "particleColor": "rgba(255, 0, 0, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 60,
          "shape": "triangle-left",
          "colors": [
            "#edc602",
            "#b23f01"
          ],
          "glowColor": "#b57403",
          "glowIntensity": 100,
          "speed": 2.1,
          "count": 5,
          "layout": "circle",
          "spacing": 15
        }
      }
    },
    "13": {
      "name": "Conditionnel Présent",
      "projectile": {
        "size": 30,
        "shape": "triangle-right",
        "colors": [
          "#f50535",
          "#a30505"
        ],
        "glowColor": "#f60404",
        "glowIntensity": 50,
        "speed": 1.6,
        "count": 3,
        "layout": "horizontal",
        "spacing": 10
      },
      "circle": {
        "size": 480,
        "ringCount": 4,
        "ringSpacing": 26,
        "ringStyle": "dotted",
        "rotationSpeed": 6,
        "particleCount": 5,
        "particleShape": "circle",
        "colors": [
          "rgba(220, 20, 60, 0.9)",
          "rgba(255, 20, 147, 0.85)",
          "rgba(255, 69, 0, 0.8)",
          "rgba(178, 34, 34, 0.75)"
        ],
        "particleColor": "rgba(220, 20, 60, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 60,
          "shape": "light",
          "colors": [
            "#f00a0a",
            "#f70202"
          ],
          "glowColor": "#f7021b",
          "glowIntensity": 69,
          "speed": 2.3,
          "count": 5,
          "layout": "v-right",
          "spacing": 60
        }
      }
    },
    "14": {
      "name": "Conditionnel Passé",
      "projectile": {
        "size": 38,
        "shape": "triangle-right",
        "colors": [
          "#fd0808",
          "#0a0200"
        ],
        "glowColor": "#ff1100",
        "glowIntensity": 60,
        "speed": 1.7,
        "count": 4,
        "layout": "horizontal",
        "spacing": 10
      },
      "circle": {
        "size": 500,
        "ringCount": 5,
        "ringSpacing": 28,
        "ringStyle": "dotted",
        "rotationSpeed": 6,
        "particleCount": 7,
        "particleShape": "circle",
        "colors": [
          "rgba(255, 20, 147, 0.9)",
          "rgba(255, 105, 180, 0.85)",
          "rgba(220, 20, 60, 0.8)",
          "rgba(178, 34, 34, 0.75)",
          "rgba(139, 0, 0, 0.7)"
        ],
        "particleColor": "rgba(255, 20, 147, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 60,
          "shape": "light",
          "colors": [
            "#e60a0a",
            "#fc2803"
          ],
          "glowColor": "#df0712",
          "glowIntensity": 46,
          "speed": 2.2,
          "count": 4,
          "layout": "v-right",
          "spacing": 60
        }
      }
    },
    "15": {
      "name": "BOSS Conditionnel",
      "projectile": {
        "size": 65,
        "shape": "triangle-right",
        "colors": [
          "#ff0000",
          "#0a0000"
        ],
        "glowColor": "#ff0000",
        "glowIntensity": 98,
        "speed": 2,
        "count": 5,
        "layout": "single",
        "spacing": 10
      },
      "circle": {
        "size": 550,
        "ringCount": 6,
        "ringSpacing": 30,
        "ringStyle": "solid",
        "rotationSpeed": 4,
        "particleCount": 15,
        "particleShape": "circle",
        "colors": [
          "rgba(255, 0, 0, 0.9)",
          "rgba(255, 69, 0, 0.85)",
          "rgba(255, 20, 147, 0.8)",
          "rgba(220, 20, 60, 0.75)",
          "rgba(178, 34, 34, 0.7)",
          "rgba(139, 0, 0, 0.65)"
        ],
        "particleColor": "rgba(255, 0, 0, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 60,
          "shape": "light",
          "colors": [
            "#8b0000",
            "#b22222"
          ],
          "glowColor": "#f90606",
          "glowIntensity": 100,
          "speed": 2.5,
          "count": 3,
          "layout": "v-right",
          "spacing": 60
        }
      }
    },
    "16": {
      "name": "Subjonctif Présent",
      "projectile": {
        "size": 46,
        "shape": "star",
        "colors": [
          "#0f0f0f",
          "#7a02f2"
        ],
        "glowColor": "#5a09fb",
        "glowIntensity": 45,
        "speed": 1.1,
        "count": 1,
        "layout": "horizontal",
        "spacing": 10
      },
      "circle": {
        "size": 470,
        "ringCount": 4,
        "ringSpacing": 26,
        "ringStyle": "solid",
        "rotationSpeed": 7,
        "particleCount": 4,
        "particleShape": "square",
        "colors": [
          "rgba(147, 112, 219, 0.9)",
          "rgba(186, 85, 211, 0.85)",
          "rgba(138, 43, 226, 0.8)",
          "rgba(128, 0, 128, 0.75)"
        ],
        "particleColor": "rgba(147, 112, 219, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 30,
          "shape": "triangle-up",
          "colors": [
            "#8a0ce4",
            "#0d0c12"
          ],
          "glowColor": "#4b0082",
          "glowIntensity": 50,
          "speed": 1.3,
          "count": 3,
          "layout": "circle",
          "spacing": 28
        }
      }
    },
    "17": {
      "name": "Subjonctif Passé",
      "projectile": {
        "size": 42,
        "shape": "star",
        "colors": [
          "#0d0c0d",
          "#9400d3"
        ],
        "glowColor": "#8406f9",
        "glowIntensity": 75,
        "speed": 1.2,
        "count": 3,
        "layout": "circle",
        "spacing": 12
      },
      "circle": {
        "size": 490,
        "ringCount": 5,
        "ringSpacing": 28,
        "ringStyle": "solid",
        "rotationSpeed": 6,
        "particleCount": 6,
        "particleShape": "square",
        "colors": [
          "rgba(138, 43, 226, 0.9)",
          "rgba(148, 0, 211, 0.85)",
          "rgba(186, 85, 211, 0.8)",
          "rgba(128, 0, 128, 0.75)",
          "rgba(75, 0, 130, 0.7)"
        ],
        "particleColor": "rgba(138, 43, 226, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 41,
          "shape": "triangle-up",
          "colors": [
            "#2709ec",
            "#9506f4"
          ],
          "glowColor": "#0c0c0d",
          "glowIntensity": 55,
          "speed": 1.4,
          "count": 4,
          "layout": "circle",
          "spacing": 30
        }
      }
    },
    "18": {
      "name": "Subjonctif Imparfait",
      "projectile": {
        "size": 52,
        "shape": "star",
        "colors": [
          "#0f000f",
          "#6c00f0"
        ],
        "glowColor": "#b557f4",
        "glowIntensity": 77,
        "speed": 1.3,
        "count": 4,
        "layout": "circle",
        "spacing": 14
      },
      "circle": {
        "size": 510,
        "ringCount": 5,
        "ringSpacing": 30,
        "ringStyle": "solid",
        "rotationSpeed": 6,
        "particleCount": 8,
        "particleShape": "square",
        "colors": [
          "rgba(128, 0, 128, 0.9)",
          "rgba(139, 0, 139, 0.85)",
          "rgba(148, 0, 211, 0.8)",
          "rgba(75, 0, 130, 0.75)",
          "rgba(106, 90, 205, 0.7)"
        ],
        "particleColor": "rgba(128, 0, 128, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 45,
          "shape": "triangle-up",
          "colors": [
            "#2a0bf4",
            "#563af2"
          ],
          "glowColor": "#131122",
          "glowIntensity": 60,
          "speed": 2.5,
          "count": 5,
          "layout": "circle",
          "spacing": 31
        }
      }
    },
    "19": {
      "name": "BOSS Subjonctif",
      "projectile": {
        "size": 80,
        "shape": "star",
        "colors": [
          "#060109",
          "#7a04f1"
        ],
        "glowColor": "#c19ef5",
        "glowIntensity": 88,
        "speed": 1.8,
        "count": 5,
        "layout": "circle",
        "spacing": 10
      },
      "circle": {
        "size": 540,
        "ringCount": 6,
        "ringSpacing": 32,
        "ringStyle": "double",
        "rotationSpeed": 5,
        "particleCount": 12,
        "particleShape": "square",
        "colors": [
          "rgba(75, 0, 130, 0.9)",
          "rgba(46, 8, 84, 0.85)",
          "rgba(128, 0, 128, 0.8)",
          "rgba(138, 43, 226, 0.75)",
          "rgba(106, 90, 205, 0.7)",
          "rgba(72, 61, 139, 0.65)"
        ],
        "particleColor": "rgba(75, 0, 130, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 60,
          "shape": "triangle-up",
          "colors": [
            "#2e0854",
            "#af4df5"
          ],
          "glowColor": "#141315",
          "glowIntensity": 98,
          "speed": 1.7,
          "count": 6,
          "layout": "circle",
          "spacing": 56
        }
      }
    },
    "20": {
      "name": "Préparation Final",
      "projectile": {
        "size": 42,
        "shape": "light",
        "colors": [
          "#f5e484",
          "#ffa500"
        ],
        "glowColor": "#f7f6ed",
        "glowIntensity": 89,
        "speed": 1.3,
        "count": 3,
        "layout": "v-left",
        "spacing": 60
      },
      "circle": {
        "size": 550,
        "ringCount": 6,
        "ringSpacing": 30,
        "ringStyle": "double",
        "rotationSpeed": 4,
        "particleCount": 15,
        "particleShape": "circle",
        "colors": [
          "rgba(255, 215, 0, 0.9)",
          "rgba(255, 165, 0, 0.85)",
          "rgba(255, 255, 0, 0.8)",
          "rgba(255, 140, 0, 0.75)",
          "rgba(255, 200, 0, 0.7)",
          "rgba(255, 255, 224, 0.65)"
        ],
        "particleColor": "rgba(255, 215, 0, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 60,
          "shape": "circle",
          "colors": [
            "#0d0d0d",
            "#f60410"
          ],
          "glowColor": "#030303",
          "glowIntensity": 100,
          "speed": 2.5,
          "count": 1,
          "layout": "v-left",
          "spacing": 60
        }
      }
    },
    "21": {
      "name": "BOSS FINAL",
      "projectile": {
        "size": 70,
        "shape": "light",
        "colors": [
          "#ffd700",
          "#ffffff"
        ],
        "glowColor": "#ffd900",
        "glowIntensity": 100,
        "speed": 1.9,
        "count": 5,
        "layout": "circle",
        "spacing": 50
      },
      "circle": {
        "size": 600,
        "ringCount": 6,
        "ringSpacing": 35,
        "ringStyle": "double",
        "rotationSpeed": 3,
        "particleCount": 15,
        "particleShape": "star",
        "colors": [
          "rgba(255, 215, 0, 0.9)",
          "rgba(255, 255, 255, 0.85)",
          "rgba(255, 255, 224, 0.8)",
          "rgba(255, 250, 205, 0.75)",
          "rgba(255, 239, 213, 0.7)",
          "rgba(255, 228, 181, 0.65)"
        ],
        "particleColor": "rgba(255, 215, 0, 1)"
      },
      "enemy": {
        "projectile": {
          "size": 60,
          "shape": "circle",
          "colors": [
            "#f40606",
            "#ff0a0a"
          ],
          "glowColor": "#f90101",
          "glowIntensity": 80,
          "speed": 2.5,
          "count": 7,
          "layout": "circle",
          "spacing": 21
        }
      }
    }
  }
};

// Fonction pour appliquer la configuration d'un niveau
function applyVisualConfig(level) {
    const config = VISUAL_CONFIG.levels[level];
    if (!config) {
        console.warn(`Configuration niveau ${level} non trouvée`);
        return;
    }
    
    const root = document.documentElement;
    
    // Projectile du héros
    root.style.setProperty('--projectile-size', `${config.projectile.size}px`);
    root.style.setProperty('--projectile-color-1', config.projectile.colors[0]);
    root.style.setProperty('--projectile-color-2', config.projectile.colors[1]);
    root.style.setProperty('--projectile-shadow', config.projectile.glowColor);
    root.style.setProperty('--projectile-speed', config.projectile.speed);
    root.style.setProperty('--projectile-shape', config.projectile.shape);
    
    // Cercle magique
    root.style.setProperty('--circle-size', `${config.circle.size}px`);
    root.style.setProperty('--circle-color-1', config.circle.colors[0]);
    root.style.setProperty('--circle-color-2', config.circle.colors[1]);
    root.style.setProperty('--circle-color-3', config.circle.colors[2]);
    root.style.setProperty('--circle-color-4', config.circle.colors[3]);
    if (config.circle.colors[4]) {
        root.style.setProperty('--circle-color-5', config.circle.colors[4]);
    }
    if (config.circle.colors[5]) {
        root.style.setProperty('--circle-color-6', config.circle.colors[5]);
    }
    root.style.setProperty('--circle-center-color', config.circle.centerColor || config.circle.colors[0]);
    root.style.setProperty('--circle-rotation-speed', `${config.circle.rotationSpeed}s`);
    root.style.setProperty('--particle-color', config.circle.particleColor);
    root.style.setProperty('--ring-style', config.circle.ringStyle);
    
    // Projectile ennemi
    root.style.setProperty('--enemy-projectile-size', `${config.enemy.projectile.size}px`);
    root.style.setProperty('--enemy-projectile-color-1', config.enemy.projectile.colors[0]);
    root.style.setProperty('--enemy-projectile-color-2', config.enemy.projectile.colors[1]);
    root.style.setProperty('--enemy-projectile-shadow', config.enemy.projectile.glowColor);
    root.style.setProperty('--enemy-projectile-speed', config.enemy.projectile.speed);
    root.style.setProperty('--enemy-projectile-shape', config.enemy.projectile.shape);
    
    console.log(`✨ Configuration visuelle niveau ${level} (${config.name}) appliquée`);
    
    return config;
}

// Exporter la configuration en JSON
function exportConfig() {
    return JSON.stringify(VISUAL_CONFIG, null, 2);
}

// Importer une configuration depuis JSON
function importConfig(jsonString) {
    try {
        const newConfig = JSON.parse(jsonString);
        Object.assign(VISUAL_CONFIG.levels, newConfig.levels);
        console.log('✅ Configuration importée avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur import configuration:', error);
        return false;
    }
}

// Sauvegarder dans localStorage
function saveConfig() {
    localStorage.setItem('conjugoquest_visual_config', exportConfig());
    console.log('💾 Configuration sauvegardée');
}

// Charger depuis localStorage
function loadConfig() {
    const saved = localStorage.getItem('conjugoquest_visual_config');
    if (saved && importConfig(saved)) {
        console.log('📂 Configuration chargée depuis localStorage');
        return true;
    }
    return false;
}

// Exposer globalement
if (typeof window !== 'undefined') {
    window.VISUAL_CONFIG = VISUAL_CONFIG;
    window.applyVisualConfig = applyVisualConfig;
    window.exportConfig = exportConfig;
    window.importConfig = importConfig;
    window.saveConfig = saveConfig;
    window.loadConfig = loadConfig;
}
