import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Navigation, NavigationProps } from "./Navigation";

interface PageProps extends NavigationProps {
  title: string;
  subtitle?: string;
}

export const Page = ({
  title,
  subtitle,
  backLink,
  backLabel,
  forwardLink,
  forwardLabel,
  children,
}: React.PropsWithChildren<PageProps>) => (
  <Container
    maxWidth="lg"
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Head>
      <title>Simulations</title>
      <meta name="description" content={title} />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Navigation
      backLink={backLink}
      backLabel={backLabel}
      forwardLink={forwardLink}
      forwardLabel={forwardLabel}
    />
    <Typography variant="h3" component="h1">
      {title}
    </Typography>
    {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}

    {children}
  </Container>
);
