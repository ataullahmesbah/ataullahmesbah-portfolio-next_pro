'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaCheckCircle, FaShieldAlt, FaNodeJs, FaDatabase } from 'react-icons/fa';
import { SiNextdotjs, SiMongodb } from 'react-icons/si';

const RightSideBanner = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const svgRef = useRef(null);

  // Nodes inspired by the Railway.app diagram
  const nodes = [
    { id: 'external_client', x: 10, y: 10, icon: <FaGlobe />, title: "External Client", type: "external" },
    { id: 'cdn', x: 25, y: 20, icon: <FaGlobe />, title: "CDN/Edge", type: "external" },
    { id: 'frontend', x: 40, y: 30, icon: <SiNextdotjs />, title: "Frontend", status: "Just deployed", url: "frontend-prod.up.railway.app", type: "service" },
    { id: 'api_gateway', x: 60, y: 40, icon: <FaShieldAlt />, title: "API Gateway", status: "Just deployed", url: "api-prod.up.railway.app", type: "service" },
    { id: 'backend', x: 60, y: 60, icon: <FaNodeJs />, title: "Backend", status: "Just deployed", url: "backend-prod.up.railway.app", type: "service" },
    { id: 'database', x: 45, y: 80, icon: <SiMongodb />, title: "Database", status: "Just deployed", type: "database" },
    { id: 'analytics', x: 30, y: 50, icon: <FaGlobe />, title: "Analytics", status: "Just deployed", url: "ackee-prod.up.railway.app", type: "service" },
  ];

  // Connections inspired by the Railway.app diagram
  const connections = [
    { from: 'external_client', to: 'cdn', type: 'line' },
    { from: 'cdn', to: 'frontend', type: 'line' },
    { from: 'frontend', to: 'api_gateway', type: 'line' },
    { from: 'api_gateway', to: 'backend', type: 'line' },
    { from: 'backend', to: 'database', type: 'line' },
    { from: 'frontend', to: 'analytics', type: 'curve', controlPoints: [[35, 40], [32, 45]] },
  ];

  // Node animation variants
  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1 + 0.5, type: "spring", stiffness: 120, damping: 15 },
    }),
    hover: { scale: 1.1, boxShadow: "0px 0px 15px rgba(0, 191, 255, 0.8)", zIndex: 100, transition: { duration: 0.3 } },
  };

  // Line animation variants
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut" },
        opacity: { duration: 1.5, ease: "easeInOut" },
      },
    },
  };

  // Helper to get node position by ID
  const getNodePos = (id) => nodes.find((node) => node.id === id);

  // Function to calculate SVG path 'd' attribute for lines/curves
  const getPathD = (conn) => {
    const fromNode = getNodePos(conn.from);
    const toNode = getNodePos(conn.to);
    if (!fromNode || !toNode) return "";

    const nodeHalfSize = 5;
    const startX = fromNode.x + nodeHalfSize;
    const startY = fromNode.y + nodeHalfSize;
    const endX = toNode.x + nodeHalfSize;
    const endY = toNode.y + nodeHalfSize;

    if (conn.type === 'curve' && conn.controlPoints) {
      const cp1 = conn.controlPoints[0];
      const cp2 = conn.controlPoints[1];
      return `M${startX},${startY} C${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]} ${endX},${endY}`;
    }
    return `M${startX},${startY} L${endX},${endY}`;
  };

  // Function to calculate tooltip position dynamically
  const getTooltipStyle = (node) => {
    if (!node || !svgRef.current) return {};

    const svgRect = svgRef.current.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;
    const nodePixelX = (node.x + 5) / 100 * svgWidth;
    const nodePixelY = (node.y + 5) / 100 * svgHeight;

    return {
      left: `${nodePixelX}px`,
      top: `${nodePixelY}px`,
      transform: 'translate(-50%, calc(-100% - 10px))',
    };
  };

  return (
    <motion.div
      className="w-full h-[450px] md:h-[600px] lg:h-[700px] p-4 flex justify-center items-center relative"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="relative w-full h-full max-w-4xl border border-gray-700 rounded-lg shadow-2xl bg-gray-800/60 backdrop-blur-sm overflow-hidden flex items-center justify-center">
        {/* Dashed border effect */}
        <div className="absolute inset-0 border-2 border-dashed border-gray-700 rounded-lg animate-pulse-slow"></div>

        {/* Main SVG for drawing lines and nodes */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {/* Define Arrow Marker */}
          <defs>
            <marker id="arrowhead" markerWidth="3" markerHeight="3" refX="1.5" refY="1.5" orient="auto" markerUnits="strokeWidth">
              <polyline points="0,0 1.5,1.5 0,3" fill="none" stroke="#6B7280" strokeWidth="0.3" />
            </marker>
            <marker id="arrowhead-hover" markerWidth="3" markerHeight="3" refX="1.5" refY="1.5" orient="auto" markerUnits="strokeWidth">
              <polyline points="0,0 1.5,1.5 0,3" fill="none" stroke="#00FFFF" strokeWidth="0.3" />
            </marker>
          </defs>

          {/* Connection Lines */}
          {connections.map((conn, idx) => (
            <motion.path
              key={idx}
              d={getPathD(conn)}
              stroke={hoveredNode && (hoveredNode.id === conn.from || hoveredNode.id === conn.to) ? "#00FFFF" : "#6B7280"}
              strokeWidth="0.3"
              fill="none"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 + idx * 0.1 }}
              markerEnd={hoveredNode && (hoveredNode.id === conn.from || hoveredNode.id === conn.to) ? "url(#arrowhead-hover)" : "url(#arrowhead)"}
            />
          ))}

          {/* Nodes */}
          {nodes.map((node, idx) => (
            <motion.g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              variants={nodeVariants}
              custom={idx}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <rect
                x="0" y="0" width="10" height="10"
                rx="2" ry="2"
                fill={node.type === "external" ? "transparent" : "#2A3240"}
                stroke={hoveredNode?.id === node.id ? "#00FFFF" : (node.type === "external" ? "transparent" : "#4B5563")}
                strokeWidth="0.3"
              />
              <foreignObject x="2" y="2" width="6" height="6">
                <div className="flex items-center justify-center h-full w-full text-white text-lg">
                  {node.icon}
                </div>
              </foreignObject>
              <text x="5" y="13" textAnchor="middle" fontSize="2" fill="#E5E7EB">
                {node.title}
              </text>
              {node.status && (
                <text x="5" y="15" textAnchor="middle" fontSize="1.5" fill="#22C55E">
                  <tspan x="5" dy="0"><FaCheckCircle className="inline-block mr-0.5" size={1.5} /></tspan>
                  {node.status}
                </text>
              )}
              {node.url && (
                <text x="5" y="17" textAnchor="middle" fontSize="1.2" fill="#9CA3AF">
                  {node.url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                </text>
              )}
            </motion.g>
          ))}
        </svg>

        {/* Tooltip for hovered node */}
        {hoveredNode && (
          <motion.div
            className="absolute bg-gray-700/90 border border-blue-500 rounded-md p-2 text-sm text-white shadow-xl z-50 pointer-events-none"
            style={getTooltipStyle(hoveredNode)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-bold text-blue-400 text-base mb-1">{hoveredNode.title}</p>
            {hoveredNode.status && <p className="text-gray-300 text-sm"><FaCheckCircle className="inline-block mr-1 text-green-400" /> {hoveredNode.status}</p>}
            {hoveredNode.url && <p className="text-gray-400 text-xs mt-1 truncate">{hoveredNode.url}</p>}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RightSideBanner;