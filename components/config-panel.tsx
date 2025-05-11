"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid3X3, Columns, Rows } from "lucide-react"
import type { LayoutConfig, HolderConfig } from "@/app/page"

interface ConfigPanelProps {
  currentLayout: LayoutConfig
  layouts: LayoutConfig[]
  onLayoutChange: (layout: LayoutConfig) => void
  onUpdateHolder: (holderId: string, updates: Partial<HolderConfig>) => void
}

export default function ConfigPanel({ currentLayout, layouts, onLayoutChange, onUpdateHolder }: ConfigPanelProps) {
  const [selectedHolderId, setSelectedHolderId] = useState<string | null>(
    currentLayout.holders.length > 0 ? currentLayout.holders[0].id : null,
  )

  const selectedHolder = selectedHolderId ? currentLayout.holders.find((h) => h.id === selectedHolderId) : null

  const handleLayoutSelect = (layoutId: string) => {
    const newLayout = layouts.find((l) => l.id === layoutId)
    if (newLayout) {
      onLayoutChange(newLayout)
      // Reset selected holder to first holder in new layout
      if (newLayout.holders.length > 0) {
        setSelectedHolderId(newLayout.holders[0].id)
      } else {
        setSelectedHolderId(null)
      }
    }
  }

  const handleHolderSelect = (holderId: string) => {
    setSelectedHolderId(holderId)
  }

  const handleHolderUpdate = (field: keyof HolderConfig, value: any) => {
    if (selectedHolderId) {
      onUpdateHolder(selectedHolderId, { [field]: value })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Layout Templates</h3>
          <div className="grid grid-cols-2 gap-4">
            {layouts.map((layout) => (
              <Button
                key={layout.id}
                variant={currentLayout.id === layout.id ? "default" : "outline"}
                className={`h-auto flex-col items-center justify-center p-4 ${
                  currentLayout.id === layout.id ? "bg-purple-600 hover:bg-purple-700" : ""
                }`}
                onClick={() => handleLayoutSelect(layout.id)}
              >
                <div className="mb-2">
                  {layout.columns === 1 ? (
                    <Rows className="h-8 w-8" />
                  ) : layout.columns === 2 ? (
                    <Columns className="h-8 w-8" />
                  ) : (
                    <Grid3X3 className="h-8 w-8" />
                  )}
                </div>
                <span className="text-sm">{layout.name}</span>
              </Button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="columns"
                  min={1}
                  max={4}
                  step={1}
                  value={[currentLayout.columns]}
                  onValueChange={(value) => onLayoutChange({ ...currentLayout, columns: value[0] })}
                  className="flex-1"
                />
                <span className="w-8 text-center">{currentLayout.columns}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gap">Gap Size (px)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="gap"
                  min={0}
                  max={40}
                  step={4}
                  value={[currentLayout.gap]}
                  onValueChange={(value) => onLayoutChange({ ...currentLayout, gap: value[0] })}
                  className="flex-1"
                />
                <span className="w-8 text-center">{currentLayout.gap}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Holder Configuration</h3>

          {currentLayout.holders.length > 0 ? (
            <Tabs defaultValue="holders" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="holders">Select Holder</TabsTrigger>
                <TabsTrigger value="customize">Customize</TabsTrigger>
              </TabsList>

              <TabsContent value="holders">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {currentLayout.holders.map((holder, index) => (
                    <Button
                      key={holder.id}
                      variant={selectedHolderId === holder.id ? "default" : "outline"}
                      className={`h-20 ${selectedHolderId === holder.id ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                      onClick={() => handleHolderSelect(holder.id)}
                    >
                      Holder {index + 1}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="customize">
                {selectedHolder ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (%)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="width"
                            min={20}
                            max={100}
                            step={5}
                            value={[selectedHolder.width]}
                            onValueChange={(value) => handleHolderUpdate("width", value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{selectedHolder.width}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="height"
                            min={100}
                            max={500}
                            step={10}
                            value={[selectedHolder.height]}
                            onValueChange={(value) => handleHolderUpdate("height", value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{selectedHolder.height}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="borderWidth">Border Width (px)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="borderWidth"
                            min={0}
                            max={10}
                            step={1}
                            value={[selectedHolder.borderWidth]}
                            onValueChange={(value) => handleHolderUpdate("borderWidth", value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{selectedHolder.borderWidth}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="borderColor">Border Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="borderColor"
                            type="color"
                            value={selectedHolder.borderColor}
                            onChange={(e) => handleHolderUpdate("borderColor", e.target.value)}
                            className="h-10 w-10 p-1"
                          />
                          <Input
                            type="text"
                            value={selectedHolder.borderColor}
                            onChange={(e) => handleHolderUpdate("borderColor", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="borderRadius">Border Radius (px)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="borderRadius"
                            min={0}
                            max={50}
                            step={1}
                            value={[selectedHolder.borderRadius]}
                            onValueChange={(value) => handleHolderUpdate("borderRadius", value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{selectedHolder.borderRadius}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shadow">Shadow</Label>
                        <Select
                          value={selectedHolder.shadow}
                          onValueChange={(value) => handleHolderUpdate("shadow", value as HolderConfig["shadow"])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select shadow" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                            <SelectItem value="xl">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="padding">Padding (px)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="padding"
                            min={0}
                            max={30}
                            step={2}
                            value={[selectedHolder.padding]}
                            onValueChange={(value) => handleHolderUpdate("padding", value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{selectedHolder.padding}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={selectedHolder.backgroundColor}
                            onChange={(e) => handleHolderUpdate("backgroundColor", e.target.value)}
                            className="h-10 w-10 p-1"
                          />
                          <Input
                            type="text"
                            value={selectedHolder.backgroundColor}
                            onChange={(e) => handleHolderUpdate("backgroundColor", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Select a holder to customize</p>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-center text-gray-500">No holders available in this layout</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
