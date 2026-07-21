# onam Diagram Colour System

Use these exact values for every draw.io diagram to keep them visually uniform.

## Palette

| Role | Fill | Border | Text |
|---|---|---|---|
| Page background | `#F8FAFC` | — | — |
| Platform container | `#EFF6FF` | `#1D4ED8` 2.5px | `#1D4ED8` |
| **Collection layer** | `#FFFFFF` | `#3B82F6` 1.5px | `#1E3A8A` |
| **Analysis engines** | `#DBEAFE` | `#2563EB` 1px | `#1E40AF` |
| **Intelligence — Threat** | `#1D4ED8` | `#F59E0B` 2px | `#FFFFFF` (sub `#BFDBFE`) |
| **Intelligence — Compliance** | `#1D4ED8` | `#34D399` 2px | `#FFFFFF` (sub `#BFDBFE`) |
| **Intelligence — Risk** | `#1D4ED8` | `#A78BFA` 2px | `#FFFFFF` (sub `#BFDBFE`) |
| **Dashboard outputs** | `#0D9488` | none | `#FFFFFF` (sub `#CCFBF1`) |
| Cloud provider chips | brand colour | none | `#FFFFFF` |

## Cloud Provider Colours (always keep brand-accurate)

| Provider | Hex |
|---|---|
| Amazon Web Services | `#FF9900` |
| Microsoft Azure | `#0078D4` |
| Google Cloud | `#4285F4` |
| Oracle Cloud (OCI) | `#C74634` |
| Alibaba Cloud | `#FF6A00` |
| IBM Cloud | `#1F70C1` |
| Kubernetes | `#326CE5` |

## Arrows

| Arrow type | Colour | Width | Style |
|---|---|---|---|
| Data flow (intra-platform) | `#2563EB` | 1.5px | dashed (8 4) |
| Cloud → Platform entry | `#2563EB` | 2px | solid block head |
| Output flow (to dashboard) | `#0F766E` | 2px | solid block head |

## Typography

- **Font**: Arial (draw.io default, renders cleanly on export)
- **Section labels**: 8px, BOLD, CAPS, letter-spacing 1.5, colour `#2563EB` (output labels use `#0F766E`)
- **Box titles**: 12–13px bold
- **Box subtitles**: 9–10px normal, colour `#64748B` (or `#CBD5E1` on dark boxes)

## Layer Hierarchy (visual weight — top to bottom)

```
Cloud providers     →  colourful brand chips (identity)
Data Collection     →  white / blue border (raw / clean)
Analysis Engines    →  light blue fill (processing)
Intelligence        →  deep navy fill (synthesis — most important)
Dashboard Outputs   →  teal fill (result delivered to user)
```

## Corner radius

- Cloud chips: `arcSize=20` (~pill)
- Collection & Intelligence boxes: `arcSize=6`
- Analysis engine boxes: `arcSize=10`
- Output boxes: `arcSize=8`
- Platform container: `arcSize=2` (almost square)
