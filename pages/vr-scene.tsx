import type { NextPage } from "next";
import { Stack } from "@mui/material";
import { Page } from "../components/Page";
import { createElement, useEffect, useState } from "react";

if (typeof window !== "undefined") {
  import("aframe");
}


export const Scene = ({ children, ...rest }: React.PropsWithChildren<{ stats?: boolean, light?: string }>) => createElement('a-scene', rest, children);

export const Sky = (props: { color?: string, id?: string }) => createElement('a-sky', props);

export const Box = (props: {
    position?: string,
    rotation?: string,
    color?: string,
}) => createElement('a-box', props);

export const Cylinder = (props: {
  position?: string,
  radius?: string,
  height?: string,
  color?: string,
}) => createElement('a-cylinder', props);

export const Sphere = (props: {
  position?: string,
  radius?: string,
  color?: string,
}) => createElement('a-sphere', props);

export const Plane = (props: {
  position?: string,
  rotation?: string,
  width?: string,
  height?: string,
  color?: string,
}) => createElement('a-plane', props);

const NaiveCube: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    import("aframe").then(() => {
      setIsLoaded(true);
    });
  }, []);
  return (
    <Page
      title="Basic AFrame Scene"
      subtitle={`Testing that Aframe works in my environemnt`}
      backLink="/"
      backLabel="< Home"
    >
      <Stack spacing={2} direction="row" style={{ flex: 1 }}>
        <Stack spacing={2} style={{ flex: 1 }}>
          {isLoaded && (
            <Scene>
              <Box
                position="-1 0.5 -3"
                rotation="0 45 0"
                color="#4CC3D9"
              ></Box>
              <Sphere
                position="0 1.25 -5"
                radius="1.25"
                color="#EF2D5E"
              ></Sphere>
              <Cylinder
                position="1 0.75 -3"
                radius="0.5"
                height="1.5"
                color="#FFC65D"
              ></Cylinder>
              <Plane
                position="0 0 -4"
                rotation="-90 0 0"
                width="4"
                height="4"
                color="#7BC8A4"
              ></Plane>
              <Sky color="#ECECEC"></Sky>
            </Scene>
          )}
        </Stack>
      </Stack>
    </Page>
  );
};

export default NaiveCube;
