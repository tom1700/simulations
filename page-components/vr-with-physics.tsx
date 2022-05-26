import type { NextPage } from "next";
import { Stack } from "@mui/material";
import { Page } from "../components/Page";
import { createElement, useEffect, useState } from "react";
import { AmmoWorkerApi } from "../workers/ammo-worker-api";
import { Vector } from "../data-structures/vector3";
import "aframe";

const initialize = async () => {
  const worker = new AmmoWorkerApi();
  await worker.initialize();
  delete AFRAME.components["physics"];
  AFRAME.registerComponent("physics", {
    schema: {
      isStatic: { type: "boolean", default: false },
    },
    init() {
      const { isStatic } = this.data;
      const { x, y, z } = this.el.object3D.position;
      worker
        .addBox(
          new Vector(
            this.el.getAttribute("width") || 1,
            this.el.getAttribute("height") || 1,
            this.el.getAttribute("depth") || 1
          ),
          new Vector(x, y, z),
          isStatic ? 0 : 1
        )
        .then((boxId) => {
          if (isStatic) return;

          worker.onBodyUpdate(boxId, (bodyInfo) => {
            this.el.object3D.position.set(bodyInfo.x, bodyInfo.y, bodyInfo.z);
            this.el.object3D.quaternion.set(
              bodyInfo.quaternionX,
              bodyInfo.quaternionY,
              bodyInfo.quaternionZ,
              bodyInfo.quaternionW
            );
          });
        });
    },
    multiple: true
  });

  worker.start();
};

export const Scene = ({
  children,
  ...rest
}: React.PropsWithChildren<{ stats?: boolean; light?: string }>) =>
  createElement("a-scene", rest, children);

export const Sky = (props: { color?: string; id?: string }) =>
  createElement("a-sky", props);

export const Box = (props: {
  position?: string;
  rotation?: string;
  color?: string;
  physics?: string;
  width?: number;
  height?: number;
  depth?: number;
}) => createElement("a-box", props);

const VRWithPhysics: NextPage = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize().then(() => {
      setIsInitialized(true);
    });
  }, []);

  return (
    <Page
      title="Basic AFrame Scene"
      subtitle={`Testing that Aframe works in my environemnt`}
      backLink="/vr-scene"
      backLabel="< VR Scene"
    >
      {isInitialized && (
        <Stack spacing={2} direction="row" style={{ flex: 1 }}>
          <Stack spacing={2} style={{ flex: 1 }}>
            <Scene>
              <Box position="0 10 -4" color="#4CC3D9" physics=""></Box>
              <Box position="2 10 -3" color="#4CC3D9" physics=""></Box>
              <Box position="-2 10 -4.5" color="#4CC3D9" physics=""></Box>
              <Box
                position="0 0 0"
                color="#FFFFFF"
                physics="isStatic:true"
                height={1}
                width={10}
                depth={10}
              ></Box>
              <Sky color="#ECECEC"></Sky>
            </Scene>
          </Stack>
        </Stack>
      )}
    </Page>
  );
};

export default VRWithPhysics;
