"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, RefreshCw, Database, ExternalLink, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAudio } from "@/components/audio-provider"

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    timestamp: "2023-05-15 12:34:56",
    txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    dataType: "Stock",
    status: "confirmed",
    blockNumber: 12345678,
  },
  {
    id: "2",
    timestamp: "2023-05-15 12:30:22",
    txHash: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a",
    dataType: "Delivery",
    status: "confirmed",
    blockNumber: 12345677,
  },
  {
    id: "3",
    timestamp: "2023-05-15 12:25:18",
    txHash: "0xz1x2c3v4b5n6m7a8s9d0f1g2h3j4k5l6p7o8i9u",
    dataType: "Stock",
    status: "confirmed",
    blockNumber: 12345676,
  },
  {
    id: "4",
    timestamp: "2023-05-15 12:20:05",
    txHash: "0xq1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9",
    dataType: "Stock",
    status: "confirmed",
    blockNumber: 12345675,
  },
  {
    id: "5",
    timestamp: "2023-05-15 12:15:42",
    txHash: "0xm1n2b3v4c5x6z7l8k9j0h1g2f3d4s5a6p7o8i9",
    dataType: "Delivery",
    status: "confirmed",
    blockNumber: 12345674,
  },
]

export function BlockchainSync() {
  const { toast } = useToast()
  const { playSound } = useAudio()
  const [isConnected, setIsConnected] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState(new Date())
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [transactions, setTransactions] = useState(mockTransactions)
  const [inventoryHash] = useState("QmXyZ123abcDEF456ghiJKL789mnoPQR")

  // Update seconds ago counter
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000)
      setSecondsAgo(diffInSeconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [lastSyncTime])

  // Simulate random connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // 95% chance to stay connected, 5% chance to disconnect
      if (Math.random() > 0.95) {
        setIsConnected(false)
        playSound("error")

        // Reconnect after 3 seconds
        setTimeout(() => {
          setIsConnected(true)
          playSound("success")
          setLastSyncTime(new Date())
        }, 3000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [playSound])

  const handleManualSync = () => {
    setIsSyncing(true)
    playSound("click")

    // Simulate sync process
    setTimeout(() => {
      const newTx = {
        id: String(Date.now()),
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
        dataType: Math.random() > 0.5 ? "Stock" : "Delivery",
        status: "pending",
        blockNumber: 0,
      }

      setTransactions([newTx, ...transactions])

      // Simulate confirmation after 2 seconds
      setTimeout(() => {
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === newTx.id
              ? {
                  ...tx,
                  status: "confirmed",
                  blockNumber: 12345678 + Math.floor(Math.random() * 10),
                }
              : tx,
          ),
        )
        setIsSyncing(false)
        setLastSyncTime(new Date())
        setSecondsAgo(0)
        playSound("success")

        toast({
          title: "Blockchain Sync Complete",
          description: "Your inventory data has been successfully synced to the blockchain.",
        })
      }, 2000)
    }, 1000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    playSound("click")
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blockchain Sync</h1>
        <Button onClick={handleManualSync} disabled={isSyncing}>
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Force Sync Now
            </>
          )}
        </Button>
      </div>

      {/* Sync Status Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${isConnected ? "bg-green-100" : "bg-red-100"}`}
                >
                  {isConnected ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">Network Status</div>
                  <div className="flex items-center">
                    <Badge className={isConnected ? "bg-green-500" : "bg-red-500"}>
                      {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                    <span className="ml-2 text-sm text-gray-500">Polygon Mumbai Testnet</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Last Sync</div>
                  <div className="text-sm text-gray-500">
                    {lastSyncTime.toLocaleTimeString()}, {secondsAgo} sec ago
                  </div>
                  <div className="text-xs text-gray-400">Auto-sync every 5 minutes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Hash Viewer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Hash Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium mb-2">Inventory Hash (IPFS)</div>
                  <div className="flex items-center">
                    <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-x-auto">{inventoryHash}</code>
                    <Button variant="ghost" size="icon" className="ml-2" onClick={() => copyToClipboard(inventoryHash)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium mb-2">Smart Contract Address</div>
                  <div className="flex items-center">
                    <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-x-auto">
                      0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard("0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => playSound("click")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Polygonscan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">TX Hash</th>
                    <th className="px-4 py-3">Data Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Block</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm">{tx.timestamp}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <span className="truncate w-24 md:w-40">{tx.txHash}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => copyToClipboard(tx.txHash)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={tx.dataType === "Stock" ? "default" : "secondary"}>{tx.dataType}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          {tx.status === "confirmed" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin mr-1" />
                          )}
                          <span className={tx.status === "confirmed" ? "text-green-600" : "text-yellow-600"}>
                            {tx.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{tx.status === "confirmed" ? tx.blockNumber : "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-blue-600"
                          onClick={() => playSound("click")}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technical Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium mb-2">Smart Contract</div>
                  <div className="text-sm text-gray-600">
                    <p>ERC-1155 based inventory tracking</p>
                    <p>Automated stock reconciliation</p>
                    <p>On-chain delivery verification</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium mb-2">Data Storage</div>
                  <div className="text-sm text-gray-600">
                    <p>IPFS for inventory snapshots</p>
                    <p>Polygon for transaction history</p>
                    <p>Decentralized backup system</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Sync Process</div>
                <div className="text-sm text-gray-600">
                  <p>1. Local inventory data is hashed and uploaded to IPFS</p>
                  <p>2. IPFS hash is recorded on Polygon blockchain</p>
                  <p>3. Transaction is confirmed and recorded in history</p>
                  <p>4. Automatic sync occurs every 5 minutes, or manually trigger with "Force Sync Now"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
