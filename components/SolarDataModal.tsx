import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Button } from './ui/button';

import SolarDataTable from './SolarDataTable';
import { SolarData } from '../utils/scraperData';

type SolarDataModalProps = {
  city: string;
  solarData: SolarData[];
  isOpen: boolean;
  onClose: () => void;
};

const SolarDataModal: React.FC<SolarDataModalProps> = ({ isOpen, onClose, city, solarData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Solar Data for {city}</DialogTitle>
          <DialogDescription>Detailed sunrise, sunset, and twilight information.</DialogDescription>
        </DialogHeader>
        <SolarDataTable data={solarData} />
        <DialogClose asChild>
          <Button variant="secondary" className="mt-4">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SolarDataModal;
