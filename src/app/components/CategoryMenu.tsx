'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Category {
    id: string;
    name: string;
}

interface CategoryMenuProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryMenu({ categories, selectedCategory, onSelectCategory }: CategoryMenuProps) {
    return (
        <Card className="w-48 h-[calc(100vh-4rem)] bg-card text-card-foreground p-4 overflow-y-auto rounded-tl-none rounded-bl-none rounded-tr-none rounded-br-none">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="space-y-2">
                <Button
                    variant={selectedCategory === "All" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onSelectCategory("All")}
                >
                    All
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={selectedCategory === category.name ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onSelectCategory(category.name)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
        </Card>
    )
}

