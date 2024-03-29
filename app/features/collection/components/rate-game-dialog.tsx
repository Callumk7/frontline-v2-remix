import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface RateGameDialogProps {
  gameId: number;
  userId: string;
  isRateGameDialogOpen: boolean;
  setIsRateDialogOpen: (isOpen: boolean) => void;
}

export function RateGameDialog({
  gameId,
  userId,
  isRateGameDialogOpen,
  setIsRateDialogOpen,
}: RateGameDialogProps) {
  const rateFetcher = useFetcher();
  const [rating, setRating] = useState(0);
  return (
    <Dialog open={isRateGameDialogOpen} onOpenChange={setIsRateDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What do you give it then?</DialogTitle>
        </DialogHeader>
        <rateFetcher.Form
          className="flex flex-col gap-3"
          method="put"
          action={`/api/collections/${userId}`}
        >
          <Input
            className="py-2 text-center border-none w-12"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
          <input type="hidden" name="gameId" value={gameId} />
          <Slider name="rating" value={[rating]} onValueChange={(v) => setRating(v[0])} />
          <Button
            type="submit"
            onClick={() => setIsRateDialogOpen(false)}
            variant={"outline"}
          >
            Submit
          </Button>
        </rateFetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
