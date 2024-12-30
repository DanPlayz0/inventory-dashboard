import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AutocompleteSelect from '../autocomplete';
import { useObjectState } from '@/lib/useObjectState';
import { Item } from '@prisma/client';
import { AutocompleteResponse } from '@/app/page';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  autocomplete: AutocompleteResponse;
}

export function AddItemModal(props: AddItemModalProps) {
  const [item, setItem] = useObjectState<Omit<Item, 'id'>>({} as Omit<Item, 'id'>);

  const onClose = () => {
    setItem({}, true);
    props.onClose();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(item)
    }).then(res => {
      if (res.status != 200) return;
      onClose();
    })
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={item.name}
                onChange={(e) => setItem({name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => setItem({ quantity: parseInt(e.target.value) || 1 })}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2 items-center gap-4">
              <Label htmlFor="last_known" className="text-right">
                Location
              </Label>
              <AutocompleteSelect
                inputId="last_known"
                placeholder="Location"
                value={item.last_known}
                onChange={(value) => setItem({last_known: value})}
                options={props.autocomplete.last_known}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

