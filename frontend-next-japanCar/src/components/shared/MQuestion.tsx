import { DialogProps } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface IProps extends DialogProps {
  text?: string;
  onClose: (result: boolean) => void;
  onYes?: () => void;
}

export default function MQuestion({
  open,
  text = 'Are sure to delete it?',
  onClose,
  onYes,
}: IProps) {
  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Question</DialogTitle>
        </DialogHeader>
        <div className="text-center mb-6">{text}</div>
        <DialogFooter>
          <div className="flex gap-1 justify-center">
            <DialogClose asChild>
              <Button variant="outline">No</Button>
            </DialogClose>
            <Button
              variant={'destructive'}
              onClick={() => {
                onClose(true);
                if (onYes) onYes();
              }}
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
