"use client";

import { DetailCitySolarData } from "@/app/types/global";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal-store";
import { scrapeCitySolarData } from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const DetailCityModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type == "detailCityModal";

  const { city, startDate } = data;

  const [solarDetail, setSolarDetail] = useState<DetailCitySolarData | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      if (city) {
        const detail = (await scrapeCitySolarData(
          city,
          startDate || "",
          7,
          true
        )) as DetailCitySolarData;
        setSolarDetail(detail);
      }
    };

    loadData();
  }, [city, startDate]);

  if (!city) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-7xl">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {solarDetail?.city.name}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <Table>
            <TableHeader>
              <TableRow className="text-black">
                <TableHead className="border p-2">Tanggal</TableHead>
                <TableHead className="border p-2">Waktu Fajar</TableHead>
                <TableHead className="border p-2">Waktu Terbit</TableHead>
                <TableHead className="border p-2">
                  Azimuth saat Terbit (°)
                </TableHead>
                <TableHead className="border p-2">Waktu Transit</TableHead>
                <TableHead className="border p-2">
                  Azimuth saat Transit (°)
                </TableHead>
                <TableHead className="border p-2">Waktu Terbenam</TableHead>
                <TableHead className="border p-2">
                  Azimuth saat Terbenam (°)
                </TableHead>
                <TableHead className="border p-2">Waktu Senja</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {city &&
                solarDetail?.data.map((detail, index) => (
                  <TableRow className="text-black" key={index}>
                    <TableCell className="border p-2">{detail.date}</TableCell>
                    <TableCell className="border p-2">
                      {detail.beginTwilight}
                    </TableCell>
                    <TableCell className="border p-2">
                      {detail.sunrise}
                    </TableCell>
                    <TableCell className="border p-2">
                      {detail.riseAzimuth}
                    </TableCell>
                    <TableCell className="border p-2">
                      {detail.transit}
                    </TableCell>
                    <TableCell className="border p-2">
                      {detail.transitAzimuth}
                    </TableCell>
                    <TableCell className="border p-2">
                      {detail.sunset}
                    </TableCell>
                    <TableCell className="border p-2">
                      {detail.setAzimuth}
                    </TableCell>
                    <TableCell className="border p-2">
                      {detail.endTwilight}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
