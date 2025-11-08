"use client"
import { useState } from "react"

interface Node {
  id: string
  name: string
  type: "central" | "coaccused"
  caseCount: number
}

interface Edge {
  from: string
  to: string
  caseCount: number
}

interface NetworkData {
  nodes: Node[]
  edges: Edge[]
}

interface AccusedNetworkGraphProps {
  networkData: NetworkData
}

export const AccusedNetworkGraph = ({ networkData }: AccusedNetworkGraphProps) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  if (!networkData?.nodes || networkData.nodes.length === 0) {
    return <p className="text-muted-foreground text-sm">No network data available</p>
  }

  const centralNode = networkData.nodes.find((n) => n.type === "central")
  const coaccused = networkData.nodes.filter((n) => n.type === "coaccused")

  return (
    <div className="space-y-6">
      {/* SVG Network Visualization */}
      <div className="bg-muted rounded-lg p-8 overflow-x-auto">
        <svg viewBox="0 0 800 400" className="w-full min-w-max" style={{ minHeight: "400px" }}>
          {/* Draw edges */}
          {networkData.edges?.map((edge, i) => {
            const fromNode = networkData.nodes.find((n) => n.id === edge.from)
            const toNode = networkData.nodes.find((n) => n.id === edge.to)
            if (!fromNode || !toNode) return null

            const fromX = fromNode.type === "central" ? 400 : 200 + Math.random() * 400
            const fromY = fromNode.type === "central" ? 200 : 100 + Math.random() * 200
            const toX = toNode.type === "central" ? 400 : 200 + Math.random() * 400
            const toY = toNode.type === "central" ? 200 : 100 + Math.random() * 200

            return (
              <line key={i} x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="rgba(100, 100, 200, 0.3)" strokeWidth="2" />
            )
          })}

          {/* Draw central node */}
          {centralNode && (
            <g key={centralNode.id}>
              <circle cx="400" cy="200" r="35" fill="#6366f1" opacity="0.8" />
              <text x="400" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {centralNode.name.split(" ")[0]}
              </text>
            </g>
          )}

          {/* Draw co-accused nodes */}
          {coaccused.map((node, i) => {
            const angle = (i / coaccused.length) * Math.PI * 2
            const x = 400 + Math.cos(angle) * 200
            const y = 200 + Math.sin(angle) * 150

            return (
              <g key={node.id} onClick={() => setSelectedNode(node.id)} style={{ cursor: "pointer" }}>
                <circle
                  cx={x}
                  cy={y}
                  r="25"
                  fill={selectedNode === node.id ? "#a855f7" : "#8b5cf6"}
                  opacity="0.7"
                  stroke={selectedNode === node.id ? "#d946ef" : "transparent"}
                  strokeWidth="2"
                />
                <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                  {node.name.split(" ")[0]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Co-accused List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coaccused.map((node) => (
          <div
            key={node.id}
            onClick={() => setSelectedNode(node.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedNode === node.id ? "bg-primary/10 border-primary" : "bg-muted border-border hover:border-primary"
            }`}
          >
            <p className="font-semibold text-foreground">{node.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{node.caseCount} shared cases</p>
          </div>
        ))}
      </div>
    </div>
  )
}
