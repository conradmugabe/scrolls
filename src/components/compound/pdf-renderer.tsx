"use client";

import { useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import SimpleBar from "simplebar-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResizeDetector } from "react-resize-detector";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { useToast } from "@/components/common/toast/use-toast";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { cn } from "@/utils/cn-utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/common/dropdown-menu";

type Props = {
  url: string;
};

function LoadingView() {
  return (
    <div className="flex justify-center">
      <Loader2 className="my-24 h-6 w-6 animate-spin" />
    </div>
  );
}

export function PDFRenderer({ url }: Props) {
  const { toast } = useToast();
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const { width, ref } = useResizeDetector();

  const PageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numberOfPages),
  });
  type TPageValidator = z.infer<typeof PageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TPageValidator>({
    defaultValues: { page: "1" },
    resolver: zodResolver(PageValidator),
  });

  function handlePageSubmit({ page }: TPageValidator) {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  }

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            aria-label="previous page"
            variant="ghost"
            onClick={() => {
              setValue(
                "page",
                currentPage - 1 <= 1 ? "1" : String(currentPage - 1),
              );
              setCurrentPage((prev) => (prev - 1 <= 1 ? 1 : prev - 1));
            }}
            disabled={currentPage <= 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numberOfPages}</span>
            </p>
          </div>
          <Button
            aria-label="next page"
            variant="ghost"
            onClick={() => {
              setValue(
                "page",
                currentPage + 1 > numberOfPages
                  ? String(numberOfPages)
                  : String(currentPage + 1),
              );
              setCurrentPage((prev) =>
                prev + 1 > numberOfPages ? numberOfPages : prev + 1,
              );
            }}
            disabled={currentPage >= numberOfPages}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                <Search className="h-4 w-4" />
                {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh - 10rem)]">
          <div ref={ref}>
            <Document
              file={url}
              className="max-h-full"
              loading={<LoadingView />}
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setNumberOfPages(numPages);
              }}
            >
              <Page
                loading={<LoadingView />}
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
