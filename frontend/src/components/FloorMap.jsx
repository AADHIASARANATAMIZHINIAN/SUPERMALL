import React, { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage } from 'react-konva'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Interactive 2D Floor Map Component
 * Technology: Konva.js (React-Konva) for high-performance canvas rendering
 * Features:
 * - Multi-floor navigation with smooth transitions
 * - Dynamic shop highlighting based on category/search
 * - Click-to-navigate to shop details
 * - Zoom and pan functionality
 * - Responsive design with mobile support
 * - Obsidian Void theme integration
 */

const FLOORS = ['F1', 'F2', 'F3', 'F4', 'F5']

const CATEGORIES = {
  ELECTRONICS: { color: '#6366f1', label: 'Electronics' },
  CLOTHING: { color: '#8b5cf6', label: 'Clothing' },
  GROCERIES: { color: '#10b981', label: 'Groceries' },
  AGRICULTURE: { color: '#f59e0b', label: 'Agriculture' },
  HANDICRAFTS: { color: '#ec4899', label: 'Handicrafts' },
  PHARMACY: { color: '#ef4444', label: 'Pharmacy' },
  BOOKS: { color: '#3b82f6', label: 'Books' },
  SPORTS: { color: '#14b8a6', label: 'Sports' },
  HOME_DECOR: { color: '#a855f7', label: 'Home Decor' },
  JEWELRY: { color: '#f97316', label: 'Jewelry' }
}

