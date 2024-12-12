"use client";
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryTable } from '@/components/inventory-table';
import { AddItemModal } from '@/components/menus/add-item-modal';
import { Item } from '@prisma/client';
import { DeleteItemDialog } from '@/components/menus/delete-item-dialog';
import { EditItemModal } from '@/components/menus/edit-item-dialog';

export interface AutocompleteResponse {
  category: string[];
  last_known: string[];
  used_for: string[];
}

export default function Home() {
  const [inventory, setInventory] = useState<Item[]>([]);
  const [autocomplete, setAutocomplete] = useState<AutocompleteResponse>({ category: [], last_known: [], used_for: [] } as AutocompleteResponse);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  const updateTable = () => {
    fetch('/api/inventory').then(res=>res.json()).then(x=>setInventory(x));
    fetch('/api/autocomplete').then(res=>res.json()).then(x=>setAutocomplete(x));
  }

  useEffect(() => {
    updateTable();
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex justify-between max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5">Inventory Dashboard</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="mb-5 max-w-xs">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
      <InventoryTable
        inventory={inventory}
        onEdit={setEditingItem}
        onDelete={setDeletingItem}
      />
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => {
          updateTable();
          setIsAddModalOpen(false)
        }}
        autocomplete={autocomplete}
      />
      <EditItemModal
        item={editingItem}
        onClose={() => {
          updateTable();
          setEditingItem(null)
        }}
        autocomplete={autocomplete}
      />
      <DeleteItemDialog
        item={deletingItem}
        onClose={() => {
          updateTable();
          setDeletingItem(null);
        }}
      />
    </div>
  );
};