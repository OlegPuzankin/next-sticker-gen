import React from "react";
import { I_Grape } from "../redux/interfaces";
import { CloseIcon } from "./Icons/CloseIcon";

interface Props {
  grape: I_Grape;
  removeGrapeFromList: Function;
}

export default function SelectedGrapeBadge({
  grape,
  removeGrapeFromList,
}: Props) {
  return (
    <div className="selected-grape-badge">
      <div className="selected-grape-badge_content"> {grape.name} </div>

      <CloseIcon closeHandler={() => removeGrapeFromList(grape.id)} />
    </div>
  );
}
