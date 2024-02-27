import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

export const textAlignments = [
    {
      name: "Left Align",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      name: "Center Align",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      name: "Right Align",
      value: "right",
      icon: AlignRightIcon,
    },
  ] as const;