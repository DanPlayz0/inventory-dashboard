import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Item } from '@prisma/client';
import { useObjectState } from '@/lib/useObjectState';
import { AutocompleteResponse } from '@/app/page';
import AutocompleteSelect from '../autocomplete';

interface EditItemModalProps {
  item: Item | null;
  onClose: () => void;
  autocomplete: AutocompleteResponse;
}

const properties = {
  name: "Name",
  last_known: "Last Known Location",
  notes: "Notes",
  project: "Project",
  quantity: "Quantity",
  used_for: "Used For",
}

export function EditItemModal(props: EditItemModalProps) {
  const [item, setItem] = useObjectState<Item>({} as Item);

  useEffect(() => {
    setItem(props.item || {});
  }, [props.item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (props.item) {
      fetch('/api/inventory', {
        method: 'PATCH',
        body: JSON.stringify(item)
      }).then((res) => {
        props.onClose();
        setItem({}, true);
      })
    }
  }

  if (!props.item) return null;

  return (
    <Dialog open={!!props.item} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {Object.entries(properties).map(([prop, name], i) => <div key={i} className="space-y-2 items-center gap-4">
              <Label htmlFor={"edit-"+prop}>
                {name}
              </Label>
              {Object.hasOwn(props.autocomplete, prop) ? <AutocompleteSelect
                  inputId="edit-location"
                  placeholder="Location"
                  // @ts-expect-error
                  value={item[prop]}
                  onChange={(value) => setItem({[prop]: value})}
                  options={props.autocomplete[prop as keyof AutocompleteResponse]}
                /> : <Input
                id={"edit-"+prop}
                // @ts-expect-error
                value={item[prop]}
                onChange={(e) => setItem({ [prop]: e.target.value })}
                className="col-span-3"
              />}
              
            </div>)}
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

