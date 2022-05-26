import type { NextPage } from "next";
import dynamic from "next/dynamic";

const VRWithPhysics = dynamic(
  () => import("../page-components/vr-with-physics"),
  { ssr: false }
);

const NaiveCube: NextPage = () => {
  return <VRWithPhysics />;
};

export default NaiveCube;
