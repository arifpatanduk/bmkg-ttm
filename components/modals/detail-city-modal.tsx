"use client";

import { DetailCitySolarData } from "@/app/types/global";
import { DownloadDropdown } from "@/components/DownloadDropdown";
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

  const detailHeaders = [
    "Tanggal",
    "Waktu Fajar",
    "Waktu Terbit",
    "Azimuth saat Terbit (°)",
    "Waktu Transit",
    "Azimuth saat Transit (°)",
    "Waktu Terbenam",
    "Azimuth saat Terbenam (°)",
    "Waktu Senja",
  ];

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

  const solarDetailArray = solarDetail?.data.map((detail) => {
    return [
      detail.date,
      detail.beginTwilight,
      detail.sunrise,
      detail.riseAzimuth,
      detail.transit,
      detail.transitAzimuth,
      detail.sunset,
      detail.setAzimuth,
      detail.endTwilight,
    ].join(", ");
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-7xl">
        <DialogHeader className="pt-8 px-6">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="w-full md:w-auto mb-3 ">
              <DialogTitle className="text-2xl font-bold">
                {city.name}
              </DialogTitle>
              <DialogDescription>
                {city.lat}, {city.lon}
              </DialogDescription>
            </div>
            <div className="w-full md:mx-6 mt-3 md:w-auto md:self-end">
              <DownloadDropdown
                prefixFile={city.name}
                tableElement="city-detail-table"
                startDate={new Date(startDate || "")}
                cityData={solarDetailArray || []}
                headers={detailHeaders}
              />
            </div>
          </div>
        </DialogHeader>
        <div id="city-detail-table" className="px-6 py-4">
          <div className="overflow-x-auto border sm:rounded-lg">
            <Table className="min-w-full text-left text-sm text-gray-600">
              <TableHeader className="bg-gray-50 text-sm">
                <TableRow>
                  <TableHead
                    scope="col"
                    className=" p-3 text-gray-600 font-bold"
                  >
                    Tanggal
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Waktu Fajar
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Waktu Terbit
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Azimuth saat Terbit (°)
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Waktu Transit
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Azimuth saat Transit (°)
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Waktu Terbenam
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Azimuth saat Terbenam (°)
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-center p-3 text-gray-600 font-bold"
                  >
                    Waktu Senja
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {city &&
                  solarDetail?.data.map((detail, index) => (
                    <TableRow key={index} className="border-b">
                      <TableCell className="p-3">{detail.date}</TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.beginTwilight}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.sunrise}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.riseAzimuth}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.transit}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.transitAzimuth}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.sunset}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.setAzimuth}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {detail.endTwilight}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
