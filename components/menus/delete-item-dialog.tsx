import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Item } from '@prisma/client';

interface DeleteItemDialogProps {
  item: Item | null
  onClose: () => void
}

export function DeleteItemDialog({ item, onClose }: DeleteItemDialogProps) {
  if (!item) return null

  const handleDelete = () => {
    // e.preventDefault()
    fetch('/api/inventory', {
      method: 'DELETE',
      body: JSON.stringify(item)
    }).then(res => {
      if (res.status != 200) return;
      onClose();
    })
  }

  return (
    <AlertDialog open={!!item} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item
            "{item.name}" from your inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

