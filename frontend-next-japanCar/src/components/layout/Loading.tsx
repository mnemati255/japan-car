import { Spinner } from '../ui/spinner';

export default function Loading() {
  return (
    <div className="flex gap-3 items-center">
      <Spinner className="size-8" />
      <span>Please wait ...</span>
    </div>
  );
}
