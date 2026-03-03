"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DynamicListProps {
    items: string[]
    onItemsChange: (items: string[]) => void
    placeholder?: string
    className?: string
}

export function DynamicList({ items, onItemsChange, placeholder = "Add item...", className }: DynamicListProps) {
    const [newItem, setNewItem] = React.useState("")

    const handleAdd = () => {
        if (newItem.trim()) {
            onItemsChange([...items, newItem.trim()])
            setNewItem("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAdd()
        }
    }

    const handleRemove = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        onItemsChange(newItems)
    }

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex gap-2">
                <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button onClick={handleAdd} type="button" size="icon" variant="secondary">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {items.length > 0 && (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between gap-2 rounded-md border bg-card p-2 text-sm animate-scale-in">
                            <span>{item}</span>
                            <Button
                                onClick={() => handleRemove(index)}
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
