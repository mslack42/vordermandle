import { SocketFunction } from "@/game/common/Card";
import { CardModifier } from "@/game/common/CardModifier";

type CardDisplayProps = {
  value: number;
  alternate?: number;
  modifier?: CardModifier;
};

export const CardDisplay = (props: CardDisplayProps) => {
  const textSize =
    props.value > 999 ? "text-3xl" : props.value > 99 ? "text-4xl" : "text-5xl";
  const altTextSize =
    props.alternate == null
      ? ""
      : props.alternate > 999
      ? "text-sm"
      : props.alternate > 99
      ? ""
      : "text-lg";
  return (
    <div className="relative w-22 h-22 bg-theme-blue border-4 border-foreground">
      <div className="h-full w-full flex flex-col justify-center">
        <div className="flex flex-row justify-center">
          <p className={textSize}>{props.value}</p>
        </div>
      </div>
      {props.modifier && props.modifier.modifierType !== "none" && (
        <div className="absolute right-[-9] top-[-9]">
          <ModifierDisplay modifier={props.modifier} />
        </div>
      )}
      {props.alternate && (
        <div className="absolute right-[-10] bottom-[-10] border-4 border-foreground bg-theme-yellow w-10 h-10 flex flex-col justify-center">
          <div className="flex flex-row justify-center">
            <p className={altTextSize}>{props.alternate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ModifierDisplay = (props: { modifier: CardModifier }) => {
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
            {[mod.incrementBy > 0 ? "+" : "", String(mod.incrementBy)].join("")}
          </>
        );
    }
    return <></>;
  };

  return (
    <div className="relative">
      <div className="h-9 w-9 rounded-4xl bg-theme-green flex flex-row justify-center text-sm border-4 border-foreground">
        <div className="flex flex-col justify-center">
          <p>{contentFn(modifier)}</p>
        </div>
      </div>
      {hasStrength && (
        <div className="absolute right-2 top-0 h-9 w-9 rounded-4xl bg-theme-green-darker flex flex-row justify-center text-sm border-4 border-foreground">
          <div className="flex flex-col justify-center">
            <p>{contentFn(modifier)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

type SocketDisplayProps = React.PropsWithChildren & {
  socketFn: SocketFunction;
};

export const SocketCardDisplay = (props: SocketDisplayProps) => {
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
    <div className="relative w-26 h-34 bg-theme-red border-4 border-foreground ">
      <div className="absolute top-0 left-0 right-0 h-12">
        <p className="w-full text-xl text-center font-bold">
          {headerFn(props.socketFn)}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 flex flex-row justify-center">
        <div className="relative h-22 w-22 bg-theme-red-darker border-4 border-foreground">
          <div className="absolute left-[-4] top-[-4] h-22 w-22">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
