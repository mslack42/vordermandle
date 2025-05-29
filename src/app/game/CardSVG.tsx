import { SocketFunction } from "@/game-generation/common/Card";
import { CardModifier } from "@/game-generation/common/CardModifier";

type CardSVGProps = {
  value: number;
  size: number;
  alternate?: number;
  modifier?: CardModifier;
};

export const CardSVG = (props: CardSVGProps) => {
  const fontSizeFn = (val: number) =>
    val < 100 ? 140 : val < 1000 ? 90 : val < 10000 ? 60 : 40;

  const card = (
    <>
      <path
        d="M3 3h194v194H3z"
        style={{
          fill: "navy",
          stroke: "#1a1a1a",
          strokeWidth: 6,
          strokeDasharray: "none",
        }}
      />
      <text
        x={95}
        y={120}
        dominantBaseline="middle"
        style={{
          fontSize: fontSizeFn(props.value),
          textAlign: "center",
          direction: "ltr",
          textAnchor: "middle",
          fill: "#fff",
          fillOpacity: 1,
          stroke: "#fff",
          strokeWidth: 6,
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
        textAnchor="middle"
      >
        {props.value}
      </text>
    </>
  );
  const altCard = props.alternate ? (
    <>
      <>
        <path
          d="M140 140h60v60h-60z"
          style={{
            fill: "#f95",
            stroke: "#1a1a1a",
            strokeWidth: 2,
            strokeDasharray: "none",
          }}
        />
        <text
          xmlSpace="preserve"
          x={170}
          y={185}
          style={{
            fontSize: (fontSizeFn(props.alternate) * 2) / 7,
            textAlign: "center",
            direction: "ltr",
            textAnchor: "middle",
            fill: "#fff",
            fillOpacity: 1,
            stroke: "#fff",
            strokeWidth: 3,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
        >
          {props.alternate}
        </text>
      </>
    </>
  ) : (
    <></>
  );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 200 200"
    >
      {card}
      {altCard}
      {props.modifier && props.modifier.modifierType != "none" ? (
        <Modifier modifier={props.modifier} />
      ) : (
        <></>
      )}
    </svg>
  );
};

const Modifier = (props: { modifier: CardModifier }) => {
  const { modifier } = props;
  const hasStrength =
    (modifier.modifierType == "reverse" || modifier.modifierType == "rotate") &&
    modifier.strength > 1;
  const contentFn = (mod: CardModifier) => {
    switch (mod.modifierType) {
      case "double":
        return <>x2</>;
      case "reverse":
        return <>rv</>;
      case "rotate":
        return <>rt</>;
      case "increment":
        return (
          <>
            {[mod.incrementBy > 0 ? "+" : "-", String(mod.incrementBy)].join(
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
        cx={175}
        cy={20}
        rx={25}
        ry={20}
        style={{
          fill: hasStrength ? "purple" : "red",
          fillOpacity: 1,
          stroke: "#1a1a1a",
          strokeWidth: 0.3,
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
      />
      {hasStrength ? (
        <>
          <ellipse
            cx={165}
            cy={25}
            rx={25}
            ry={20}
            style={{
              fill: "#f0f",
              fillOpacity: 1,
              stroke: "#1a1a1a",
              strokeWidth: 0.3,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
          />
          <text
            xmlSpace="preserve"
            x={165}
            y={30}
            style={{
              fontSize: "22px",
              textAlign: "center",
              direction: "ltr",
              textAnchor: "middle",
              fill: "#f0f",
              fillOpacity: 1,
              stroke: "#fff",
              strokeWidth: 2,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
          >
            {contentFn(modifier)}
          </text>
        </>
      ) : (
        <>
          <text
            xmlSpace="preserve"
            x={175}
            y={25}
            style={{
              fontSize: "22px",
              textAlign: "center",
              direction: "ltr",
              textAnchor: "middle",
              fill: "#fff",
              fillOpacity: 1,
              stroke: "#fff",
              strokeWidth: 2,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
          >
            {contentFn(modifier)}
          </text>
        </>
      )}
    </>
  );
};

type SocketSVGProps = {
  size: number;
  socketFn: SocketFunction;
};

export const SocketSVG = (props: SocketSVGProps & React.PropsWithChildren) => {
  const headerFn = (def: SocketFunction) => {
    switch (def) {
      case "clone":
        return <>CLONE</>;
      case "parts":
        return <>PARTS</>;
      case "prime":
        return <>PRIME</>;
      case "reverse":
        return <>REV</>;
      case "rotate":
        return <>ROT</>;
      case "round":
        return <>~10</>;
      case "split":
        return <>SPLIT</>;
      case "square":
        return <>SQ</>;
      case "triangle":
        return <>TRI</>;
      default:
        <></>;
    }
  };
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(props.size * 220) / 270}
        height={props.size}
        viewBox="0 0 220 270"
      >
        <path
          d="M3 3v260h190V3Zm9 55h170v196H13Z"
          style={{
            fill: "#ff8080",
            stroke: "#1a1a1a",
            strokeWidth: 6,
            strokeDasharray: "none",
          }}
        />
        <rect
          style={{
            fill: "#ff0010",
            stroke: "#1a1a1a",
            strokeWidth: 6,
            strokeDasharray: "none",
          }}
          width="169"
          height="195"
          x="13"
          y="58"
        />
        <text
          xmlSpace="preserve"
          x={108}
          y={45}
          style={{
            fontSize: "36px",
            textAlign: "center",
            direction: "ltr",
            textAnchor: "middle",
            fill: "#fff",
            fillOpacity: 1,
            stroke: "#fff",
            strokeWidth: 2,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
        >
          {headerFn(props.socketFn)}{" "}
        </text>
      </svg>
      <div className="absolute bottom-[13px] left-[8px] right-[13px] top-[30px]">
        {props.children}
      </div>
    </div>
  );
};