const FloorMap = ({ shops = [], onShopClick, activeCategory = null, searchQuery = '' }) => {
  const [currentFloor, setCurrentFloor] = useState('F1')
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hoveredShop, setHoveredShop] = useState(null)
  const [selectedShop, setSelectedShop] = useState(null)
  const stageRef = useRef(null)
  const containerRef = useRef(null)

  // Canvas dimensions
  const STAGE_WIDTH = 1200
  const STAGE_HEIGHT = 800
  const SHOP_SIZE = 100

  // Filter shops by current floor
  const floorShops = shops.filter(shop => shop.floorId === currentFloor)

  // Generate shop layout grid
  const generateShopLayout = (shops) => {
    const layout = []
    const cols = 10
    const rows = 6

    shops.forEach((shop, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      layout.push({
        ...shop,
        x: col * (SHOP_SIZE + 20) + 50,
        y: row * (SHOP_SIZE + 20) + 50,
        width: SHOP_SIZE,
        height: SHOP_SIZE
      })
    })

    return layout
  }

  const shopLayout = generateShopLayout(floorShops)

  // Check if shop matches search/filter criteria
  const isShopHighlighted = (shop) => {
    if (activeCategory && shop.categoryId !== activeCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return shop.name.toLowerCase().includes(query) || 
             shop.description?.toLowerCase().includes(query)
    }
    return true
  }

  // Handle shop click
  const handleShopClick = (shop) => {
    setSelectedShop(shop)
    if (onShopClick) {
      onShopClick(shop)
    }
    toast.success(`Selected: ${shop.name}`)
  }

  // Zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Floor navigation
  const handleFloorChange = (direction) => {
    const currentIndex = FLOORS.indexOf(currentFloor)
    if (direction === 'up' && currentIndex < FLOORS.length - 1) {
      setCurrentFloor(FLOORS[currentIndex + 1])
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentFloor(FLOORS[currentIndex - 1])
    }
  }

  // Shop component
  const ShopRect = ({ shop }) => {
    const isHighlighted = isShopHighlighted(shop)
    const categoryColor = CATEGORIES[shop.categoryId]?.color || '#5f5f7f'
    const isHovered = hoveredShop?._id === shop._id
    const isSelected = selectedShop?._id === shop._id

    return (
      <Group
        x={shop.x}
        y={shop.y}
        onClick={() => handleShopClick(shop)}
        onMouseEnter={() => setHoveredShop(shop)}
        onMouseLeave={() => setHoveredShop(null)}
      >
        {/* Shop rectangle */}
        <Rect
          width={shop.width}
          height={shop.height}
          fill={isHighlighted ? categoryColor : '#35354d'}
          stroke={isSelected ? '#10b981' : isHovered ? '#6366f1' : '#4a4a66'}
          strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
          cornerRadius={8}
          opacity={isHighlighted ? 1 : 0.5}
          shadowColor={isHovered ? categoryColor : 'black'}
          shadowBlur={isHovered ? 15 : 5}
          shadowOpacity={isHovered ? 0.6 : 0.3}
        />

        {/* Shop name */}
        <Text
          text={shop.name}
          width={shop.width}
          height={shop.height}
          align="center"
          verticalAlign="middle"
          fill="#e1e1e6"
          fontSize={12}
          fontFamily="Inter"
          fontStyle="bold"
          padding={10}
          wrap="word"
        />

        {/* Shop number badge */}
        <Rect
          x={5}
          y={5}
          width={30}
          height={20}
          fill="#0a0a0f"
          cornerRadius={4}
        />
        <Text
          text={shop.location?.shopNumber || (shops.indexOf(shop) + 1).toString()}
          x={5}
          y={5}
          width={30}
          height={20}
          align="center"
          verticalAlign="middle"
          fill="#6366f1"
          fontSize={10}
          fontFamily="Fira Code"
        />

        {/* Status indicator */}
        {shop.status === 'active' && (
          <Rect
            x={shop.width - 15}
            y={5}
            width={10}
            height={10}
            fill="#10b981"
            cornerRadius={5}
          />
        )}
      </Group>
    )
  }

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Floor selector */}
        <div className="card glass p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFloorChange('down')}
              disabled={currentFloor === FLOORS[0]}
              className="btn-ghost p-2 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-accent-primary px-4">
              Floor {currentFloor}
            </span>
            <button
              onClick={() => handleFloorChange('up')}
              disabled={currentFloor === FLOORS[FLOORS.length - 1]}
              className="btn-ghost p-2 disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="card glass p-2 flex flex-col gap-1">
          <button onClick={handleZoomIn} className="btn-ghost p-2">
            <ZoomIn size={20} />
          </button>
          <button onClick={handleZoomOut} className="btn-ghost p-2">
            <ZoomOut size={20} />
          </button>
          <button onClick={handleReset} className="btn-ghost p-2">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Shop info panel */}
      {hoveredShop && (
        <div className="absolute top-4 right-4 z-10 card glass p-4 max-w-xs animate-fade-in">
          <h3 className="font-bold text-accent-primary">{hoveredShop.name}</h3>
          <p className="text-sm text-obsidian-300 mt-1">{hoveredShop.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="badge badge-primary">
              {CATEGORIES[hoveredShop.categoryId]?.label}
            </span>
            <span className="badge badge-success">{hoveredShop.status}</span>
          </div>
          {hoveredShop.contact?.phone && (
            <p className="text-xs text-obsidian-400 mt-2">
              📞 {hoveredShop.contact.phone}
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 card glass p-3 max-w-md">
        <h4 className="text-sm font-bold mb-2">Categories</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CATEGORIES).slice(0, 6).map(([key, { color, label }]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full h-full bg-void-light rounded-xl overflow-hidden">
        <Stage
          ref={stageRef}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y()
            })
          }}
        >
          <Layer>
            {/* Background grid */}
            {Array.from({ length: 20 }).map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                <Rect
                  x={i * 60}
                  y={0}
                  width={1}
                  height={STAGE_HEIGHT}
                  fill="#1a1a24"
                />
                <Rect
                  x={0}
                  y={i * 60}
                  width={STAGE_WIDTH}
                  height={1}
                  fill="#1a1a24"
                />
              </React.Fragment>
            ))}

            {/* Floor label */}
            <Text
              text={`FLOOR ${currentFloor}`}
              x={STAGE_WIDTH / 2 - 100}
              y={20}
              width={200}
              align="center"
              fontSize={32}
              fontFamily="Inter"
              fontStyle="bold"
              fill="#2a2a3d"
            />

            {/* Shops */}
            {shopLayout.map((shop) => (
              <ShopRect key={shop._id} shop={shop} />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 right-4 z-10 card glass p-3">
        <p className="text-sm">
          <span className="text-obsidian-400">Shops on this floor:</span>{' '}
          <span className="font-bold text-accent-primary">{floorShops.length}</span>
        </p>
      </div>
    </div>
  )
}

export default FloorMap
