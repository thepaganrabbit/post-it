"use client";

import React, { useState } from "react";
import styles from "./ColorPicker.module.scss";
import { Button, Container } from "react-bootstrap";
import { Chrome } from "@uiw/react-color";
import { CheckCircleFill, X } from "react-bootstrap-icons";

interface ColorPickerProps {
  colorPickerState: boolean;
  returnType: "hex" | "rgb";
  onChange: (value: string) => void;
  initialColor?: string;
  closeColorPicker: (val: boolean) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onChange,
  initialColor = "#393939",
  returnType,
  colorPickerState,
  closeColorPicker,
}) => {
  const [color, setColor] = useState<string>(initialColor);

  return (
    <Container className={styles.pickerContainer}>
      <Chrome
        color={color}
        onChange={(color) => {
          setColor(color.hex);
          if (returnType === "hex") {
            onChange(color.hex);
          } else {
            onChange(String(color.rgba));
          }
        }}
      />
      <div className={styles.selectorGroup}>
        <Button
          onClick={() => {
            onChange(color);
            closeColorPicker(!colorPickerState);
          }}
        >
          <X size={30} color="red" />
        </Button>
        <Button onClick={() => closeColorPicker(!colorPickerState)}>
          <CheckCircleFill size={30} color="blue" />
        </Button>
      </div>
    </Container>
  );
};

export default ColorPicker;
