import Stack from "@mui/material/Stack";
import Link from "next/link";

export interface NavigationProps {
  backLink?: string;
  backLabel?: string;
  forwardLink?: string;
  forwardLabel?: string;
}

export const Navigation = ({
  backLink,
  backLabel,
  forwardLink,
  forwardLabel,
}: NavigationProps) => {
  return (
    <Stack
      spacing={2}
      direction="row"
      style={{
        justifyContent: "space-between",
        padding: "0.5rem 0",
        marginBottom: '0.5rem',
        borderBottom: "solid 1px #AAA",
      }}
    >
      {backLink && <Link href={backLink}>{backLabel}</Link>}
      {forwardLink && <Link href={forwardLink}>{forwardLabel}</Link>}
    </Stack>
  );
};
