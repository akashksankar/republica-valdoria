import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Region, MapLayerType, GameState } from '../../types/game';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  TrendingUp, 
  Users, 
  Coins, 
  Briefcase, 
  Factory, 
  ShieldCheck, 
  Vote, 
  Home, 
  Leaf,
  Compass,
  Building
} from 'lucide-react';

interface GodViewMapProps {
  state: GameState;
  onSelectRegion: (regionId: string) => void;
  onSelectLayer: (layer: MapLayerType) => void;
}

export const GodViewMap: React.FC<GodViewMapProps> = ({
  state,
  onSelectRegion,
  onSelectLayer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera transform state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);

  // Animation frame reference
  const animFrameRef = useRef<number | null>(null);
  const timeTickRef = useRef<number>(0);

  // Touch handling for pinch-zoom
  const lastTouchDistRef = useRef<number | null>(null);

  // Reset Camera
  const handleResetCamera = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  // Center on a specific region
  const handleFlyTo = useCallback((reg: Region) => {
    if (!canvasRef.current) return;
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    // Map base coordinates are 0-1000. Center is 500, 500.
    const targetPanX = (500 - reg.mapX) * 1.2;
    const targetPanY = (500 - reg.mapY) * 1.2;
    setZoom(1.4);
    setPan({ x: targetPanX, y: targetPanY });
  }, []);

  // Map layers definitions
  const LAYER_OPTIONS: { id: MapLayerType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'standard', label: 'Standard Physical', icon: Eye, color: 'text-amber-400' },
    { id: 'gdp', label: 'GDP & Commerce', icon: TrendingUp, color: 'text-emerald-400' },
    { id: 'population', label: 'Population Density', icon: Users, color: 'text-sky-400' },
    { id: 'wealth', label: 'Household Wealth', icon: Coins, color: 'text-yellow-400' },
    { id: 'unemployment', label: 'Labor & Jobless', icon: Briefcase, color: 'text-rose-400' },
    { id: 'industry', label: 'Industrial Output', icon: Factory, color: 'text-orange-400' },
    { id: 'infrastructure', label: 'Infrastructure Index', icon: ShieldCheck, color: 'text-indigo-400' },
    { id: 'political', label: 'Political Control', icon: Vote, color: 'text-purple-400' },
    { id: 'realestate', label: 'Real Estate Valuations', icon: Home, color: 'text-teal-400' },
    { id: 'environmental', label: 'Ecology & Risk', icon: Leaf, color: 'text-green-400' },
  ];

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      timeTickRef.current += 0.02;
      const t = timeTickRef.current;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Background sea gradient (ambient deep ocean)
      const oceanGrad = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.1,
        width / 2, height / 2, width * 0.8
      );
      oceanGrad.addColorStop(0, '#0f2744');
      oceanGrad.addColorStop(0.5, '#0a192f');
      oceanGrad.addColorStop(1, '#030816');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // Transform coordinate system for God-view isometric tilt & pan/zoom
      ctx.save();
      ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
      ctx.scale(zoom, zoom * 0.85); // 0.85 Y-scale gives subtle elevated 75° isometric tilt

      // Coordinate mapping: map center is at (0, 0)
      const toScreenX = (x: number) => (x - 500) * 1.1;
      const toScreenY = (y: number) => (y - 500) * 1.1;

      // 1. Draw Island / Landmass Cutaway Base (stratified cliffs and turquoise shoals)
      drawCoastlineAndShoals(ctx, t);
      drawLandmass(ctx, state.selectedLayer);
      drawInfrastructure(ctx, state.regions, t);
      drawActiveLayerVisuals(ctx, state.regions, state.selectedLayer, t);
      drawSettlementsAndLandmarks(ctx, state.regions, t, hoveredRegion);
      drawMovingLogistics(ctx, t);

      ctx.restore(); // end map transform

      ctx.restore(); // end base scale

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [pan, zoom, state.regions, state.selectedLayer, hoveredRegion]);

  // Helper: Draw animated coastal shoals and stratified drop-cliffs
  const drawCoastlineAndShoals = (ctx: CanvasRenderingContext2D, t: number) => {
    // Outer Turquoise Coastal Waters
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 40, 520, 390, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
    ctx.fill();

    // Wave ripples around island
    for (let r = 0; r < 3; r++) {
      const ripplePhase = (t * 0.8 + r * 1.5) % 4;
      ctx.beginPath();
      ctx.ellipse(0, 40, 510 + ripplePhase * 15, 380 + ripplePhase * 12, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 0.18 - ripplePhase * 0.04)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Stratified 3D Cliff Rim (gives elevated landmass depth like reference image)
    ctx.beginPath();
    ctx.ellipse(0, 65, 480, 340, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b'; // Rock foundation base
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 50, 475, 335, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#334155'; // Mid-cliff stratum
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 35, 470, 330, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#475569'; // Upper shelf rock
    ctx.fill();

    // Sandy Shoreline rim
    ctx.beginPath();
    ctx.ellipse(0, 25, 465, 325, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();

    ctx.restore();
  };

  // Helper: Draw the main topography of Valdoria
  const drawLandmass = (ctx: CanvasRenderingContext2D, layer: MapLayerType) => {
    ctx.save();

    // Main island surface
    ctx.beginPath();
    ctx.ellipse(0, 15, 455, 315, 0, 0, Math.PI * 2);
    
    // Rich topographical gradient: Northern highlands, fertile greenridge valleys, coastal sands
    const landGrad = ctx.createLinearGradient(0, -300, 0, 300);
    landGrad.addColorStop(0, '#1e293b'); // Northmark highlands granite
    landGrad.addColorStop(0.3, '#334155'); // Midland plateau
    landGrad.addColorStop(0.55, '#164e63'); // River basin
    landGrad.addColorStop(0.85, '#064e3b'); // Greenridge agricultural green
    landGrad.addColorStop(1, '#0f172a'); // Coastal rim
    ctx.fillStyle = landGrad;
    ctx.fill();

    // Inner contouring: Green agricultural plains in southwest
    ctx.beginPath();
    ctx.ellipse(-210, 80, 160, 120, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
    ctx.fill();

    // Northern Highlands Mountain Ridge (Northmark)
    ctx.beginPath();
    ctx.ellipse(0, -200, 180, 75, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
    ctx.fill();

    // Major River System (Flows from Northmark through Aurelia and out near Port Azure & Greenridge)
    ctx.beginPath();
    ctx.moveTo(10, -200);
    ctx.bezierCurveTo(-20, -100, 20, -40, 0, 20);
    ctx.bezierCurveTo(-30, 80, -90, 140, -120, 220);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // River tributary to Port Azure
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.bezierCurveTo(20, 90, 0, 160, 0, 210);
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Horseshoe Seawall harbor basin at Port Azure (Iconic reference shape!)
    drawPortAzureHarbor(ctx);

    ctx.restore();
  };

  // Draw the iconic Horseshoe Naval / Freight Harbor at Port Azure (inspired by reference image)
  const drawPortAzureHarbor = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const hx = 0;
    const hy = 220;

    // Protected inner blue water pool
    ctx.beginPath();
    ctx.arc(hx, hy, 90, 0.2 * Math.PI, 0.8 * Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#0369a1';
    ctx.fill();

    // Curved Stone Fortress Seawall with opening
    ctx.beginPath();
    ctx.arc(hx, hy, 105, 0.25 * Math.PI, 0.75 * Math.PI, true);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 18;
    ctx.lineCap = 'butt';
    ctx.stroke();

    // Upper parapet highlight
    ctx.beginPath();
    ctx.arc(hx, hy, 105, 0.25 * Math.PI, 0.75 * Math.PI, true);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Harbor gateway watchtowers
    const angleLeft = 0.75 * Math.PI;
    const angleRight = 0.25 * Math.PI;
    const lx = hx + Math.cos(angleLeft) * 105;
    const ly = hy + Math.sin(angleLeft) * 105;
    const rx = hx + Math.cos(angleRight) * 105;
    const ry = hy + Math.sin(angleRight) * 105;

    // Left tower
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(lx - 8, ly - 8, 16, 16);
    // Right tower
    ctx.fillRect(rx - 8, ry - 8, 16, 16);

    // Inner docks / piers
    for (let p = -2; p <= 2; p++) {
      const px = hx + p * 25;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(px - 4, hy - 40, 8, 32);
    }

    ctx.restore();
  };

  // Helper: Draw roads, highways, railways
  const drawInfrastructure = (ctx: CanvasRenderingContext2D, regions: Region[], t: number) => {
    ctx.save();

    // Draw arterial highways connecting all major hubs
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);

    // Aurelia to Port Azure Highway (Avenue of the Republic)
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(0, 160);
    ctx.stroke();

    // Aurelia to Novara Highway
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(260, -140);
    ctx.stroke();

    // Aurelia to Ironvale Heavy Rail
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(-260, -100);
    ctx.stroke();

    // Ironvale to Port Azure Freight Line
    ctx.beginPath();
    ctx.moveTo(-260, -100);
    ctx.lineTo(0, 160);
    ctx.stroke();

    // Novara to Eastford & Solmere
    ctx.beginPath();
    ctx.moveTo(260, -140);
    ctx.lineTo(240, 0);
    ctx.lineTo(240, 140);
    ctx.stroke();

    // Railway track hatching overlay (Aurelia - Ironvale)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(-260, -100);
    ctx.stroke();

    ctx.restore();
  };

  // Helper: Draw analytical thematic layers
  const drawActiveLayerVisuals = (
    ctx: CanvasRenderingContext2D,
    regions: Region[],
    layer: MapLayerType,
    t: number
  ) => {
    if (layer === 'standard') return;

    ctx.save();
    regions.forEach((reg) => {
      const rx = (reg.mapX - 500) * 1.1;
      const ry = (reg.mapY - 500) * 1.1;

      let radius = 60;
      let fillColor = 'rgba(245, 158, 11, 0.2)';
      let label = '';

      switch (layer) {
        case 'gdp':
          radius = 45 + (reg.gdpBillion / 120) * 45;
          fillColor = 'rgba(16, 185, 129, 0.35)';
          label = `${reg.gdpBillion}B VLC`;
          break;
        case 'population':
          radius = 40 + (reg.population / 2200000) * 50;
          fillColor = 'rgba(14, 165, 233, 0.35)';
          label = `${(reg.population / 1000000).toFixed(1)}M`;
          break;
        case 'wealth':
          radius = 40 + (reg.wealthScore / 100) * 45;
          fillColor = 'rgba(234, 179, 8, 0.35)';
          label = `Idx ${reg.wealthScore}`;
          break;
        case 'unemployment':
          radius = 35 + (reg.unemploymentPercent / 8) * 45;
          fillColor = reg.unemploymentPercent > 5.5 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.3)';
          label = `${reg.unemploymentPercent}%`;
          break;
        case 'industry':
          radius = 40 + (reg.industrialOutputScore / 100) * 50;
          fillColor = 'rgba(249, 115, 22, 0.35)';
          label = `Prod ${reg.industrialOutputScore}`;
          break;
        case 'infrastructure':
          radius = 40 + (reg.infrastructureScore / 100) * 45;
          fillColor = 'rgba(99, 102, 241, 0.35)';
          label = `Infra ${reg.infrastructureScore}`;
          break;
        case 'political':
          radius = 55;
          fillColor = reg.dominantPartyId === 'ndp' ? 'rgba(2, 132, 199, 0.38)'
            : reg.dominantPartyId === 'fma' ? 'rgba(245, 158, 11, 0.38)'
            : reg.dominantPartyId === 'sdu' ? 'rgba(220, 38, 38, 0.38)'
            : 'rgba(22, 163, 74, 0.38)';
          label = reg.dominantPartyId.toUpperCase();
          break;
        case 'realestate':
          radius = 40 + (reg.avgLandPriceSqM / 4500) * 45;
          fillColor = 'rgba(20, 184, 166, 0.35)';
          label = `${reg.avgLandPriceSqM} VLC/m²`;
          break;
        case 'environmental':
          radius = 40 + (reg.environmentalScore / 100) * 45;
          fillColor = reg.environmentalScore > 70 ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)';
          label = `Eco ${reg.environmentalScore}`;
          break;
      }

      // Pulsing choropleth bubble
      const pulse = Math.sin(t * 2 + rx * 0.05) * 4;
      ctx.beginPath();
      ctx.arc(rx, ry, radius + pulse, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Label on the map
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(label, rx, ry + radius + 16);
    });
    ctx.restore();
  };

  // Helper: Draw landmarks and cities (Aurelia Citadel, Port Azure Docks, Novara Silicon Campus, etc.)
  const drawSettlementsAndLandmarks = (
    ctx: CanvasRenderingContext2D,
    regions: Region[],
    t: number,
    hovered: Region | null
  ) => {
    regions.forEach((reg) => {
      const rx = (reg.mapX - 500) * 1.1;
      const ry = (reg.mapY - 500) * 1.1;
      const isHovered = hovered?.id === reg.id;

      ctx.save();
      ctx.translate(rx, ry);

      // Elevated drop shadow
      ctx.beginPath();
      ctx.ellipse(8, 12, 28, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      // Specific Landmark rendering based on region type
      if (reg.type === 'capital') {
        // Aurelia Sovereign Citadel (Neoclassical stepped fortress with gold dome)
        drawCitadelGraphic(ctx, t, isHovered);
      } else if (reg.type === 'port') {
        // Port Azure Container Hub & Cranes
        drawPortHubGraphic(ctx, t, isHovered);
      } else if (reg.type === 'tech') {
        // Novara Quantum Fabricator
        drawTechParkGraphic(ctx, t, isHovered);
      } else if (reg.type === 'industrial') {
        // Ironvale Heavy Foundry
        drawFoundryGraphic(ctx, t, isHovered);
      } else if (reg.type === 'agrarian') {
        // Greenridge Silos & Granary
        drawGranaryGraphic(ctx, isHovered);
      } else if (reg.type === 'coastal') {
        // Solmere Marina & Resort
        drawMarinaGraphic(ctx, isHovered);
      } else if (reg.type === 'mining') {
        // Northmark Granite Quarry
        drawQuarryGraphic(ctx, isHovered);
      } else {
        // Eastford Transit Junction
        drawMetropolisGraphic(ctx, isHovered);
      }

      // City Name Banner & Badge
      const bannerY = -34;
      ctx.font = 'bold 12px Cinzel, serif';
      ctx.textAlign = 'center';

      // Badge background pill
      const textWidth = ctx.measureText(reg.name).width;
      ctx.fillStyle = isHovered ? '#0284c7' : 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = isHovered ? '#38bdf8' : '#475569';
      ctx.lineWidth = 1.5;

      const bw = textWidth + 24;
      const bh = 22;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, bannerY - 14, bw, bh, 4);
      ctx.fill();
      ctx.stroke();

      // Text label
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(reg.name.toUpperCase(), 0, bannerY + 1);

      // Facility indicator dot
      ctx.beginPath();
      ctx.arc(-bw / 2 + 8, bannerY - 3, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = reg.highlightColor;
      ctx.fill();

      // Selection Bracket if hovered
      if (isHovered) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        const boxSize = 36;
        // 4 corners
        ctx.beginPath();
        // Top-left
        ctx.moveTo(-boxSize, -boxSize + 10);
        ctx.lineTo(-boxSize, -boxSize);
        ctx.lineTo(-boxSize + 10, -boxSize);
        // Top-right
        ctx.moveTo(boxSize - 10, -boxSize);
        ctx.lineTo(boxSize, -boxSize);
        ctx.lineTo(boxSize, -boxSize + 10);
        // Bottom-left
        ctx.moveTo(-boxSize, boxSize - 10);
        ctx.lineTo(-boxSize, boxSize);
        ctx.lineTo(-boxSize + 10, boxSize);
        // Bottom-right
        ctx.moveTo(boxSize - 10, boxSize);
        ctx.lineTo(boxSize, boxSize);
        ctx.lineTo(boxSize, boxSize - 10);
        ctx.stroke();
      }

      ctx.restore();
    });
  };

  // Landmark: Aurelia Sovereign Citadel
  const drawCitadelGraphic = (ctx: CanvasRenderingContext2D, t: number, isHovered: boolean) => {
    // Stepped terrace
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-22, -10, 44, 20);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-16, -18, 32, 14);

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-10, -26, 20, 10);

    // Gold central cupola
    ctx.beginPath();
    ctx.arc(0, -28, 7, Math.PI, 0);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // National flag on spire
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(0, -38);
    ctx.stroke();

    // Waving flag
    const wave = Math.sin(t * 4) * 2;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(0, -38);
    ctx.lineTo(8 + wave, -35);
    ctx.lineTo(0, -32);
    ctx.fill();
  };

  // Landmark: Port Azure Docks & Gantry Cranes
  const drawPortHubGraphic = (ctx: CanvasRenderingContext2D, t: number, isHovered: boolean) => {
    // Dock platform
    ctx.fillStyle = '#475569';
    ctx.fillRect(-24, -8, 48, 16);

    // Gantry Crane (Orange)
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, 8);
    ctx.lineTo(-8, -20);
    ctx.lineTo(16, -20);
    ctx.stroke();

    // Container stacks
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-6, -4, 10, 8);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(4, -4, 10, 8);
  };

  // Landmark: Novara Tech Park
  const drawTechParkGraphic = (ctx: CanvasRenderingContext2D, t: number, isHovered: boolean) => {
    // Clean glass hexagon dome
    ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x = Math.cos(a) * 18;
      const y = Math.sin(a) * 14;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing core
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();
  };

  // Landmark: Ironvale Bessemer Foundry
  const drawFoundryGraphic = (ctx: CanvasRenderingContext2D, t: number, isHovered: boolean) => {
    // Brick industrial building
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-18, -10, 36, 18);

    // Two smokestacks
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-12, -22, 6, 14);
    ctx.fillRect(6, -22, 6, 14);

    // Animated chimney smoke
    const s1 = Math.sin(t * 3) * 3;
    const s2 = Math.cos(t * 3) * 3;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.beginPath();
    ctx.arc(-9 + s1, -26, 4, 0, Math.PI * 2);
    ctx.arc(9 + s2, -26, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  // Landmark: Greenridge Granary
  const drawGranaryGraphic = (ctx: CanvasRenderingContext2D, isHovered: boolean) => {
    // Cylindrical silos
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(-8, -4, 8, 0, Math.PI * 2);
    ctx.arc(8, -4, 8, 0, Math.PI * 2);
    ctx.fill();

    // Windmill blades
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 2);
    ctx.moveTo(-10, -8);
    ctx.lineTo(10, -8);
    ctx.stroke();
  };

  // Landmark: Solmere Luxury Marina
  const drawMarinaGraphic = (ctx: CanvasRenderingContext2D, isHovered: boolean) => {
    // Curved marina quay
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0.3 * Math.PI, 1.2 * Math.PI);
    ctx.stroke();

    // Moored luxury yacht
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 2, 10, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
  };

  // Landmark: Northmark Mining Quarry
  const drawQuarryGraphic = (ctx: CanvasRenderingContext2D, isHovered: boolean) => {
    // Terraced concentric quarry pit
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Extraction derrick
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(-6, 2);
    ctx.lineTo(6, 2);
    ctx.closePath();
    ctx.stroke();
  };

  // Landmark: Eastford Metropolis
  const drawMetropolisGraphic = (ctx: CanvasRenderingContext2D, isHovered: boolean) => {
    // Clustered high-rise silhouettes
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-16, -16, 8, 22);
    ctx.fillStyle = '#db2777';
    ctx.fillRect(-6, -22, 10, 28);
    ctx.fillStyle = '#be185d';
    ctx.fillRect(6, -14, 8, 20);
  };

  // Helper: Draw moving logistics (freight ships sailing into Port Azure, train on tracks)
  const drawMovingLogistics = (ctx: CanvasRenderingContext2D, t: number) => {
    ctx.save();

    // 1. Merchant Galleon / Container Vessel entering Port Azure from South
    const shipCycle = (t * 0.15) % 1;
    const shipY = 320 - shipCycle * 90;
    const shipX = 0 + Math.sin(t * 0.8) * 8;

    // Wake trail behind ship
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(shipX, shipY + 12);
    ctx.lineTo(shipX - 10, shipY + 28);
    ctx.moveTo(shipX, shipY + 12);
    ctx.lineTo(shipX + 10, shipY + 28);
    ctx.stroke();

    // Ship hull
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(shipX, shipY, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sail / superstructure
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(shipX - 3, shipY - 6, 6, 5);

    // 2. Heavy Freight Train running between Ironvale (-260, -100) and Aurelia (0, -110)
    const trainCycle = (t * 0.2) % 1;
    const trainX = -260 + trainCycle * 260;
    const trainY = -100 - trainCycle * 10;

    ctx.fillStyle = '#f97316';
    ctx.fillRect(trainX - 8, trainY - 3, 16, 6);

    ctx.restore();
  };

  // Mouse / Touch Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    // Hit test regions
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    // Convert mouse screen coordinates back into map space
    const centerScreenX = width / 2 + pan.x;
    const centerScreenY = height / 2 + pan.y;

    const mapXRel = (clickX - centerScreenX) / zoom;
    const mapYRel = (clickY - centerScreenY) / (zoom * 0.85);

    // Convert to 0-1000 base coordinates
    const unmappedX = mapXRel / 1.1 + 500;
    const unmappedY = mapYRel / 1.1 + 500;

    let found: Region | null = null;
    for (const reg of state.regions) {
      const dist = Math.hypot(reg.mapX - unmappedX, reg.mapY - unmappedY);
      if (dist < 40) {
        found = reg;
        break;
      }
    }
    setHoveredRegion(found);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredRegion) {
      onSelectRegion(hoveredRegion.id);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(2.5, Math.max(0.6, prev * zoomFactor)));
  };

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / lastTouchDistRef.current;
      setZoom((prev) => Math.min(2.5, Math.max(0.6, prev * ratio)));
      lastTouchDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistRef.current = null;
  };

  const currentLayerObj = LAYER_OPTIONS.find((l) => l.id === state.selectedLayer) || LAYER_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Strategic Layer Selector (Top Left Floating Pill) */}
      <div className="absolute top-3 left-3 z-20">
        <button
          id="map-layer-selector-btn"
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 shadow-xl transition-all"
        >
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline text-slate-400">LAYER:</span>
          <span className="text-sky-300 font-bold">{currentLayerObj.label}</span>
        </button>

        {/* Dropdown Layer Menu */}
        {isLayerMenuOpen && (
          <div className="absolute top-12 left-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-xl shadow-2xl p-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 py-1 mb-1">
              Select Strategic Layer
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {LAYER_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = state.selectedLayer === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectLayer(opt.id);
                      setIsLayerMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? 'bg-sky-950/80 border border-sky-600/60 text-sky-200'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Camera Navigation Controls (Bottom Right Floating Bar) */}
      <div className="absolute bottom-20 sm:bottom-6 right-3 sm:right-6 z-20 flex flex-col items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 border border-slate-800 rounded-xl shadow-2xl">
        <button
          id="zoom-in-btn"
          onClick={() => setZoom((prev) => Math.min(2.5, prev * 1.2))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="zoom-out-btn"
          onClick={() => setZoom((prev) => Math.max(0.6, prev * 0.8))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-5 h-px bg-slate-800 my-0.5" />
        <button
          id="reset-cam-btn"
          onClick={handleResetCamera}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick City Navigation Strip (Top Right) */}
      <div className="absolute top-3 right-3 z-20 hidden md:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2 flex items-center gap-1">
          <Compass className="w-3 h-3 text-amber-400" /> SECTOR:
        </span>
        {state.regions.slice(0, 5).map((r) => (
          <button
            key={r.id}
            onClick={() => handleFlyTo(r)}
            className="px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Active Hover / Selected Region Card (Bottom Left) */}
      {hoveredRegion && (
        <div className="absolute bottom-20 sm:bottom-6 left-3 sm:left-6 z-20 max-w-xs sm:max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredRegion.highlightColor }} />
                <h3 className="font-serif-cinzel font-bold text-base text-white tracking-wide">
                  {hoveredRegion.name}
                </h3>
              </div>
              <p className="text-[11px] text-amber-300 font-medium">
                {hoveredRegion.tagline}
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider font-mono">
              {hoveredRegion.type}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 mb-3">
            {hoveredRegion.description}
          </p>

          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center mb-3">
            <div>
              <div className="text-[10px] text-slate-400">GDP</div>
              <div className="font-mono text-xs font-bold text-emerald-400">
                {hoveredRegion.gdpBillion}B
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">POPULATION</div>
              <div className="font-mono text-xs font-bold text-sky-400">
                {(hoveredRegion.population / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">UNEMPLOYMENT</div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {hoveredRegion.unemploymentPercent}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{hoveredRegion.keyFacility.name}</span>
            </div>
            <button
              id={`inspect-region-${hoveredRegion.id}`}
              onClick={() => onSelectRegion(hoveredRegion.id)}
              className="shrink-0 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-bold rounded-lg shadow transition-all"
            >
              Inspect Region
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
