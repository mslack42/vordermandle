import { TargetModifier } from "@/game/common/TargetModifier";
import * as React from "react";
type TargetSVGProps = {
  size: number;
  value: number;
  modifier?: TargetModifier;
};
export const TargetSVG = (props: TargetSVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={(405 / 220) * props.size}
    height={props.size}
    viewBox="0 0 110 60"
    {...props}
  >
    <g transform="translate(-20 -52)">
      <path
        d="M20 52h108v60H20z"
        style={{
          fill: "#b3b3b3",
          strokeWidth: 0.2,
        }}
      />
      <path
        d="M22 54h104v56H22z"
        style={{
          fill: "#1a1a1a",
          strokeWidth: 0.2,
        }}
      />
      <text
        xmlSpace="preserve"
        x={118}
        y={100}
        style={{
          fontWeight: 500,
          fontStretch: "normal",
          fontSize: "51px",
          fontFamily: "sans-serif",
          textAlign: "center",
          direction: "ltr",
          textAnchor: "end",
          fill: "red",
          strokeWidth: 0.4,
          strokeDasharray: "none",
        }}
      >
        {props.value}
      </text>
      {props.modifier && <Modifier modifier={props.modifier} />}
    </g>
  </svg>
);

function Modifier({ modifier }: { modifier: TargetModifier }) {
  const contentFn = (mod: TargetModifier) => {
    switch (mod.modifierType) {
      case "reverse":
        return <>rv</>;
      case "rotate":
        return <>rt</>;
      case "increment":
        return (
          <>
            {[mod.incrementBy > 0 ? "+" : "", String(mod.incrementBy)].join(
              ""
            )}
          </>
        );
    }
    return <></>;
  };

  return (
    <>
      <ellipse
        cx={118.5}
        cy={61.2}
        rx={10}
        ry={8}
        style={{
          fill: "#00f",
          strokeWidth: 0.2,
          strokeDasharray: "none",
        }}
      />
      <text
        xmlSpace="preserve"
        x={118}
        y={64}
        style={{
          fontWeight: 400,
          fontSize: "10px",
          fontFamily: "sans-serif",
          textAlign: "center",
          direction: "ltr",
          textAnchor: "middle",
          fill: "#ececec",
          strokeWidth: 0.4,
          strokeDasharray: "none",
        }}
      >
        {contentFn(modifier)}
      </text>
    </>
  );
}
